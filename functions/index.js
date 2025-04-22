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
