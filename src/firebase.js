
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

//  Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCCTHcVHrfDbkXgEwGN_6g1Zj6hvtfQ_hs",
    authDomain: "cricklytics-4aed5.firebaseapp.com",
    projectId: "cricklytics-4aed5",
    storageBucket: "cricklytics-4aed5.firebasestorage.app",
    messagingSenderId: "173377933744",
    appId: "1:173377933744:web:01e6fda81bfa69e8b0c675",
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app); // ✅ Firestore

export { auth, db };
