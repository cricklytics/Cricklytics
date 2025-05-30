// const { onDocumentCreated } = require("firebase-functions/v2/firestore");
// const { initializeApp } = require("firebase-admin/app");
// const { getFirestore } = require("firebase-admin/firestore");
// const { getStorage } = require("firebase-admin/storage");
// const textToSpeech = require("@google-cloud/text-to-speech");
// const fs = require("fs");
// const path = require("path");
// const util = require("util");

// initializeApp();
// const db = getFirestore();
// const storage = getStorage();
// const client = new textToSpeech.TextToSpeechClient();

// exports.generatePlayerDetailsAudio = onDocumentCreated("players/{playerId}", async (event) => {
//     const snap = event.data;
//     if (!snap) {
//         console.log("❌ No snapshot data received.");
//         return;
//     }

//     const playerData = snap.data();
//     const playerId = event.params.playerId;

//     console.log(`📌 New player added: ${playerId}`);

//     const text = `${playerData.name}, a ${playerData.role} from ${playerData.team}, 
// has a batting average of ${playerData.battingAvg} and a bowling average of ${playerData.bowlingAvg || "well we dont have any"}.
// Recent scores are ${playerData.recentMatches.join(", ")}.`;

//     const request = {
//         input: { text },
//         voice: {
//             languageCode: "en-IN",
//             ssmlGender: "MALE",
//             name: "en-IN-Wavenet-C",
//         },
//         audioConfig: {
//             audioEncoding: "MP3",
//             speakingRate: 1.0,
//             pitch: 0.0,
//             volumeGainDb: 0.0,
//             effectsProfileId: ["handset-class-device"],
//         },
//     };

//     try {
//         const [response] = await client.synthesizeSpeech(request);
//         const fileName = `player_files/${playerId}.mp3`;
//         const tempFilePath = path.join("/tmp", `${playerId}.mp3`);
        
//         await util.promisify(fs.writeFile)(tempFilePath, response.audioContent, "binary");

//         await storage.bucket().upload(tempFilePath, {
//             destination: fileName,
//             metadata: { contentType: "audio/mpeg" },
//         });

//         const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.bucket().name}/o/${encodeURIComponent(fileName)}?alt=media`;

//         await db.collection("players").doc(playerId).update({ audioUrl: fileUrl });

//         console.log("✅ Audio URL updated in Firestore.");
//     } catch (error) {
//         console.error("❌ Error generating/storing AI voice:", error);
//     }
// });

// exports.generateWelcomeAudio = onDocumentCreated("users/{userId}", async (event) => {
//     const snap = event.data;
//     if (!snap) {
//         console.log("❌ No user snapshot data.");
//         return;
//     }

//     const userData = snap.data();
//     const userId = event.params.userId;

//     const userName = userData.firstName || "User";
//     const welcomeText = `Welcome to Cricklytics! ${userName}`;

//     const request = {
//         input: { text: welcomeText },
//         voice: {
//             languageCode: "en-IN",
//             ssmlGender: "MALE",
//             name: "en-IN-Wavenet-C",
//         },
//         audioConfig: {
//             audioEncoding: "MP3",
//             speakingRate: 1.0,
//             pitch: 0.0,
//             volumeGainDb: 0.0,
//             effectsProfileId: ["handset-class-device"],
//         },
//     };

//     try {
//         const [response] = await client.synthesizeSpeech(request);
//         const fileName = `welcome_audio/${userId}.mp3`;
//         const tempFilePath = path.join("/tmp", `${userId}_welcome.mp3`);

//         await util.promisify(fs.writeFile)(tempFilePath, response.audioContent, "binary");

//         await storage.bucket().upload(tempFilePath, {
//             destination: fileName,
//             metadata: { contentType: "audio/mpeg" },
//         });

//         const fileUrl = `https://firebasestorage.googleapis.com/v0/b/cricklytics-4aed5.firebasestorage.app/o/${encodeURIComponent(fileName)}?alt=media`;

//         await db.collection("users").doc(userId).update({ welcomeAudio: fileUrl });

//         console.log("✅ Welcome audio stored and Firestore updated.");
//     } catch (err) {
//         console.error("❌ Failed to generate welcome audio:", err);
//     }
// });

const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const path = require("path");
const util = require("util");
const log = require("./logger");

initializeApp();
const db = getFirestore();
const storage = getStorage();
const client = new textToSpeech.TextToSpeechClient();

