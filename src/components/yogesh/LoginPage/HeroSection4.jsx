import React from "react";
import stadium from "../../../assets/yogesh/login/stadium.png";
import { motion } from "framer-motion";

function HeroSection4() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1A2A44] via-[#2E4A6B] to-[#FFD700] text-white relative font-serif overflow-hidden">
      {/* Subtle overlay for premium effect */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)] z-0"></div>

      <motion.div 
        className="absolute top-20 w-full text-center z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-5xl md:text-6xl font-bold flex items-center justify-center font-['Alegreya'] tracking-tight drop-shadow-[0_2px_8px_rgba(255,215,0,0.5)]">
          Premium <span className="text-yellow-400 ml-2 animate-pulse">⭐</span>
        </h1>
      </motion.div>

      <motion.div 
        className="flex flex-col md:flex-row items-center p-6 rounded-xl w-220 gap-10 mt-30 z-10 bg-[rgba(255,255,255,0.1)] backdrop-blur-md shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <div className="w-full md:w-1/2 flex flex-col items-start gap-y-6 font-['Alegreya']">
          <ul className="text-lg w-full space-y-6">
            <li>
              <p className="font-bold text-2xl font-['Alegreya'] text-yellow-300">• Clubs</p>
              <p className="text-gray-200 text-xl font-['Alegreya'] leading-relaxed">
                Body text for whatever you’d like to expand on the main point.
              </p>
            </li>
            <li>
              <p className="font-bold text-2xl font-['Alegreya'] text-yellow-300">• My Cricket</p>
              <p className="text-gray-200 text-xl font-['Alegreya'] leading-relaxed">
                Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes.
              </p>
            </li>
            <li>
              <p className="font-bold text-2xl font-['Alegreya'] text-yellow-300">• Leader Board</p>
              <p className="text-gray-200 text-xl font-['Alegreya'] leading-relaxed">
                Body text for whatever you’d like to add more to the main point. It provides details, explanations, and context.
              </p>
            </li>
          </ul>
        </div>
        <motion.div 
          className="w-full md:w-1/2 flex justify-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img 
            src={stadium} 
            alt="Cricket" 
            className="rounded-lg w-full max-w-md h-auto shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          />
        </motion.div>
      </motion.div>

      <motion.div 
        className="flex justify-center mt-10 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
        <button 
          className="bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-black px-10 py-4 rounded-full text-xl font-semibold font-['Alegreya'] shadow-[0_4px_16px_rgba(255,215,0,0.5)] hover:shadow-[0_8px_24px_rgba(255,215,0,0.7)] hover:scale-105 transition-all duration-300"
        >
          Get Premium
        </button>
      </motion.div>
    </div>
  );
}

export default HeroSection4;