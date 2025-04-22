<<<<<<< HEAD
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
    has a batting average of ${playerData.battingAvg} and a bowling average of ${playerData.bowlingAvg || "well we dont have any"}.
    Recent scores are ${playerData.recentMatches.join(", ")}.`;

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
=======
const functions = require("firebase-functions"); 
const admin = require("firebase-admin"); 
const { TextToSpeechClient } = require("@google-cloud/text-to-speech"); 
const { v4: uuidv4 } = require("uuid"); 
const fs = require("fs");
const util = require("util");
const path = require("path");

// Initialize Firebase Admin SDK
admin.initializeApp();
const client = new TextToSpeechClient();

// Firebase function to generate player voice
exports.generatePlayerVoice = functions
  .https.onCall(async (data) => {
    const { playerId, name, role, battingAvg, bowlingAvg, recentMatches } = data;

    let speechText = `Meet ${name}, a ${role}.`;

    // Handling batting average
    if (battingAvg && battingAvg !== "N/A") {
      speechText += ` He has a batting average of ${battingAvg}.`;
    } else {
      speechText += ` He does not have a batting average.`;
    }

    // Handling bowling average
    if (bowlingAvg && bowlingAvg !== "N/A") {
      speechText += ` His bowling average is ${bowlingAvg}.`;
    } else {
      speechText += ` He does not have a bowling average.`;
    }

    // Handling recent matches
    if (recentMatches && recentMatches.length > 0) {
      if (role.toLowerCase() === "batsman") {
        speechText += ` His recent batting performance includes scores of ${recentMatches.join(", ")}.`;
      } else if (role.toLowerCase() === "bowler") {
        speechText += ` His recent bowling performance includes taking wickets with the following scores: ${recentMatches.join(", ")}.`;
      } else {
        speechText += ` His recent performance includes scores of ${recentMatches.join(", ")}.`;
      }
    } else {
      speechText += ` There is no recent performance data available.`;
    }

    // Google Cloud Text-to-Speech request
    const request = {
      input: { text: speechText },
      voice: { languageCode: "en-GB", ssmlGender: "MALE" },
      audioConfig: { audioEncoding: "MP3" },
    };

    try {
      // Call to synthesize speech
      const [response] = await client.synthesizeSpeech(request);

      // Temporary file path for storing audio content
      const tempFilePath = path.join(os.tmpdir(), `${playerId}-${uuidv4()}.mp3`);
      await util.promisify(fs.writeFile)(tempFilePath, response.audioContent, "binary");

      // Upload the file to Firebase Storage
      const bucket = admin.storage().bucket();
      const destination = `player-voices/${playerId}.mp3`;
      await bucket.upload(tempFilePath, {
        destination,
        metadata: {
          contentType: "audio/mpeg",
          metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
          },
        },
      });

      // Get download URL for the file
      const file = bucket.file(destination);
      const downloadURL = await file.getSignedUrl({
        action: "read",
        expires: "03-09-2491", // far future expiration
      });

      // Return the download URL
      return { audioUrl: downloadURL[0] };
    } catch (error) {
      console.error("Error generating voice:", error);
      throw new functions.https.HttpsError("internal", "Unable to generate player voice");
    }
  });
>>>>>>> fb6be535c9616e6316367e0fbef56d3f588f5be4