exports.generatePlayerDetailsAudio = onDocumentCreated("players/{playerId}", async (event) => {
    const snap = event.data;
    if (!snap) {
        log("❌ No snapshot data received.");
        return;
    }

    const playerData = snap.data();
    const playerId = event.params.playerId;

    log("📌 New player added", playerId);

    const text = `${playerData.name}, a ${playerData.role} from ${playerData.team}, 
has a batting average of ${playerData.battingAvg} and a bowling average of ${playerData.bowlingAvg || "not available"}.
Recent scores are ${playerData.recentMatches.join(", ")}.`;

    log("📝 Generated Text", text);

    const request = {
        input: { text },
        voice: {
            languageCode: "en-IN",
            ssmlGender: "MALE",
            name: "en-IN-Wavenet-C",
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
        log("💾 Audio file saved locally", tempFilePath);

        await storage.bucket().upload(tempFilePath, {
            destination: fileName,
            metadata: { contentType: "audio/mpeg" },
        });
        log("🚀 Audio file uploaded to Firebase Storage", fileName);

        const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.bucket().name}/o/${encodeURIComponent(fileName)}?alt=media`;

        await db.collection("players").doc(playerId).update({ audioUrl: fileUrl });
        log("✅ Audio URL updated in Firestore", fileUrl);
    } catch (error) {
        log("❌ Error generating/storing AI voice", error.message);
    }
});

exports.generateWelcomeAudio = onDocumentCreated("users/{userId}", async (event) => {
    const snap = event.data;
    if (!snap) {
        log("❌ No user snapshot data.");
        return;
    }

    const userData = snap.data();
    const userId = event.params.userId;

    const userName = userData.firstName || "User";
    const welcomeText = `Welcome to Cricklytics! ${userName}`;

    log("📌 New user added", userId);
    log("📝 Welcome text", welcomeText);

    const request = {
        input: { text: welcomeText },
        voice: {
            languageCode: "en-IN",
            ssmlGender: "MALE",
            name: "en-IN-Wavenet-C",
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
        const fileName = `welcome_audio/${userId}.mp3`;
        const tempFilePath = path.join("/tmp", `${userId}_welcome.mp3`);

        await util.promisify(fs.writeFile)(tempFilePath, response.audioContent, "binary");
        log("💾 Welcome audio saved locally", tempFilePath);

        await storage.bucket().upload(tempFilePath, {
            destination: fileName,
            metadata: { contentType: "audio/mpeg" },
        });
        log("🚀 Welcome audio uploaded to Firebase Storage", fileName);

        const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.bucket().name}/o/${encodeURIComponent(fileName)}?alt=media`;

        await db.collection("users").doc(userId).update({ welcomeAudio: fileUrl });
        log("✅ Welcome audio URL updated in Firestore", fileUrl);
    } catch (err) {
        log("❌ Failed to generate welcome audio", err.message);
    }
});

exports.generateAiAssistanceAudio = onDocumentCreated("ai_assistance/{aiId}", async (event) => {
    const snap = event.data;
    if (!snap) {
        log("❌ No AI snapshot data received.");
        return;
    }

    const aiData = snap.data();
    const aiId = event.params.aiId;

    const text = aiData.context;
    if (!text || text.trim().length === 0) {
        log("⚠️ No context text provided.");
        return;
    }

    const request = {
        input: { text },
        voice: {
            languageCode: "en-IN",
            ssmlGender: "MALE",
            name: "en-IN-Wavenet-C",
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
        const fileName = `ai_audio/${aiId}.mp3`;
        const tempFilePath = path.join("/tmp", `${aiId}.mp3`);

        await util.promisify(fs.writeFile)(tempFilePath, response.audioContent, "binary");
        log("💾 AI audio saved locally", tempFilePath);

        await storage.bucket().upload(tempFilePath, {
            destination: fileName,
            metadata: { contentType: "audio/mpeg" },
        });
        log("🚀 AI audio uploaded to Firebase Storage", fileName);

        const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.bucket().name}/o/${encodeURIComponent(fileName)}?alt=media`;

        await db.collection("ai_assistance").doc(aiId).update({ audioUrl: fileUrl });
        log("✅ AI audio URL updated in Firestore", fileUrl);
    } catch (error) {
        log("❌ Error generating/storing AI voice", error.message);
    }
});

exports.generateClubPlayerDetailsAudio = onDocumentCreated("clubPlayers/{clubPlayerId}", async (event) => {
    const snap = event.data;
    if (!snap) {
        log("❌ No snapshot data received for club player.");
        return;
    }

    const clubPlayerData = snap.data();
    const clubPlayerId = event.params.clubPlayerId;

    log("📌 New club player added:", clubPlayerId);

    const text = `${clubPlayerData.name}, a ${clubPlayerData.age}-year-old ${clubPlayerData.role} from the ${clubPlayerData.team}.
    ${clubPlayerData.name} is a ${clubPlayerData.battingStyle}, and ${clubPlayerData.name}'s bowling style is ${clubPlayerData.bowlingStyle || "not specified"}.`;

    log("📝 Generated text for club player:", text);

    const request = {
        input: { text },
        voice: {
            languageCode: "en-IN",
            ssmlGender: "MALE",
            name: "en-IN-Wavenet-C",
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
        const fileName = `club_player_audio/${clubPlayerId}.mp3`;
        const tempFilePath = path.join("/tmp", `${clubPlayerId}.mp3`);

        await util.promisify(fs.writeFile)(tempFilePath, response.audioContent, "binary");
        log("💾 Club player audio file saved locally:", tempFilePath);

        await storage.bucket().upload(tempFilePath, {
            destination: fileName,
            metadata: { contentType: "audio/mpeg" },
        });
        log("🚀 Club player audio file uploaded to Firebase Storage:", fileName);

        // Ensure the bucket name matches your project's bucket for public access
        const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.bucket().name}/o/${encodeURIComponent(fileName)}?alt=media`;

        await db.collection("clubPlayers").doc(clubPlayerId).update({ audioUrl: fileUrl });
        log("✅ Club player audio URL updated in Firestore:", fileUrl);
    } catch (error) {
        log("❌ Error generating/storing club player AI voice:", error.message);
    }
});
