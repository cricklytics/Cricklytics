import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase'; // Import your Firebase db instance
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions

import logo from '../assets/pawan/PlayerProfile/picture-312.png'; // Still need these if used elsewhere
import bgImg from '../assets/sophita/HomePage/advertisement5.jpeg'; // Still need these if used elsewhere

// =====================================================================
// PlayerSelector Component (will be updated in next step)
// For now, it will receive full team objects.
// =====================================================================
const PlayerSelector = ({ teamA, teamB, overs, origin, scorer }) => {
  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');
  // Initialize selectedPlayers with empty arrays
  const [selectedPlayers, setSelectedPlayers] = useState({ left: [], right: [] });
  const navigate = useNavigate();

  // IMPORTANT: playersTeamA and playersTeamB will no longer be hardcoded.
  // They will come from the 'players' array within the teamA and teamB objects.
  // teamA and teamB props now contain the full team object from Firestore.
  // They might be undefined initially, so handle that.
  const playersTeamAData = teamA?.players || [];
  const playersTeamBData = teamB?.players || [];

  const filteredLeftPlayers = playersTeamAData.filter(player =>
    player.name.toLowerCase().includes(leftSearch.toLowerCase()) // Filter by player.name
  );
  const filteredRightPlayers = playersTeamBData.filter(player =>
    player.name.toLowerCase().includes(rightSearch.toLowerCase()) // Filter by player.name
  );

  const togglePlayerSelection = (side, player) => {
    setSelectedPlayers(prev => {
      const newSelection = { ...prev };
      if (newSelection[side].includes(player)) {
        // Deselect player (using the full player object)
        newSelection[side] = newSelection[side].filter(p => p !== player);
      } else {
        // Select player only if less than 11 are already selected
        if (newSelection[side].length < 11) {
          newSelection[side] = [...newSelection[side], player];
        }
      }
      return newSelection;
    });
  };

  const handleActualStartMatch = () => {
    if (selectedPlayers.left.length !== 11 || selectedPlayers.right.length !== 11) {
      alert("Please select exactly 11 players for each team before starting the match.");
      return;
    }

    console.log("Starting match with players:", selectedPlayers);
    console.log('Origin being passed to StartMatchPlayers:', origin);
    navigate('/StartMatchPlayersSB', {
      state: {
        scorer: scorer, // Fixed: Use the scorer prop passed to PlayerSelector
        overs: overs,
        teamA: teamA, // Pass full team A object
        teamB: teamB, // Pass full team B object
        selectedPlayers: selectedPlayers, // This now contains full player objects
        origin: origin
      }
    });
  };

  return (
    <div
      className="w-full relative py-8"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: 'calc(100vh - H - N)',
      }}
    >
      <div className="w-full px-4 md:px-8 pb-8 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl border border-blue-100"
        >
          <h1 className="text-4xl font-bold mb-6 text-black">Select Players</h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Team A Player Selection */}
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-semibold text-blue-800">{teamA?.name || 'Team A'}</span>
                {teamA?.flagUrl && (
                    <img src={teamA.flagUrl} alt={`${teamA.name} Flag`} className="w-8 h-6 object-cover rounded-sm" />
                )}
                <span className="ml-auto text-lg font-bold text-blue-700">
                  Selected: {selectedPlayers.left.length}/11
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
                  {filteredLeftPlayers.length === 0 ? (
                      <p className="p-3 text-gray-500">No players found or team has no players.</p>
                  ) : (
                    filteredLeftPlayers.map((player, index) => {
                      const isSelected = selectedPlayers.left.includes(player);
                      const isSelectionDisabled = selectedPlayers.left.length >= 11 && !isSelected;

                      return (
                        <motion.div
                          key={player.name} // Use player.name or a unique ID if available
                          className={`p-3 border-b border-blue-50 last:border-b-0 transition-colors duration-200 flex items-center ${
                            isSelected
                              ? 'bg-blue-100 font-medium'
                              : 'hover:bg-blue-50'
                          } ${isSelectionDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          onClick={isSelectionDisabled ? null : () => togglePlayerSelection('left', player)}
                          whileHover={isSelectionDisabled ? {} : { scale: 1.01 }}
                        >
                          {player.photoUrl && (
                              <img src={player.photoUrl} alt={player.name} className="w-8 h-8 rounded-full object-cover mr-3 border border-gray-300" />
                          )}
                          <span className="text-blue-800">{player.name}</span>
                          {player.role && <span className="ml-2 text-sm text-gray-500">({player.role})</span>}
                          {isSelected && (
                            <span className="float-right text-blue-600 ml-auto">✓</span>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>

            {/* Team B Player Selection */}
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-semibold text-indigo-800">{teamB?.name || 'Team B'}</span>
                {teamB?.flagUrl && (
                    <img src={teamB.flagUrl} alt={`${teamB.name} Flag`} className="w-8 h-6 object-cover rounded-sm" />
                )}
                <span className="ml-auto text-lg font-bold text-indigo-700">
                  Selected: {selectedPlayers.right.length}/11
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
                  {filteredRightPlayers.length === 0 ? (
                      <p className="p-3 text-gray-500">No players found or team has no players.</p>
                  ) : (
                    filteredRightPlayers.map((player, index) => {
                      const isSelected = selectedPlayers.right.includes(player);
                      const isSelectionDisabled = selectedPlayers.right.length >= 11 && !isSelected;

                      return (
                        <motion.div
                          key={player.name} // Use player.name or a unique ID if available
                          className={`p-3 border-b border-indigo-50 last:border-b-0 transition-colors duration-200 flex items-center ${
                            isSelected
                              ? 'bg-indigo-100 font-medium'
                              : 'hover:bg-indigo-50'
                          } ${isSelectionDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          onClick={isSelectionDisabled ? null : () => togglePlayerSelection('right', player)}
                          whileHover={isSelectionDisabled ? {} : { scale: 1.01 }}
                        >
                          {player.photoUrl && (
                              <img src={player.photoUrl} alt={player.name} className="w-8 h-8 rounded-full object-cover mr-3 border border-gray-300" />
                          )}
                          <span className="text-blue-800">{player.name}</span>
                          {player.role && <span className="ml-2 text-sm text-gray-500">({player.role})</span>}
                          {isSelected && (
                            <span className="float-right text-indigo-600 ml-auto">✓</span>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-8 pt-4 border-t border-blue-200">
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleActualStartMatch}
            >
              Start Match
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// =====================================================================
// Startmatch Component
// =====================================================================
const Startmatch = ({ initialTeamA = '', initialTeamB = '', origin }) => {
  console.log('Startmatch received origin prop:', origin);

  const [allTeams, setAllTeams] = useState([]); // New state to store fetched teams
  const [loadingTeams, setLoadingTeams] = useState(true); // Loading state for teams
  const [teamFetchError, setTeamFetchError] = useState(null); // Error state for teams

  const [selectedTeamA, setSelectedTeamA] = useState('');
  const [selectedTeamB, setSelectedTeamB] = useState('');
  const [tossWinner, setTossWinner] = useState('');
  const [tossDecision, setTossDecision] = useState('Batting');
  const [overs, setOvers] = useState('');
  const [scorer, setScorer] = useState('');
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);
  
  // Effect to fetch teams from Firebase
  useEffect(() => {
    const fetchAllTeams = async () => {
      try {
        setLoadingTeams(true);
        const teamsCollectionRef = collection(db, 'teams');
        const teamSnapshot = await getDocs(teamsCollectionRef);
        const fetchedTeams = teamSnapshot.docs.map(doc => ({
          id: doc.id, // The document ID is the team name, used as key
          name: doc.data().name, // Actual team name field
          flagUrl: doc.data().flagUrl,
          players: doc.data().players || [] // Ensure players array exists
        }));
        setAllTeams(fetchedTeams);
      } catch (err) {
        console.error("Error fetching all teams:", err);
        setTeamFetchError("Failed to load teams from database. Please check console.");
      } finally {
        setLoadingTeams(false);
      }
    };
    fetchAllTeams();
  }, []);

  // Effect to update state if props change after initial render (optional but good practice)
  useEffect(() => {
    if (initialTeamA && allTeams.length > 0) {
      setSelectedTeamA(initialTeamA);
    }
  }, [initialTeamA, allTeams]); // Depend on allTeams to ensure it's loaded

  useEffect(() => {
    if (initialTeamB && allTeams.length > 0) {
      setSelectedTeamB(initialTeamB);
    }
  }, [initialTeamB, allTeams]); // Depend on allTeams to ensure it's loaded

  // --- NEW LOGIC FOR TEAM B SELECTION FILTER ---
  // This useEffect ensures that if Team A is changed AFTER Team B is selected,
  // and the new Team A value is the same as Team B, Team B is reset.
  useEffect(() => {
    if (selectedTeamA && selectedTeamB === selectedTeamA) {
      setSelectedTeamB(''); // Reset Team B if it clashes with Team A
    }
  }, [selectedTeamA, selectedTeamB]);
  // --- END NEW LOGIC ---

  const handleNext = () => {
    if (!selectedTeamA || !selectedTeamB || !overs || !scorer) {
      alert('Please select both teams, enter overs, and assign the scorer.');
      return;
    }
    if (selectedTeamA === selectedTeamB) { // Double check for direct selection
        alert('Teams A and B cannot be the same. Please select different teams.');
        return;
    }

    // Ensure the selected teams exist and have players
    const teamAData = allTeams.find(team => team.name === selectedTeamA);
    const teamBData = allTeams.find(team => team.name === selectedTeamB);

    if (!teamAData) {
        alert(`Team "${selectedTeamA}" not found in database.`);
        return;
    }
    if (!teamBData) {
        alert(`Team "${selectedTeamB}" not found in database.`);
        return;
    }
    if (!teamAData.players || teamAData.players.length === 0) {
      alert(`Team "${selectedTeamA}" has no players registered. Please add players via Admin Panel.`);
      return;
    }
    if (!teamBData.players || teamBData.players.length === 0) {
      alert(`Team "${selectedTeamB}" has no players registered. Please add players via Admin Panel.`);
      return;
    }

    setShowPlayerSelector(true);
  };

  // If showing player selector, render it
  if (showPlayerSelector) {
    // Pass the full team objects (including players array) to PlayerSelector
    const teamAObject = allTeams.find(team => team.name === selectedTeamA);
    const teamBObject = allTeams.find(team => team.name === selectedTeamB);

    return (
      <PlayerSelector
        teamA={teamAObject}
        teamB={teamBObject}
        overs={overs}
        origin={origin}
        scorer={scorer}
      />
    );
  }

  const hasValue = (value) => value !== '' && value !== null && value !== undefined;

  if (loadingTeams) {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <p className="text-xl">Loading Teams...</p>
        </div>
    );
  }

  if (teamFetchError) {
      return (
          <div className="min-h-screen bg-gray-900 text-red-500 flex items-center justify-center">
              <p className="text-xl">Error: {teamFetchError}</p>
          </div>
      );
  }
  // Check if there are at least two teams to select from
  if (allTeams.length < 2) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl text-center">
          Not enough teams registered. Please add at least two teams and their players via the Admin Panel.
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full relative"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: 'calc(100vh - H - N)',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="w-full px-4 md:px-8 pb-8 py-1 mx-auto max-w-7xl">
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
              {/* Big Card - Select Teams */}
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
                      className={`w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${hasValue(selectedTeamA) ? 'bg-gray-200 text-gray-700' : 'bg-white'}`}
                      value={selectedTeamA}
                      onChange={(e) => setSelectedTeamA(e.target.value)}
                    >
                      <option value="">Select Team</option>
                      {allTeams.map(team => (
                        <option key={`teamA-${team.id}`} value={team.name}>{team.name}</option>
                      ))}
                    </select>
                  </div>
                  {/* Team B */}
                  <div className="w-full">
                    <label className="block text-gray-700 mb-2 font-medium">Team B</label>
                    <select
                      className={`w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${hasValue(selectedTeamB) ? 'bg-gray-200 text-gray-700' : 'bg-white'}`}
                      value={selectedTeamB}
                      onChange={(e) => setSelectedTeamB(e.target.value)}
                    >
                      <option value="">Select Team</option>
                      {/* --- MODIFIED LINE HERE --- */}
                      {allTeams.filter(t => t.name !== selectedTeamA).map(team => (
                        <option key={`teamB-${team.id}`} value={team.name}>{team.name}</option>
                      ))}
                      {/* --- END MODIFIED LINE --- */}
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
                    className={`w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${hasValue(overs) ? 'bg-gray-200 text-gray-700' : 'bg-white'}`}
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
              {/* Big Card - Toss Details */}
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
                      className={`w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 mb-4 ${hasValue(tossWinner) ? 'bg-gray-200 text-gray-700' : 'bg-white'}`}
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
                  <input
                    type="text"
                    placeholder="Enter scorer name"
                    className={`w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${hasValue(scorer) ? 'bg-gray-200 text-gray-700' : 'bg-white'}`}
                    value={scorer}
                    onChange={(e) => setScorer(e.target.value)}
                  />
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
      </motion.div>
    </div>
  );
};

export default Startmatch;
