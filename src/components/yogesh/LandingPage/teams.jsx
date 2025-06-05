// src/pages/Teams.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RoleSelectionModal from '../LandingPage/RoleSelectionModal'; // Adjust path if needed
import AddTeamModal from '../LandingPage/AddTeamModal'; // Import the new modal
import TeamSquadModal from '../LandingPage/TeamSquadModal'; // Import the new TeamSquadModal
import { db, auth } from '../../../firebase'; // Adjust path to firebase.js
import { collection, onSnapshot, query } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const Teams = () => {
  // State for role selection modal
  const [showRoleModal, setShowRoleModal] = useState(() => {
    const storedRole = sessionStorage.getItem('userRole');
    return !storedRole; // Show modal if no role is stored
  });
  const [userRole, setUserRole] = useState(() => {
    return sessionStorage.getItem('userRole') || null;
  });
  const [currentUserId, setCurrentUserId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // State for Add Team Modal
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);

  // --- NEW STATE FOR TEAM SQUAD MODAL ---
  const [showTeamSquadModal, setShowTeamSquadModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null); // To store the team object for the modal

  // State for fetching teams from Firestore
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [teamsError, setTeamsError] = useState(null);

  // Function to handle role selection
  const handleSelectRole = (role) => {
    setUserRole(role);
    sessionStorage.setItem('userRole', role); // Store the selected role
    setShowRoleModal(false);
  };

  // --- NEW FUNCTION TO OPEN SQUAD MODAL ---
  const handleViewSquad = (team) => {
    setSelectedTeam(team);
    setShowTeamSquadModal(true);
  };

  // Effect to listen for auth state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null); // No user logged in
      }
      setAuthLoading(false);
    });

    return () => unsubscribeAuth(); // Clean up auth listener
  }, []);

  // Effect to fetch teams from Firestore
  useEffect(() => {
    const teamsCollectionRef = collection(db, 'clubTeams');
    const q = query(teamsCollectionRef); // Removed orderBy clause as per your request

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLoadingTeams(true);
      setTeamsError(null);
      const fetchedTeams = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTeams(fetchedTeams);
      setLoadingTeams(false);
    }, (error) => {
      console.error("Error fetching teams: ", error);
      setTeamsError("Failed to load teams: " + error.message);
      setLoadingTeams(false);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  // Conditional rendering based on authentication and role
  if (authLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white text-xl">
        Loading authentication...
      </div>
    );
  }

  // If not logged in and trying to access admin features
  if (!currentUserId && userRole === 'admin') {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white text-xl">
        Please log in to manage teams as an admin.
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-gray-100">
      <AnimatePresence>
        {showRoleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <RoleSelectionModal onSelectRole={handleSelectRole} />
          </motion.div>
        )}
      </AnimatePresence>

      {userRole && ( // Only render content if a role is selected
        <>
          {/* Page Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-purple-400">Teams</h1>
              <p className="text-gray-400 mt-2">SAYAR CUP 2023-24 • Ranveer Singh Cricket Stadium, Jaipur</p>
            </div>
            {userRole === 'admin' && currentUserId && (
              <button
                onClick={() => setShowAddTeamModal(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Add Team
              </button>
            )}
          </div>

          {/* Teams Grid */}
          {loadingTeams ? (
            <div className="text-center text-gray-400 text-xl py-8">Loading teams...</div>
          ) : teamsError ? (
            <div className="text-center text-red-500 text-xl py-8">{teamsError}</div>
          ) : teams.length === 0 ? (
            <div className="text-center text-gray-400 text-xl py-8">No teams found. {userRole === 'admin' && 'Add some teams!'}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teams.map((team) => (
                <div key={team.id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-700">
                  {/* Team Header */}
                  <div className="bg-purple-800 p-4 text-white">
                    <h2 className="text-xl font-bold truncate">{team.name}</h2>
                    <p className="text-sm opacity-90">Captain: {team.captain}</p>
                  </div>

                  {/* Team Stats */}
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div className="bg-gray-700 p-2 rounded">
                        <p className="text-sm text-gray-300">Matches</p>
                        <p className="font-bold">{team.matches}</p>
                      </div>
                      <div className="bg-gray-700 p-2 rounded">
                        <p className="text-sm text-gray-300">Wins</p>
                        <p className="font-bold text-green-400">{team.wins}</p>
                      </div>
                      <div className="bg-gray-700 p-2 rounded">
                        <p className="text-sm text-gray-300">Points</p>
                        <p className="font-bold">{team.points}</p>
                      </div>
                    </div>

                    {/* Last Match */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-400">Last Match</p>
                      <p className={`text-sm ${team.lastMatch && team.lastMatch.startsWith('Won') ? 'text-green-400' : 'text-red-400'}`}>
                        {team.lastMatch}
                      </p>
                    </div>

                    {/* Key Players */}
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-2">Key Players</p>
                      <div className="space-y-2">
                        {team.players && team.players.length > 0 ? (
                          team.players.map((player, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span className="font-medium text-gray-300">{player.name}</span>
                              <div className="flex gap-2">
                                <span className="bg-purple-900 text-purple-300 px-2 py-0.5 rounded text-xs">
                                  {player.runs || 0}r
                                </span>
                                {player.wickets > 0 && (
                                  <span className="bg-green-900 text-green-300 px-2 py-0.5 rounded text-xs">
                                    {player.wickets || 0}w
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No players listed for this team.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* View Team Button - UPDATED */}
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => handleViewSquad(team)} // Call the new handler
                      className="w-full py-2 bg-purple-900 text-purple-300 rounded-md hover:bg-purple-700 transition font-medium"
                    >
                      View Full Squad
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Team Comparison Section (Table remains the same but uses fetched 'teams') */}
          <div className="mt-12 bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-gray-200 mb-6">Team Standings</h2>

            {loadingTeams ? (
              <div className="text-center text-gray-400">Loading standings...</div>
            ) : teamsError ? (
              <div className="text-center text-red-500">{teamsError}</div>
            ) : teams.length === 0 ? (
              <div className="text-center text-gray-400">No team standings available.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Played</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Won</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Lost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Points</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">NRR</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Form</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {teams
                      .sort((a, b) => b.points - a.points) // Ensure sorting by points
                      .map((team, index) => (
                        <tr key={team.id} className="hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-400">{team.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{team.matches}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{team.wins}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{team.losses}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-200">{team.points}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {/* Placeholder NRR, you might want to calculate this or fetch from DB */}
                            {team.nrr || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-1">
                              {/* Placeholder Form, ideally fetched from DB or dynamically generated */}
                              {['W', 'L', 'W', 'W', 'L'].map((result, i) => ( // Static example, replace with dynamic data
                                <span
                                  key={i}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                    result === 'W' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                                  }`}
                                >
                                  {result}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Tournament Stats - (These sections are static in your original code, keep them as is or update as needed) */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-gray-200 mb-4">Highest Team Totals</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span className="font-medium text-gray-300">202/2</span>
                  <span className="text-sm text-gray-400">Jaipur Strikers vs JAY GARHWAL</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span className="font-medium text-gray-300">203/7</span>
                  <span className="text-sm text-gray-400">Aloha Warriors XI vs LUT Biggieagles</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-300">169/8</span>
                  <span className="text-sm text-gray-400">LUT Biggieagles vs Alejha Warriors</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-gray-200 mb-4">Lowest Team Totals</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span className="font-medium text-gray-300">76/10</span>
                  <span className="text-sm text-gray-400">Aavas Financiers vs Golden Warriors</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span className="font-medium text-gray-300">128/9</span>
                  <span className="text-sm text-gray-400">JAY GARHWAL vs Jaipur Strikers</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-300">129/3</span>
                  <span className="text-sm text-gray-400">LUT Biggieagles vs Aloha Warriors</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-gray-200 mb-4">Biggest Victories</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span className="font-medium text-gray-300">93 runs</span>
                  <span className="text-sm text-gray-400">LUT Biggieagles vs Aavas Financiers</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span className="font-medium text-gray-300">74 runs</span>
                  <span className="text-sm text-gray-400">Jaipur Strikers vs JAY GARHWAL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-300">8 wickets</span>
                  <span className="text-sm text-gray-400">Golden Warriors vs Jaipur Strikers</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Team Modal */}
      <AnimatePresence>
        {showAddTeamModal && currentUserId && userRole === 'admin' && (
          <AddTeamModal
            onClose={() => setShowAddTeamModal(false)}
            onTeamAdded={() => {
              setShowAddTeamModal(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* --- NEW TEAM SQUAD MODAL RENDERING --- */}
      <AnimatePresence>
        {showTeamSquadModal && selectedTeam && (
          <TeamSquadModal
            team={selectedTeam}
            onClose={() => {
              setShowTeamSquadModal(false);
              setSelectedTeam(null); // Clear selected team when closing
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Teams;