import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from '../../../assets/pawan/PlayerProfile/picture-312.png';
import Userprof from '../../../assets/pawan/PlayerProfile/user-placeholder.png';
import bot from '../../../assets/pawan/PlayerProfile/chitti_robot.png';
import { db } from "../../../firebase"; // Adjust path if your firebase config is elsewhere
import {
  doc,
  getDoc,
  collection,
  query as firestoreQuery, // Alias query to avoid conflict with function parameter
  where,
  getDocs,
  limit
} from "firebase/firestore";

const AIAssistance = ({ isAIExpanded, setIsAIExpanded }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  const audioRef = useRef(null);

  // Expanded dummy data for matches (scalable for real-time updates)
  const matches = [
    {
      id: 1,
      teams: "India vs Australia",
      score: "IND 120/2 (15.0 ov)",
      venue: "Wankhede Stadium, Mumbai",
      status: "Live",
      date: "2025-05-01",
    },
    {
      id: 2,
      teams: "England vs South Africa",
      score: "ENG 50/1 (5.0 ov)",
      venue: "Lord's, London",
      status: "Live",
      date: "2025-05-02",
    },
    {
      id: 3,
      teams: "Pakistan vs New Zealand",
      score: "Not started",
      venue: "Gaddafi Stadium, Lahore",
      status: "Upcoming",
      date: "2025-05-03",
    },
  ];

  // Expanded dummy API simulation for cricket-related queries
  const getBotResponse = async (userInput) => {
    const lowerQuery = userInput.toLowerCase().trim();
    const ultimateFallback = {
        text: "Sorry, I couldn't find an answer for that right now.",
        audioUrl: null
    };

    if (!lowerQuery) {
        return ultimateFallback;
    }

    try {
        // 1. Query the collection for a document where the 'prompt' field matches the user input
        const assistanceCol = collection(db, "ai_assistance");
        const q = firestoreQuery(
            assistanceCol,
            where("prompt", "==", lowerQuery), // Query the 'prompt' field
            limit(1) // We only expect/need one match
        );

        console.log(`Executing query: where("prompt", "==", "${lowerQuery}")`);
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Match found based on the 'prompt' field
            const docSnap = querySnapshot.docs[0]; // Get the first matching document
            const data = docSnap.data();
            console.log(`Firestore Data found via query (Doc ID: ${docSnap.id}):`, data);
            return {
                text: data.context || "Response context is missing.",
                audioUrl: data.audioUrl || null
            };
        } else {
            // 2. No match found via query, try fetching the 'default' document by ID
            console.log(`No document found matching prompt: "${lowerQuery}". Trying 'default'.`);
            const defaultDocRef = doc(db, "ai_assistance", "default");
            const defaultDocSnap = await getDoc(defaultDocRef);

            if (defaultDocSnap.exists()) {
                // Default document found, return its data
                const defaultData = defaultDocSnap.data();
                console.log("Firestore Data for 'default':", defaultData);
                return {
                    text: defaultData.context || "Default response context is missing.",
                    audioUrl: defaultData.audioUrl || null
                };
            } else {
                // 3. Neither specific prompt query nor 'default' document ID found
                console.log("No 'default' document found either.");
                return ultimateFallback;
            }
        }
    } catch (error) {
        console.error("Error fetching Firestore document:", error);
        // Check if the error is about a missing index
         if (error.code === 'failed-precondition') {
             console.error("Firestore query failed. This often means you need to create an index. Check the Firebase console for a link to create it, usually for the 'prompt' field in the 'ai_assistance' collection.");
             // You might want to return a more specific error message here
             return {
                 text: "Sorry, there was a configuration issue fetching the response. Please try again later.",
                 audioUrl: null
             };
         }
        // Return ultimate fallback on any other fetch error
        return ultimateFallback;
    }
};

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const currentInput = input;
    const userMessage = { text: currentInput, sender: "user", timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const responseData = await getBotResponse(currentInput);

    if (responseData.audioUrl) {
        console.log("Audio URL:", responseData.audioUrl);
    } else {
        console.log("No audio URL found for this response.");
    }

    // Add the text message to the chat immediately (or after a short delay)
    // We separate adding text and playing audio slightly
     setTimeout(() => {
        const botMessage = {
            text: responseData.text,
            sender: "bot",
            timestamp: new Date()
        };
        setMessages((prev) => [...prev, botMessage]);

        // Play audio from URL if voice is enabled and URL exists
        if (isVoiceEnabled && responseData.audioUrl) {
             // Optional: Stop any previously playing audio
             if (audioRef.current) {
                 audioRef.current.pause();
                 audioRef.current.currentTime = 0; // Reset time
             }

            try {
                // Create a new Audio object and store it in the ref
                audioRef.current = new Audio(responseData.audioUrl);

                // Attempt to play the audio
                audioRef.current.play()
                    .then(() => {
                        console.log("Audio playback started successfully.");
                        // Optional: Add event listener for when audio finishes
                        audioRef.current.addEventListener('ended', () => {
                            console.log("Audio playback finished.");
                            audioRef.current = null; // Clear ref when done
                        });
                    })
                    .catch(error => {
                        console.error("Error playing audio:", error);
                        // Handle playback error (e.g., browser policy, invalid URL)
                        // Maybe show an error icon in the chat?
                        audioRef.current = null; // Clear ref on error
                    });
            } catch (error) {
                 console.error("Error creating Audio object:", error);
                 // This might happen if the URL is fundamentally wrong
            }

        }
        // Remove the old TTS logic completely
        // if (isVoiceEnabled && window.speechSynthesis) {
        //   const utterance = new SpeechSynthesisUtterance(botMessage.text);
        //   utterance.lang = "en-US";
        //   window.speechSynthesis.speak(utterance);
        // }

    }, 100); // Delay before showing bot message and playing audio
};
useEffect(() => {
  return () => {
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
          console.log("Audio stopped on component unmount/cleanup.");
      }
  };
}, []);

