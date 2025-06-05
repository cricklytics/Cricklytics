// src/LandingPage/AddTeamModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../../firebase'; // Adjust path as per your firebase.js location
import { collection, addDoc } from 'firebase/firestore';

const AddTeamModal = ({ onClose, onTeamAdded }) => {
  const [teamName, setTeamName] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [matchesPlayed, setMatchesPlayed] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [points, setPoints] = useState(0);
  const [lastMatchResult, setLastMatchResult] = useState('');
  const [players, setPlayers] = useState([{ name: '', role: '', runs: 0, wickets: 0 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleAddPlayer = () => {
    setPlayers([...players, { name: '', role: '', runs: 0, wickets: 0 }]);
  };

  const handlePlayerChange = (index, field, value) => {
    const newPlayers = [...players];
    newPlayers[index][field] = value;
    setPlayers(newPlayers);
  };

  const handleRemovePlayer = (index) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Basic validation
    if (!teamName || !captainName) {
      setError('Team Name and Captain are required.');
      setLoading(false);
      return;
    }

    try {
      const newTeam = {
        name: teamName,
        captain: captainName,
        matches: parseInt(matchesPlayed),
        wins: parseInt(wins),
        losses: parseInt(losses),
        points: parseInt(points),
        lastMatch: lastMatchResult,
        players: players.map(player => ({
          name: player.name,
          role: player.role,
          runs: parseInt(player.runs),
          wickets: parseInt(player.wickets),
        })),
        createdAt: new Date(), // Add a timestamp
      };

      await addDoc(collection(db, 'clubTeams'), newTeam);
      setSuccess(true);
      // Clear form after successful submission
      setTeamName('');
      setCaptainName('');
      setMatchesPlayed(0);
      setWins(0);
      setLosses(0);
      setPoints(0);
      setLastMatchResult('');
      setPlayers([{ name: '', role: '', runs: 0, wickets: 0 }]);
      
      onTeamAdded(); // Notify parent component that a team was added
      setTimeout(onClose, 1500); // Close after a short delay to show success
    } catch (err) {
      console.error("Error adding team: ", err);
      setError("Failed to add team: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Add New Team</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="teamName" className="block text-sm font-medium text-gray-300">Team Name</label>
            <input
              type="text"
              id="teamName"
              className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="captainName" className="block text-sm font-medium text-gray-300">Captain Name</label>
            <input
              type="text"
              id="captainName"
              className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={captainName}
              onChange={(e) => setCaptainName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="matchesPlayed" className="block text-sm font-medium text-gray-300">Matches Played</label>
              <input
                type="number"
                id="matchesPlayed"
                className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={matchesPlayed}
                onChange={(e) => setMatchesPlayed(e.target.value)}
                min="0"
              />
            </div>
            <div>
              <label htmlFor="wins" className="block text-sm font-medium text-gray-300">Wins</label>
              <input
                type="number"
                id="wins"
                className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={wins}
                onChange={(e) => setWins(e.target.value)}
                min="0"
              />
            </div>
            <div>
              <label htmlFor="losses" className="block text-sm font-medium text-gray-300">Losses</label>
              <input
                type="number"
                id="losses"
                className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={losses}
                onChange={(e) => setLosses(e.target.value)}
                min="0"
              />
            </div>
            <div>
              <label htmlFor="points" className="block text-sm font-medium text-gray-300">Points</label>
              <input
                type="number"
                id="points"
                className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                min="0"
              />
            </div>
          </div>
          <div>
            <label htmlFor="lastMatchResult" className="block text-sm font-medium text-gray-300">Last Match Result</label>
            <input
              type="text"
              id="lastMatchResult"
              className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={lastMatchResult}
              onChange={(e) => setLastMatchResult(e.target.value)}
            />
          </div>

          <h3 className="text-lg font-bold text-gray-200 mt-6 mb-2">Players</h3>
          {players.map((player, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 bg-gray-700 p-3 rounded-md border border-gray-600">
              <div className="col-span-2">
                <label htmlFor={`playerName-${index}`} className="block text-xs font-medium text-gray-400">Name</label>
                <input
                  type="text"
                  id={`playerName-${index}`}
                  className="mt-1 block w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded-md text-white text-sm"
                  value={player.name}
                  onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor={`playerRole-${index}`} className="block text-xs font-medium text-gray-400">Role</label>
                <select
                  id={`playerRole-${index}`}
                  className="mt-1 block w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded-md text-white text-sm"
                  value={player.role}
                  onChange={(e) => handlePlayerChange(index, 'role', e.target.value)}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Batsman">Batsman</option>
                  <option value="Bowler">Bowler</option>
                  <option value="All-rounder">All-rounder</option>
                  <option value="Wicketkeeper">Wicketkeeper</option>
                </select>
              </div>
              <div>
                <label htmlFor={`playerRuns-${index}`} className="block text-xs font-medium text-gray-400">Runs</label>
                <input
                  type="number"
                  id={`playerRuns-${index}`}
                  className="mt-1 block w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded-md text-white text-sm"
                  value={player.runs}
                  onChange={(e) => handlePlayerChange(index, 'runs', e.target.value)}
                  min="0"
                />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <label htmlFor={`playerWickets-${index}`} className="block text-xs font-medium text-gray-400">Wickets</label>
                  <input
                    type="number"
                    id={`playerWickets-${index}`}
                    className="mt-1 block w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded-md text-white text-sm"
                    value={player.wickets}
                    onChange={(e) => handlePlayerChange(index, 'wickets', e.target.value)}
                    min="0"
                  />
                </div>
                {players.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(index)}
                    className="p-1 text-red-400 hover:text-red-600 transition"
                    title="Remove player"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddPlayer}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Another Player
          </button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">Team added successfully!</p>}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Adding Team...' : 'Add Team'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddTeamModal;