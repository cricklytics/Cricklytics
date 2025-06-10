import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RoleSelectionModal from '../LandingPage/RoleSelectionModal';
import AddMatchModal from '../LandingPage/AddMatchModal';
import { db, auth } from '../../../firebase';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const Matches = () => {
  // Initialize showRoleModal and userRole from sessionStorage
  const [showRoleModal, setShowRoleModal] = useState(() => {
    const storedRole = sessionStorage.getItem('userRole');
    return !storedRole;
  });
  const [userRole, setUserRole] = useState(() => {
    return sessionStorage.getItem('userRole') || null;
  });

  const [showAddMatchModal, setShowAddMatchModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState('all');

  const [tournamentsFromDb, setTournamentsFromDb] = useState([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [selectedTournamentName, setSelectedTournamentName] = useState('');
  const [matchesData, setMatchesData] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [matchesError, setMatchesError] = useState(null);

  // Function to handle role selection
  const handleSelectRole = (role) => {
    setUserRole(role);
    sessionStorage.setItem('userRole', role);
    setShowRoleModal(false);
  };

  // Effect to listen for auth state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
        setTournamentsFromDb([]);
        setMatchesData([]);
        setMatchesError('Please log in to view matches.');
      }
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Effect to fetch tournaments from DB for the current user
  useEffect(() => {
    if (!currentUserId) {
      setTournamentsFromDb([]);
      return;
    }

    const q = query(
      collection(db, 'tournaments'),
      where('userId', '==', currentUserId)
    );

    const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
      const fetchedTournaments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      setTournamentsFromDb(fetchedTournaments);
      // Automatically select the first tournament if available
      if (fetchedTournaments.length > 0 && !selectedTournamentId) {
        setSelectedTournamentId(fetchedTournaments[0].id);
        setSelectedTournamentName(fetchedTournaments[0].name);
      } else if (fetchedTournaments.length === 0) {
        setSelectedTournamentId(null);
        setSelectedTournamentName('');
      }
    }, (err) => {
      console.error("Error fetching tournaments for dropdown:", err);
      setTournamentsFromDb([]);
    });

    return () => unsubscribeSnapshot();
  }, [currentUserId, selectedTournamentId]);

  // Effect to fetch matches for the selected tournament
  useEffect(() => {
    if (!currentUserId || !selectedTournamentName) {
      setMatchesData([]);
      setLoadingMatches(false);
      return;
    }

    setLoadingMatches(true);
    setMatchesError(null);

    const q = query(
      collection(db, 'tournamentMatches'),
      where('tournamentName', '==', selectedTournamentName),
      where('createdBy', '==', currentUserId)
    );

    const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
      const fetchedMatches = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMatchesData(fetchedMatches);
      setLoadingMatches(false);
    }, (err) => {
      console.error("Error fetching matches:", err);
      setMatchesError("Failed to load match data: " + err.message);
      setLoadingMatches(false);
    });

    return () => unsubscribeSnapshot();
  }, [currentUserId, selectedTournamentName]);

  // Handle tournament selection change
  const handleTournamentChange = (e) => {
    const tournamentId = e.target.value;
    setSelectedTournamentId(tournamentId);
    const selectedTournament = tournamentsFromDb.find(t => t.id === tournamentId);
    setSelectedTournamentName(selectedTournament ? selectedTournament.name : '');
  };

  // Filter tabs
  const filterTabs = [
    { id: 'all', label: 'ALL' },
    { id: 'live', label: 'LIVE' },
    { id: 'upcoming', label: 'UPCOMING' },
    { id: 'past', label: 'PAST' },
  ];

  // Function to filter matches based on activeFilter
  const filteredMatches = matchesData.filter(match => {
    if (activeFilter === 'all') {
      return true;
    }
    return match.status && match.status.toLowerCase() === activeFilter;
  });

  if (authLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white text-xl">
        Loading authentication...
      </div>
    );
  }

  if (!currentUserId && userRole === 'admin') {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white text-xl">
        Please log in to add matches as an admin.
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 min-h-screen text-gray-100">
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
          {/* Tournament Selection and Add Match Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
            {tournamentsFromDb.length > 0 ? (
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <label htmlFor="tournament-select" className="text-gray-300 text-lg font-medium">Select Tournament:</label>
                <select
                  id="tournament-select"
                  value={selectedTournamentId || ''}
                  onChange={handleTournamentChange}
                  className="bg-gray-700 border border-gray-600 text-gray-100 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                >
                  <option value="" disabled>Select a Tournament</option>
                  {tournamentsFromDb.map(tournament => (
                    <option key={tournament.id} value={tournament.id}>
                      {tournament.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-gray-400">No tournaments available. Add one from the Tournament page.</p>
            )}

            {userRole === 'admin' && currentUserId && selectedTournamentId && (
              <button
                onClick={() => setShowAddMatchModal(true)}
                className="mt-4 sm:mt-0 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors self-start sm:self-center"
              >
                Add Match
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                  activeFilter === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
                onClick={() => setActiveFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Matches List */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-purple-400 mb-4">{selectedTournamentName || 'Select a Tournament'} Matches</h1>

            {loadingMatches ? (
              <div className="text-center text-gray-400 text-xl py-8">Loading matches...</div>
            ) : matchesError ? (
              <div className="text-center text-red-500 text-xl py-8">{matchesError}</div>
            ) : filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <div key={match.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-colors">
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <h2 className="text-lg font-bold text-purple-400">{selectedTournamentName}</h2>
                      <span className="text-sm text-gray-400">
                        {match.location}, {match.date}, {match.overs}, {match.status}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="inline-block bg-purple-900 text-purple-300 text-xs px-2 py-1 rounded font-medium">
                        {match.stage}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-base font-semibold text-gray-100">{match.team1}</div>
                      <div className="text-base font-bold text-gray-100">{match.score1}</div>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-base font-semibold text-gray-100">{match.team2}</div>
                      <div className="text-base font-bold text-gray-100">{match.score2}</div>
                    </div>
                    <div className="mt-3 p-2 bg-green-900 bg-opacity-30 rounded border border-green-800">
                      <p className="font-medium text-green-400">{match.result}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 text-xl py-8">No matches found for this tournament or filter.</div>
            )}
          </div>
        </>
      )}

      {/* Add Match Modal */}
      {showAddMatchModal && currentUserId && selectedTournamentId && (
        <AddMatchModal
          onClose={() => setShowAddMatchModal(false)}
          onMatchAdded={() => {
            setShowAddMatchModal(false);
          }}
          tournamentId={selectedTournamentId}
          tournamentName={selectedTournamentName}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};

export default Matches;