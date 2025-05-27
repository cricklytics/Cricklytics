import React, { useState, useEffect, Component } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-4 text-red-600">
          <h2>Error: Something went wrong</h2>
          <p>{this.state.error?.message || 'Unknown error'}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Selection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [format, setFormat] = useState(null);
  const [matches, setMatches] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [currentStage, setCurrentStage] = useState(null);
  const [tournamentWinner, setTournamentWinner] = useState(null);
  const [matchHistory, setMatchHistory] = useState([]); // Added to store all matches
  const [phaseHistory, setPhaseHistory] = useState([]); // Added to store phase history

  useEffect(() => {
    if (location.state) {
      if (location.state.teams) {
        const initialTeams = Array.isArray(location.state.teams)
          ? location.state.teams.map(team => typeof team === 'string' ? { name: team } : team)
          : [];
        setTeams(initialTeams);
      }
      if (location.state.matches) setMatches(location.state.matches);
      if (location.state.rounds) setRounds(location.state.rounds);
      if (location.state.currentStage) setCurrentStage(location.state.currentStage);
      if (location.state.currentPhase) setCurrentStage(location.state.currentPhase); // Support phase from flowchart
      if (location.state.tournamentWinner) setTournamentWinner(location.state.tournamentWinner);
      if (location.state.format) setFormat(location.state.format);
      if (location.state.matchHistory) setMatchHistory(location.state.matchHistory);
      if (location.state.phaseHistory) setPhaseHistory(location.state.phaseHistory);
    }
  }, [location.state]);

  const initializeBracket = (teams, selectedFormat) => {
    if (!teams || teams.length < 2) {
      console.error('Invalid teams array');
      return;
    }

    const shuffled = [...teams].sort(() => 0.5 - Math.random());
    const newMatches = [];
    const newRounds = [];

    // Knockout format
    let currentTeams = [...shuffled];
    let roundNumber = 0;
    while (currentTeams.length >= 2) {
      const roundMatches = [];
      const roundLabel = getRoundLabel(currentTeams.length, roundNumber);
      for (let i = 0; i < currentTeams.length; i += 2) {
        const match = {
          id: `r${roundNumber}-${i/2}`,
          round: roundNumber,
          team1: currentTeams[i],
          team2: currentTeams[i + 1] || { name: 'BYE', isBye: true },
          winner: null,
          stage: roundLabel
        };
        roundMatches.push(match);
      }
      newMatches.push(...roundMatches);
      newRounds.push({
        name: roundLabel,
        matches: roundMatches.map(m => m.id),
        roundNumber: roundNumber,
        stage: roundLabel
      });
      if (roundMatches.length === 1) break;
      currentTeams = roundMatches.map(() => null);
      roundNumber++;
    }

    setMatches(newMatches);
    setRounds(newRounds);
    setMatchHistory(newMatches); // Initialize matchHistory
    setPhaseHistory([newRounds[0]?.stage || 'Round of 16']); // Initialize phaseHistory
    setCurrentStage(newRounds[0]?.stage || 'Round of 16');
    setTournamentWinner(null);
  };

  const getRoundLabel = (teamCount, roundNumber) => {
    if (teamCount <= 2) return 'Final';
    if (teamCount <= 4) return 'Semifinals';
    if (teamCount <= 8) return 'Quarterfinals';
    if (teamCount <= 16) return 'Round of 16';
    return `Round of ${teamCount}`;
  };

  const handleFormatSelection = (selectedFormat) => {
    setFormat(selectedFormat);
    initializeBracket(teams, selectedFormat);
  };

  const handleMatchResult = (matchId, winner) => {
    if (tournamentWinner) return;

    let updatedMatches = matches.map(match => {
      if (match.id === matchId && !match.team1?.isBye && !match.team2?.isBye) {
        return { ...match, winner };
      }
      return match;
    });

    setMatchHistory((prev) => {
      const existingMatch = prev.find((m) => m.id === matchId);
      if (existingMatch) {
        return prev.map((m) => (m.id === matchId ? { ...m, winner } : m));
      }
      return [...prev, ...updatedMatches.filter((m) => m.id === matchId)];
    });

    const currentRoundIndex = rounds.findIndex(r => r.stage === currentStage);
    const currentRoundMatches = updatedMatches.filter(m => m.stage === currentStage);
    const allCompleted = currentRoundMatches.every(m => m.winner !== null || m.team1?.isBye || m.team2?.isBye);

    if (allCompleted) {
      const winners = currentRoundMatches
        .map(m => {
          if (m.team1?.isBye) return m.team2?.name;
          if (m.team2?.isBye) return m.team1?.name;
          return m.winner;
        })
        .filter(w => w !== null);

      if (winners.length === 1) {
        setTournamentWinner(winners[0]);
        setPhaseHistory((prev) => [...prev, currentStage]);
        return;
      }

      const nextRoundNumber = currentRoundIndex + 1;
      const nextStageLabel = getRoundLabel(winners.length, nextRoundNumber);

      let nextRoundMatches = updatedMatches.filter(m => m.stage === nextStageLabel);
      if (nextRoundMatches.length === 0 && winners.length >= 2) {
        nextRoundMatches = [];
        for (let i = 0; i < winners.length; i += 2) {
          const match = {
            id: `r${nextRoundNumber}-${i/2}`,
            round: nextRoundNumber,
            team1: winners[i] ? { name: winners[i] } : { name: 'BYE', isBye: true },
            team2: winners[i + 1] ? { name: winners[i + 1] } : { name: 'BYE', isBye: true },
            winner: null,
            stage: nextStageLabel
          };
          nextRoundMatches.push(match);
        }

        const newRounds = [...rounds];
        if (!newRounds[nextRoundNumber]) {
          newRounds.push({
            name: nextStageLabel,
            matches: nextRoundMatches.map(m => m.id),
            roundNumber: nextRoundNumber,
            stage: nextStageLabel
          });
        }
        updatedMatches = [...updatedMatches.filter(m => m.stage !== nextStageLabel), ...nextRoundMatches];
        setRounds(newRounds);
        setMatchHistory((prev) => [...prev, ...nextRoundMatches]);
        setPhaseHistory((prev) => [...prev, currentStage]);
      }

      const currentMatchIndex = updatedMatches
        .filter(m => m.stage === currentStage)
        .findIndex(m => m.id === matchId);

      const nextMatchIndex = Math.floor(currentMatchIndex / 2);
      const nextMatch = nextRoundMatches[nextMatchIndex];
      if (nextMatch) {
        updatedMatches = updatedMatches.map(m => {
          if (m.id === nextMatch.id) {
            const isFirstTeam = currentMatchIndex % 2 === 0;
            return {
              ...m,
              team1: isFirstTeam ? { name: winner } : m.team1 || { name: 'BYE', isBye: true },
              team2: !isFirstTeam ? { name: winner } : m.team2 || { name: 'BYE', isBye: true },
              winner: null
            };
          }
          return m;
        });
      }

      setCurrentStage(nextStageLabel);
    }

    setMatches(updatedMatches);
  };

  const handleNext = () => {
    navigate('/flowchart', {
      state: {
        teams,
        format,
        matches,
        rounds,
        currentStage,
        tournamentWinner
      }
    });
  };

  const getRoundColor = (stage) => {
    switch (stage) {
      case 'Final':
      case 'final':
        return 'bg-green-100 border-green-400';
      case 'Semifinals':
      case 'semi':
        return 'bg-purple-100 border-purple-400';
      case 'Quarterfinals':
      case 'quarter':
        return 'bg-yellow-50 border-yellow-400';
      default:
        return 'bg-blue-100 border-blue-400';
    }
  };

  const renderMatch = (match, stage) => {
    const actualMatch = matchHistory.find(m => m.id === match.id) || match;
    if (!actualMatch) {
      console.warn('Match not found:', match.id);
      return null;
    }
    const isFinalRound = stage === 'Final' || stage === 'final';
    const isCurrentRound = actualMatch?.stage === currentStage && !tournamentWinner && !isFinalRound;
    const isCompleted = actualMatch?.winner !== null;
    const hasBye = actualMatch?.team1?.isBye || actualMatch?.team2?.isBye;

    return (
      <motion.div
        key={match.id}
        className={`p-3 rounded-lg border-2 ${
          hasBye ? 'border-gray-400 bg-gray-100' :
          isFinalRound ? getRoundColor(stage) :
          isCurrentRound ? 'border-yellow-400 bg-yellow-50' :
          isCompleted ? `${getRoundColor(stage).replace('100', '200')} border-green-400` :
          getRoundColor(stage)
        } w-48`}
        whileHover={{ scale: (isCurrentRound || isFinalRound) && !hasBye && !isCompleted ? 1.05 : 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="flex flex-col items-center">
          <button
            onClick={() => {
              if (!hasBye && (isCurrentRound || isFinalRound) && !isCompleted) {
                handleMatchResult(match.id, actualMatch.team1?.name);
              }
            }}
            className={`w-full p-2 mb-1 rounded ${
              (isCurrentRound || isFinalRound) && !isCompleted && !hasBye ?
                'hover:bg-green-100 cursor-pointer' : 'cursor-default'
            } ${
              actualMatch.winner === actualMatch.team1?.name
                ? 'font-bold text-green-700 text-lg'
                : actualMatch.winner && actualMatch.winner !== actualMatch.team1?.name
                ? 'text-red-600'
                : 'text-gray-800'
            }`}
          >
            {actualMatch?.team1?.isBye ? 'BYE' : actualMatch?.team1?.name || 'TBD'}
          </button>

          <div className="text-center">vs</div>

          <button
            onClick={() => {
              if (!hasBye && (isCurrentRound || isFinalRound) && !isCompleted) {
                handleMatchResult(match.id, actualMatch.team2?.name);
              }
            }}
            className={`w-full p-2 mt-1 rounded ${
              (isCurrentRound || isFinalRound) && !isCompleted && !hasBye ?
                'hover:bg-green-100 cursor-pointer' : 'cursor-default'
            } ${
              actualMatch.winner === actualMatch.team2?.name
                ? 'font-bold text-green-700 text-lg'
                : actualMatch.winner && actualMatch.winner !== actualMatch.team2?.name
                ? 'text-red-600'
                : 'text-gray-800'
            }`}
          >
            {actualMatch?.team2?.isBye ? 'BYE' : actualMatch?.team2?.name || 'TBD'}
          </button>

          {isCompleted && (
            <div className="mt-2 text-sm font-semibold text-center text-green-700">
              Winner: {actualMatch.winner}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderKnockoutTree = () => {
    if (!rounds && !matchHistory.length) {
      return (
        <div className="text-center p-4 text-red-600">
          Error: Unable to render tournament structure
        </div>
      );
    }

    const getStageColor = (stage) => {
      switch (stage) {
        case 'Final':
        case 'final':
          return 'border-green-200 text-green-600';
        case 'Semifinals':
        case 'semi':
          return 'border-purple-200 text-purple-600';
        case 'Quarterfinals':
        case 'quarter':
          return 'border-yellow-200 text-yellow-600';
        default:
          return 'border-blue-200 text-blue-600';
      }
    };

    if (tournamentWinner && matchHistory.length) {
      const phases = [...new Set(matchHistory.map(m => m.phase || m.stage))];
      return (
        <div className="w-full max-w-4xl mx-auto space-y-12">
          {phases.map((phase, index) => (
            <div key={index} className={`bg-white p-6 rounded-xl shadow-lg border-2 ${getStageColor(phase)}`}>
              <h3 className={`text-2xl font-bold mb-4 ${getStageColor(phase).split(' ')[1]}`}>
                {phase === 'superKnockout' ? 'Super Knockout' :
                 phase === 'preQuarter' ? 'Pre-Quarter Finals' :
                 phase === 'quarter' ? 'Quarter Finals' :
                 phase === 'semi' ? 'Semi Finals' :
                 phase === 'final' ? 'Final' :
                 phase === 'qualifier1' ? 'Qualifier 1' :
                 phase === 'eliminator' ? 'Eliminator' :
                 phase === 'qualifier2' ? 'Qualifier 2' :
                 phase === 'playOff' ? 'Play Off' :
                 phase === 'eliminatorElite' ? 'Eliminator Elite' :
                 phase === 'championship' ? 'Championship' :
                 phase === 'thirdPlace' ? 'Third Place Match' :
                 phase}
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {matchHistory
                  .filter(m => (m.phase || m.stage) === phase)
                  .map(match => renderMatch(match, phase))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="w-full max-w-4xl mx-auto space-y-12">
        {rounds
          .slice()
          .sort((a, b) => a.roundNumber - b.roundNumber)
          .map((round, index) => (
            <div key={index} className={`bg-white p-6 rounded-xl shadow-lg border-2 ${getStageColor(round.stage)}`}>
              <h3 className={`text-2xl font-bold mb-4 ${getStageColor(round.stage).split(' ')[1]}`}>
                {round.name} {round.stage === currentStage && !tournamentWinner ? '(Current)' : ''}
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {round.matches.map(matchId => {
                  const match = matches.find(m => m.id === matchId);
                  return match ? renderMatch(match, round.stage) : (
                    <div key={matchId} className="p-4 rounded-lg bg-gray-50 border-2 border-gray-300">
                      <div className="flex items-center justify-between opacity-50">
                        <span className="text-gray-600">TBD</span>
                        <span className="text-gray-400 mx-4">vs</span>
                        <span className="text-gray-600">TBD</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Select Tournament Format
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleFormatSelection('knockout')}
                className={`px-6 py-3 rounded-lg text-white ${
                  format === 'knockout' ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Round Robin
              </button>
              <button
                onClick={() => handleFormatSelection('knockout')}
                className={`px-6 py-3 rounded-lg text-white ${
                  format === 'knockout' ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Knockout
              </button>
            </div>
          </div>

          {!format && (
            <div className="text-center text-gray-600">
              Please select a tournament format.
            </div>
          )}

          {format && (
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
                Tournament Flowchart (Knockout)
              </h1>

              {tournamentWinner && (
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className="bg-gradient-to-r from-yellow-400 to-white border-4 border-yellow-600 rounded-lg p-4 shadow-lg">
                      <span className="text-2xl font-bold text-gray-800">
                        🏆 Champion: {teams.find((t) => t.id === tournamentWinner)?.name || 'Unknown'} 🏆
                      </span>
                    </div>
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-3xl">
                      👑
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center">
                {renderKnockoutTree()}
              </div>

              {!tournamentWinner && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Continue to Flowchart
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Selection;