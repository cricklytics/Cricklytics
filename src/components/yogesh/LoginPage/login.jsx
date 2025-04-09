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

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state

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
      navigate("/landingpage");
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
      await signInWithPopup(auth, provider);
      toast.success("Signed in with Google!");
      navigate("/landingpage");
    } catch (error) {
      console.error("Google Sign-In error:", error.message);
      toast.error("Google Sign-In failed");
    }
    setLoading(false);
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black to-blue-900">
      <div className="flex max-w-4xl w-full">
        <div className="w-1/2 hidden md:block">
          <img src={img} alt="Cricket Player" className="w-full h-full object-cover" />
        </div>

        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Cricklytics</h2>
          <p className="text-gray-600 mb-6">Express sign in via Google and Facebook</p>

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
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Sign in</h3>

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />

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
    </div>
  );
};

export default Login;
