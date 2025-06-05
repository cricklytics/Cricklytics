// src/pages/Tournament.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RoleSelectionModal from '../LandingPage/RoleSelectionModal';
import AddTournamentModal from '../LandingPage/AddTournamentModal';
import { db, auth } from '../../../firebase';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore'; // Added getDocs
import { onAuthStateChanged } from 'firebase/auth';

// Helper function to parse DD-MMM-YY to Date object for sorting
const parseDateString = (dateStr) => {
  if (!dateStr) return new Date(0); // Return a very old date for invalid strings

  const [day, monthStr, yearStr] = dateStr.split('-');
  const currentYear = new Date().getFullYear();
  let year = parseInt(yearStr, 10);

  // Simple heuristic for 2-digit years (e.g., '22' -> 2022, '99' -> 1999)
  // Adjust this logic if your date range spans centuries more broadly
  const fullYear = (year > (currentYear % 100) + 10) ? 1900 + year : 2000 + year;

  const monthMap = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  const month = monthMap[monthStr];

  // Validate month and day to prevent invalid date creation
  if (month === undefined || isNaN(parseInt(day, 10))) {
      console.warn("Invalid date string encountered:", dateStr);
      return new Date(0); // Return a very old date for unparseable strings
  }

  return new Date(fullYear, month, parseInt(day, 10));
};


