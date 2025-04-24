import textToSpeech from "@google-cloud/text-to-speech";
import fs from "fs";
import util from "util";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const client = new textToSpeech.TextToSpeechClient();

export const generateAndUploadWelcomeAudio = async (userId, userName) => {
  const request = {
    input: { text: `Welcome to Cricklytics! Hello, ${userName}` },
    voice: {
        languageCode: "en-IN",
        ssmlGender: "MALE",
        name: "en-IN-Wavenet-C",
    },
    audioConfig: {
        audioEncoding: "MP3",
    },
  };

  const [response] = await client.synthesizeSpeech(request);
  const buffer = response.audioContent;

  // Upload to Firebase Storage
  const storage = getStorage();
  const audioRef = ref(storage, `welcome_audios/${userId}.mp3`);
  await uploadBytes(audioRef, buffer, { contentType: "audio/mpeg" });

  const audioURL = await getDownloadURL(audioRef);

  // Store audio URL in Firestore
  await setDoc(doc(db, "users", userId), {
    welcomeAudio: audioURL,
  }, { merge: true });

  return audioURL;
};
