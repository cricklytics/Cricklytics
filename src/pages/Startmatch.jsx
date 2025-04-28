import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/pawan/PlayerProfile/picture-312.png';
import bgImg from '../assets/sophita/HomePage/advertisement5.jpeg';


const PlayerSelector = ({ teamA, teamB }) => {
  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState({ left: [], right: [] });
  const navigate = useNavigate();

  const players = [
    "Max O'Dowd",
    "Bas de Leede",
    "Teja Nidamanuru",
    "Aryan Dutt",
    "Kyle Klein",
    "Vikramjit Singh",
    "Colin Ackermann",
    "Paul van Meekeren"
  ];

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const filteredLeftPlayers = players.filter(player =>
    player.toLowerCase().includes(leftSearch.toLowerCase())
  );
  const filteredRightPlayers = players.filter(player =>
    player.toLowerCase().includes(rightSearch.toLowerCase())
  );

  const togglePlayerSelection = (side, player) => {
    setSelectedPlayers(prev => {
      const newSelection = { ...prev };
      if (newSelection[side].includes(player)) {
        newSelection[side] = newSelection[side].filter(p => p !== player);
      } else {
        newSelection[side] = [...newSelection[side], player];
      }
      return newSelection;
    });
  };

  return (
    <div className="fixed inset-0 overflow-y-auto" style={{
      backgroundImage: `url(${bgImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh'
    }}>
      <div className="relative min-h-screen w-full">
        {/* Header - Same as in Startmatch */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center p-4 w-full bg-opacity-80"
        >
          <div className="flex items-center">
            <motion.img
              src={logo}
              alt="Cricklytics Logo"
              className="h-12 mr-3"
              whileHover={{ scale: 1.05 }}
            />
            <span className="text-2xl font-bold text-white">Cricklytics</span>
          </div>
          <motion.div 
            className="text-black bg-white bg-opacity-100 text-center w-33 md:w-40 px-4 py-2 rounded-lg font-medium"
            whileHover={{ scale: 1.05 }}
          >
            Schedule: {formattedDate}
          </motion.div>
        </motion.div>

        {/* Player Selector Content */}
        <div className="w-full px-4 md:px-8 py-8 mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl border border-blue-100"
          >
            <h1 className="text-4xl font-bold mb-6 text-black">Select Players</h1>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Team A dropdown */}
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-semibold text-blue-800">{teamA}</span>
                  <span role="img" aria-label="Team A flag" className="text-2xl">
                    {teamA === 'Netherlands' ? '🇳🇱' : teamA === 'South Africa' ? '🇿🇦' : '🏏'}
                  </span>
                </div>
                
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search Players..."
                      className="w-full p-3 pl-10 border-2 border-blue-200 rounded-lg mb-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-black"
                      value={leftSearch}
                      onChange={(e) => setLeftSearch(e.target.value)}
                    />
                    <svg
                      className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  
                  <div className="border-2 border-blue-100 rounded-lg max-h-60 overflow-y-auto bg-white">
                    {filteredLeftPlayers.map((player, index) => (
                      <motion.div 
                        key={index}
                        className={`p-3 cursor-pointer border-b border-blue-50 last:border-b-0 transition-colors duration-200 ${
                          selectedPlayers.left.includes(player) 
                            ? 'bg-blue-100 font-medium' 
                            : 'hover:bg-blue-50'
                        }`}
                        onClick={() => togglePlayerSelection('left', player)}
                        whileHover={{ scale: 1.01 }}
                      >
                        <span className="text-blue-800">{player}</span>
                        {selectedPlayers.left.includes(player) && (
                          <span className="float-right text-blue-600">✓</span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
              
              {/* Team B dropdown */}
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-semibold text-indigo-800">{teamB}</span>
                  <span role="img" aria-label="Team B flag" className="text-2xl">
                    {teamB === 'Netherlands' ? '🇳🇱' : teamB === 'South Africa' ? '🇿🇦' : '🏏'}
                  </span>
                </div>
                
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search Players..."
                      className="w-full p-3 pl-10 border-2 border-indigo-200 rounded-lg mb-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-black"
                      value={rightSearch}
                      onChange={(e) => setRightSearch(e.target.value)}
                    />
                    <svg
                      className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  
                  <div className="border-2 border-indigo-100 rounded-lg max-h-60 overflow-y-auto bg-white">
                    {filteredRightPlayers.map((player, index) => (
                      <motion.div 
                        key={index}
                        className={`p-3 cursor-pointer border-b border-indigo-50 last:border-b-0 transition-colors duration-200 ${
                          selectedPlayers.right.includes(player) 
                            ? 'bg-indigo-100 font-medium' 
                            : 'hover:bg-indigo-50'
                        }`}
                        onClick={() => togglePlayerSelection('right', player)}
                        whileHover={{ scale: 1.01 }}
                      >
                        <span className="text-blue-800">{player}</span>
                        {selectedPlayers.right.includes(player) && (
                          <span className="float-right text-indigo-600">✓</span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-blue-200">
      <motion.button 
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/match-start')}
      >
        Start Match
      </motion.button>
    </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
const Startmatch = () => {
  const [selectedTeamA, setSelectedTeamA] = useState('');
  const [selectedTeamB, setSelectedTeamB] = useState('');
  const [tossWinner, setTossWinner] = useState('');
  const [tossDecision, setTossDecision] = useState('Batting');
  const [overs, setOvers] = useState('');
  const [scorer, setScorer] = useState('');
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);
  const navigate = useNavigate();

  const teams = ['India', 'Australia', 'England', 'Pakistan', 'New Zealand', 'Netherlands', 'South Africa'];
  const scorers = ['John Doe', 'Jane Smith', 'Mike Johnson'];

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const handleNext = () => {
    if (!selectedTeamA || !selectedTeamB || !overs) {
      alert('Please fill all required fields');
      return;
    }
    setShowPlayerSelector(true);
  };

  if (showPlayerSelector) {
    return <PlayerSelector teamA={selectedTeamA} teamB={selectedTeamB} />;
  }

  return (
    <div className="fixed inset-0 overflow-y-auto" style={{
      backgroundImage: `url(${bgImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh'
    }}>
      <div className="relative min-h-screen w-full">        
        {/* Main Content */}
        <div className="w-full px-4 md:px-8 py-8 mx-auto max-w-7xl">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center text-white mb-4 drop-shadow-lg"
          >
            Start a Match
          </motion.h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
  {/* Left Column */}
  <motion.div 
    className="flex flex-col space-y-6 w-full"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    {/* Big Card */}
    <motion.div 
      className="min-h-[300px] bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl p-6 w-full border border-blue-100 flex flex-col"
      whileHover={{ scale: 1.01 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Select Teams</h2>
      <div className="space-y-4 w-full flex-1">
        {/* Team A */}
        <div className="w-full">
          <label className="block text-gray-700 mb-2 font-medium">Team A</label>
          <select
            className="w-full p-3 border-2 border-blue-200 rounded-lg bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            value={selectedTeamA}
            onChange={(e) => setSelectedTeamA(e.target.value)}
          >
            <option value="">Select Team</option>
            {teams.map(team => (
              <option key={`teamA-${team}`} value={team}>{team}</option>
            ))}
          </select>
        </div>
        {/* Team B */}
        <div className="w-full">
          <label className="block text-gray-700 mb-2 font-medium">Team B</label>
          <select
            className="w-full p-3 border-2 border-blue-200 rounded-lg bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            value={selectedTeamB}
            onChange={(e) => setSelectedTeamB(e.target.value)}
          >
            <option value="">Select Team</option>
            {teams.filter(t => t !== selectedTeamA).map(team => (
              <option key={`teamB-${team}`} value={team}>{team}</option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>

    {/* Smaller Card - Overs */}
    <motion.div 
      className="min-h-[200px] bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl p-6 w-full border border-blue-100 flex flex-col justify-center"
      whileHover={{ scale: 1.01 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Choose your Overs</h2>
      <div className="w-full">
        <input
          type="number"
          placeholder="Enter overs (e.g. 20)"
          className="w-full p-3 border-2 border-blue-200 rounded-lg bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          value={overs}
          onChange={(e) => setOvers(e.target.value)}
          min="1"
          max="50"
        />
      </div>
    </motion.div>
  </motion.div>

  {/* Right Column */}
  <motion.div 
    className="flex flex-col space-y-6 w-full"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    {/* Big Card */}
    <motion.div 
      className="min-h-[300px] bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl p-6 w-full border border-blue-100 flex flex-col"
      whileHover={{ scale: 1.01 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Toss Details</h2>
      <div className="space-y-4 w-full flex-1">
        {/* Toss Winner */}
        <div className="w-full">
          <label className="block text-gray-700 mb-2 font-medium">Record Toss & Decision</label>
          <select
            className="w-full p-3 border-2 border-blue-200 rounded-lg bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 mb-4"
            value={tossWinner}
            onChange={(e) => setTossWinner(e.target.value)}
          >
            <option value="">Select Team</option>
            {selectedTeamA && <option value={selectedTeamA}>{selectedTeamA}</option>}
            {selectedTeamB && <option value={selectedTeamB}>{selectedTeamB}</option>}
          </select>
        </div>
        {/* Toss Decision */}
        <div className="w-full">
          <label className="block text-gray-700 mb-2 font-medium">Elected to:</label>
          <div className="flex space-x-8 items-center">
            <label className="inline-flex items-center space-x-2">
              <input
                type="radio"
                name="tossDecision"
                value="Batting"
                checked={tossDecision === 'Batting'}
                onChange={() => setTossDecision('Batting')}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-black font-medium">Batting</span>
            </label>
            <label className="inline-flex items-center space-x-2">
              <input
                type="radio"
                name="tossDecision"
                value="Bowling"
                checked={tossDecision === 'Bowling'}
                onChange={() => setTossDecision('Bowling')}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-black font-medium">Bowling</span>
            </label>
          </div>
        </div>
      </div>
    </motion.div>

    {/* Smaller Card - Assign Scorer */}
    <motion.div 
      className="min-h-[200px] bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl p-6 w-full border border-blue-100 flex flex-col justify-center"
      whileHover={{ scale: 1.01 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Assign Scorer</h2>
      <div className="w-full">
        <select
          className="w-full p-3 border-2 border-blue-200 rounded-lg bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          value={scorer}
          onChange={(e) => setScorer(e.target.value)}
        >
          <option value="">Select Scorer</option>
          {scorers.map(person => (
            <option key={person} value={person}>{person}</option>
          ))}
        </select>
      </div>
    </motion.div>
  </motion.div>
</div>


          {/* Next Button */}
          <motion.div 
            className="mt-8 text-center w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.button
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl text-xl transition-all duration-300"
              onClick={handleNext}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              Next
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Startmatch;