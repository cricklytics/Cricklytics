// src/pages/PlayersList.jsx (or wherever your PlayersList component is)
import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../../firebase'; // Adjust path to firebase.js
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged
import { FiPlusCircle, FiEdit, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import AddPlayerModal from '../../../pages/AddClubPlayer';
import RoleSelectionModal from '../LandingPage/RoleSelectionModal'; // Adjust path if needed

const PlayersList = () => {
    // Role selection and Auth states (copied from Teams.jsx)
    const [showRoleModal, setShowRoleModal] = useState(() => {
        const storedRole = sessionStorage.getItem('userRole');
        return !storedRole; // Show modal if no role is stored
    });
    const [userRole, setUserRole] = useState(() => {
        return sessionStorage.getItem('userRole') || null;
    });
    const [currentUserId, setCurrentUserId] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const [playingPlayerId, setPlayingPlayerId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [teamFilter, setTeamFilter] = useState('');
    const [battingStyleFilter, setBattingStyleFilter] = useState('');
    const [players, setPlayers] = useState([]);
    const [loadingPlayers, setLoadingPlayers] = useState(true); // Renamed from 'loading' to avoid confusion with authLoading
    const [error, setError] = useState(null);
    const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
    const [editingPlayerId, setEditingPlayerId] = useState(null);
    const audioRef = useRef(null);

    const teams = ['Golden Warriors XI', 'Jaipur Strikers', 'LUT Biggieagles XI', 'Aavas Financiers'];
    const battingStyles = ['Right Handed Bat', 'Left Handed Bat'];

    const playerRoles = {
        player: 'Player',
        sub_admin: 'Sub Admin',
        admin: 'Admin'
    };

    // Function to handle role selection (copied from Teams.jsx)
    const handleSelectRole = (role) => {
        setUserRole(role);
        sessionStorage.setItem('userRole', role); // Store the selected role
        setShowRoleModal(false);
    };

    // Effect to listen for auth state changes (copied from Teams.jsx)
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

    // Fetch players data from Firebase
    const fetchPlayers = async () => {
        try {
            setLoadingPlayers(true); // Use loadingPlayers
            const playersCollectionRef = collection(db, 'clubPlayers');
            const querySnapshot = await getDocs(playersCollectionRef);
            const playersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                level: doc.data().level || 'player',
                ...doc.data()
            }));
            setPlayers(playersData);
            setError(null);
        } catch (err) {
            console.error("Error fetching players: ", err);
            setError("Failed to load players. Please try again later.");
        } finally {
            setLoadingPlayers(false); // Use loadingPlayers
        }
    };

    // Initial fetch on component mount
    useEffect(() => {
        fetchPlayers();
    }, []);

    // Effect to manage audio playback when playingPlayerId changes
    useEffect(() => {
        if (!audioRef.current) return;

        if (playingPlayerId) {
            const playerToPlay = players.find(p => p.id === playingPlayerId);

            if (playerToPlay && playerToPlay.audioUrl) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current.src = playerToPlay.audioUrl;
                audioRef.current.load();

                const playPromise = audioRef.current.play();

                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.warn("Autoplay prevented:", e);
                    });
                }
            } else {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current.src = '';
            }
        } else {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.src = '';
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current.src = '';
            }
        };
    }, [playingPlayerId, players]);

    const filteredPlayers = players.filter(player => {
        const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTeam = teamFilter ? player.team === teamFilter : true;
        const matchesBattingStyle = battingStyleFilter ? player.battingStyle === battingStyleFilter : true;
        return matchesSearch && matchesTeam && matchesBattingStyle;
    });

    const handlePlayerClick = (player) => {
        if (playingPlayerId === player.id) {
            audioRef.current.pause();
            setPlayingPlayerId(null);
        } else {
            setPlayingPlayerId(player.id);
        }
    };

    const generatePlayerDescription = (playerData) => {
        const name = playerData.name;
        const battingDetail = playerData.battingStyle || "not specified";
        const bowlingDetail = playerData.bowlingStyle || "not specified";

        return `${name}, a ${playerData.age}-year-old ${playerRoles[playerData.level] || 'player'} from the ${playerData.team}. ` +
            `${name} is a ${battingDetail}, and ${name}'s bowling style is ${bowlingDetail}.`;
    };

    const handlePlayerAdded = () => {
        fetchPlayers();
        setIsAddPlayerModalOpen(false);
    };

    const toggleRoleEdit = (playerId) => {
        setEditingPlayerId(editingPlayerId === playerId ? null : playerId);
    };

    const updatePlayerRole = async (playerId, newLevel) => {
        try {
            const playerRef = doc(db, 'clubPlayers', playerId);
            await updateDoc(playerRef, { level: newLevel });
            setPlayers(prevPlayers =>
                prevPlayers.map(player =>
                    player.id === playerId ? { ...player, level: newLevel } : player
                )
            );
            setEditingPlayerId(null);
            console.log(`Player ${playerId} level updated to ${newLevel}`);
        } catch (err) {
            console.error("Error updating player level: ", err);
            setError("Failed to update player level.");
        }
    };

    // Conditional rendering for authentication loading
    if (authLoading) {
        return (
            <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white text-xl">
                Loading authentication...
            </div>
        );
    }

    // Conditional rendering for unauthenticated admin access
    if (!currentUserId && userRole === 'admin') {
        return (
            <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white text-xl">
                Please log in to manage players as an admin.
            </div>
        );
    }

    return (
        <div className="bg-gray-900 min-h-screen p-4 md:p-6">
            <audio ref={audioRef} />

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

            {userRole && ( // Only render main content if a role is selected
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-6 text-center md:text-left">Players List</h1>

                    {/* Filters and Add Player Button */}
                    <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border rounded-lg p-2 w-full bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <select
                                value={teamFilter}
                                onChange={(e) => setTeamFilter(e.target.value)}
                                className="border rounded-lg p-2 w-full bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Teams</option>
                                {teams.map(team => (
                                    <option key={team} value={team}>{team}</option>
                                ))}
                            </select>
                            <select
                                value={battingStyleFilter}
                                onChange={(e) => setBattingStyleFilter(e.target.value)}
                                className="border rounded-lg p-2 w-full bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Batting Styles</option>
                                {battingStyles.map(style => (
                                    <option key={style} value={style}>{style}</option>
                                ))}
                            </select>
                        </div>
                        {userRole === 'admin' && currentUserId && ( // Only show if admin and logged in
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsAddPlayerModalOpen(true)}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors w-full md:w-auto mt-4 md:mt-0"
                            >
                                <FiPlusCircle /> Add Player
                            </motion.button>
                        )}
                    </div>

                    {/* Loading/Error/No players message */}
                    {loadingPlayers ? (
                        <div className="text-center text-gray-400 text-xl py-8">Loading players...</div>
                    ) : error ? (
                        <div className="text-center text-red-500 text-xl py-8">{error}</div>
                    ) : filteredPlayers.length === 0 ? (
                        <p className="text-white text-center col-span-full">No players found matching your criteria.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPlayers.map((player) => (
                                <div
                                    key={player.id}
                                    className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden border p-4 relative
                                        ${playingPlayerId === player.id ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-700 hover:border-blue-500 transition'}`}
                                >
                                    {/* Edit Icon and Role Selector - Only for Admin */}
                                    {userRole === 'admin' && currentUserId && (
                                        <div className="absolute top-2 right-2 z-10">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleRoleEdit(player.id);
                                                }}
                                                className="p-1 rounded-full bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600 transition-colors"
                                            >
                                                <FiEdit className="w-5 h-5" />
                                            </motion.button>

                                            <AnimatePresence> {/* Use AnimatePresence for the dropdown */}
                                                {editingPlayerId === player.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="absolute right-0 mt-2 w-40 bg-gray-700 rounded-md shadow-lg py-1 z-20 border border-gray-600"
                                                    >
                                                        {Object.entries(playerRoles).map(([key, value]) => (
                                                            <div
                                                                key={key}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updatePlayerRole(player.id, key);
                                                                }}
                                                                className={`flex items-center px-4 py-2 text-sm text-white cursor-pointer hover:bg-gray-600
                                                                    ${player.level === key ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                                                            >
                                                                <span>{value}</span>
                                                                {player.level === key && <FiCheckCircle className="ml-auto text-green-400" />}
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-4"
                                        onClick={() => handlePlayerClick(player)}
                                    >
                                        <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gray-600 flex-shrink-0">
                                            <img
                                                src={player.image}
                                                alt={player.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/150";
                                                }}
                                            />
                                        </div>
                                        <div className="text-center sm:text-left">
                                            <h2 className="text-xl font-bold text-white">{player.name}</h2>
                                            <p className="text-gray-400">{player.team}</p>
                                            <p className="text-gray-400 text-sm mt-1">Level: <span className="font-medium text-yellow-400 drop-shadow-[0_0_6px_rgba(255,255,0,0.5)]">{player.level ? playerRoles[player.level] : 'Player'}</span></p>
                                            <p className="text-gray-400 text-sm">Role: <span className="font-medium text-gray-300">{player.role || '-'}</span></p>
                                            <p className="text-gray-400 text-sm">Age: <span className="font-medium text-gray-300">{player.age || '-'}</span></p>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-sm mb-4 text-center sm:text-left">
                                        {player.bio}
                                    </p>

                                    <div className="bg-gray-700 rounded-lg p-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm border border-gray-600">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Matches:</span>
                                            <span className="font-medium text-blue-400">{player.careerStats?.batting?.matches || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Runs:</span>
                                            <span className="font-medium text-blue-400">{player.careerStats?.batting?.runs || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Average:</span>
                                            <span className="font-medium text-blue-400">{player.careerStats?.batting?.average || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Centuries:</span>
                                            <span className="font-medium text-blue-400">{player.careerStats?.batting?.centuries || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Wickets:</span>
                                            <span className="font-medium text-blue-400">{player.careerStats?.bowling?.wickets || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Batting:</span>
                                            <span className="font-medium text-gray-300">{player.battingStyle || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Bowling:</span>
                                            <span className="font-medium text-gray-300">{player.bowlingStyle || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Innings:</span>
                                            <span className="font-medium text-gray-300">{player.careerStats?.batting?.innings || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Strike Rate:</span>
                                            <span className="font-medium text-gray-300">{player.careerStats?.batting?.strikeRate || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Catches:</span>
                                            <span className="font-medium text-gray-300">{player.careerStats?.fielding?.catches || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Stumpings:</span>
                                            <span className="font-medium text-gray-300">{player.careerStats?.fielding?.stumpings || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Run Outs:</span>
                                            <span className="font-medium text-gray-300">{player.careerStats?.fielding?.runOuts || '-'}</span>
                                        </div>
                                    </div>
                                    {playingPlayerId === player.id && (
                                        <div className="absolute top-2 left-2 text-blue-400 animate-pulse">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.616 3.076a1 1 0 011.09.217L18.414 7H20a1 1 0 011 1v4a1 1 0 01-1 1h-1.586l-2.707 2.707A1 1 0 0114 16V4a1 1 0 01.616-.924z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Add Player Modal - Only opens if admin and logged in */}
            {isAddPlayerModalOpen && userRole === 'admin' && currentUserId && (
                <AddPlayerModal
                    onClose={() => setIsAddPlayerModalOpen(false)}
                    onPlayerAdded={handlePlayerAdded}
                />
            )}
        </div>
    );
};

export default PlayersList;