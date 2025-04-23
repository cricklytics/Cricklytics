const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const path = require("path");
const util = require("util");

initializeApp();
const db = getFirestore();
const storage = getStorage();
const client = new textToSpeech.TextToSpeechClient();

exports.generatePlayerDetailsAudio = onDocumentCreated("players/{playerId}", async (event) => {
    const snap = event.data;
    if (!snap) {
        console.log("❌ No snapshot data received.");
        return;
    }

    const playerData = snap.data();
    const playerId = event.params.playerId;

    console.log(`📌 New player added: ${playerId}`);

    const text = `${playerData.name}, a ${playerData.role} from ${playerData.team}, 
has a batting average of ${playerData.battingAvg} and a bowling average of ${playerData.bowlingAvg || "not applicable"}.
Recent scores are ${playerData.recentMatches.join(", ")}.`;

    const request = {
        input: { text },
        voice: {
            languageCode: "en-IN",
            ssmlGender: "MALE",
            name: "en-IN-Standard-A",
        },
        audioConfig: {
            audioEncoding: "MP3",
            speakingRate: 1.0,
            pitch: 0.0,
            volumeGainDb: 0.0,
            effectsProfileId: ["handset-class-device"],
        },
    };

    try {
        const [response] = await client.synthesizeSpeech(request);
        const fileName = `player_files/${playerId}.mp3`;
        const tempFilePath = path.join("/tmp", `${playerId}.mp3`);
        
        await util.promisify(fs.writeFile)(tempFilePath, response.audioContent, "binary");

        await storage.bucket().upload(tempFilePath, {
            destination: fileName,
            metadata: { contentType: "audio/mpeg" },
        });

        const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.bucket().name}/o/${encodeURIComponent(fileName)}?alt=media`;

        await db.collection("players").doc(playerId).update({ audioUrl: fileUrl });

        console.log("✅ Audio URL updated in Firestore.");
    } catch (error) {
        console.error("❌ Error generating/storing AI voice:", error);
    }
});

exports.generateWelcomeAudio = onDocumentCreated("users/{userId}", async (event) => {
    const snap = event.data;
    if (!snap) {
        console.log("❌ No user snapshot data.");
        return;
    }

    const userData = snap.data();
    const userId = event.params.userId;

    const userName = userData.firstName || "User";
    const welcomeText = `Welcome to Cricklytics! Hello, ${userName}`;

    const request = {
        input: { text: welcomeText },
        voice: {
            languageCode: "en-IN",
            ssmlGender: "MALE",
            name: "en-IN-Standard-A",
        },
        audioConfig: {
            audioEncoding: "MP3",
        },
    };

    try {
        const [response] = await client.synthesizeSpeech(request);
        const fileName = `welcome_audio/${userId}.mp3`;
        const tempFilePath = path.join("/tmp", `${userId}_welcome.mp3`);

        await util.promisify(fs.writeFile)(tempFilePath, response.audioContent, "binary");

        await storage.bucket().upload(tempFilePath, {
            destination: fileName,
            metadata: { contentType: "audio/mpeg" },
        });

        const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.bucket().name}/o/${encodeURIComponent(fileName)}?alt=media`;

        await db.collection("users").doc(userId).update({ welcomeAudio: fileUrl });

        console.log("✅ Welcome audio stored and Firestore updated.");
    } catch (err) {
        console.error("❌ Failed to generate welcome audio:", err);
    }
});