useEffect(() => {
   if (!isVoiceEnabled && audioRef.current) {
      audioRef.current.pause();
      // Optionally reset currentTime: audioRef.current.currentTime = 0;
      console.log("Audio paused because voice was disabled.");
   }
}, [isVoiceEnabled]);

  return (
    <div className="min-h-full bg-gradient-to-b from-black to-[#001A80] bg-fixed text-white p-5">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center p-4 bg-black/30 rounded-lg mb-5">
        <div className="flex items-center gap-4">
          <img 
            src={logo}
            alt="Cricklytics Logo"
            className="h-10 object-contain block"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/Picture3 2.png";
            }}
          />
          <span className="text-2xl font-bold text-white whitespace-nowrap text-shadow-[0_0_8px_rgba(93,224,230,0.4)]">
            Cricklytics
          </span>
        </div>
      </div>
      <div className="flex gap-330">
        <button 
          className="text-white bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-500"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button 
          className="text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500"
          onClick={() => window.location.reload()}
        >
          Cancel
        </button>
      </div>

      {/* Match Card */}
      <motion.div 
        className="max-w-5xl mx-auto mb-6 bg-[rgba(71,156,182,0.7)] p-6 rounded-xl shadow-lg border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-xl font-bold font-['Alegreya'] mb-4">Current Match</h2>
        <div className="bg-[rgba(0,0,0,0.3)] p-4 rounded-lg">
          <h3 className="text-lg font-semibold">{matches[0].teams}</h3>
          <p className="text-cyan-300">{matches[0].score}</p>
          <p className="text-gray-300">{matches[0].venue}</p>
          <p className={matches[0].status === "Live" ? "text-green-400" : "text-yellow-400"}>{matches[0].status}</p>
        </div>
      </motion.div>

      {/* Chatbox or Minimized Button */}
      {isMinimized ? (
        <motion.div
          className="fixed bottom-5 right-5 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={() => {
              setIsMinimized(false);
              setIsAIExpanded(true);
            }}
            className="relative  flex items-center gap-2 px-4 py-2 bg-[#5DE0E6] text-black rounded-full shadow-lg hover:bg-[#48C6EF] transition-all duration-300"
          >
            <img 
              src={bot}
              alt="Chitti ROBO" 
              className="w-17 h-17 -top-7 z-10  absolute -left-2 rounded-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/bot-placeholder.png";
              }}
            />
            <span className="text-sm text-amber-100 font-bold pl-8 font-['Alegreya']">Chiti Robot</span>
          </button>
        </motion.div>
      ) : (
        <motion.div 
          className="fixed bottom-5 right-5 w-80 md:w-96 bg-[rgba(0,0,0,0.8)] rounded-xl shadow-xl z-50 border border-cyan-300/30"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Chat Header */}
          <div className="flex justify-between items-center p-4 bg-[#cccccc] rounded-t-xl">
            <div className="flex items-center gap-2">
              <img 
                src={bot}
                alt="Chitti ROBO" 
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/bot-placeholder.png";
                }}
              />
              <span className="text-lg font-bold text-black font-['Alegreya']">Chitti ROBO</span>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <span className="text-lg font-bold text-black">Voice</span>
                <input
                  type="checkbox"
                  checked={isVoiceEnabled}
                  onChange={() => setIsVoiceEnabled(!isVoiceEnabled)}
                  className="toggle-checkbox w-5 h-5"
                />
              </label>
              <button
                onClick={() => {
                  setIsMinimized(true);
                  setIsAIExpanded(false);
                }}
                className="text-white hover:text-cyan-300   "
              >X
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-300 scrollbar-track-gray-800">
            {messages.map((msg, index) => (
              <motion.div 
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`flex items-start gap-2 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <img 
                    src={msg.sender === "user" ? Userprof : bot} 
                    alt={msg.sender} 
                    className="w-6 h-6 rounded-full"
                  />
                  <div className={`p-3 rounded-lg ${msg.sender === "user" ? "bg-[#403636] text-white" : "bg-gray-700 text-white"}`}>
                    <p>{msg.text}</p>
                    <p className="text-xs text-cyan-300 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-600">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about cricket..."
                className="flex-1 p-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-cyan-300"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-[#5DE0E6] text-white rounded-lg hover:bg-[#48C6EF] transition-all duration-300"
              >
                Send
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AIAssistance;