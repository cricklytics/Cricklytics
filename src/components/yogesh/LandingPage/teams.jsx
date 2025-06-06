import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RoleSelectionModal from '../LandingPage/RoleSelectionModal'; // Adjust path if needed
import AddTeamModal from '../LandingPage/AddTeamModal'; // Import the new modal
import TeamSquadModal from '../LandingPage/TeamSquadModal'; // Import the TeamSquadModal
import { db, auth, storage } from '../../../firebase'; // Adjust path to firebase.js
import { collection, onSnapshot, query, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { FiPlusCircle, FiEdit, FiTrash2 } from 'react-icons/fi';

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

  // State for Add Player Modal
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [selectedTeamForPlayer, setSelectedTeamForPlayer] = useState(null); // For adding player to specific team

  // State for Edit Player Modal
  const [isEditPlayerModalOpen, setIsEditPlayerModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null); // For editing player
  const [selectedTeamForEdit, setSelectedTeamForEdit] = useState(null); // Team of the player being edited

  // State for Delete Confirmation
  const [showDeletePlayerConfirm, setShowDeletePlayerConfirm] = useState(false);
  const [showDeleteTeamConfirm, setShowDeleteTeamConfirm] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null); // Team to be deleted

  // State for Team Squad Modal
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

  // Function to open squad modal
  const handleViewSquad = (team) => {
    setSelectedTeam(team);
    setShowTeamSquadModal(true);
  };

  // Function to handle player added
  const handlePlayerAdded = () => {
    setIsAddPlayerModalOpen(false);
    setSelectedTeamForPlayer(null);
  };

  // Function to open add player modal for a specific team
  const handleOpenAddPlayer = (team) => {
    setSelectedTeamForPlayer(team);
    setIsAddPlayerModalOpen(true);
  };

  // Function to open edit player modal
  const handleOpenEditPlayer = (team, player) => {
    setSelectedTeamForEdit(team);
    setSelectedPlayer(player);
    setIsEditPlayerModalOpen(true);
  };

  // Function to handle image upload to Firebase Storage
  const handleImageUpload = async (file, playerName, teamId) => {
    if (!file) return null;
    try {
      const storageRef = ref(storage, `player_images/${teamId}/${playerName}_${Date.now()}`);
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = async (event) => {
          try {
            const base64Image = event.target.result.split(',')[1]; // Remove data URL prefix
            await uploadString(storageRef, base64Image, 'base64');
            const downloadURL = await getDownloadURL(storageRef);
            resolve(downloadURL);
          } catch (error) {
            console.error('Error uploading image: ', error);
            reject(error);
          }
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error('Error uploading image: ', error);
      return null;
    }
  };

  // Function to handle player edit
  const handleEditPlayer = async (teamId, updatedPlayer, imageFile) => {
    try {
      let imageUrl = updatedPlayer.imageUrl || selectedPlayer?.imageUrl || '';
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile, updatedPlayer.name, teamId);
      }
      const teamRef = doc(db, 'clubTeams', teamId);
      const updatedPlayerData = { ...updatedPlayer, imageUrl };
      const updatedPlayers = selectedTeamForEdit.players.map((player) =>
        player.name === selectedPlayer.name ? updatedPlayerData : player
      );
      await updateDoc(teamRef, { players: updatedPlayers });
      setIsEditPlayerModalOpen(false);
      setSelectedPlayer(null);
      setSelectedTeamForEdit(null);
    } catch (error) {
      console.error("Error updating player: ", error);
    }
  };

  // Function to handle removing a player
  const handleRemovePlayer = async (teamId) => {
    try {
      const teamRef = doc(db, 'clubTeams', teamId);
      const updatedPlayers = selectedTeamForEdit.players.filter(
        (player) => player.name !== selectedPlayer.name
      );
      await updateDoc(teamRef, { players: updatedPlayers });
      setShowDeletePlayerConfirm(false);
      setIsEditPlayerModalOpen(false);
      setSelectedPlayer(null);
      setSelectedTeamForEdit(null);
    } catch (error) {
      console.error("Error removing player: ", error);
    }
  };

  // Function to handle deleting a team
  const handleDeleteTeam = async (teamId) => {
    try {
      const teamRef = doc(db, 'clubTeams', teamId);
      await deleteDoc(teamRef);
      setShowDeleteTeamConfirm(false);
      setTeamToDelete(null);
    } catch (error) {
      console.error("Error deleting team: ", error);
    }
  };

  // Function to handle adding a new player
  const handleAddPlayer = async (teamId, newPlayer, imageFile) => {
    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile, newPlayer.name, teamId);
      }
      const teamRef = doc(db, 'clubTeams', teamId);
      const team = teams.find((t) => t.id === teamId);
      const updatedPlayer = { ...newPlayer, imageUrl };
      const updatedPlayers = [...(team.players || []), updatedPlayer];
      await updateDoc(teamRef, { players: updatedPlayers });
      handlePlayerAdded();
    } catch (error) {
      console.error("Error adding player: ", error);
    }
  };

  // Effect to listen for auth state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null); // No user is logged in
      }
      setAuthLoading(false);
    });

    return () => unsubscribeAuth(); // Clean up auth listener
  }, []);

  // Effect to fetch teams from Firestore
  useEffect(() => {
    const teamsCollectionRef = collection(db, 'clubTeams');
    const q = query(teamsCollectionRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setLoadingTeams(true);
        setTeamsError(null);
        const fetchedTeams = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTeams(fetchedTeams);
        setLoadingTeams(false);
      },
      (error) => {
        console.error('Error fetching teams: ', error);
        setTeamsError('Failed to load teams: ' + error.message);
        setLoadingTeams(false);
      }
    );

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
        <p>Please log in to manage teams as an admin.</p>
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

      {userRole && (
        <>
          {/* Page Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-purple-400">Teams</h1>
              <p className="text-gray-400 mt-2">SAYAR CUP 2023-24 • Ranveer Singh Cricket Stadium, Jaipur</p>
            </div>
            {userRole === 'admin' && currentUserId && (
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAddPlayerModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <FiPlusCircle /> Add Player
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddTeamModal(true)}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <FiPlusCircle /> Add Team
                </motion.button>
              </div>
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
                <div key={team.id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-700 relative">
                  {/* Delete Team Button */}
                  {userRole === 'admin' && currentUserId && (
                    <button
                      onClick={() => {
                        setTeamToDelete(team);
                        setShowDeleteTeamConfirm(true);
                      }}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-500"
                      title="Delete Team"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  )}
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
                      <p className={`text-sm ${team.lastMatch && team.lastMatch.toLowerCase().startsWith('won') ? 'text-green-400' : 'text-red-400'}`}>
                        {team.lastMatch}
                      </p>
                    </div>

                    {/* Key Players */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-gray-400">Key Players</p>
                        {userRole === 'admin' && currentUserId && (
                          <button
                            onClick={() => handleOpenAddPlayer(team)}
                            className="text-green-400 hover:text-green-500"
                            title="Add Player"
                          >
                            <FiPlusCircle size={20} />
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {team.players && team.players.length > 0 ? (
                          team.players.slice(0, 3).map((player, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-300">{player.name}</span>
                                {userRole === 'admin' && currentUserId && (
                                  <button
                                    onClick={() => handleOpenEditPlayer(team, player)}
                                    className="text-yellow-400 hover:text-yellow-500"
                                    title="Edit Player"
                                  >
                                    <FiEdit size={16} />
                                  </button>
                                )}
                              </div>
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

                  {/* View Team Button */}
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => handleViewSquad(team)}
                      className="w-full py-2 bg-purple-900 text-purple-300 rounded-md hover:bg-purple-700 transition font-medium"
                    >
                      View Full Squad
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Team Comparison Section */}
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
                      .sort((a, b) => b.points - a.points)
                      .map((team, index) => (
                        <tr key={team.id} className="hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-400">{team.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{team.matches}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{team.wins}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{team.losses}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-200">{team.points}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {team.nrr || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-1">
                              {['W', 'L', 'W', 'W', 'L'].map((result, i) => (
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

          {/* Tournament Stats */}
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
                <div className="flex justify-between items-center pb-2 border-b border-b">
                  <span className="font-medium text-gray-300">74 runs</span>
                  <span className="text-sm text-gray-400">Jaipur Strikers vs JAY GARHWAL</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-300">8 wickets</span>
                  <span className="text-sm text-gray-500">Golden Warriors vs Jaipur Strikers</span>
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

      {/* Add Player Modal */}
      <AnimatePresence>
        {isAddPlayerModalOpen && currentUserId && userRole === 'admin' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-200 mb-4">Add Player to {selectedTeamForPlayer?.name}</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const newPlayer = {
                    name: e.target.name.value,
                    runs: parseInt(e.target.runs.value) || 0,
                    wickets: parseInt(e.target.wickets.value) || 0,
                  };
                  const imageFile = e.target.image.files[0];
                  await handleAddPlayer(selectedTeamForPlayer.id, newPlayer, imageFile);
                }}
              >
                <div className="mb-4">
                  <label className="block text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full bg-gray-700 text-gray-200 p-2 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-1">Runs</label>
                  <input
                    type="number"
                    name="runs"
                    defaultValue={0}
                    className="w-full bg-gray-700 text-gray-200 p-2 rounded"
                    min="0"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-1">Wickets</label>
                  <input
                    type="number"
                    name="wickets"
                    defaultValue={0}
                    className="w-full bg-gray-700 text-gray-200 p-2 rounded"
                    min="0"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-1">Upload Profile Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="w-full bg-gray-700 text-gray-200 p-2 rounded"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Add Player
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddPlayerModalOpen(false);
                      setSelectedTeamForPlayer(null);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Player Modal */}
      <AnimatePresence>
        {isEditPlayerModalOpen && currentUserId && userRole === 'admin' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-200 mb-4">Edit Player</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const updatedPlayer = {
                    name: e.target.name.value,
                    runs: parseInt(e.target.runs.value) || 0,
                    wickets: parseInt(e.target.wickets.value) || 0,
                    imageUrl: e.target.imageUrl.value || selectedPlayer?.imageUrl || '',
                  };
                  const imageFile = e.target.image.files[0];
                  await handleEditPlayer(selectedTeamForEdit.id, updatedPlayer, imageFile);
                }}
              >
                <div className="mb-4">
                  <label className="block text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={selectedPlayer?.name}
                    className="w-full bg-gray-700 text-gray-200 p-2 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-1">Runs</label>
                  <input
                    type="number"
                    name="runs"
                    defaultValue={selectedPlayer?.runs || 0}
                    className="w-full bg-gray-700 text-gray-200 p-2 rounded"
                    min="0"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-1">Wickets</label>
                  <input
                    type="number"
                    name="wickets"
                    defaultValue={selectedPlayer?.wickets || 0}
                    className="w-full bg-gray-700 text-gray-200 p-2 rounded"
                    min="0"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-1">Profile Image URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    defaultValue={selectedPlayer?.imageUrl || ''}
                    className="w-full bg-gray-700 text-gray-200 p-2 rounded"
                    placeholder="Enter image URL"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-1">Upload Profile Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="w-full bg-gray-700 text-gray-200 p-2 rounded"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeletePlayerConfirm(true);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Remove Player
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditPlayerModalOpen(false);
                      setSelectedPlayer(null);
                      setSelectedTeamForEdit(null);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Player Confirmation Modal */}
      <AnimatePresence>
        {showDeletePlayerConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-200 mb-4">Confirm Delete</h2>
              <p className="text-gray-300 mb-4">
                Are you sure you want to remove {selectedPlayer?.name} from {selectedTeamForEdit?.name}?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleRemovePlayer(selectedTeamForEdit.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Yes, Remove
                </button>
                <button
                  onClick={() => setShowDeletePlayerConfirm(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Team Confirmation Modal */}
      <AnimatePresence>
        {showDeleteTeamConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-200 mb-4">Confirm Delete</h2>
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete {teamToDelete?.name}? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleDeleteTeam(teamToDelete.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteTeamConfirm(false);
                    setTeamToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team Squad Modal */}
      <AnimatePresence>
        {showTeamSquadModal && selectedTeam && (
          <TeamSquadModal
            team={selectedTeam}
            onClose={() => {
              setShowTeamSquadModal(false);
              setSelectedTeam(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Teams;