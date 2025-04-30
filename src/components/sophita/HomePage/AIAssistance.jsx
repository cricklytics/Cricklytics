import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from '../../../assets/pawan/PlayerProfile/picture-312.png';
import Userprof from '../../../assets/pawan/PlayerProfile/user-placeholder.png';
import bot from '../../../assets/pawan/PlayerProfile/chitti_robot.png';

const AIAssistance = ({ isAIExpanded, setIsAIExpanded }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

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
  const getBotResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    const responses = {
      score: "India is at 120/2 after 15 overs vs Australia at Wankhede Stadium.",
      "player stats": "Rohit Sharma: 4,200 runs, 8 centuries, 150 matches.",
      hi: "Hello. I am Chitti, your cricket assistant. Ask about scores, stats, or match summaries!",
      "match summary": "India vs Australia: India batting first, 50-run partnership between Rohit and Kohli.",
      "upcoming matches": "Upcoming: Pakistan vs New Zealand on May 3, 2025, at Gaddafi Stadium.",
      "team ranking": "Current T20I Rankings: 1. India, 2. Australia, 3. England.",
      "player profile": "Virat Kohli: Right-hand batsman, 4,500 runs, 9 centuries, known for aggressive play.",
      default: "Sorry, I didn't understand that. Try asking about scores, stats, or match summaries!",
    };

    for (const key in responses) {
      if (lowerQuery.includes(key)) {
        return responses[key];
      }
    }
    return responses.default;
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user", timestamp: new Date() };
    setMessages([...messages, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = { 
        text: getBotResponse(input), 
        sender: "bot", 
        timestamp: new Date() 
      };
      setMessages((prev) => [...prev, botResponse]);

      // Read response aloud if voice is enabled
      if (isVoiceEnabled && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(botResponse.text);
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
      }
    }, 500);

    setInput("");
  };

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