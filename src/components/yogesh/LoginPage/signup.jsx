// ✅ IMPORTS ADDED
import { useState } from "react";
import img from "../../../assets/yogesh/login/img1.png";
import googleImg from "../../../assets/yogesh/login/google.png";
import { Link, useNavigate } from "react-router-dom";

import { auth, db } from "../../../firebase"; // ✅ Firebase Auth & Firestore
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";


export default function Signup() {
  const navigate = useNavigate();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [googleUser, setGoogleUser] = useState(null); // temporarily hold Google user

  const [formData, setFormData] = useState({
    firstName: "",
    dob: "",
    email: "",
    whatsapp: "",
    password: "", // ✅ Password field added for Firebase Auth
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Signup handler with validation, auth, email verification, Firestore
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { firstName, dob, email, whatsapp, password } = formData;

    // ✅ Basic validation
    if (!firstName || !dob || !email || !whatsapp || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!email.includes("@") || password.length < 6) {
      setError("Invalid email or password too short");
      return;
    }

    try {
      // ✅ Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Send verification email
      await sendEmailVerification(user);

      // ✅ Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName,
        dob,
        email,
        whatsapp,
        createdAt: new Date().toISOString(),
      });

      setMessage("Signup successful! Check your email for verification.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setMessage("");
  
    const provider = new GoogleAuthProvider();
  
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
  
      if (!userSnap.exists()) {
        setGoogleUser(user); // hold user temporarily
        setShowPhoneModal(true); // show modal instead of prompt
        return;
      }
  
      setMessage("Google Sign-in successful!");
      setTimeout(() => navigate("/landingpage"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  
  const handlePhoneSubmit = async () => {
    if (!phoneInput || !googleUser) {
      setError("Phone number is required.");
      return;
    }
  
    const userRef = doc(db, "users", googleUser.uid);
  
    try {
      await setDoc(userRef, {
        uid: googleUser.uid,
        firstName: googleUser.displayName || "",
        email: googleUser.email,
        whatsapp: phoneInput,
        createdAt: new Date().toISOString(),
        signupMethod: "google",
      });
  
      setShowPhoneModal(false);
      setMessage("Google Sign-in successful!");
      setTimeout(() => navigate("/landingpage"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };
  
  
  


  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-r from-[#0a1f44] to-[#123456] p-6 md:p-12 ">
      <div className="flex items-center justify-center w-full md:w-1/2">
        <img src={img} alt="Cricket Player" className="max-w-xs md:max-w-md lg:max-w-lg h-auto object-contain" />
      </div>

      <div className="w-full md:w-1/2 max-w-lg bg-opacity-90 px-6 md:px-12 py-8 rounded-lg">
        <h1 className="text-3xl md:text-4xl font-semibold text-cyan-400 mb-4 text-center">Cricklytics</h1>
        <p className="text-gray-400 text-center mb-6">Express sign-up via Google and Facebook</p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <button onClick={handleGoogleSignup} className="flex items-center justify-center gap-3 bg-teal-800 text-black px-6 py-3 rounded-lg hover:bg-gray-200 w-full">
            <img src={googleImg} alt="Google" className="w-6" />
            Google
          </button>
          <button className="flex items-center justify-center gap-3 bg-teal-800 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" className="w-6" />
            Facebook
          </button>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            className="w-full px-5 py-3 rounded bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400"
            onChange={handleChange}
          />
          <input
            type="date"
            name="dob"
            className="w-full px-5 py-3 rounded bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full px-5 py-3 rounded bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400"
            onChange={handleChange}
          />
          <input
            type="text"
            name="whatsapp"
            placeholder="Whatsapp number"
            className="w-full px-5 py-3 rounded bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400"
            onChange={handleChange}
          />
          {/* ✅ Password Field added */}
          <input
            type="password"
            name="password"
            placeholder="Create password"
            className="w-full px-5 py-3 rounded bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400"
            onChange={handleChange}
          />

          {/* ✅ Show errors/messages */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-400 text-sm">{message}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-300 to-teal-700 text-white py-3 rounded-lg mt-2 hover:bg-cyan-500 text-lg"
          >
            Sign up
          </button>
        </form>
      </div>
      {showPhoneModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
    <div className="bg-gray-900 p-6 rounded-2xl shadow-xl w-[90%] max-w-md border border-cyan-600">
      <h2 className="text-2xl font-bold text-cyan-400 mb-3 text-center">WELCOME</h2>
      <p className="text-gray-200 mb-4 text-center">Enter your WhatsApp number to complete sign-up:</p>
      <input
        type="text"
        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
        placeholder="e.g. 9876543210"
        value={phoneInput}
        onChange={(e) => setPhoneInput(e.target.value)}
      />
      <div className="flex justify-end mt-6 gap-3">
        <button
          onClick={() => setShowPhoneModal(false)}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
        >
          Cancel
        </button>
        <button
          onClick={handlePhoneSubmit}
          className="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
