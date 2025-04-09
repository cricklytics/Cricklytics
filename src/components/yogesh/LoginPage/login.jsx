import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import img from "../../../assets/yogesh/login/img1.png";
import googleImg from "../../../assets/yogesh/login/google.png";
import { auth } from "../../../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { toast } from "react-toastify";
import { db } from "../../../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";


const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null); // holds user temporarily

  const [showPassword, setShowPassword] = useState(false);


  

  // ✅ Firebase Email/Password Login
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        toast.warning("Please verify your email before logging in.");
        setLoading(false);
        return;
      }

      toast.success("Login successful!");
      setEmail(""); // ✅ Clear fields
      setPassword("");
      setTimeout(() => {
        navigate("/landingpage");
      }, 2000);
    } catch (error) {
      toast.error("Invalid credentials or user does not exist.");
      console.error("Login error:", error.message);
    }
    setLoading(false);
  };

  // ✅ Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
  
      if (!userSnap.exists() || !userSnap.data().whatsapp) {
        setPendingGoogleUser({ uid: user.uid, email: user.email, name: user.displayName || "User" });
        setShowPhoneModal(true);
        setLoading(false);
        return;
      }
      
  
      toast.success("Signed in with Google!");
      setTimeout(() => {
        navigate("/landingpage");
      }, 2000);
    } catch (error) {
      console.error("Google Sign-In error:", error.message);
      toast.error("Google Sign-In failed");
    }
    setLoading(false);
  };

  const handlePhoneSubmit = async () => {
    if (!phoneInput) {
      toast.warning("Please enter your WhatsApp number.");
      return;
    }
  
    try {
      const userRef = doc(db, "users", pendingGoogleUser.uid);
      const userSnap = await getDoc(userRef);
  
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: pendingGoogleUser.uid,
          email: pendingGoogleUser.email,
          firstName: pendingGoogleUser.name,
          whatsapp: phoneInput,
          createdAt: new Date().toISOString(),
          signupMethod: "google",
        });
      } else {
        await updateDoc(userRef, {
          whatsapp: phoneInput,
        });
      }
  
      toast.success("Signed in with Google!");
      setShowPhoneModal(false);
      setPhoneInput("");
      setPendingGoogleUser(null);
      navigate("/landingpage");
    } catch (err) {
      console.error("Error saving phone number:", err.message);
      toast.error("Something went wrong. Try again.");
    }
  };
  
  

  // ✅ Forgot Password Reset
  const handleForgotPassword = async () => {
    if (!email) {
      toast.warning("Enter your email address to reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error) {
      console.error("Reset error:", error.message);
      toast.error("Error sending reset email.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-[#0a1f44] to-[#123456]">
      <div className="flex max-w-4xl w-full">
        <div className="w-1/2 hidden md:block">
          <img src={img} alt="Cricket Player" className="w-full h-full object-cover" />
        </div>

        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">Cricklytics</h2>
          <p className="text-gray-400 mb-6">Express sign in via Google and Facebook</p>

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center bg-white w-1/2 py-2 rounded-lg shadow-md hover:bg-blue-200"
            >
              <span className="text-blue-600 font-semibold">GOOGLE</span>
              <img src={googleImg} alt="Google" className="w-5 h-5 ml-2" />
            </button>
            <button
              className="flex items-center justify-center bg-white w-1/2 py-2 rounded-lg shadow-md hover:bg-blue-200"
              disabled
            >
              <span className="text-blue-600 font-semibold">Facebook</span>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                alt="Facebook"
                className="w-5 h-5 ml-2"
              />
            </button>
          </div>

          <div className="py-2 rounded-lg shadow-md text-white">
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Sign in</h3>

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

<div className="relative mb-4">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <span
    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
           viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.956 9.956 0 012.688-6.812M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 3l18 18"/>
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
           viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
      </svg>
    )}
  </span>
</div>


            {/* ✅ Forgot Password Link */}
            <p
              onClick={handleForgotPassword}
              className="text-sm text-blue-200 hover:underline cursor-pointer text-right mb-4"
            >
              Forgot Password?
            </p>

            {/* ✅ Login Button */}
            <button
              className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold p-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-center mt-4">
              <Link to="/signup" className="text-blue-300 hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
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
          onClick={() => {
            setShowPhoneModal(false);
            setPhoneInput("");
            setPendingGoogleUser(null);
          }}
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
};

export default Login;
