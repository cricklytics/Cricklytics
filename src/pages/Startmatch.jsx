import React, { useState } from 'react';
import Picture3 from '../assets/sophita/HomePage/Picture3.png';
import { useNavigate } from "react-router-dom";

const Startmatch = () => {
  const navigate = useNavigate();
  const [selectedFormat, setSelectedFormat] = useState('');
  const [tossWinner, setTossWinner] = useState('Team 20');
  const [tossDecision, setTossDecision] = useState('Bat');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Sample player data
  const players = [
    "Virat Kohli",
    "Rohit Sharma",
    "KL Rahul",
    "Jasprit Bumrah",
    "Rishabh Pant",
    "Hardik Pandya",
    "Ravindra Jadeja",
    "Mohammed Shami",
    "Shreyas Iyer",
    "Suryakumar Yadav"
  ];

  // Filter players based on search query
  const filteredPlayers = players.filter(player =>
    player.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen  bg-gradient-to-b from-[#0D171E] to-[#283F79] p-4">
      {/* Navigation Bar */}
      <div className="flex justify-between items-center p-4 bg-black/30 rounded-lg mb-5">
        <div className="flex items-center gap-4 cursor-pointer select-none" onClick={() => navigate("/landingpage")}>
          <img 
            src= {Picture3}
            alt="Cricklytics Logo"
            className="h-10 object-contain block"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = {Picture3};
            }}
            onClick={() => navigate("/landingpage")}
          />
          <span className="text-2xl font-bold text-white whitespace-nowrap text-shadow-[0_0_8px_rgba(93,224,230,0.4)] " >
            Cricklytics
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-white">Start a New Match</h1>
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-3">
          {/* Left Column */}
          <div className="space-y-3">
            {/* Select Teams Box */}
            <div className="bg-[#243A6E] p-3 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-white">Select Teams</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Home Team</label>
                  <select className="w-full p-2 border border-gray-500 rounded bg-[#243A6E] text-white">
                    <option className="bg-[#4094D0]">India</option>
                    <option className="bg-[#4094D0]">Usa</option>
                    <option className="bg-[#4094D0]">Europe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Away Team</label>
                  <select className="w-full p-2 border border-gray-500 rounded bg-[#243A6E] text-white">
                    <option className="bg-[#4094D0]">Australia</option>
                    <option className="bg-[#4094D0]">Africa</option>
                    <option className="bg-[#4094D0]">Pakistan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Match Format Box */}
            <div className="bg-[#243A6E] p-3 rounded-lg">
              <h2 className="text-xl font-semibold mb-1 text-white">Match Format</h2>
              <div className="space-y-2">
                {['Test', 'ODI', 'T20'].map((format) => (
                  <label key={format} className="flex items-center text-white">
                    <input
                      type="radio"
                      name="matchFormat"
                      checked={selectedFormat === format}
                      onChange={() => setSelectedFormat(format)}
                      className="mr-2"
                    />
                    {format}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Toss Details Box */}
            <div className="bg-[#243A6E] p-3 rounded-lg">
              <h2 className="text-xl font-semibold mb-3 text-white">Toss Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Toss Winner</label>
                  <select 
                    className="w-full p-2 border border-gray-500 rounded bg-[#243A6E] text-white"
                    value={tossWinner}
                    onChange={(e) => setTossWinner(e.target.value)}
                  >
                    <option className="bg-[#4094D0]">India</option>
                    <option className="bg-[#4094D0]">Pakistan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Toss Decision</label>
                  <select 
                    className="w-full p-2 border border-gray-500 rounded bg-[#243A6E] text-white"
                    value={tossDecision}
                    onChange={(e) => setTossDecision(e.target.value)}
                  >
                    <option className="bg-[#4094D0]">Bat</option>
                    <option className="bg-[#4094D0]">Bowl</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Select Player Box with Search Functionality */}
            <div className="bg-[#243A6E] p-3 rounded-lg">
              <h2 className="text-xl font-semibold mb-1 text-white">Select Player</h2>
              <div className="relative">
                <label className="block text-gray-300 mb-2">Search Players</label>
                <input
                  type="text"
                  placeholder="Search Players..."
                  className="w-full p-2 border border-gray-500 rounded bg-[#243A6E] text-white"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                
                {/* Player Suggestions Dropdown */}
                {showSuggestions && searchQuery && (
                  <div className="absolute z-10 mt-1 w-full bg-[#243A6E] border border-gray-500 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredPlayers.length > 0 ? (
                      filteredPlayers.map((player) => (
                        <div
                          key={player}
                          className="p-2 hover:bg-blue-700 cursor-pointer text-white"
                          onClick={() => {
                            setSearchQuery(player);
                            setShowSuggestions(false);
                          }}
                        >
                          {player}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-400">No players found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Start Match Button */}
        <div className="mt-6">
          <button className="w-full mb-1 !bg-white text-black py-3 px-4 rounded-lg font-medium !hover:bg-blue-500 hover:text-black transition-colors duration-300">
            Start Match
          </button>
        </div>
   </div>


      {/* Footer (now always visible at the bottom) */}

      <footer className="bg-[#111827] grid grid-cols-2 gap-1 max-h-screen text-white text-center p-4 mt-auto mt-1">
        <h3 className="font-semibold ">About Cricklytics</h3>
        <p className="text-sm">Email: support@cricklytics.com | Phone: +1-234-567-890</p>
        <p className="text-sm">Cricklytics is your ultimate cricket management platform,providing comprehensive tools for managing tornaments,matches and player statistics</p>
        <p className="text-sm">Phone: +1-234-567-890</p>
      </footer>
 
    </div>
  );
};

export default Startmatch;
