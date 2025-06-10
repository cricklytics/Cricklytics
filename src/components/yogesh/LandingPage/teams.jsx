import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RoleSelectionModal from '../LandingPage/RoleSelectionModal';
import AddTeamModal from '../LandingPage/AddTeamModal';
import TeamSquadModal from '../LandingPage/TeamSquadModal';
import AddPlayerModal from '../../../pages/AddClubPlayer';
import { db, auth, storage } from '../../../firebase';
import { collection, onSnapshot, query, updateDoc, doc, deleteDoc, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { FiPlusCircle, FiEdit, FiTrash2 } from 'react-icons/fi';

const Teams = () => {
  const [showRoleModal, setShowRoleModal] = useState(() => {
    const storedRole = sessionStorage.getItem('userRole');
    return !storedRole;
  });
  const [userRole, setUserRole] = useState(() => {
    return sessionStorage.getItem('userRole') || null;
  });
  const [currentUserId, setCurrentUserId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [selectedTeamForPlayer, setSelectedTeamForPlayer] = useState(null);
  const [isEditPlayerModalOpen, setIsEditPlayerModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedTeamForEdit, setSelectedTeamForEdit] = useState(null);
  const [showDeletePlayerConfirm, setShowDeletePlayerConfirm] = useState(false);
  const [showDeleteTeamConfirm, setShowDeleteTeamConfirm] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [showTeamSquadModal, setShowTeamSquadModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [teamsError, setTeamsError] = useState(null);

  const [tournaments, setTournaments] = useState([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState(() => {
    return sessionStorage.getItem('selectedTournamentId') || null;
  });
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [tournamentsError, setTournamentsError] = useState(null);

  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [playersError, setPlayersError] = useState(null);

  const handleSelectRole = (role) => {
    setUserRole(role);
    sessionStorage.setItem('userRole', role);
    setShowRoleModal(false);
  };

  const handleViewSquad = (team) => {
    setSelectedTeam(team);
    setShowTeamSquadModal(true);
  };

  const handlePlayerAdded = () => {
    setIsAddPlayerModalOpen(false);
    setSelectedTeamForPlayer(null);
  };

  const handleOpenAddPlayer = (team) => {
    setSelectedTeamForPlayer(team);
    setIsAddPlayerModalOpen(true);
  };

  const handleImageUpload = async (file, playerName, teamId) => {
    if (!file) return null;
    try {
      const storageRef = ref(storage, `player_images/${teamId}/${playerName}_${Date.now()}`);
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = async (event) => {
          try {
            const base64Image = event.target.result.split(',')[1];
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

  const handleTournamentChange = (event) => {
    const tournamentId = event.target.value;
    setSelectedTournamentId(tournamentId);
    sessionStorage.setItem('selectedTournamentId', tournamentId);
    const selected = tournaments.find(t => t.id === tournamentId);
    setSelectedTournament(selected || null);
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
        setTeams([]);
        setTournaments([]);
        setPlayers([]);
        setTeamsError('Please log in to view teams.');
        setTournamentsError('Please log in to view tournaments.');
        setPlayersError('Please log in to view players.');
      }
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUserId) {
      setLoadingTournaments(false);
      setTournaments([]);
      return;
    }

    setLoadingTournaments(true);
    setTournamentsError(null);

    const q = query(
      collection(db, 'tournaments'),
      where('userId', '==', currentUserId)
    );

    const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const fetchedTournaments = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTournaments(fetchedTournaments);

        const storedTournamentId = sessionStorage.getItem('selectedTournamentId');
        const isValidTournament = fetchedTournaments.some(t => t.id === storedTournamentId);

        if (storedTournamentId && isValidTournament) {
          setSelectedTournamentId(storedTournamentId);
          const selected = fetchedTournaments.find(t => t.id === storedTournamentId);
          setSelectedTournament(selected || null);
        } else {
          if (fetchedTournaments.length > 0) {
            setSelectedTournamentId(fetchedTournaments[0].id);
            setSelectedTournament(fetchedTournaments[0]);
            sessionStorage.setItem('selectedTournamentId', fetchedTournaments[0].id);
          }
        }
      } else {
        setTournaments([]);
        setSelectedTournamentId(null);
        setSelectedTournament(null);
        sessionStorage.removeItem('selectedTournamentId');
        setTournamentsError('No tournaments found.');
      }
      setLoadingTournaments(false);
    }, (err) => {
      console.error('Error fetching tournaments:', err);
      setTournamentsError('Failed to load tournaments: ' + err.message);
      setLoadingTournaments(false);
    });

    return () => unsubscribeSnapshot();
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId || !selectedTournamentId) {
      setLoadingTeams(false);
      setTeams([]);
      return;
    }

    setLoadingTeams(true);
    setTeamsError(null);

    const q = query(
      collection(db, 'clubTeams'),
      where('createdBy', '==', currentUserId),
      where('tournamentId', '==', selectedTournamentId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
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

    return () => unsubscribe();
  }, [currentUserId, selectedTournamentId]);

  useEffect(() => {
    if (!currentUserId || !selectedTournament?.name) {
      setLoadingPlayers(false);
      setPlayers([]);
      return;
    }

    setLoadingPlayers(true);
    setPlayersError(null);

    const q = query(
      collection(db, 'clubPlayers'),
      where('userId', '==', currentUserId),
      where('tournamentName', '==', selectedTournament.name)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedPlayers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlayers(fetchedPlayers);
        setLoadingPlayers(false);
      },
      (error) => {
        console.error('Error fetching players: ', error);
        setPlayersError('Failed to load players: ' + error.message);
        setLoadingPlayers(false);
      }
    );

    return () => unsubscribe();
  }, [currentUserId, selectedTournament]);

  if (authLoading || loadingTournaments || loadingPlayers) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    );
  }

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
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-purple-400">Teams</h1>
              <p className="text-gray-400 mt-2">
                {selectedTournament ? `${selectedTournament.name} • ${selectedTournament.location}` : 'Select a tournament'}
              </p>
              <select
                value={selectedTournamentId || ''}
                onChange={handleTournamentChange}
                className="mt-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md p-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={tournaments.length === 0}
              >
                {tournaments.length === 0 ? (
                  <option value="">No tournaments available</option>
                ) : (
                  tournaments.map(tournament => (
                    <option key={tournament.id} value={tournament.id}>
                      {tournament.name}
                    </option>
                  ))
                )}
              </select>
              {tournamentsError && <p className="text-red-500 text-sm mt-2">{tournamentsError}</p>}
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

          {loadingTeams ? (
            <div className="text-center text-gray-400 text-xl py-8">Loading teams...</div>
          ) : teamsError ? (
            <div className="text-center text-red-500 text-xl py-8">{teamsError}</div>
          ) : teams.length === 0 ? (
            <div className="text-center text-gray-400 text-xl py-8">
              No teams found for this tournament. {userRole === 'admin' && 'Add some teams!'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teams.map((team) => {
                // Filter players for the current team based on teamName
                const teamPlayers = players.filter(player => player.teamName === team.teamName);
                return (
                  <div key={team.id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-700 relative">
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
                    <div className="bg-purple-800 p-4 text-white">
                      <h2 className="text-xl font-bold truncate">{team.teamName}</h2>
                      <p className="text-sm opacity-90">Captain: {team.captain}</p>
                    </div>
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
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-400">Last Match</p>
                        <p className={`text-sm ${team.lastMatch && team.lastMatch.toLowerCase().startsWith('won') ? 'text-green-400' : 'text-red-400'}`}>
                          {team.lastMatch}
                        </p>
                      </div>
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
                          {teamPlayers.length > 0 ? (
                            teamPlayers.slice(0, 3).map((player, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-300">{player.name}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="bg-purple-900 text-purple-300 px-2 py-0.5 rounded text-xs">
                                    {player.careerStats?.batting?.runs || player.runs || 0}r
                                  </span>
                                  <span className="bg-green-900 text-green-300 px-2 py-0.5 rounded text-xs">
                                      {player.careerStats?.bowling?.wickets || player.wickets}w
                                  </span>
                                  {player.wickets > 0 && (
                                    <span className="bg-green-900 text-green-300 px-2 py-0.5 rounded text-xs">
                                      {player.careerStats?.bowling?.wickets || player.wickets}w
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
                    <div className="px- nested p-4">
                      <button
                        onClick={() => handleViewSquad(team)}
                        className="w-full py-2 bg-purple-900 text-purple-300 rounded-md hover:bg-purple-700 transition font-medium"
                      >
                        View Full Squad
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-400">{team.teamName}</td>
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

          <AnimatePresence>
            {isAddPlayerModalOpen && currentUserId && userRole === 'admin' && (
              <AddPlayerModal
                onClose={() => setIsAddPlayerModalOpen(false)}
                team={selectedTeamForPlayer}
              />
            )}
          </AnimatePresence>

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

          <AnimatePresence>
            {showDeleteTeamConfirm && teamToDelete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-bold text-gray-200 mb-4">Confirm Delete Team</h3>
                  <p className="text-gray-300 mb-4">
                    Are you sure you want to delete {teamToDelete.teamName}? This action cannot be undone.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={async () => {
                        try {
                          await deleteDoc(doc(db, 'clubTeams', teamToDelete.id));
                          setShowDeleteTeamConfirm(false);
                          setTeamToDelete(null);
                        } catch (error) {
                          console.error('Error deleting team: ', error);
                          setTeamsError('Failed to delete team: ' + error.message);
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete
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
        </>
      )}
    </div>
  );
};

export default Teams;