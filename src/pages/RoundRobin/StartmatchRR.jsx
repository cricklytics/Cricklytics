import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../firebase';
import { collection, getDocs, query, where, doc, getDoc, updateDoc } from 'firebase/firestore';
import logo from '../../assets/pawan/PlayerProfile/picture-312.png';
import bgImg from '../../assets/sophita/HomePage/advertisement5.jpeg';

const PlayerSelector = ({
  teamA,
  teamB,
  overs,
  origin,
  tournamentId,
  schedule,
  semiFinals,
  finals,
  selectedTeams,
  groupPhase,
  matchId,
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

    console.group('Navigating to StartMatchPlayersRR');
    console.log('Selected Players:', selectedPlayers);
    console.log('Team A:', teamA);
    console.log('Team B:', teamB);
    console.log('Overs:', overs);
    console.log('Origin:', origin);
    console.log('Tournament ID:', tournamentId);
    console.log('Schedule:', schedule);
    console.log('Semi-Finals:', semiFinals);
    console.log('Finals:', finals);
    console.log('Selected Teams:', selectedTeams);
    console.log('Group Phase:', groupPhase);
    console.log('Match ID:', matchId);
    console.groupEnd();

    navigate('/StartMatchPlayersRR', {
      state: {
        overs,
        teamA,
        teamB,
        selectedPlayers,
        origin,
        tournamentId,
        schedule,
        semiFinals,
        finals,
        selectedTeams,
        phase: groupPhase,
        matchId,
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
        minHeight: 'calc(100vh - H - N)',
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
                    filteredLeftPlayers.map((player, index) => {
                      const isSelected = selectedPlayers.left.includes(player);
                      const isSelectionDisabled = selectedPlayers.left.length >= 11 && !isSelected;

                      return (
                        <motion.div
                          key={player.name}
                          className={`p-3 border-b border-blue-50 last:border-b-0 transition-colors duration-200 flex items-center ${
                            isSelected ? 'bg-blue-100 font-medium' : 'hover:bg-blue-50'
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
                    filteredRightPlayers.map((player, index) => {
                      const isSelected = selectedPlayers.right.includes(player);
                      const isSelectionDisabled = selectedPlayers.right.length >= 11 && !isSelected;

                      return (
                        <motion.div
                          key={player.name}
                          className={`p-3 border-b border-indigo-50 last:border-b-0 transition-colors duration-200 flex items-center ${
                            isSelected ? 'bg-indigo-100 font-medium' : 'hover:bg-indigo-50'
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

const Startmatch = ({
  initialTeamA,
  initialTeamB,
  tournamentId,
  schedule,
  semiFinals,
  finals,
  selectedTeams,
  origin,
  onTeamsSelectedForLiveScore,
  setActiveTab,
}) => {
  console.group('Startmatch Props');
  console.log('Initial Team A:', initialTeamA);
  console.log('Initial Team B:', initialTeamB);
  console.log('Tournament ID:', tournamentId);
  console.log('Schedule:', schedule);
  console.log('Semi-Finals:', semiFinals);
  console.log('Finals:', finals);
  console.log('Selected Teams:', selectedTeams);
  console.log('Origin:', origin);
  console.log('onTeamsSelectedForLiveScore:', typeof onTeamsSelectedForLiveScore);
  console.log('setActiveTab:', typeof setActiveTab);
  console.groupEnd();

  const [allTeams, setAllTeams] = useState([]);
  const [allMatches, setAllMatches] = useState([]); // State to store matches from Firestore
  const [tournamentWinner, setTournamentWinner] = useState(null); // State to store the tournament winner
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [teamFetchError, setTeamFetchError] = useState(null);
  const [selectedTeamA, setSelectedTeamA] = useState(initialTeamA || '');
  const [selectedTeamB, setSelectedTeamB] = useState(initialTeamB || '');
  const [tossWinner, setTossWinner] = useState('');
  const [tossDecision, setTossDecision] = useState('Batting');
  const [overs, setOvers] = useState('');
  const [scorer, setScorer] = useState('');
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('');
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [groupPhase, setGroupPhase] = useState('');
  const [loadingTournament, setLoadingTournament] = useState(false);
  const [tournamentError, setTournamentError] = useState(null);
  const [tournamentDocId, setTournamentDocId] = useState(''); // Store the Firestore document ID
  const [showFlowchartModal, setShowFlowchartModal] = useState(false); // State for flowchart modal
  const [flowchartData, setFlowchartData] = useState([]); // State to store flowchart data
  const [flowchartLoading, setFlowchartLoading] = useState(false); // State for loading flowchart data
  const [flowchartError, setFlowchartError] = useState(null); // State for flowchart errors

  const scorers = ['John Doe', 'Jane Smith', 'Mike Johnson'];
  const navigate = useNavigate();

  // Fetch teams from Firebase
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
        }));
        setAllTeams(fetchedTeams);
        console.group('Fetched Teams');
        console.log('All Teams:', fetchedTeams);
        console.groupEnd();
      } catch (err) {
        console.error('Error fetching teams:', err);
        setTeamFetchError('Failed to load teams. Please check console.');
      } finally {
        setLoadingTeams(false);
      }
    };
    fetchAllTeams();
  }, []);

  // Fetch tournament data to get matches, determine phase, and update semi-finals/finals
  useEffect(() => {
    const fetchTournamentData = async () => {
      if (!tournamentId) {
        setTournamentError('No tournament ID provided.');
        return;
      }

      setLoadingTournament(true);
      try {
        // Query the tournament collection for the document with the given tournamentId
        const q = query(
          collection(db, 'roundrobin'),
          where('tournamentId', '==', tournamentId)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setTournamentError('Tournament not found.');
          setLoadingTournament(false);
          return;
        }

        const tournamentDoc = querySnapshot.docs[0];
        setTournamentDocId(tournamentDoc.id); // Store the document ID for updates
        const tournamentData = tournamentDoc.data();

        // Extract matches from roundRobin, semiFinals, and finals
        const roundRobinMatches = Object.keys(tournamentData.roundRobin || {}).flatMap(groupKey => {
          const groupNumber = groupKey.split('_').pop();
          return (tournamentData.roundRobin[groupKey] || []).map(match => ({
            ...match,
            phase: `Group Stage ${groupNumber}`,
          }));
        });
        const semiFinalMatches = Object.values(tournamentData.semiFinals || {}).map(match => ({
          ...match,
          phase: 'Semi-Final',
        }));
        const finalMatches = Object.values(tournamentData.finals || {}).map(match => ({
          ...match,
          phase: 'Final',
        }));

        // Determine completion status of each phase
        const groupStageComplete = roundRobinMatches.length > 0 && roundRobinMatches.every(match => match.winner !== null);
        const semiFinalsComplete = semiFinalMatches.length > 0 && semiFinalMatches.every(match => match.winner !== null);
        const finalsComplete = finalMatches.length > 0 && finalMatches.every(match => match.winner !== null);

        // Update semi-finals if Group Stage is complete and semi-finals are not yet set
        if (groupStageComplete && semiFinalMatches.every(match => match.team1 === 'TBD')) {
          // Get top 4 teams based on points
          const teams = tournamentData.teams || [];
          const sortedTeams = teams
            .filter(team => team.teamName !== 'BYE')
            .sort((a, b) => b.points - a.points)
            .slice(0, 4); // Top 4 teams

          if (sortedTeams.length >= 4) {
            const updatedSemiFinals = {
              match_1: { id: 'semi_1', phase: 'Semi-Final 1', team1: sortedTeams[0].teamName, team2: sortedTeams[3].teamName, winner: null },
              match_2: { id: 'semi_2', phase: 'Semi-Final 2', team1: sortedTeams[1].teamName, team2: sortedTeams[2].teamName, winner: null },
            };

            // Update Firestore with the new semi-finals
            await updateDoc(doc(db, 'roundrobin', tournamentDoc.id), {
              semiFinals: updatedSemiFinals,
            });

            // Update local state
            semiFinalMatches.splice(0, semiFinalMatches.length, ...Object.values(updatedSemiFinals));
          }
        }

        // Update finals if Semi-Finals are complete and finals are not yet set
        if (groupStageComplete && semiFinalsComplete && finalMatches.every(match => match.team1 === 'TBD')) {
          const semiFinalWinners = semiFinalMatches
            .map(match => match.winner)
            .filter(winner => winner !== null);

          if (semiFinalWinners.length === 2) {
            const updatedFinals = {
              match_1: { id: 'final_1', phase: 'Final', team1: semiFinalWinners[0], team2: semiFinalWinners[1], winner: null },
            };

            // Update Firestore with the new finals
            await updateDoc(doc(db, 'roundrobin', tournamentDoc.id), {
              finals: updatedFinals,
            });

            // Update local state
            finalMatches.splice(0, finalMatches.length, ...Object.values(updatedFinals));
          }
        }

        // Determine the tournament winner if Finals are complete
        if (groupStageComplete && semiFinalsComplete && finalsComplete) {
          const finalWinner = finalMatches[0]?.winner;
          if (finalWinner) {
            setTournamentWinner(finalWinner);
            // Optionally, update Firestore with the tournament winner
            await updateDoc(doc(db, 'roundrobin', tournamentDoc.id), {
              winner: finalWinner,
            });
          }
        }

        // Determine which matches to display based on phase completion
        let matchesToDisplay = [];
        let phase = 'Group Stage';

        if (!groupStageComplete) {
          // Group Stage is not complete, only show Group Stage matches
          matchesToDisplay = roundRobinMatches.filter(match => match.winner === null);
          phase = 'Group Stage';
        } else if (groupStageComplete && !semiFinalsComplete) {
          // Group Stage is complete, Semi-Finals are not complete, show Semi-Final matches
          matchesToDisplay = semiFinalMatches.filter(match => match.winner === null);
          phase = 'Semi-Finals';
        } else if (groupStageComplete && semiFinalsComplete && !finalsComplete) {
          // Both Group Stage and Semi-Finals are complete, show Final matches
          matchesToDisplay = finalMatches.filter(match => match.winner === null);
          phase = 'Finals';
        } else if (groupStageComplete && semiFinalsComplete && finalsComplete) {
          // Tournament is complete
          matchesToDisplay = [];
          phase = 'Finals (Complete)';
        }

        setAllMatches(matchesToDisplay);
        setCurrentPhase(phase);

        console.group('Fetched Tournament Data');
        console.log('Tournament Data:', tournamentData);
        console.log('Round Robin Matches:', roundRobinMatches);
        console.log('Semi-Final Matches:', semiFinalMatches);
        console.log('Final Matches:', finalMatches);
        console.log('Group Stage Complete:', groupStageComplete);
        console.log('Semi-Finals Complete:', semiFinalsComplete);
        console.log('Finals Complete:', finalsComplete);
        console.log('Matches to Display:', matchesToDisplay);
        console.log('Current Phase:', phase);
        console.log('Tournament Winner:', tournamentWinner);
        console.groupEnd();
      } catch (err) {
        console.error('Error fetching tournament:', err);
        setTournamentError('Failed to load tournament data.');
      } finally {
        setLoadingTournament(false);
      }
    };

    if (tournamentId) {
      fetchTournamentData();
    }
  }, [tournamentId]);

  // Handle match selection
  useEffect(() => {
    if (selectedMatchId) {
      const match = allMatches.find(m => m.id === selectedMatchId);
      if (match) {
        setSelectedTeamA(match.team1);
        setSelectedTeamB(match.team2);
        setGroupPhase(match.phase);
        console.group('Match Selected');
        console.log('Selected Match ID:', selectedMatchId);
        console.log('Selected Match Details:', match);
        console.log('Selected Team A:', match.team1);
        console.log('Selected Team B:', match.team2);
        console.log('Group Phase:', match.phase);
        console.groupEnd();
      }
    }
  }, [selectedMatchId, allMatches]);

  // Prevent same team selection
  useEffect(() => {
    if (selectedTeamA && selectedTeamB === selectedTeamA) {
      setSelectedTeamB('');
    }
  }, [selectedTeamA, selectedTeamB]);

  // Fetch data for the flowchart modal
  const fetchFlowchartData = async () => {
    if (!tournamentId) {
      setFlowchartError('No tournament ID provided.');
      return;
    }

    setFlowchartLoading(true);
    setFlowchartError(null);

    try {
      const q = query(
        collection(db, 'roundrobin'),
        where('tournamentId', '==', tournamentId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setFlowchartError('Tournament not found.');
        setFlowchartLoading(false);
        return;
      }

      const tournamentData = querySnapshot.docs[0].data();
      const flowchart = [];

      // Group Stage: Show all teams
      if (tournamentData.roundRobin && Object.keys(tournamentData.roundRobin).length > 0) {
        flowchart.push({
          phase: 'Group Stage',
          teams: tournamentData.teams
            .filter(team => team.teamName !== 'BYE')
            .map(team => team.teamName),
        });
      }

      // Semi-Finals: Show teams if available
      let semiFinalTeams = [];
      const semiFinalMatches = Object.values(tournamentData.semiFinals || {});
      if (semiFinalMatches.length > 0 && semiFinalMatches[0].team1 !== 'TBD') {
        semiFinalTeams = semiFinalMatches.flatMap(match => [match.team1, match.team2]);
      } else {
        if (tournamentData.teams.length >= 4) {
          semiFinalTeams = ['TBD', 'TBD', 'TBD', 'TBD'];
        } else if (tournamentData.teams.length === 3) {
          semiFinalTeams = ['TBD', 'TBD'];
        }
      }
      if (semiFinalTeams.length > 0) {
        flowchart.push({
          phase: 'Semi-Finals',
          teams: semiFinalTeams,
        });
      }

      // Finals: Show teams if available
      let finalTeams = [];
      const finalMatches = Object.values(tournamentData.finals || {});
      if (finalMatches.length > 0 && finalMatches[0].team1 !== 'TBD') {
        finalTeams = finalMatches.flatMap(match => [match.team1, match.team2]);
      } else {
        if (tournamentData.teams.length >= 2) {
          finalTeams = ['TBD', 'TBD'];
        }
      }
      if (finalTeams.length > 0) {
        flowchart.push({
          phase: 'Finals',
          teams: finalTeams,
        });
      }

      setFlowchartData(flowchart);
    } catch (err) {
      console.error('Error fetching flowchart data:', err);
      setFlowchartError('Failed to load flowchart. Please try again.');
    } finally {
      setFlowchartLoading(false);
    }
  };

  // Open flowchart modal and fetch data
  const handleOpenFlowchartModal = () => {
    setShowFlowchartModal(true);
    fetchFlowchartData();
  };

  const handleNext = () => {
    if (!selectedTeamA || !selectedTeamB || !overs) {
      alert('Please select a match and enter overs.');
      return;
    }

    const teamAData = allTeams.find(team => team.name === selectedTeamA);
    const teamBData = allTeams.find(team => team.name === selectedTeamB);

    if (!teamAData) {
      alert(`Team "${selectedTeamA}" not found.`);
      return;
    }
    if (!teamBData) {
      alert(`Team "${selectedTeamB}" not found.`);
      return;
    }
    if (!teamAData.players || teamAData.players.length === 0) {
      alert(`Team "${selectedTeamA}" has no players. Add players via admin panel.`);
      return;
    }
    if (!teamBData.players || teamBData.players.length === 0) {
      alert(`Team "${selectedTeamB}" has no players. Add players via admin panel.`);
      return;
    }

    setShowPlayerSelector(true);
  };

  const hasValue = value => value !== '' && value !== null && value !== undefined;

  if (loadingTeams || loadingTournament) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (teamFetchError || tournamentError) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-500 flex items-center justify-center">
        <p className="text-xl">Error: {teamFetchError || tournamentError}</p>
      </div>
    );
  }

  if (allTeams.length < 2) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl text-center">
          Not enough teams registered. Please add at least two teams via admin panel.
        </p>
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
        origin={origin}
        tournamentId={tournamentId}
        schedule={schedule}
        semiFinals={semiFinals}
        finals={finals}
        selectedTeams={selectedTeams}
        groupPhase={groupPhase}
        matchId={selectedMatchId}
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
        minHeight: 'calc(100vh - H - N)',
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

          {/* Display Tournament Winner */}
          {tournamentWinner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-semibold text-white">
                Tournament Winner: {tournamentWinner} 🏆
              </h2>
            </motion.div>
          )}

          {/* Flowchart Button */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              onClick={handleOpenFlowchartModal}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              View Flowchart
            </button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            {/* Left Column */}
            <motion.div
              className="flex flex-col space-y-6 w-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Big Card - Select Teams */}
              <motion.div
                className="min-h-[300px] bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl p-6 w-full border border-blue-100 flex flex-col"
                whileHover={{ scale: 1.01 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Select Match</h2>
                <div className="mb-4">
                  <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Current Phase: {currentPhase}
                  </span>
                </div>
                <div className="space-y-4 w-full flex-1">
                  {/* Match Selector */}
                  <div className="w-full">
                    <label className="block text-gray-700 mb-2 font-medium">Select Match</label>
                    <select
                      className={`w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                        hasValue(selectedMatchId) ? 'bg-gray-200 text-gray-700' : 'bg-white'
                      }`}
                      value={selectedMatchId}
                      onChange={(e) => setSelectedMatchId(e.target.value)}
                    >
                      <option value="">Select a Match</option>
                      {allMatches.map(match => (
                        <option key={match.id} value={match.id}>
                          {`${match.team1} vs ${match.team2}`}
                        </option>
                      ))}
                    </select>
                    {allMatches.length === 0 && currentPhase !== 'Finals (Complete)' && (
                      <p className="text-red-500 mt-2 text-sm">
                        No matches available. Please complete the previous phase.
                      </p>
                    )}
                    {currentPhase === 'Finals (Complete)' && allMatches.length === 0 && (
                      <p className="text-green-500 mt-2 text-sm">
                        Tournament completed! No more matches to play.
                      </p>
                    )}
                  </div>
                  {/* Team A (Read-only) */}
                  <div className="w-full">
                    <label className="block text-gray-700 mb-2 font-medium">Team A</label>
                    <input
                      type="text"
                      className="w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 bg-gray-200"
                      value={selectedTeamA}
                      readOnly
                    />
                  </div>
                  {/* Team B (Read-only) */}
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

              {/* Smaller Card - Overs */}
              <motion.div
                className="min-h-[200px] bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl p-6 w-full border border-blue-100 flex flex-col justify-center"
                whileHover={{ scale: 1.01 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Choose your Overs</h2>
                <div className="w-full">
                  <input
                    type="number"
                    placeholder="Enter overs (e.g. 20)"
                    className={`w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                      hasValue(overs) ? 'bg-gray-200 text-gray-700' : 'bg-white'
                    }`}
                    value={overs}
                    onChange={(e) => setOvers(e.target.value)}
                    min="1"
                    max="50"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              className="flex flex-col space-y-6 w-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Big Card - Toss Details */}
              <motion.div
                className="min-h-[300px] bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl p-6 w-full border border-blue-100 flex flex-col"
                whileHover={{ scale: 1.01 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Toss Details</h2>
                <div className="space-y-4 w-full flex-1">
                  {/* Toss Winner */}
                  <div className="w-full">
                    <label className="block text-gray-700 mb-2 font-medium">Record Toss & Decision</label>
                    <select
                      className={`w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 mb-4 ${
                        hasValue(tossWinner) ? 'bg-gray-200 text-gray-700' : 'bg-white'
                      }`}
                      value={tossWinner}
                      onChange={(e) => setTossWinner(e.target.value)}
                    >
                      <option value="">Select Team</option>
                      {selectedTeamA && <option value={selectedTeamA}>{selectedTeamA}</option>}
                      {selectedTeamB && <option value={selectedTeamB}>{selectedTeamB}</option>}
                    </select>
                  </div>
                  {/* Toss Decision */}
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

              {/* Smaller Card - Assign Scorer */}
              <motion.div
                className="min-h-[200px] bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl p-6 w-full border border-blue-100 flex flex-col justify-center"
                whileHover={{ scale: 1.01 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Assign Scorer</h2>
                <div className="w-full">
                  <select
                    className={`w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                      hasValue(scorer) ? 'bg-gray-200 text-gray-700' : 'bg-white'
                    }`}
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

          {/* Next Button */}
          <motion.div
            className="mt-8 text-center w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.button
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleNext}
              whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              disabled={currentPhase === 'Finals (Complete)'}
            >
              Next
            </motion.button>
          </motion.div>

          {/* Flowchart Modal */}
          {showFlowchartModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-[#1A2B4C] rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center text-white">
                  Tournament Flowchart
                </h2>
                {flowchartLoading && <p className="text-sm md:text-base text-white">Loading flowchart...</p>}
                {flowchartError && <p className="text-red-500 text-sm md:text-base">{flowchartError}</p>}
                {!flowchartLoading && !flowchartError && flowchartData.length > 0 && (
                  <div className="space-y-6">
                    {flowchartData.map((phase, index) => (
                      <div key={index} className="flex flex-row items-start">
                        <div className="w-1/4 text-left pr-4">
                          <h3 className="text-lg md:text-xl font-bold mb-2 text-white">{phase.phase}</h3>
                        </div>
                        <div className="w-3/4">
                          <div className="flex flex-row flex-wrap gap-2">
                            {phase.teams.map((team, teamIndex) => (
                              <div
                                key={teamIndex}
                                className="bg-blue-900 p-3 rounded-lg text-center text-sm md:text-base text-white min-w-[100px]"
                              >
                                {team}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Display Tournament Winner in Modal */}
                {tournamentWinner && (
                  <div className="mt-6 text-center">
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      Winner: {tournamentWinner} 🏆
                    </h3>
                  </div>
                )}
                <button
                  onClick={() => setShowFlowchartModal(false)}
                  className="mt-6 w-full bg-gray-500 px-4 py-2 rounded hover:bg-gray-600 text-sm md:text-base text-white"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Startmatch;