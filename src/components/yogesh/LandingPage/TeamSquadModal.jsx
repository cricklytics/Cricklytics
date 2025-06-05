// src/components/TeamSquadModal.jsx (Updated)
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../../firebase'; // Adjust path to firebase.js if needed
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const TeamSquadModal = ({ team, onClose }) => {
  const [squadPlayers, setSquadPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ensure we have a team object and a team name to query by
    if (!team || !team.name) {
      setError("No team name provided to fetch squad.");
      setLoadingPlayers(false);
      return;
    }

    const playersCollectionRef = collection(db, 'clubPlayers');
    // --- KEY CHANGE HERE: Query by 'team' field (team name) instead of 'teamId' ---
    const q = query(playersCollectionRef, where('team', '==', team.name));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLoadingPlayers(true);
      setError(null);
      const players = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSquadPlayers(players);
      setLoadingPlayers(false);
    }, (err) => {
      console.error("Error fetching squad players: ", err);
      setError("Failed to load players: " + err.message);
      setLoadingPlayers(false);
    });

    return () => unsubscribe(); // Clean up listener
  }, [team]); // Re-run effect if the team prop changes

  if (!team) {
    return null; // Don't render if no team is provided
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
        onClick={onClose} // Close when clicking outside the modal content
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
        >
          <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
            <h2 className="text-2xl font-bold text-purple-400">Squad: {team.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-3xl font-light"
            >
              &times;
            </button>
          </div>

          {loadingPlayers ? (
            <div className="text-center text-gray-400 py-8">Loading squad...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : squadPlayers.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No players found for this team.</div>
          ) : (
            <ul className="space-y-4">
              {squadPlayers.map((player) => (
                <li key={player.id} className="flex items-center space-x-4 bg-gray-700 p-3 rounded-md">
                  <img
                    // Using player.image from your AddPlayerModal structure
                    src={player.image || 'https://via.placeholder.com/60?text=Player'}
                    alt={player.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{player.name}</h3>
                    {/* Displaying role from your player data */}
                    <p className="text-gray-300 text-sm">Role: {player.role || 'N/A'}</p>
                    {/* You can add more details from your player data here */}
                    {player.careerStats?.batting?.highest > 0 && (
                        <p className="text-gray-400 text-xs">Highest Score: {player.careerStats.batting.highest}</p>
                    )}
                    {player.careerStats?.bowling?.wickets > 0 && (
                        <p className="text-gray-400 text-xs">Total Wickets: {player.careerStats.bowling.wickets}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TeamSquadModal;