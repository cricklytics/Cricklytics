import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const TournamentBracket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [format, setFormat] = useState(null);
  const [matches, setMatches] = useState([]);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [tournamentWinner, setTournamentWinner] = useState(null);
  const [phaseHistory, setPhaseHistory] = useState([]);
  const [matchHistory, setMatchHistory] = useState([]); // Added to store all matches

  useEffect(() => {
    if (location.state?.teams) {
      const initialTeams = location.state.teams.map((t, i) => ({
        ...t,
        id: t.id || generateUUID(),
        seed: t.seed || i + 1,
      }));
      setTeams(initialTeams);
      if (location.state.tournamentWinner) {
        setTournamentWinner(location.state.tournamentWinner);
      }
      if (location.state.matches) {
        setMatches(location.state.matches);
      }
      if (location.state.currentPhase) {
        setCurrentPhase(location.state.currentPhase);
      }
      if (location.state.phaseHistory) {
        setPhaseHistory(location.state.phaseHistory);
      }
      if (location.state.matchHistory) {
        setMatchHistory(location.state.matchHistory);
      }
    } else {
      console.error('No teams provided in location state.');
      alert('Please select teams before starting the tournament.');
      navigate('/TournamentPage');
    }
  }, [location.state, navigate]);

  const initializeTournament = (formatType) => {
    setFormat(formatType);
    const teamCount = teams.length;
    const seededTeams = [...teams].sort((a, b) => a.seed - b.seed);

    if (formatType === 'superKnockout') {
      let byeCount = 0;
      if (teamCount >= 16) byeCount = 4;
      else if (teamCount === 15) byeCount = 1;
      else if (teamCount > 10) byeCount = teamCount - 10;
      else if (teamCount > 8) byeCount = teamCount - 8;
      byeCount = Math.min(byeCount, Math.floor(teamCount / 2));

      const competingTeams = seededTeams.slice(byeCount);
      const superKnockoutMatches = [];

      for (let i = 0; i < competingTeams.length - 1; i += 2) {
        superKnockoutMatches.push({
          id: `super-knockout-${i / 2}`,
          team1: competingTeams[i],
          team2: competingTeams[i + 1],
          round: 0,
          phase: 'superKnockout',
          winner: null,
          played: false,
        });
      }

      if (competingTeams.length % 2 === 1) {
        superKnockoutMatches.push({
          id: `super-knockout-${Math.floor(competingTeams.length / 2)}`,
          team1: competingTeams[competingTeams.length - 1],
          team2: { name: 'BYE', id: generateUUID(), isBye: true },
          round: 0,
          phase: 'superKnockout',
          winner: competingTeams[competingTeams.length - 1].id,
          played: true,
        });
      }

      setMatches(superKnockoutMatches);
      setMatchHistory(superKnockoutMatches);
      setCurrentPhase('superKnockout');
    } else if (formatType === 'knockout') {
      if (teamCount !== 12) {
        console.error(`Knockout format requires exactly 12 teams, received ${teamCount}.`);
        alert('Knockout format requires exactly 12 teams.');
        window.location.reload();
        return;
      }
      const newMatches = [
        {
          id: 'pre-quarter-1',
          team1: seededTeams[8],
          team2: seededTeams[11],
          round: 0,
          phase: 'preQuarter',
          winner: null,
          played: false,
        },
        {
          id: 'pre-quarter-2',
          team1: seededTeams[9],
          team2: seededTeams[10],
          round: 0,
          phase: 'preQuarter',
          winner: null,
          played: false,
        },
      ];
      setMatches(newMatches);
      setMatchHistory(newMatches);
      setCurrentPhase('preQuarter');
    } else if (formatType === 'playOff') {
      if (teamCount !== 8) {
        console.error(`Play Off format requires exactly 8 teams, received ${teamCount}.`);
        alert('Play Off format requires exactly 8 teams.');
        window.location.reload();
        return;
      }
      const newMatches = [
        { id: 'playoff-1', team1: seededTeams[0], team2: seededTeams[7], round: 0, phase: 'playOff', winner: null, played: false },
        { id: 'playoff-2', team1: seededTeams[1], team2: seededTeams[6], round: 0, phase: 'playOff', winner: null, played: false },
        { id: 'playoff-3', team1: seededTeams[2], team2: seededTeams[5], round: 0, phase: 'playOff', winner: null, played: false },
        { id: 'playoff-4', team1: seededTeams[3], team2: seededTeams[4], round: 0, phase: 'playOff', winner: null, played: false },
      ];
      setMatches(newMatches);
      setMatchHistory(newMatches);
      setCurrentPhase('playOff');
    } else if (formatType === 'eliminatorElite') {
      if (teamCount !== 4) {
        console.error(`Eliminator Elite format requires exactly 4 teams, received ${teamCount}.`);
        alert('Eliminator Elite format requires exactly 4 teams.');
        window.location.reload();
        return;
      }
      const newMatches = [
        { id: 'elite-1', team1: seededTeams[0], team2: seededTeams[3], round: 0, phase: 'eliminatorElite', winner: null, played: false },
        { id: 'elite-2', team1: seededTeams[1], team2: seededTeams[2], round: 0, phase: 'eliminatorElite', winner: null, played: false },
      ];
      setMatches(newMatches);
      setMatchHistory(newMatches);
      setCurrentPhase('eliminatorElite');
    } else if (formatType === 'championship') {
      if (teamCount !== 2) {
        console.error(`Championship format requires exactly 2 teams, received ${teamCount}.`);
        alert('Championship format requires exactly 2 teams.');
        window.location.reload();
        return;
      }
      const newMatches = [
        { id: 'championship', team1: seededTeams[0], team2: seededTeams[1], round: 0, phase: 'championship', winner: null, played: false },
      ];
      setMatches(newMatches);
      setMatchHistory(newMatches);
      setCurrentPhase('championship');
    } else {
      console.error(`Unknown format: ${formatType}`);
      alert('Invalid tournament format selected.');
      window.location.reload();
      return;
    }

    console.log(`Initialized ${formatType} with ${matches.length} matches.`);
  };

  const handleMatchResult = (matchId, winnerId) => {
    if (tournamentWinner) return;

    setMatches((prevMatches) => {
      const updatedMatches = prevMatches.map((match) => {
        if (match.id === matchId) {
          return { ...match, winner: winnerId, played: true };
        }
        return match;
      });

      setMatchHistory((prev) => {
        const existingMatch = prev.find((m) => m.id === matchId);
        if (existingMatch) {
          return prev.map((m) => (m.id === matchId ? { ...m, winner: winnerId, played: true } : m));
        }
        return [...prev, ...updatedMatches.filter((m) => m.id === matchId)];
      });

      const phaseMatches = updatedMatches.filter((m) => m.phase === currentPhase);
      if (phaseMatches.every((m) => m.played || m.team1?.isBye || m.team2?.isBye)) {
        if (currentPhase === 'superKnockout') {
          const winners = updatedMatches
            .filter((m) => m.phase === 'superKnockout' && m.winner && !m.team1?.isBye && !m.team2?.isBye)
            .map((m) => teams.find((t) => t.id === m.winner))
            .filter((t) => t);
          const byeTeams = teams.length >= 16 ? teams.slice(0, 4) : teams.length === 15 ? teams.slice(0, 1) : teams.length > 10 ? teams.slice(0, teams.length - 10) : teams.length > 8 ? teams.slice(0, teams.length - 8) : [];
          const nextTeams = [...winners, ...byeTeams].sort((a, b) => a.seed - b.seed);

          if (nextTeams.length === 10) {
            initializePreQuarter(nextTeams);
          } else if (nextTeams.length === 8) {
            initializeQuarterFinals(nextTeams);
          } else {
            console.error(`Unexpected number of teams after Super Knockout: ${nextTeams.length}`);
            alert(`Error advancing from Super Knockout. Expected 8 or 10 teams, got ${nextTeams.length}.`);
            window.location.reload();
            return updatedMatches;
          }
        } else if (currentPhase === 'preQuarter') {
          const winners = updatedMatches
            .filter((m) => m.phase === 'preQuarter' && m.winner)
            .map((m) => teams.find((t) => t.id === m.winner))
            .filter(Boolean);

          const topSeeds = teams.slice(0, 8);
          const nextTeams = [...topSeeds, ...winners].sort((a, b) => a.seed - b.seed).slice(0, 8);

          if (nextTeams.length !== 8) {
            console.error(`Expected 8 teams for Quarter Finals, got ${nextTeams.length}`);
            alert(`Error: Expected 8 teams for Quarter Finals, got ${nextTeams.length}`);
            return updatedMatches;
          }

          initializeQuarterFinals(nextTeams);
        } else if (currentPhase === 'quarter' || currentPhase === 'playOff') {
          const winners = updatedMatches
            .filter((m) => m.phase === currentPhase && m.winner)
            .map((m) => teams.find((t) => t.id === m.winner))
            .filter((t) => t);
          if (winners.length !== 4) {
            console.error(`Expected 4 winners for Semi Finals from ${currentPhase}, got ${winners.length}`);
            alert(`Error: Expected 4 winners for Semi Finals from ${currentPhase}, got ${winners.length}.`);
            return updatedMatches;
          }
          initializeSemiFinals(winners);
        } else if (currentPhase === 'eliminatorElite') {
          const winners = updatedMatches
            .filter((m) => m.phase === 'eliminatorElite' && m.winner)
            .map((m) => teams.find((t) => t.id === m.winner));
          const losers = updatedMatches
            .filter((m) => m.phase === 'eliminatorElite' && m.winner)
            .map((m) => (m.team1.id === m.winner ? m.team2 : m.team1));
          initializeFinal(winners);
          if (losers.length === 2) {
            const thirdPlaceMatch = {
              id: 'third-place',
              team1: losers[0],
              team2: losers[1],
              round: 1,
              phase: 'thirdPlace',
              winner: null,
              played: false,
            };
            setMatches((prev) => [...prev, thirdPlaceMatch]);
            setMatchHistory((prev) => [...prev, thirdPlaceMatch]);
          }
        } else if (currentPhase === 'semi') {
          const winners = updatedMatches
            .filter((m) => m.phase === 'semi' && m.winner)
            .map((m) => teams.find((t) => t.id === m.winner))
            .filter(Boolean);

          if (winners.length === 2) {
            initializeFinal(winners);
          } else {
            console.error(`Expected 2 winners for Final from semi, got ${winners.length}`);
            alert(`Error: Expected 2 winners for Final from semi, got ${winners.length}.`);
            return updatedMatches;
          }
        } else if (currentPhase === 'qualifier1' || currentPhase === 'eliminator') {
          if (updatedMatches.filter((m) => m.phase === 'qualifier1' || m.phase === 'eliminator').every((m) => m.played)) {
            initializeQualifier2();
          }
        } else if (currentPhase === 'qualifier2') {
          initializeFinal();
        } else if (currentPhase === 'championship' || currentPhase === 'final') {
          const winner = updatedMatches.find((m) => m.phase === currentPhase)?.winner;
          if (winner) {
            setTournamentWinner(winner);
          } else {
            console.error('No winner found for final/championship.');
          }
        }
      }

      return updatedMatches;
    });
  };

  const initializePreQuarter = (nextTeams) => {
    if (nextTeams.length !== 10) {
      console.error(`PreQuarter expects 10 teams, received ${nextTeams.length}`);
      alert('Error: Incorrect number of teams for Pre-Quarter Finals.');
      return;
    }
    const preQuarterMatches = [
      { id: 'pre-quarter-1', team1: nextTeams[4], team2: nextTeams[9], round: 1, phase: 'preQuarter', winner: null, played: false },
      { id: 'pre-quarter-2', team1: nextTeams[5], team2: nextTeams[8], round: 1, phase: 'preQuarter', winner: null, played: false },
      { id: 'pre-quarter-3', team1: nextTeams[6], team2: nextTeams[7], round: 1, phase: 'preQuarter', winner: null, played: false },
    ];
    setMatches(preQuarterMatches);
    setMatchHistory((prev) => [...prev, ...preQuarterMatches]);
    setCurrentPhase('preQuarter');
    setPhaseHistory((prev) => [...prev, 'superKnockout']);
  };

  const initializeQuarterFinals = (teamsForQuarter) => {
    if (teamsForQuarter.length !== 8) {
      console.error(`Quarter Finals requires 8 teams, got ${teamsForQuarter.length}`);
      alert('Error: Quarter Finals need exactly 8 teams.');
      return;
    }

    const matches = [
      { id: 'quarter-1', team1: teamsForQuarter[0], team2: teamsForQuarter[7], round: 2, phase: 'quarter', winner: null, played: false },
      { id: 'quarter-2', team1: teamsForQuarter[1], team2: teamsForQuarter[6], round: 2, phase: 'quarter', winner: null, played: false },
      { id: 'quarter-3', team1: teamsForQuarter[2], team2: teamsForQuarter[5], round: 2, phase: 'quarter', winner: null, played: false },
      { id: 'quarter-4', team1: teamsForQuarter[3], team2: teamsForQuarter[4], round: 2, phase: 'quarter', winner: null, played: false },
    ];

    setMatches(matches);
    setMatchHistory((prev) => [...prev, ...matches]);
    setCurrentPhase('quarter');
    setPhaseHistory((prev) => [...prev, 'preQuarter']);
  };

  const initializeSemiFinals = (teamsForSemi) => {
    const matches = [
      { id: 'semi-1', team1: teamsForSemi[0], team2: teamsForSemi[3], round: 3, phase: 'semi', winner: null, played: false },
      { id: 'semi-2', team1: teamsForSemi[1], team2: teamsForSemi[2], round: 3, phase: 'semi', winner: null, played: false },
    ];
    setMatches(matches);
    setMatchHistory((prev) => [...prev, ...matches]);
    setCurrentPhase('semi');
    setPhaseHistory((prev) => [...prev, 'quarter']);
  };

  const initializeQualifier2 = () => {
    const q1Match = matches.find((m) => m.phase === 'qualifier1');
    const elimMatch = matches.find((m) => m.phase === 'eliminator');
    if (!q1Match?.winner || !elimMatch?.winner) {
      console.error('Qualifier 2 cannot be initialized: Missing winners from Qualifier 1 or Eliminator.');
      alert('Error: Cannot proceed to Qualifier 2 without Qualifier 1 and Eliminator results.');
      return;
    }
    const q1Loser = q1Match.winner === q1Match.team1.id ? q1Match.team2 : q1Match.team1;
    const elimWinner = teams.find((t) => t.id === elimMatch.winner);
    const q2Match = [
      {
        id: 'qualifier2',
        team1: q1Loser,
        team2: elimWinner,
        round: 0,
        phase: 'qualifier2',
        winner: null,
        played: false,
      },
    ];
    setMatches(q2Match);
    setMatchHistory((prev) => [...prev, ...q2Match]);
    setCurrentPhase('qualifier2');
    setPhaseHistory((prev) => [...prev, 'qualifier1', 'eliminator']);
  };

  const initializeFinal = (winners) => {
    let finalTeams = [];
    if (currentPhase === 'qualifier2') {
      const q1Winner = teams.find((t) => t.id === matches.find((m) => m.phase === 'qualifier1').winner);
      const q2Winner = teams.find((t) => t.id === matches.find((m) => m.phase === 'qualifier2').winner);
      finalTeams = [q1Winner, q2Winner].filter((t) => t);
    } else if (currentPhase === 'semi' || currentPhase === 'eliminatorElite') {
      finalTeams = winners || matches
        .filter((m) => m.phase === currentPhase && m.winner)
        .map((m) => teams.find((t) => t.id === m.winner))
        .filter((t) => t);
    }
    if (finalTeams.length !== 2) {
      console.error(`Final expects 2 teams, received ${finalTeams.length}`);
      alert('Error: Incorrect number of teams for Final.');
      return;
    }
    const finalMatch = [
      {
        id: 'final',
        team1: finalTeams[0],
        team2: finalTeams[1],
        round: 0,
        phase: 'final',
        winner: null,
        played: false,
      },
    ];
    setMatches(finalMatch);
    setMatchHistory((prev) => [...prev, ...finalMatch]);
    setCurrentPhase('final');
    setPhaseHistory((prev) => [...prev, currentPhase]);
  };

  const handleGoToFlowchart = () => {
    navigate('/selection', {
      state: {
        teams,
        format,
        matches: matchHistory,
        currentPhase,
        tournamentWinner,
        phaseHistory,
        matchHistory,
      },
    });
  };

  const renderMatchCard = (match) => (
    <motion.div
      key={match.id}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border-2 border-purple-500 shadow-2xl mb-4"
      whileHover={{ scale: (match.team1?.isBye || match.team2?.isBye || match.played) ? 1 : 1.02 }}
    >
      <div className="flex justify-between items-center mb-2">
        <div className={`flex-1 text-right ${match.winner === match.team1?.id ? 'text-green-400 font-bold' : 'text-gray-300'}`}>
          {match.team1?.isBye ? 'BYE' : match.team1?.name || 'TBD'}
        </div>
        <div className="mx-4 text-xl font-bold text-purple-400">vs</div>
        <div className={`flex-1 text-left ${match.winner === match.team2?.id ? 'text-green-400 font-bold' : 'text-gray-300'}`}>
          {match.team2?.isBye ? 'BYE' : match.team2?.name || 'TBD'}
        </div>
      </div>
      {!match.played && !match.team1?.isBye && !match.team2?.isBye && (
        <div className="flex justify-center space-x-2 mt-2">
          <button
            onClick={() => handleMatchResult(match.id, match.team1.id)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transform transition-all duration-200 hover:scale-105"
            disabled={match.played}
          >
            {match.team1?.name || 'Team 1'} Wins
          </button>
          <button
            onClick={() => handleMatchResult(match.id, match.team2.id)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transform transition-all duration-200 hover:scale-105"
            disabled={match.played}
          >
            {match.team2?.name || 'Team 2'} Wins
          </button>
        </div>
      )}
      {match.winner && (
        <div className="text-center mt-2 text-sm text-green-400">
          Winner: {teams.find((t) => t.id === match.winner)?.name || 'Unknown'}
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {!format ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-8 text-purple-400">Select Tournament Format</h1>
            <div className="flex flex-wrap justify-center gap-6">
              {['superKnockout', 'knockout', 'playOff', 'eliminatorElite', 'championship'].map((formatType) => (
                <button
                  key={formatType}
                  onClick={() => initializeTournament(formatType)}
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-xl transform transition-all duration-300 hover:scale-110"
                >
                  {formatType === 'superKnockout'
                    ? 'Super Knockout'
                    : formatType === 'knockout'
                    ? 'Knockout'
                    : formatType === 'playOff'
                    ? 'Play Off'
                    : formatType === 'eliminatorElite'
                    ? 'Eliminator Elite'
                    : 'Championship'}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-purple-400">
                {currentPhase === 'superKnockout'
                  ? 'Super Knockout'
                  : currentPhase === 'preQuarter'
                  ? 'Pre-Quarter Finals'
                  : currentPhase === 'quarter'
                  ? 'Quarter Finals'
                  : currentPhase === 'semi'
                  ? 'Semi Finals'
                  : currentPhase === 'final'
                  ? 'Final'
                  : currentPhase === 'qualifier1'
                  ? 'Qualifier 1'
                  : currentPhase === 'eliminator'
                  ? 'Eliminator'
                  : currentPhase === 'qualifier2'
                  ? 'Qualifier 2'
                  : currentPhase === 'playOff'
                  ? 'Play Off'
                  : currentPhase === 'eliminatorElite'
                  ? 'Eliminator Elite'
                  : currentPhase === 'championship'
                  ? 'Championship'
                  : currentPhase === 'thirdPlace'
                  ? 'Third Place Match'
                  : 'Tournament'}
              </h1>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-bold mb-4 text-purple-400">
                  {currentPhase === 'superKnockout'
                    ? 'Super Knockout'
                    : currentPhase === 'preQuarter'
                    ? 'Pre-Quarter Finals'
                    : currentPhase === 'quarter'
                    ? 'Quarter Finals'
                    : currentPhase === 'semi'
                    ? 'Semi Finals'
                    : currentPhase === 'final'
                    ? 'Final'
                    : currentPhase === 'qualifier1'
                    ? 'Qualifier 1'
                    : currentPhase === 'eliminator'
                    ? 'Eliminator'
                    : currentPhase === 'qualifier2'
                    ? 'Qualifier 2'
                    : currentPhase === 'playOff'
                    ? 'Play Off'
                    : currentPhase === 'eliminatorElite'
                    ? 'Eliminator Elite'
                    : currentPhase === 'championship'
                    ? 'Championship'
                    : currentPhase === 'thirdPlace'
                    ? 'Third Place Match'
                    : 'Tournament'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matches
                    .filter((m) => m.phase === currentPhase)
                    .map((match) => renderMatchCard(match))}
                </div>
              </div>
            </div>

            {tournamentWinner && (
              <div className="text-center mt-8">
                <div className="bg-purple-600 p-8 rounded-xl inline-block shadow-2xl">
                  <h2 className="text-4xl font-bold text-white animate-pulse">
                    🏆 Champion: {teams.find((t) => t.id === tournamentWinner)?.name || 'Unknown'} 🏆
                  </h2>
                  <button
                    onClick={handleGoToFlowchart}
                    className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transform transition-all duration-200 hover:scale-105"
                  >
                    GO TO FLOWCHART
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TournamentBracket;