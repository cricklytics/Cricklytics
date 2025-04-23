
import React, { useEffect, useRef, useState } from 'react';
import '../App.scss';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import coinSound from '../assets/kumar/coinsound.mp3';
import { useLocation, useNavigate } from "react-router-dom";
import { getDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Adjust if path differs



function greeting() {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = location.state?.userName || "User";

  const showWelcome = true;

  const [flipComplete, setFlipComplete] = useState(false); // Will be true after 3s
  const spinAudioRef = useRef(null);
  const hasSpokenRef = useRef(false);
  const speechSynthesisRef = useRef(null);
  const timeoutRef = useRef(null);


  useEffect(() => {
    const userName = location.state?.userName || "User";
    const spinAudio = new Audio(coinSound);
    spinAudio.volume = 0.3;
    spinAudio.loop = false;
  
    // Play coin sound on page load
    const playCoinSound = async () => {
      try {
        await spinAudio.play();
        console.log("✅ Coin sound playing...");
      } catch (err) {
        console.warn("🔒 Coin sound autoplay blocked. Waiting for click...");
        const resumeCoin = () => {
          spinAudio.play();
          document.removeEventListener("click", resumeCoin);
        };
        document.addEventListener("click", resumeCoin);
      }
    };
  
    // Play welcome audio after 6 seconds
    const playWelcomeAudio = async () => {
      try {
        const q = query(collection(db, "users"), where("firstName", "==", userName));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const audioURL = userDoc.data().welcomeAudio;
  
          if (audioURL) {
            const welcomeAudio = new Audio(audioURL);
            welcomeAudio.volume = 0.7;
  
            const welcomePlay = welcomeAudio.play();
            if (welcomePlay !== undefined) {
              welcomePlay
                .then(() => {
                  console.log("✅ Welcome audio played.");
                })
                .catch(() => {
                  console.warn("🔒 Welcome audio autoplay blocked.");
                  const resumeWelcome = () => {
                    welcomeAudio.play();
                    document.removeEventListener("click", resumeWelcome);
                  };
                  document.addEventListener("click", resumeWelcome);
                });
            }
          }
        } else {
          console.warn("❌ No user found with that name.");
        }
      } catch (err) {
        console.error("❌ Error fetching or playing welcome audio:", err);
      }
    };
  
    // Sequence:
    playCoinSound();
  
    const welcomeDelay = setTimeout(() => {
      playWelcomeAudio();
    }, 6000); // 6s delay
  
    const redirectDelay = setTimeout(() => {
      navigate("/landingpage");
    }, 13500); // Total ~13.5s = 6s + ~7s voice message
  
    return () => {
      clearTimeout(welcomeDelay);
      clearTimeout(redirectDelay);
      spinAudio.pause();
      spinAudio.currentTime = 0;
    };
  }, []);
  
  
  

  return (
    <div className="outer">
      <DotLottieReact
        src="https://lottie.host/0d1faa0c-a758-479f-860c-7f2441f5e3de/fu4S2jXH7A.lottie"
        style={{
          position: 'absolute',
          top: '10%',
          width: '100%',
          bottom: '25%',
          height: '100%',
        }}
        loop
        autoplay
      />

      <h2 id="greet">Welcome, to Cricklytics</h2>

      <div className={`coin ${flipComplete ? 'flipped' : 'flip-mode'}`}>
        <div className="coin__front">
          <h2>{userName}</h2>
        </div>
        <div className="coin__edge">
          {[...Array(180)].map((_, i) => (
            <div key={i}></div>
          ))}
        </div>
        <div className="coin__back">
          <h2 className="scarlet-transparent">{userName}</h2>
        </div>
        <div className="coin__shadow"></div>
      </div>
    </div>
  );
}

export default greeting;