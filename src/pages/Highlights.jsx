import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaRegImage } from 'react-icons/fa';
import logo from '../assets/sophita/HomePage/picture3_2.png';
import backButton from '../assets/kumar/right-chevron.png'

export default function Highlights() {
  const [activeTab, setActiveTab] = useState('myteam');

  const tabContentVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div
    className="min-h-screen p-4 flex flex-col"
    style={{ background: 'linear-gradient(to bottom right, #3e8e8e, #9b59b6)' }}
  >

      {/* Top Navbar */}
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
          <span className="text-2xl font-bold text-black whitespace-nowrap text-shadow-[0_0_8px_rgba(93,224,230,0.4)]">
            Cricklytics
          </span>
        </div>
      </div>

      {/* 🔙 Back Button Below Logo */}
<div className="mb-4">
  <img
    src={backButton} // Change path if needed
    alt="Back"
    className="h-8 w-8 cursor-pointer absolute w-10 h-10 -scale-x-100  left-5'"
    onClick={() => window.history.back()}
  />
</div>


      {/* Tabs */}
      <div className="flex justify-center space-x-12 text-black text-lg font-semibold border-b-4 border-white pb-2 mb-6">
        <div
          onClick={() => setActiveTab('myteam')}
          className={`cursor-pointer ${activeTab === 'myteam' ? 'border-b-2 border-white' : ''}`}
        >
          Highlights
        </div>
        <div
          onClick={() => setActiveTab('following')}
          className={`cursor-pointer ${activeTab === 'following' ? 'border-b-2 border-white' : ''}`}
        >
          Photos
        </div>
        <div
          onClick={() => setActiveTab('all')}
          className={`cursor-pointer ${activeTab === 'all' ? 'border-b-2 border-white' : ''}`}
        >
          Videos
        </div>
      </div>

      {/* Animated Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'myteam' && (
          <motion.div
            key="myteam"
            variants={tabContentVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center justify-center text-center mt-24"
          >
            <motion.div
              className="w-40 h-40 flex items-center justify-center bg-white rounded-full mb-6 shadow-lg cursor-pointer hover:scale-105 transition-transform"
              whileHover={{ scale: 1.1 }}
            >
              <FaPlay className="text-black text-6xl" />
            </motion.div>
            <p className="text-lg font-medium mb-4 text-center text-black">
              We don’t have Highlights of this player yet but you can have yours!
            </p>
            <button className="!bg-blue-600 text-white px-10 py-5 rounded-full text-xl font-semibold hover:bg-blue-700">
              Go Live
            </button>
          </motion.div>
        )}

        {activeTab === 'following' && (
          <motion.div
            key="following"
            variants={tabContentVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center justify-center text-center mt-24"
          >
            <FaRegImage className="text-black text-[100px] mb-6" />
            <p className="text-lg font-medium text-black">
              Player match media not Found
            </p>
          </motion.div>
        )}

        {activeTab === 'all' && (
          <motion.div
            key="all"
            variants={tabContentVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-h-[700px] overflow-y-auto px-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
              {[...Array(9)].map((_, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
                >
                  <div className="w-full h-48 bg-gray-300 flex items-center justify-center rounded-md mb-4 overflow-hidden">
                    <video
                      controls
                      className="w-full h-full object-cover rounded-md"
                    >
                      <source src={`/videos/video${index + 1}.mp4`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <p className="text-black font-medium">Match Highlight {index + 1}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
