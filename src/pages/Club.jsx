import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaUserFriends, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import cricketImage from '../assets/sophita/Homepage/cricket1.png';
import logo from '../assets/sophita/HomePage/Picture3.png';
import backButton from '../assets/kumar/right-chevron.png'

const ClubPage = () => {
  const [showTeamsDropdown, setShowTeamsDropdown] = useState(false);
  const [showMatchesDropdown, setShowMatchesDropdown] = useState(false);
  const [showClubDropdown, setShowClubDropdown] = useState(false);

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(to bottom, #000000 15%, #001A80 87%, #000D40 100%)'
      }}
    >
      {/* Header */}
      <header className="shadow-md py-4 px-6">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <motion.img
              src={logo}
              alt="Cricklytics Logo"
              className="h-7 w-7 md:h-10 object-contain block select-none"
              whileHover={{ scale: 1.05 }}
            />
            <span className="text-2xl font-bold text-white pl-3">Cricklytics</span>
          </div>
          
          <div className="relative">
            <button 
              className="flex items-center gap-2 bg-[#51aab1] text-white px-4 py-2 rounded-lg hover:bg-[#4acfd4] transition-colors"
              onClick={() => setShowClubDropdown(!showClubDropdown)}
            >
              <span className="hidden sm:inline">Austria CC Wien Club</span>
              <span className="sm:hidden">AC Wien</span>
              {showClubDropdown ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {showClubDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 transition-colors">Club Profile</a>
                  <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 transition-colors">Club Members</a>
                  <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 transition-colors">Club Settings</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {/* Desktop Layout (hidden on mobile) */}
        <div className="hidden md:flex flex-col md:flex-row gap-8">
          {/* Left Sidebar - Upcoming Matches */}
          <div className="w-full md:w-1/4">
            <div className="rounded-lg shadow-md p-4 h-full">
              <button 
                className="flex items-center justify-between w-full bg-[#51aab1] text-white px-4 py-3 rounded-lg hover:bg-[#4acfd4] transition-colors"
                onClick={() => setShowMatchesDropdown(!showMatchesDropdown)}
              >
                <div className="flex items-center gap-2">
                  <FaCalendarAlt />
                  <span>Upcoming Matches</span>
                </div>
                {showMatchesDropdown ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {showMatchesDropdown && (
                <div className="mt-2 space-y-2 bg-white rounded-lg py-1">
                  <div className="p-3 hover:bg-gray-200 cursor-pointer transition-colors">
                    <p className="font-medium text-gray-800">Austria CC vs Vienna CC</p>
                    <p className="text-sm text-gray-600">May 10, 2025</p>
                  </div>
                  <div className="p-3 hover:bg-gray-200 cursor-pointer transition-colors">
                    <p className="font-medium text-gray-800">Austria CC vs Graz CC</p>
                    <p className="text-sm text-gray-600">May 17, 2025</p>
                  </div>
                  <div className="p-3 hover:bg-gray-200 cursor-pointer transition-colors">
                    <p className="font-medium text-gray-800">Austria CC vs Salzburg CC</p>
                    <p className="text-sm text-gray-600">May 24, 2025</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center Content - Larger Section */}
          <div className="w-full md:w-2/4 flex flex-col items-center">
            <div className="flex flex-col items-center justify-center h-full w-full">
              {/* Larger Cricket Image */}
              <div className="mb-8 w-full flex justify-center">
                <img 
                  src={cricketImage} 
                  alt="Cricket"
                  className="w-140 h-170 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar - Teams and Players with Join Club Button */}
          <div className="w-full md:w-1/4 flex flex-col">
            <div className="shadow-md p-4 flex-grow">
              <button 
                className="flex items-center justify-between w-full bg-[#51aab1] text-white px-4 py-3 rounded-lg hover:bg-[#4acfd4] transition-colors"
                onClick={() => setShowTeamsDropdown(!showTeamsDropdown)}
              >
                <div className="flex items-center gap-2">
                  <FaUserFriends />
                  <span>Teams And Players</span>
                </div>
                {showTeamsDropdown ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {showTeamsDropdown && (
                <div className="mt-2 space-y-2 bg-white rounded-lg py-1">
                  <div className="p-3 hover:bg-gray-200 cursor-pointer transition-colors">
                    <p className="font-medium text-gray-800">Senior Team</p>
                    <p className="text-sm text-gray-600">12 players</p>
                  </div>
                  <div className="p-3 hover:bg-gray-200 cursor-pointer transition-colors">
                    <p className="font-medium text-gray-800">Junior Team</p>
                    <p className="text-sm text-gray-600">8 players</p>
                  </div>
                  <div className="p-3 hover:bg-gray-200 cursor-pointer transition-colors">
                    <p className="font-medium text-gray-800">Women's Team</p>
                    <p className="text-sm text-gray-600">10 players</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Join Club Button positioned slightly higher */}
            <div className="relative top-[-80px] shadow-md p-4">
              <button className="w-full bg-[#51aab1] text-white px-8 py-4 rounded-lg hover:bg-[#4acfd4] transition-colors flex items-center justify-center gap-2 text-xl">
                <FaPlus size={20} />
                Join Club
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Layout (hidden on desktop) */}
        <div className="md:hidden flex flex-col gap-4">
          {/* Upcoming Matches - Top */}
          <div className="w-full">
            <div className="rounded-lg shadow-md p-2">
              <button 
                className="flex items-center justify-between w-full bg-[#51aab1] text-white px-3 py-2 rounded-lg hover:bg-[#4acfd4] transition-colors text-sm"
                onClick={() => setShowMatchesDropdown(!showMatchesDropdown)}
              >
                <div className="flex items-center gap-2">
                  <FaCalendarAlt size={14} />
                  <span>Upcoming Matches</span>
                </div>
                {showMatchesDropdown ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
              </button>
              {showMatchesDropdown && (
                <div className="mt-2 space-y-1 bg-white rounded-lg py-1">
                  <div className="p-2 hover:bg-gray-200 cursor-pointer transition-colors">
                    <p className="font-medium text-gray-800 text-sm">Austria CC vs Vienna CC</p>
                    <p className="text-xs text-gray-600">May 10, 2025</p>
                  </div>
                  <div className="p-2 hover:bg-gray-200 cursor-pointer transition-colors">
                    <p className="font-medium text-gray-800 text-sm">Austria CC vs Graz CC</p>
                    <p className="text-xs text-gray-600">May 17, 2025</p>
                  </div>
                  <div className="p-2 hover:bg-gray-200 cursor-pointer transition-colors">
                    <p className="font-medium text-gray-800 text-sm">Austria CC vs Salzburg CC</p>
                    <p className="text-xs text-gray-600">May 24, 2025</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center Content - Cricket Image */}
          <div className="w-full flex justify-center">
            <div className="w-full flex justify-center">
              <img 
                src={cricketImage} 
                alt="Cricket"
                className="w-40 h-48 object-contain"
              />
            </div>
          </div>

          {/* Teams and Players - Bottom */}
          <div className="w-full">
            <div className="shadow-md p-2">
              <button 
                className="flex items-center justify-between w-full bg-[#51aab1] text-white px-3 py-2 rounded-lg hover:bg-[#4acfd4] transition-colors text-sm"
                onClick={() => setShowTeamsDropdown(!showTeamsDropdown)}
              >
                <div className="flex items-center gap-2">
                  <FaUserFriends size={14} />
                  <span>Teams And Players</span>
                </div>
                {showTeamsDropdown ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
              </button>
              {showTeamsDropdown && (
                <div className="mt-2 space-y-1 bg-white rounded-lg py-1">
                  <div className="p-2 hover:bg-gray-200 cursor-pointer transition-colors">
                    <p className="font-medium text-gray-800 text-sm">Senior Team</p>
                    <p className="text-xs text-gray-600">12 players</p>
                  </div>
                  <div className="p-2 hover:bg-gray-200 cursor-pointer transition-colors">
                    <p className="font-medium text-gray-800 text-sm">Junior Team</p>
                    <p className="text-xs text-gray-600">8 players</p>
                  </div>
                  <div className="p-2 hover:bg-gray-200 cursor-pointer transition-colors">
                    <p className="font-medium text-gray-800 text-sm">Women's Team</p>
                    <p className="text-xs text-gray-600">10 players</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Join Club Button */}
            <div className="mt-4 shadow-md p-2">
              <button className="w-full bg-[#51aab1] text-white px-4 py-3 rounded-lg hover:bg-[#4acfd4] transition-colors flex items-center justify-center gap-2 text-sm">
                <FaPlus size={14} />
                Join Club
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClubPage;