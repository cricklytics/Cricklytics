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
import { fetchSignInMethodsForEmail } from "firebase/auth";


export default function Signup() {
  const navigate = useNavigate();

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
  
    if (!firstName || !dob || !email || !whatsapp || !password) {
      setError("Please fill in all fields before continuing.");
      return;
    }
  
    if (!email.includes("@") || password.length < 6) {
      setError("Invalid email or password too short");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await sendEmailVerification(user);
  
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName,
        dob,
        email,
        whatsapp,
        createdAt: new Date().toISOString(),
      });
  
      setMessage("Verification email sent. Please check your inbox.");
  
      // Poll to check if email is verified
      const interval = setInterval(async () => {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(interval);
          setMessage("Email verified successfully! Redirecting to login...");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      }, 3000); // check every 3 seconds
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
  
      const displayName = user.displayName || "";
      const email = user.email || "";
  
      // 🔥 Immediately delete this temporary user from Firebase Auth
      await user.delete();
  
      // ✅ Autofill form only
      setFormData((prev) => ({
        ...prev,
        firstName: displayName.split(" ")[0] || "",
        email: email,
      }));
  
      setMessage("Google autofill complete! Please finish the form and click Sign Up.");
    } catch (err) {
      setError("Google autofill failed. Please try again.");
      console.error("Google sign-in error:", err);
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
            value={formData.firstName}
          />
          <input
            type="date"
            name="dob"
            className="w-full px-5 py-3 rounded bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400"
            onChange={handleChange}
            value={formData.dob}
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full px-5 py-3 rounded bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400"
            onChange={handleChange}
            value={formData.email}
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
      
    </div>
  );
}
