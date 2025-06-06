import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TeamSquadModal = ({ team, onClose }) => {
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
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
            <h2 className="text-2xl font-bold text-purple-400">Squad: {team.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-3xl font-light"
            >
              ×
            </button>
          </div>

          {(!team.players || team.players.length === 0) ? (
            <div className="text-center text-gray-400 py-8">No players found for this team.</div>
          ) : (
            <ul className="space-y-4">
              {team.players.map((player, index) => (
                <li key={index} className="flex items-center space-x-4 bg-gray-700 p-3 rounded-md">
                  <img
                    src={player.imageUrl || 'https://via.placeholder.com/60?text=Player'}
                    alt={player.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{player.name}</h3>
                    <p className="text-gray-300 text-sm">Role: {player.role || 'N/A'}</p>
                    {player.runs > 0 && (
                      <p className="text-purple-300 text-xs">Runs: {player.runs}</p>
                    )}
                    {player.wickets > 0 && (
                      <p className="text-green-300 text-xs">Wickets: {player.wickets}</p>
                    )}
                    {(!player.runs && !player.wickets) && (
                      <p className="text-gray-400 text-xs">No stats available</p>
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