const Tournament = () => {
  // Initialize showRoleModal based on whether a role is already stored in sessionStorage
  const [showRoleModal, setShowRoleModal] = useState(() => {
    const storedRole = sessionStorage.getItem('userRole');
    return !storedRole; // Show modal if no role is stored
  });
  // Initialize userRole from sessionStorage or null
  const [userRole, setUserRole] = useState(() => {
    return sessionStorage.getItem('userRole') || null;
  });
  const [showAddTournamentModal, setShowAddTournamentModal] = useState(false);

  const [tournamentData, setTournamentData] = useState(null);
  const [loadingTournament, setLoadingTournament] = useState(true);
  const [tournamentError, setTournamentError] = useState(null);

  // States for matches
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matchesError, setMatchesError] = useState(null);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // New states for top performers and tournament statistics
  const [topBattingPerformers, setTopBattingPerformers] = useState([]);
  const [topBowlingPerformers, setTopBowlingPerformers] = useState([]);
  const [loadingPerformers, setLoadingPerformers] = useState(true);
  const [performersError, setPerformersError] = useState(null);

  const [totalRuns, setTotalRuns] = useState(0);
  const [totalWickets, setTotalWickets] = useState(0);
  const [averageWicketsPerMatch, setAverageWicketsPerMatch] = useState(0); // Renamed for clarity
  const [totalHalfCenturies, setTotalHalfCenturies] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);


  // Function to handle role selection
  const handleSelectRole = (role) => {
    setUserRole(role);
    sessionStorage.setItem('userRole', role); // Store the selected role
    setShowRoleModal(false);
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

  // Fetch tournament data using a real-time listener (currently fetches the first one)
  useEffect(() => {
    const q = query(collection(db, "tournaments"));
    const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
      setLoadingTournament(true);
      setTournamentError(null);

      if (!querySnapshot.empty) {
        const fetchedTournament = querySnapshot.docs[0].data();
        setTournamentData({ id: querySnapshot.docs[0].id, ...fetchedTournament });
      } else {
        setTournamentData(null);
      }
      setLoadingTournament(false);
    }, (err) => {
      console.error("Error fetching tournament:", err);
      setTournamentError("Failed to load tournament data: " + err.message);
      setLoadingTournament(false);
    });

    return () => unsubscribeSnapshot(); // Clean up snapshot listener
  }, []); // Empty dependency array means this runs once on mount

  // Effect to fetch matches for the selected tournament
  useEffect(() => {
    if (!tournamentData?.id) { // Only fetch if tournamentData and its ID are available
      setRecentMatches([]);
      setUpcomingMatches([]);
      setLoadingMatches(false);
      return;
    }

    setLoadingMatches(true);
    setMatchesError(null);

    // MODIFIED QUERY: Removed orderBy("date", "desc")
    const matchesQuery = query(
      collection(db, "tournamentMatches"),
      where("tournamentId", "==", tournamentData.id)
    );

    const unsubscribeMatches = onSnapshot(matchesQuery, (querySnapshot) => {
      const allMatches = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const now = new Date();
      const tempRecent = [];
      const tempUpcoming = [];

      allMatches.forEach(match => {
        const matchDate = parseDateString(match.date);
        if (match.status && match.status.toLowerCase() === 'past') {
          tempRecent.push(match);
        } else if (match.status && match.status.toLowerCase() === 'upcoming') {
          tempUpcoming.push(match);
        } else {
          // If status is 'LIVE' or unknown, decide based on date
          if (matchDate < now) {
            tempRecent.push(match);
          } else {
            tempUpcoming.push(match);
          }
        }
      });

      // CLIENT-SIDE SORTING REMAINS CRUCIAL HERE
      // Sort recent matches by date descending (most recent first)
      tempRecent.sort((a, b) => parseDateString(b.date) - parseDateString(a.date));

      // Sort upcoming matches by date ascending (soonest first)
      tempUpcoming.sort((a, b) => parseDateString(a.date) - parseDateString(b.date));

      setRecentMatches(tempRecent);
      setUpcomingMatches(tempUpcoming);
      setLoadingMatches(false);
    }, (err) => {
      console.error("Error fetching tournament matches:", err);
      setMatchesError("Failed to load matches: " + err.message);
      setLoadingMatches(false);
    });

    return () => unsubscribeMatches(); // Clean up matches listener
  }, [tournamentData]); // Re-run when tournamentData changes (i.e., a new tournament is loaded)

  // Effect to fetch top performers and calculate tournament statistics from clubPlayers
  useEffect(() => {
    const fetchData = async () => {
      setLoadingPerformers(true);
      setPerformersError(null);
      setLoadingStats(true);
      setStatsError(null);

      try {
        const playersCollectionRef = collection(db, 'clubPlayers');
        const querySnapshot = await getDocs(playersCollectionRef);
        const playersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // --- Top Performers Calculation ---
        const playersWithBattingStats = playersData.filter(p => p.careerStats?.batting?.runs !== undefined && p.careerStats.batting.runs !== null);
        const playersWithBowlingStats = playersData.filter(p => p.careerStats?.bowling?.wickets !== undefined && p.careerStats.bowling.wickets !== null);

        // Sort for top batsmen
        const sortedBatting = [...playersWithBattingStats].sort((a, b) => {
          return (b.careerStats.batting.runs || 0) - (a.careerStats.batting.runs || 0);
        });
        setTopBattingPerformers(sortedBatting.slice(0, 2)); // Get top 2

        // Sort for top bowlers
        const sortedBowling = [...playersWithBowlingStats].sort((a, b) => {
          return (b.careerStats.bowling.wickets || 0) - (a.careerStats.bowling.wickets || 0);
        });
        setTopBowlingPerformers(sortedBowling.slice(0, 2)); // Get top 2

        // --- Tournament Statistics Calculation ---
        let calculatedTotalRuns = 0;
        let calculatedTotalWickets = 0;
        let calculatedTotalHalfCenturies = 0;
        let totalPlayersWithWickets = 0; // To calculate average wickets

        playersData.forEach(player => {
          // Total Runs
          if (player.careerStats?.batting?.runs !== undefined && player.careerStats.batting.runs !== null) {
            calculatedTotalRuns += player.careerStats.batting.runs;
          }

          // Total Wickets
          if (player.careerStats?.bowling?.wickets !== undefined && player.careerStats.bowling.wickets !== null) {
            calculatedTotalWickets += player.careerStats.bowling.wickets;
            if (player.careerStats.bowling.wickets > 0) {
              totalPlayersWithWickets++;
            }
          }

          // Half Centuries (assuming `halfCenturies` is a direct field or can be inferred)
          // If you have a specific field for half-centuries in careerStats.batting, use that.
          // For now, I'll assume a 'fifties' or similar field. If not, you'd need to calculate it
          // from individual match scores (which you stated not to use).
          // For this example, let's assume `fifties` exists under `careerStats.batting`.
          if (player.careerStats?.batting?.fifties !== undefined && player.careerStats.batting.fifties !== null) {
            calculatedTotalHalfCenturies += player.careerStats.batting.fifties;
          } else if (player.careerStats?.batting?.scoresAbove50 !== undefined && player.careerStats.batting.scoresAbove50 !== null) {
            // Alternative if you store number of scores > 50
            calculatedTotalHalfCenturies += player.careerStats.batting.scoresAbove50;
          }
        });

        setTotalRuns(calculatedTotalRuns);
        setTotalWickets(calculatedTotalWickets);
        setTotalHalfCenturies(calculatedTotalHalfCenturies);

        // Calculate average wickets per player who has taken wickets
        const avgWickets = totalPlayersWithWickets > 0 ? (calculatedTotalWickets / totalPlayersWithWickets).toFixed(2) : 0;
        setAverageWicketsPerMatch(avgWickets); // Renamed to represent average per player, adjust if needed


      } catch (err) {
        console.error("Error fetching performers and stats:", err);
        setPerformersError("Failed to load top performers.");
        setStatsError("Failed to load tournament statistics.");
      } finally {
        setLoadingPerformers(false);
        setLoadingStats(false);
      }
    };

    fetchData();
  }, []); // Run once on component mount

  // --- Render logic for authentication and role ---
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
        Please log in to add tournaments as an admin.
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
          {/* Tournament Header */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              {loadingTournament ? (
                <div className="text-gray-400">Loading tournament data...</div>
              ) : tournamentError ? (
                <div className="text-red-500">{tournamentError}</div>
              ) : tournamentData ? (
                <>
                  <div>
                    <h1 className="text-3xl font-bold text-purple-400">{tournamentData.name}</h1>
                    <p className="text-gray-400 mt-2">
                      {tournamentData.location} | {tournamentData.season}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-4">
                      <span className="bg-purple-900 text-purple-300 px-3 py-1 rounded-full text-sm">
                        {tournamentData.teams} Teams
                      </span>
                      <span className="bg-purple-900 text-purple-300 px-3 py-1 rounded-full text-sm">
                        {tournamentData.matches} Matches
                      </span>
                      <span className="bg-purple-900 text-purple-300 px-3 py-1 rounded-full text-sm">
                        {tournamentData.currentStage}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 bg-gray-700 p-4 rounded-lg border border-gray-600">
                    <h3 className="font-semibold text-gray-300">Defending Champions</h3>
                    <p className="text-xl font-bold text-purple-400">{tournamentData.defendingChampion}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {tournamentData.startDate} - {tournamentData.endDate}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-gray-400">No main tournament data available. Add one if you are admin.</div>
              )}

              {/* Admin Button for Adding Tournament */}
              {userRole === 'admin' && currentUserId && (
                <button
                  onClick={() => setShowAddTournamentModal(true)}
                  className="mt-4 md:mt-0 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors self-start md:self-center"
                >
                  Add Tournament
                </button>
              )}
            </div>
          </div>

          {!loadingTournament && !tournamentData && userRole === 'user' && (
            <div className="text-center text-gray-400 text-xl py-8">
              No active tournament found. Check back later!
            </div>
          )}

          {tournamentData && ( // Only show match sections if tournamentData is available
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Matches Section */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 lg:col-span-2 border border-gray-700">
                <h2 className="text-xl font-bold text-gray-200 mb-4 border-b border-gray-700 pb-2">Recent Matches</h2>
                {loadingMatches ? (
                  <div className="text-gray-400 text-center">Loading recent matches...</div>
                ) : matchesError ? (
                  <div className="text-red-500 text-center">{matchesError}</div>
                ) : recentMatches.length > 0 ? (
                  <div className="space-y-4">
                    {recentMatches.map((match) => (
                      <div key={match.id} className="border-b border-gray-700 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-100">{match.team1} vs {match.team2}</h3>
                            <p className="text-sm text-gray-400 mt-1">{match.date} - {match.overs}</p>
                          </div>
                          <span className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs font-medium">
                            {match.status}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-300">{match.result}</p>
                        <p className="mt-1 text-sm text-purple-400">⭐ {match.stage}</p> {/* Using stage as highlight for now */}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center">No recent matches found for this tournament.</div>
                )}
              </div>

              {/* Upcoming Matches Section */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-gray-200 mb-4 border-b border-gray-700 pb-2">Upcoming Matches</h2>
                {loadingMatches ? (
                  <div className="text-gray-400 text-center">Loading upcoming matches...</div>
                ) : matchesError ? (
                  <div className="text-red-500 text-center">{matchesError}</div>
                ) : upcomingMatches.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingMatches.map((match) => (
                      <div key={match.id} className="border-b border-gray-700 pb-4 last:border-b-0 last:pb-0">
                        <h3 className="font-medium text-gray-100">{match.team1} vs {match.team2}</h3>
                        <div className="mt-2 flex items-center text-sm text-gray-400">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {match.date} {/* Assuming time and venue might not be available directly in matches data */}
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-400">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {match.location} {/* Assuming location from match data */}
                        </div>
                        <button className="mt-3 w-full bg-purple-900 text-purple-300 py-1 rounded text-sm font-medium hover:bg-purple-800 transition">
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center">No upcoming matches found for this tournament.</div>
                )}
              </div>

              {/* Top Performers Section (UPDATED) */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-gray-200 mb-4 border-b border-gray-700 pb-2">Top Performers</h2>
                {loadingPerformers ? (
                  <div className="text-gray-400 text-center">Loading top performers...</div>
                ) : performersError ? (
                  <div className="text-red-500 text-center">{performersError}</div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-300 mb-2">Batting</h3>
                      <div className="space-y-3">
                        {topBattingPerformers.length > 0 ? (
                          topBattingPerformers.map((player, index) => (
                            <div key={player.id} className="flex items-center">
                              <div className="w-8 h-8 bg-purple-900 rounded-full flex items-center justify-center text-purple-300 font-bold mr-3">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-100">{player.name}</p>
                                <p className="text-xs text-gray-400">
                                  {player.careerStats?.batting?.runs || 0} runs | Avg: {player.careerStats?.batting?.average || '-'} | SR: {player.careerStats?.batting?.strikeRate || '-'}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-400 text-sm">No top batsmen found.</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-300 mb-2">Bowling</h3>
                      <div className="space-y-3">
                        {topBowlingPerformers.length > 0 ? (
                          topBowlingPerformers.map((player, index) => (
                            <div key={player.id} className="flex items-center">
                              <div className="w-8 h-8 bg-purple-900 rounded-full flex items-center justify-center text-purple-300 font-bold mr-3">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-100">{player.name}</p>
                                <p className="text-xs text-gray-400">
                                  {player.careerStats?.bowling?.wickets || 0} wkts | Avg: {player.careerStats?.bowling?.average || '-'} | Econ: {player.careerStats?.bowling?.economy || '-'}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-400 text-sm">No top bowlers found.</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-800 rounded-lg shadow-lg p-6 lg:col-span-2 border border-gray-700">
                <h2 className="text-xl font-bold text-gray-200 mb-4 border-b border-gray-700 pb-2">Tournament Statistics</h2>
                {loadingStats ? (
                  <div className="text-gray-400 text-center">Loading statistics...</div>
                ) : statsError ? (
                  <div className="text-red-500 text-center">{statsError}</div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-700 p-4 rounded-lg text-center border border-gray-600">
                      <p className="text-2xl font-bold text-purple-400">{totalRuns}</p>
                      <p className="text-sm text-gray-400">Total Runs</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg text-center border border-gray-600">
                      <p className="text-2xl font-bold text-purple-400">{totalWickets}</p>
                      <p className="text-sm text-gray-400">Total Wickets</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg text-center border border-gray-600">
                      <p className="text-2xl font-bold text-purple-400">{averageWicketsPerMatch}</p>
                      <p className="text-sm text-gray-400">Avg Wkts per Player</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg text-center border border-gray-600">
                      <p className="text-2xl font-bold text-purple-400">{totalHalfCenturies}</p>
                      <p className="text-sm text-gray-400">Half Centuries</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Tournament Modal */}
      {showAddTournamentModal && currentUserId && (
        <AddTournamentModal
          onClose={() => setShowAddTournamentModal(false)}
          onTournamentAdded={() => {
            setShowAddTournamentModal(false);
          }}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};

export default Tournament;