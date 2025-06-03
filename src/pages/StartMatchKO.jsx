import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import bgImg from '../assets/sophita/HomePage/advertisement5.jpeg';

// PlayerSelector component (no changes needed here for this specific issue)
const PlayerSelector = ({
  teamA,
  teamB,
  overs,
  tossWinner,
  tossDecision,
  origin,
  selectedMatchId,
  tournamentMatches,
  tournamentTeams,
  tournamentGroups,
  currentPhase,
  currentGroupIndex,
  groupResults,
  historicalGroupResults,
  oddTeam,
  phaseHistory,
}) => {
  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState({ left: [], right: [] });
  const navigate = useNavigate();

  const playersTeamAData = teamA?.players || [];
  const playersTeamBData = teamB?.players || [];

  const filteredLeftPlayers = playersTeamAData.filter(player =>
    player.name.toLowerCase().includes(leftSearch.toLowerCase())
  );
  const filteredRightPlayers = playersTeamBData.filter(player =>
    player.name.toLowerCase().includes(rightSearch.toLowerCase())
  );

  const togglePlayerSelection = (side, player) => {
    setSelectedPlayers(prev => {
      const newSelection = { ...prev };
      if (newSelection[side].includes(player)) {
        newSelection[side] = newSelection[side].filter(p => p !== player);
      } else {
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

    navigate('/StartMatchPlayersKO', {
      state: {
        overs: overs,
        teamA: teamA,
        teamB: teamB,
        selectedPlayers: selectedPlayers,
        tossWinner: tossWinner,
        tossDecision: tossDecision,
        origin: origin,
        matchId: selectedMatchId,
        tournamentMatches: tournamentMatches,
        tournamentTeams: tournamentTeams,
        tournamentGroups: tournamentGroups,
        currentPhase: currentPhase,
        currentGroupIndex: currentGroupIndex,
        groupResults: groupResults,
        historicalGroupResults: historicalGroupResults,
        oddTeam: oddTeam,
        phaseHistory: phaseHistory,
      },
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
        minHeight: 'calc(100vh - 80px)',
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
                    filteredLeftPlayers.map((player) => {
                      const isSelected = selectedPlayers.left.includes(player);
                      const isSelectionDisabled = selectedPlayers.left.length >= 11 && !isSelected;

                      return (
                        <motion.div
                          key={player.name}
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
                    filteredRightPlayers.map((player) => {
                      const isSelected = selectedPlayers.right.includes(player);
                      const isSelectionDisabled = selectedPlayers.right.length >= 11 && !isSelected;

                      return (
                        <motion.div
                          key={player.name}
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


const Startmatch = ({ initialTeamA = '', initialTeamB = '', onMatchSetupComplete, origin }) => {
  console.log('Startmatch received origin prop:', origin);

  const [allTeams, setAllTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [teamFetchError, setTeamFetchError] = useState(null);
  const [selectedTeamA, setSelectedTeamA] = useState('');
  const [selectedTeamB, setSelectedTeamB] = useState('');
  const [tossWinner, setTossWinner] = useState('');
  const [tossDecision, setTossDecision] = useState('Batting');
  const [overs, setOvers] = useState('');
  const [scorer, setScorer] = useState('');
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedMatchId, setSelectedMatchId] = useState(''); // Will be controlled by dropdown
  const navigate = useNavigate();
  const location = useLocation();

  const {
    teams,
    matches,
    currentPhase,
    match, // The specific match object to be potentially pre-selected or used as a fallback
    format,
    matchHistory,
    phaseHistory,
    superLeagueStandings,
    liveMatchIndex,
    tournamentWinner: initialTournamentWinner,
    origin: passedOrigin,
    activeTab,
    oddTeam: initialOddTeam,
    currentGroupIndex,
    groups
  } = location.state || {};

  const [tournamentTeams, setTournamentTeams] = useState(teams || []);
  const [tournamentMatches, setTournamentMatches] = useState(matches || []);
  const [tournamentPhase, setTournamentPhase] = useState(currentPhase || 'league');
  const [tournamentGroupIndex, setTournamentGroupIndex] = useState(currentGroupIndex || 0);
  const [tournamentWinner, setTournamentWinner] = useState(initialTournamentWinner || null);
  const [oddTeam, setOddTeam] = useState(initialOddTeam || null);
  const [tournamentPhaseHistory, setTournamentPhaseHistory] = useState(phaseHistory || []);
  const [tournamentGroups, setTournamentGroups] = useState(groups || []);

  const scorers = ['John Doe', 'Jane Smith', 'Mike Johnson'];

  useEffect(() => {
    const fetchAllTeams = async () => {
      try {
        setLoadingTeams(true);
        const teamsCollectionRef = collection(db, 'teams');
        const teamSnapshot = await getDocs(teamsCollectionRef);
        const fetchedTeams = teamSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          flagUrl: doc.data().flagUrl,
          players: doc.data().players || [],
          matchesPlayed: doc.data().matchesPlayed || 0,
          wins: doc.data().wins || 0,
          losses: doc.data().losses || 0,
          netRunRate: doc.data().netRunRate || 0,
          points: doc.data().points || 0
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

  // Initialize tournament data from location.state
  useEffect(() => {
    // Only update these states if location.state actually contains new tournament data
    if (location.state) {
      setTournamentTeams(location.state.teams || []);
      setTournamentMatches(location.state.matches || []);
      setTournamentPhase(location.state.currentPhase || 'league');
      setTournamentGroupIndex(location.state.currentGroupIndex || 0);
      setTournamentWinner(location.state.tournamentWinner || null);
      setOddTeam(location.state.oddTeam || null);
      setTournamentPhaseHistory(location.state.phaseHistory || []);
      setTournamentGroups(location.state.groups || []);
      if (location.state.match) {
        handleMatchSelection(location.state.match.id); // This will set selectedMatchId and teams
      }
    }
  }, [location.state]); // Depend on location.state for initial data load

  const getAvailableMatches = () => {
    if (!tournamentMatches || !tournamentPhase) {
      console.log("No tournament matches or phase defined for filtering.");
      return [];
    }

    const filtered = tournamentMatches
      .filter(m =>
        m.phase === tournamentPhase &&
        // For superLeague, filter by group index. For KO phases, group might be irrelevant or -1.
        // Adjust this if your KO phase matches have a 'group' property you need to check.
        (tournamentPhase !== 'superLeague' || m.group === tournamentGroupIndex) &&
        !m.played && // Only show unplayed matches
        !m.team1?.isBye && // Exclude bye matches
        !m.team2?.isBye
      )
      .map(m => ({
        id: m.id,
        team1: m.team1,
        team2: m.team2,
        label: `${m.team1.name} vs ${m.team2.name}`
      }));
      console.log("Available matches for dropdown:", filtered);
      return filtered;
  };

  const handleMatchSelection = (matchIdFromDropdown) => {
    setSelectedMatchId(matchIdFromDropdown);
    const selected = tournamentMatches.find(m => m.id === matchIdFromDropdown);
    if (selected) {
      setSelectedMatch(selected);
      setSelectedTeamA(selected.team1.name);
      setSelectedTeamB(selected.team2.name);
      setTossWinner(''); // Reset toss info on new match selection
      setTossDecision('Batting'); // Reset toss info
      setOvers(''); // Reset overs
    } else {
      setSelectedMatch(null);
      setSelectedTeamA('');
      setSelectedTeamB('');
      setTossWinner('');
      setTossDecision('Batting');
      setOvers('');
    }
  };

  const handleMatchResultFromStartMatch = (matchData) => {
    const { winnerId: returnedWinnerId, loserId: returnedLoserId, teamANRR, teamBNRR, matchId: completedMatchId } = matchData;

    setTournamentMatches(prevMatches => {
      const updatedMatches = prevMatches.map(matchItem => {
        if (matchItem.id === completedMatchId) {
          const updated = { ...matchItem, winner: returnedWinnerId, played: true };

          setTournamentTeams(prevTeams => {
            const tempUpdatedTeams = prevTeams.map(team => {
              const teamStats = {
                  points: team.points || 0,
                  wins: team.wins || 0,
                  losses: team.losses || 0,
                  runsFor: team.runsFor || 0,
                  runsAgainst: team.runsAgainst || 0,
                  netRunRate: team.netRunRate || 0,
                  matchesPlayed: team.matchesPlayed || 0
              };

              if (team.id === returnedWinnerId) {
                teamStats.wins += 1;
                teamStats.points += 2;
                teamStats.matchesPlayed += 1;
                // These NRR and runs for/against are placeholders; actual calculation needed from match result
                teamStats.netRunRate = teamANRR || teamStats.netRunRate;
                teamStats.runsFor += 200;
                teamStats.runsAgainst += 180;
              } else if (team.id === returnedLoserId) {
                teamStats.losses += 1;
                teamStats.matchesPlayed += 1;
                teamStats.netRunRate = teamBNRR || teamStats.netRunRate;
                teamStats.runsFor += 180;
                teamStats.runsAgainst += 200;
              }
              return { ...team, ...teamStats };
            });

            const updatedGroupResults = {};
            tempUpdatedTeams.forEach(team => {
                updatedGroupResults[team.id] = {
                    points: team.points,
                    wins: team.wins,
                    losses: team.losses,
                    runsFor: team.runsFor,
                    runsAgainst: team.runsAgainst,
                    netRunRate: team.netRunRate,
                    matchesPlayed: team.matchesPlayed
                };
            });
            setTournamentPhaseHistory(prevHistory => {
              const newHistory = [...prevHistory];
              const currentPhaseEntryIndex = newHistory.findIndex(entry => entry.phase === tournamentPhase);
              if(currentPhaseEntryIndex !== -1) {
                  newHistory[currentPhaseEntryIndex] = {
                      ...newHistory[currentPhaseEntryIndex],
                      standings: updatedGroupResults
                  };
              } else {
                  newHistory.push({
                      phase: tournamentPhase,
                      standings: updatedGroupResults
                  });
              }
              return newHistory;
            });
            return tempUpdatedTeams;
          });
          return updated;
        }
        return matchItem;
      });

      const currentGroupMatches = updatedMatches.filter(m =>
        (tournamentPhase !== 'superLeague' || m.group === tournamentGroupIndex) && // Filter by group if SuperLeague
        m.phase === tournamentPhase &&
        !m.team1?.isBye &&
        !m.team2?.isBye
      );

      // Check if all matches in the CURRENT relevant scope (phase/group) are played
      if (currentGroupMatches.every(m => m.played)) {
        console.log(`All matches in ${tournamentPhase} group ${tournamentGroupIndex} played. Navigating back to Selection.`);
        navigate('/selection', {
            state: {
                teams: tournamentTeams,
                matches: updatedMatches,
                currentPhase: tournamentPhase,
                matchHistory: matchHistory,
                phaseHistory: tournamentPhaseHistory,
                superLeagueStandings: superLeagueStandings,
                tournamentWinner: tournamentWinner,
                oddTeam: oddTeam,
                currentGroupIndex: tournamentGroupIndex,
                groups: tournamentGroups,
                matchCompleted: true,
                completedMatchId: completedMatchId
            },
            replace: true
        });
      }
      return updatedMatches;
    });
  };


  const handleNext = () => {
    if (!selectedMatchId) {
      alert('Please select a match.');
      return;
    }
    if (!overs || isNaN(overs) || parseInt(overs) <= 0) {
      alert('Please enter a valid number of overs (greater than 0).');
      return;
    }
    if (!tossWinner) {
      alert('Please select the toss winner.');
      return;
    }

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

  const hasValue = (value) => value !== '' && value !== null && value !== undefined;

  if (loadingTeams) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl p-4">Loading Teams...</div>
      </div>
    );
  }

  if (teamFetchError) {
    return (
      <div className="min-h-screen text-red-500 flex items-center justify-center">
        <div className="text-xl p-4">Error: {teamFetchError}</div>
      </div>
    );
  }

  if (tournamentTeams.length < 2 && allTeams.length < 2) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-xl text-center p-4">
          Not enough teams registered or tournament data missing. Please add at least two teams via the Admin Panel or ensure tournament setup is complete.
        </div>
      </div>
    );
  }

  if (showPlayerSelector) {
    const teamAObject = allTeams.find(team => team.name === selectedTeamA);
    const teamBObject = allTeams.find(team => team.name === selectedTeamB);

    return (
      <PlayerSelector
        teamA={teamAObject}
        teamB={teamBObject}
        overs={overs}
        tossWinner={tossWinner}
        tossDecision={tossDecision}
        origin={passedOrigin}
        selectedMatchId={selectedMatchId}
        tournamentMatches={tournamentMatches}
        tournamentTeams={tournamentTeams}
        tournamentGroups={tournamentGroups}
        currentPhase={tournamentPhase}
        currentGroupIndex={tournamentGroupIndex}
        oddTeam={oddTeam}
        phaseHistory={tournamentPhaseHistory}
      />
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
        minHeight: 'calc(100vh - 80px)',
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
            <motion.div
              className="flex flex-col space-y-6 w-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                className="min-h-[300px] bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl p-6 w-full border border-blue-100 flex flex-col"
                whileHover={{ scale: 1.01 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Select Match</h2>
                <div className="space-y-4 w-full flex-1">
                  <div className="w-full">
                    <label className="block text-gray-700 mb-2 font-medium">Current Phase</label>
                    <input
                      type="text"
                      className="w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 bg-gray-200"
                      value={tournamentPhase.charAt(0).toUpperCase() + tournamentPhase.slice(1)}
                      readOnly
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-gray-700 mb-2 font-medium">Available Matches</label>
                    <select
                      className={`w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${hasValue(selectedMatchId) ? 'bg-white' : 'bg-white'}`}
                      value={selectedMatchId}
                      onChange={(e) => handleMatchSelection(e.target.value)}
                    >
                      <option value="">Select a match</option>
                      {getAvailableMatches().map(matchOption => (
                        <option key={matchOption.id} value={matchOption.id}>{matchOption.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full">
                    <label className="block text-gray-700 mb-2 font-medium">Team A</label>
                    <input
                      type="text"
                      className="w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 bg-gray-200"
                      value={selectedTeamA}
                      readOnly
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-gray-700 mb-2 font-medium">Team B</label>
                    <input
                      type="text"
                      className="w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 bg-gray-200"
                      value={selectedTeamB}
                      readOnly
                    />
                  </div>
                </div>
              </motion.div>

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

            <motion.div
              className="flex flex-col space-y-6 w-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                className="min-h-[300px] bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl p-6 w-full border border-blue-100 flex flex-col"
                whileHover={{ scale: 1.01 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Toss Details</h2>
                <div className="space-y-4 w-full flex-1">
                  <div className="w-full">
                    <label className="block text-gray-700 mb-2 font-medium">Record Toss & Decision</label>
                    <select
                      className={`w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${hasValue(tossWinner) ? 'bg-gray-200 text-gray-700' : 'bg-white'}`}
                      value={tossWinner}
                      onChange={(e) => setTossWinner(e.target.value)}
                    >
                      <option value="">Select Team</option>
                      {selectedTeamA && <option value={selectedTeamA}>{selectedTeamA}</option>}
                      {selectedTeamB && <option value={selectedTeamB}>{selectedTeamB}</option>}
                    </select>
                  </div>
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

              <motion.div
                className="min-h-[200px] bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl p-6 w-full border border-blue-100 flex flex-col justify-center"
                whileHover={{ scale: 1.01 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Assign Scorer</h2>
                <div className="w-full">
                  <select
                    className={`w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${hasValue(scorer) ? 'bg-gray-200 text-gray-700' : 'bg-white'}`}
                    value={scorer}
                    onChange={(e) => setScorer(e.target.value)}
                  >
                    <option value="">Select Scorer</option>
                    {scorers.map(person => (
                      <option key={person} value={person}>{person}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            </motion.div>
          </div>

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