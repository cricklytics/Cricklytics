import React, { useState, useEffect, useRef  } from 'react';
import { motion } from 'framer-motion';
import FireworksCanvas from '../../components/sophita/HomePage/FireworksCanvas';
import { FaChevronDown, FaChevronUp, FaTrophy, FaHeart, FaCommentDots, FaShareAlt } from 'react-icons/fa';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { ScatterChart, Scatter, ZAxis, BarChart, Bar } from 'recharts';
import logo from '../../assets/sophita/HomePage/Picture3_2.png';
import netherland from '../../assets/sophita/HomePage/Netherland.jpeg';
import southAfrica from '../../assets/sophita/HomePage/Southafrica.png';
import trophy from '../../assets/sophita/HomePage/trophy.png';
import ipl2 from '../../assets/sophita/HomePage/ipl2.jpeg';
import ipl2022 from '../../assets/sophita/HomePage/2022.jpeg';
import ipl2025 from '../../assets/sophita/HomePage/2025.jpeg';
import ipl2019 from '../../assets/sophita/HomePage/2019.jpeg';
import ipl2019_3 from '../../assets/sophita/HomePage/2019-3.jpeg';
import ipl2021 from '../../assets/sophita/HomePage/2021.jpeg';
import ipl2020 from '../../assets/sophita/HomePage/2020.jpeg';
import ipl2018 from '../../assets/sophita/HomePage/2018.jpeg';
import advertisement1 from '../../assets/sophita/HomePage/Advertisement1.webp'
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import Startmatch from './StartmatchRR'; // Assuming this is StartmatchPlayers
import nav from '../../assets/kumar/right-chevron.png';
import placeholderFlag from '../../assets/sophita/HomePage/Netherland.jpeg'; // ADD a placeholder image (ensure this path is correct)
// TournamentSplitter
const TournamentSplitter = {
  getOptimalGroups(teamCount) {
    if (teamCount === 4) return { groupCount: 1, size: 4 };
    if (teamCount === 7) return { groupCount: 2, size: 3, removed: 1 };
    if (teamCount === 8) return { groupCount: 2, size: 4 };
    if (teamCount === 9) return { groupCount: 3, size: 3 };
    if (teamCount === 10) return { groupCount: 2, size: 5 };
    if (teamCount === 12) return { groupCount: 3, size: 4 };
    if (teamCount === 15) return { groupCount: 3, size: 5 };

    if (teamCount < 10) {
      const groupCount = teamCount <= 6 ? 2 : 3;
      const size = Math.ceil(teamCount / groupCount);
      return { groupCount, size };
    }

    const idealSizes = [15, 12, 10, 5, 4];
    const preferredGroupCounts = [3, 2];

    for (const groupCount of preferredGroupCounts) {
      for (const size of idealSizes) {
        if (teamCount === groupCount * size) {
          return { groupCount, size };
        }
      }
    }

    if (teamCount > 60) {
      for (let count = 3; count <= 6; count++) {
        const size = Math.ceil(teamCount / count);
        if (size <= 15 && teamCount / count === size) {
          return { groupCount: count, size };
        }
      }
    }

    if (isPrime(teamCount)) {
      const remainingTeams = teamCount - 1;
      const groupCount = 2;
      const size = Math.ceil(remainingTeams / groupCount);
      return { groupCount, size, removed: 1 };
    }

    for (let count = 2; count <= 3; count++) {
      const size = teamCount / count;
      if (Number.isInteger(size) && size >= 4 && size <= 15) {
        return { groupCount: count, size };
      }
    }

    const baseSize = Math.floor(teamCount / 3);
    const remainder = teamCount % 3;
    const groups = Array(3).fill(baseSize);
    for (let i = 0; i < remainder; i++) groups[i]++;
    return { groupCount: 3, groups };
  }
};

// Helper function to check if a number is prime
const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// RoundRobinScheduler
const RoundRobinScheduler = {
  generateRoundRobin(teams) {
    const numTeams = teams.length;
    const rounds = [];
    const teamIndices = Array.from({ length: numTeams }, (_, i) => i);
    
    if (numTeams % 2 === 1) {
      teamIndices.push(-1);
    }
    
    const n = teamIndices.length;
    const totalRounds = numTeams % 2 === 0 ? numTeams - 1 : numTeams;
    const playedMatches = new Set();

    for (let round = 0; round < totalRounds; round++) {
      const matches = [];
      for (let i = 0; i < n / 2; i++) {
        const t1 = teamIndices[i];
        const t2 = teamIndices[n - 1 - i];
        const matchKey = [Math.min(t1, t2), Math.max(t1, t2)].join('-');
        if (t1 !== -1 && t2 !== -1 && !playedMatches.has(matchKey)) {
          matches.push([teams[t1], teams[t2]]);
          playedMatches.add(matchKey);
        }
      }
      
      if (matches.length > 0) {
        rounds.push({
          round: round + 1,
          matches,
          bye: numTeams % 2 === 1 ? teams[teamIndices.findIndex(i => !matches.flat().map(t => t.id).includes(teams[i]?.id))] : null
        });
      }
      
      const first = teamIndices[1];
      for (let i = 1; i < n - 1; i++) {
        teamIndices[i] = teamIndices[i + 1];
      }
      teamIndices[n - 1] = first;
    }
    
    return rounds;
  }
};

// Flowchart Component
const Flowchart = ({ teams, groups, currentPhase, matches, groupResults, tournamentWinner, oddTeam, phaseHistory, currentGroupIndex, setTournamentTeams, setTournamentGroups, setTournamentMatches, setTournamentPhase, setTournamentGroupIndex, setPhaseHistory, setGroupResults }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.winner) {
      handleMatchResult(location.state);
    }
  }, [location.state]);

  const getGroupStandings = (groupIndex, phase = 'league') => {
    if (!groups[groupIndex]) return [];
    return groups[groupIndex]
      .map(team => ({
        ...team,
        ...groupResults[phase]?.[team.id] || {}
      }))
      .sort((a, b) => {
        const pointsA = b.points || 0;
        const pointsB = a.points || 0;
        if (pointsA !== pointsB) return pointsA - pointsB;
        const nrrA = b.netRunRate || 0;
        const nrrB = a.netRunRate || 0;
        if (nrrA !== nrrB) return nrrA - nrrB;
        const winsA = b.wins || 0;
        const winsB = a.wins || 0;
        if (winsA !== winsB) return winsA - winsB;
        return Math.random() - 0.5; // Random tiebreaker if all else is equal
      });
  };

  const getExpectedTeamCount = (phase) => {
    if (phase === 'league') return teams.length;
    if (phase === 'pre-quarter') return 10;
    if (phase === 'quarter') return 6;
    if (phase === 'semi') return teams.length === 7 || teams.length === 13 ? 5 : 4;
    if (phase === 'final') return 2;
    if (phase === 'winner') return 1;
    return 0;
  };

  const getQualifiedTeams = (phase) => {
    if (phase === 'league') {
      return teams.map(team => ({ ...team, name: team.name }));
    } else if (phase === 'pre-quarter') {
      if (currentPhase !== 'league') {
        return groups[0]?.map(team => ({ ...team, name: team.name })) || [];
      }
      return Array(10).fill().map((_, i) => ({
        id: `placeholder-pre-quarter-${i}`,
        name: 'Team'
      }));
    } else if (phase === 'quarter') {
      if (currentPhase === 'quarter' || currentPhase === 'semi' || currentPhase === 'final' || currentPhase === 'winner') {
        const prevPhase = phaseHistory.includes('pre-quarter') ? 'pre-quarter' : 'league';
        const teamsToAdvance = prevPhase === 'league' && groups.length > 4 && groups[0].length <= 3 ? 1 : prevPhase === 'pre-quarter' ? 3 : 2;
        const qualifiedTeams = groups.flatMap((group, groupIndex) => {
          const sorted = getGroupStandings(groupIndex, prevPhase);
          return sorted.slice(0, teamsToAdvance);
        });
        return qualifiedTeams.map(team => ({ ...team, name: team.name }));
      }
      return Array(6).fill().map((_, i) => ({ id: `placeholder-quarter-${i}`, name: 'Team' }));
    } else if (phase === 'semi') {
      if (currentPhase === 'semi' || currentPhase === 'final' || currentPhase === 'winner') {
        const prevPhase = phaseHistory.includes('quarter') ? 'quarter' : phaseHistory.includes('pre-quarter') ? 'pre-quarter' : 'league';
        const teamsToAdvance = prevPhase === 'league' && groups.length > 4 && groups[0].length <= 3 ? 1 : prevPhase === 'pre-quarter' ? 3 : prevPhase === 'quarter' ? 4 : 2;
        let qualifiedTeams = [];
        if (prevPhase === 'league' && (teams.length === 7 || teams.length === 13)) {
          qualifiedTeams = groups.flatMap((group, groupIndex) => {
            const sorted = getGroupStandings(groupIndex, prevPhase);
            return sorted.slice(0, teamsToAdvance);
          });
          return oddTeam ? [...qualifiedTeams, oddTeam].map(team => ({ ...team, name: team.name })) : qualifiedTeams.map(team => ({ ...team, name: team.name }));
        } else {
          qualifiedTeams = getGroupStandings(0, prevPhase).slice(0, teams.length === 7 || teams.length === 13 ? 5 : 4);
          return oddTeam && (teams.length === 7 || teams.length === 13) ? [...qualifiedTeams, oddTeam].map(team => ({ ...team, name: team.name })) : qualifiedTeams.map(team => ({ ...team, name: team.name }));
        }
      }
      return Array(getExpectedTeamCount('semi')).fill().map((_, i) => ({ id: `placeholder-semi-${i}`, name: 'Team' }));
    } else if (phase === 'final') {
      if (currentPhase === 'final' || currentPhase === 'winner') {
        const semiStandings = getGroupStandings(0, 'semi');
        return semiStandings.slice(0, 2).map(team => ({ ...team, name: team.name }));
      }
      return Array(2).fill().map((_, i) => ({ id: `placeholder-final-${i}`, name: 'Team' }));
    } else if (phase === 'winner') {
      if (tournamentWinner) {
        return [{ ...teams.find(t => t.id === tournamentWinner), name: teams.find(t => t.id === tournamentWinner).name }];
      }
      return [{ id: 'placeholder-winner', name: 'Team' }];
    }
    return [];
  };

  const getPhaseName = (phase) => {
    if (phase === 'league') return 'Group Stage';
    if (phase === 'pre-quarter') return 'Pre-Quarter-Final';
    if (phase === 'quarter') return 'Quarter-Final';
    if (phase === 'semi') return 'Semi-Final';
    if (phase === 'final') return 'Final';
    if (phase === 'winner') return 'Winner';
    return phase;
  };

  const renderTreeNode = (team, level, index, isOddTeam = false) => (
    <motion.div
      key={`${level}-${index}`}
      className={`p-3 m-2 rounded-lg text-center text-white ${
        isOddTeam ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' :
        level === 'league' ? 'bg-gradient-to-r from-blue-700 to-blue-500' :
        level === 'pre-quarter' ? 'bg-gradient-to-r from-teal-700 to-teal-500' :
        level === 'quarter' ? 'bg-gradient-to-r from-green-700 to-green-500' :
        level === 'semi' ? 'bg-gradient-to-r from-orange-700 to-orange-500' :
        level === 'final' ? 'bg-gradient-to-r from-purple-700 to-purple-500' :
        level === 'winner' ? 'bg-gradient-to-r from-red-700 to-red-500' :
        'bg-gradient-to-r from-gray-700 to-gray-500'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {team ? team.name : 'TBD'}
    </motion.div>
  );

  const renderTreeLevel = (teams, levelName, level, matchesInfo = null) => (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-purple-400 mb-2">{levelName}</h3>
      <div className="flex flex-wrap justify-center">
        {teams.length > 0 ? 
          teams.map((team, index) => renderTreeNode(team, level, index, team?.id === oddTeam?.id)) : 
          <div className="text-gray-400">TBD</div>
        }
      </div>
      {matchesInfo && (
        <div className="mt-2 text-sm text-gray-300 text-center">
          {matchesInfo}
        </div>
      )}
    </div>
  );

  const renderGroupDetails = (groupIndex, phase = 'league') => {
    const standings = getGroupStandings(groupIndex, phase);
    const groupMatches = matches.filter(m => m.group === groupIndex && m.phase === phase);
    const teamsToAdvance = phase === 'league' ? 
      (groups.length > 4 && groups[0].length <= 3 ? 1 : teams.length === 7 || teams.length === 13 ? 1 : teams.length === 8 || teams.length === 9 || teams.length === 15 ? 2 : 2) : 
      phase === 'pre-quarter' ? 3 : 
      phase === 'quarter' ? 4 : 
      2;

    return (
      <div className="bg-gray-800 p-6 rounded-xl mt-4">
        <button
          onClick={() => setSelectedGroup(null)}
          className="mb-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
        >
          Back to Standings
        </button>
        <h3 className="text-xl font-bold text-purple-400 mb-4">{phase === 'league' ? `Group ${groupIndex + 1}` : phase.charAt(0).toUpperCase() + phase.slice(1)} Details</h3>
        <h4 className="text-lg font-semibold text-gray-200 mb-2">Teams ({standings.length})</h4>
        <div className="mb-4">
          {standings.map((team, i) => (
            <div
              key={team.id}
              className={`p-2 rounded ${i < teamsToAdvance ? 'bg-purple-900' : 'bg-gray-700'} mb-2 ${team.id === oddTeam?.id ? 'border-2 border-yellow-400' : ''}`}
            >
              {team.name} (Points: {team.points || 0}, Wins: {team.wins || 0}, Losses: {team.losses || 0}, Matches Played: {team.matchesPlayed || 0}, NRR: {(team.netRunRate || 0).toFixed(3)})
              {i < teamsToAdvance && <span className="ml-2 text-green-400">✓ Advances</span>}
              {team.id === oddTeam?.id && phase === 'league' && <span className="ml-2 text-yellow-400">✓ Advances to {teams.length === 7 || teams.length === 13 ? 'Semi-Final' : 'Quarter-Final'}</span>}
            </div>
          ))}
        </div>
        <h4 className="text-lg font-semibold text-gray-200 mb-2">Matches</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groupMatches.map(match => (
            <div key={match.id} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className={match.winner === match.team1?.id ? 'text-green-400 font-bold' : 'text-gray-300'}>
                  {match.team1?.name || 'TBD'}
                </span>
                <span className="mx-2 text-purple-400">vs</span>
                <span className={match.winner === match.team2?.id ? 'text-green-400 font-bold' : 'text-gray-300'}>
                  {match.team2?.name || 'TBD'}
                </span>
              </div>
              {match.winner && (
                <div className="text-center mt-2 text-sm text-green-400">
                  Winner: {teams.find(t => t.id === match.winner)?.name}
                </div>
              )}
              <button
                onClick={() => {
                  navigate('/start-match-player', {
                    state: {
                      teamA: match.team1,
                      teamB: match.team2,
                      teams,
                      groups,
                      matches,
                      currentPhase,
                      currentGroupIndex,
                      oddTeam,
                      phaseHistory,
                      groupResults,
                      origin: '/match-start'
                    }
                  });
                }}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
              >
                Play Match
              </button>
            </div>
          ))}
        </div>
        <p className="mt-4 text-gray-200">
          Advancing: Top {teamsToAdvance} team{teamsToAdvance > 1 ? 's' : ''} from this {phase === 'league' ? 'group' : phase === 'pre-quarter' ? 'pre-quarter-final' : phase === 'quarter' ? 'quarter-final' : 'stage'}${oddTeam && phase === 'league' ? ` + Odd Team to ${teams.length === 7 || teams.length === 13 ? 'Semi-Final' : 'Quarter-Final'}` : ''}
        </p>
      </div>
    );
  };

  const renderPhaseStandings = (phase) => {
    if (phase === 'semi' || phase === 'final') {
      const phaseMatches = matches.filter(m => m.phase === phase);
      return (
        <div className="bg-gray-800 p-6 rounded-xl mt-4">
          <h3 className="text-xl font-bold text-purple-400 mb-4">{phase === 'semi' ? 'Semi-Final' : 'Final'} Matches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {phaseMatches.map(match => (
              <div key={match.id} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className={match.winner === match.team1?.id ? 'text-green-400 font-bold' : 'text-gray-300'}>
                    {match.team1?.name || 'TBD'}
                  </span>
                  <span className="mx-2 text-purple-400">vs</span>
                  <span className={match.winner === match.team2?.id ? 'text-green-400 font-bold' : 'text-gray-300'}>
                    {match.team2?.name || 'TBD'}
                  </span>
                </div>
                {match.winner && (
                  <div className="text-center mt-2 text-sm text-green-400">
                    Winner: {teams.find(t => t.id === match.winner)?.name}
                  </div>
                )}
                <button
                  onClick={() => {
                    navigate('/start-match-player', {
                      state: {
                        teamA: match.team1,
                        teamB: match.team2,
                        teams,
                        groups,
                        matches,
                        currentPhase,
                        currentGroupIndex,
                        oddTeam,
                        phaseHistory,
                        groupResults,
                        origin: '/match-start'
                      }
                    });
                  }}
                  className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                >
                  Play Match
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-800 p-6 rounded-xl mt-4">
        <h3 className="text-xl font-bold text-purple-400 mb-4">{phase.charAt(0).toUpperCase() + phase.slice(1)} Standings</h3>
        <table className="w-full bg-gray-800 rounded-xl shadow-xl mb-4">
          <thead>
            <tr className="text-left border-b border-purple-600">
              <th className="p-4 text-white">Team</th>
              <th className="p-4 text-white">Matches Played</th>
              <th className="p-4 text-white">Wins</th>
              <th className="p-4 text-white">Losses</th>
              <th className="p-4 text-white">NRR</th>
            </tr>
          </thead>
          <tbody>
            {(phase === 'league' && oddTeam ? teams.filter(t => t.id !== oddTeam.id) : teams).map(team => (
              <tr key={`${phase}-${team.id}`} className="border-b border-gray-700">
                <td className="p-4 text-white">{team.name}{team.id === oddTeam?.id ? ' (Odd Team)' : ''}</td>
                <td className="p-4 text-white">{team.matchesPlayed || 0}</td>
                <td className="p-4 text-white">{team.wins || 0}</td>
                <td className="p-4 text-white">{team.losses || 0}</td>
                <td className="p-4 text-white">{(team.netRunRate || 0).toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {phase === 'league' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {groups.map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedGroup(i)}
                className={`p-4 font-bold rounded-lg ${i === currentGroupIndex ? 'bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                Group {i + 1} ({groups[i].length} Teams)
              </button>
            ))}
            {oddTeam && (
              <div className="p-4 bg-yellow-600 rounded-lg text-white font-bold text-center">
                Odd Team: {oddTeam.name} (Advances to {teams.length === 7 || teams.length === 13 ? 'Semi-Final' : 'Quarter-Final'})
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setSelectedGroup(0)}
              className={`p-4 font-bold rounded-lg ${currentGroupIndex === 0 ? 'bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              {phase === 'pre-quarter' ? 'Pre-Quarter-Final' : phase === 'quarter' ? 'Quarter-Final' : 'Semi-Final'} ({groups[0]?.length} Teams)
            </button>
          </div>
        )}
      </div>
    );
  };

  const handleMatchResult = (matchData) => {
    const { winner, loser, teamANRR, teamBNRR } = matchData;
    const currentMatch = matches.find(m => m.group === currentGroupIndex && m.phase === currentPhase && !m.played);
    if (!currentMatch) return;

    const winnerId = teams.find(t => t.name === winner)?.id;
    if (!winnerId) return;

    setTournamentMatches(prevMatches => {
      const updatedMatches = prevMatches.map(match => {
        if (match.id === currentMatch.id) {
          const updated = { ...match, winner: winnerId, played: true };
          
          setTournamentTeams(prevTeams => {
            const updatedTeams = prevTeams.map(team => {
              const teamStats = groupResults[currentPhase]?.[team.id] || {};
              if (team.name === winner) {
                teamStats.wins = (teamStats.wins || 0) + 1;
                teamStats.points = (teamStats.points || 0) + 2;
                teamStats.matchesPlayed = (teamStats.matchesPlayed || 0) + 1;
                teamStats.netRunRate = team.name === currentMatch.team1.name ? teamANRR : teamBNRR;
                teamStats.runsFor = (teamStats.runsFor || 0) + 200;
                teamStats.runsAgainst = (teamStats.runsAgainst || 0) + 180;
              } else if (team.name === loser) {
                teamStats.losses = (teamStats.losses || 0) + 1;
                teamStats.matchesPlayed = (teamStats.matchesPlayed || 0) + 1;
                teamStats.netRunRate = team.name === currentMatch.team1.name ? teamANRR : teamBNRR;
                teamStats.runsFor = (teamStats.runsFor || 0) + 180;
                teamStats.runsAgainst = (teamStats.runsAgainst || 0) + 200;
              }
              return { ...team, ...teamStats };
            });
            setGroupResults(prev => {
              const updatedStats = {};
              updatedTeams.forEach(team => {
                updatedStats[team.id] = {
                  points: team.points || 0,
                  wins: team.wins || 0,
                  losses: team.losses || 0,
                  runsFor: team.runsFor || 0,
                  runsAgainst: team.runsAgainst || 0,
                  netRunRate: team.netRunRate || 0,
                  matchesPlayed: team.matchesPlayed || 0
                };
              });
              return { ...prev, [currentPhase]: updatedStats };
            });
            return updatedTeams;
          });

          return updated;
        }
        return match;
      });

      const currentGroupMatches = updatedMatches.filter(m => m.group === currentGroupIndex && m.phase === currentPhase);
      if (currentGroupMatches.every(m => m.played)) {
        if (currentGroupIndex < groups.length - 1 && currentPhase === 'league') {
          const nextGroupIndex = currentGroupIndex + 1;
          setTournamentGroupIndex(nextGroupIndex);
          setSelectedGroup(nextGroupIndex);
          setTournamentMatches(prev => [
            ...prev.filter(m => m.group !== nextGroupIndex || m.phase !== currentPhase),
            ...generateGroupMatches(groups[nextGroupIndex], nextGroupIndex, currentPhase)
          ]);
        } else {
          advanceToNextPhase();
        }
      } else if (currentPhase === 'pre-quarter') {
        if (updatedMatches.filter(m => m.phase === 'pre-quarter').every(m => m.played)) {
          initializeQuarterFinals();
        }
      } else if (currentPhase === 'quarter') {
        if (updatedMatches.filter(m => m.phase === 'quarter').every(m => m.played)) {
          initializeSemiFinals();
        }
      } else if (currentPhase === 'semi') {
        if (updatedMatches.filter(m => m.phase === 'semi').every(m => m.played)) {
          initializeFinal();
        }
      } else if (currentPhase === 'final') {
        if (updatedMatches.filter(m => m.phase === 'final').every(m => m.played)) {
          setTournamentPhase('winner');
          setTournamentWinner(winnerId);
        }
      }
      return updatedMatches;
    });
  };

  const generateGroupMatches = (groupTeams, groupIndex, phase) => {
    const rounds = RoundRobinScheduler.generateRoundRobin(groupTeams);
    return rounds.flatMap((round, roundIndex) =>
      round.matches.map((match, matchIndex) => ({
        id: `${phase}-g${groupIndex}-r${roundIndex}-m${matchIndex}`,
        team1: match[0],
        team2: match[1],
        round: roundIndex,
        group: groupIndex,
        phase,
        winner: null,
        played: false
      }))
    );
  };

  const advanceToNextPhase = () => {
    const teamCount = teams.length;
    const groupCount = groups.length;
    const groupSize = groups[0].length;
    const teamsToAdvance = groupCount > 4 && groupSize <= 3 ? 1 : teamCount === 7 || teamCount === 13 ? 1 : teamCount === 8 || teamCount === 9 || teamCount === 15 ? 2 : 2;

    if (currentPhase === 'league') {
      if (groupSize === 10) {
        const qualifiedTeams = groups.flatMap((group, groupIndex) => {
          const sorted = getGroupStandings(groupIndex, 'league');
          return sorted.slice(0, 5);
        });
        advanceToPreQuarterFinal([qualifiedTeams], 'pre-quarter');
      } else if (teamCount === 7 || teamCount === 13) {
        const qualifiedTeams = groups.flatMap((group, groupIndex) => {
          const sorted = getGroupStandings(groupIndex, 'league');
          return sorted.slice(0, teamsToAdvance);
        });
        const semiTeams = oddTeam ? [...qualifiedTeams, oddTeam] : qualifiedTeams;
        advanceToSemiFinal(semiTeams, 'semi');
      } else if (teamCount === 8 || teamCount === 9 || teamCount === 15 || (groupCount > 4 && groupSize <= 3)) {
        const qualifiedTeams = groups.flatMap((group, groupIndex) => {
          const sorted = getGroupStandings(groupIndex, 'league');
          return sorted.slice(0, teamsToAdvance);
        });
        const quarterTeams = oddTeam && teamCount !== 7 && teamCount !== 13 ? [...qualifiedTeams, oddTeam] : qualifiedTeams;
        advanceToQuarterFinal([quarterTeams], 'quarter');
      } else {
        const qualifiedTeams = groups.flatMap((group, groupIndex) => {
          const sorted = getGroupStandings(groupIndex, 'league');
          return sorted.slice(0, teamsToAdvance);
        });
        advanceToQuarterFinal([qualifiedTeams], 'quarter');
      }
    } else if (currentPhase === 'pre-quarter') {
      initializeQuarterFinals();
    } else if (currentPhase === 'quarter') {
      initializeSemiFinals();
    }
  };

  const advanceToPreQuarterFinal = (preQuarterGroups, phase) => {
    const preQuarterMatches = preQuarterGroups.flatMap((group, index) =>
      generateGroupMatches(group, index, phase)
    );
    
    setTournamentGroups(preQuarterGroups);
    setTournamentMatches(preQuarterMatches);
    setTournamentPhase(phase);
    setPhaseHistory(prev => [...prev, 'league']);
    setTournamentGroupIndex(0);
    setSelectedGroup(0);
  };

  const advanceToQuarterFinal = (quarterGroups, phase) => {
    const quarterMatches = quarterGroups.flatMap((group, index) =>
      generateGroupMatches(group, index, phase)
    );
    
    setTournamentGroups(quarterGroups);
    setTournamentMatches(quarterMatches);
    setTournamentPhase(phase);
    setPhaseHistory(prev => [...prev, phaseHistory.includes('pre-quarter') ? 'pre-quarter' : 'league']);
    setTournamentGroupIndex(0);
    setSelectedGroup(0);
  };

  const advanceToSemiFinal = (semiTeams, phase) => {
    const semiMatches = generateGroupMatches(semiTeams, 0, phase);
    
    setTournamentGroups([semiTeams]);
    setTournamentMatches(semiMatches);
    setTournamentPhase(phase);
    setPhaseHistory(prev => [...prev, phaseHistory.includes('quarter') ? 'quarter' : phaseHistory.includes('pre-quarter') ? 'pre-quarter' : 'league']);
    setTournamentGroupIndex(0);
    setSelectedGroup(0);
  };

  const initializeQuarterFinals = () => {
    const prevPhase = phaseHistory.includes('pre-quarter') ? 'pre-quarter' : 'league';
    const qualifiedTeams = getGroupStandings(0, prevPhase).slice(0, 6);
    const quarterMatches = generateGroupMatches(qualifiedTeams, 0, 'quarter');
    
    setTournamentGroups([qualifiedTeams]);
    setTournamentMatches(quarterMatches);
    setTournamentPhase('quarter');
    setPhaseHistory(prev => [...prev, prevPhase]);
    setTournamentGroupIndex(0);
    setSelectedGroup(0);
  };

  const initializeSemiFinals = () => {
    const prevPhase = phaseHistory.includes('quarter') ? 'quarter' : phaseHistory.includes('pre-quarter') ? 'pre-quarter' : 'league';
    const qualifiedTeams = getGroupStandings(0, prevPhase).slice(0, teams.length === 7 || teams.length === 13 ? 5 : 4);
    const semiMatches = generateGroupMatches(qualifiedTeams, 0, 'semi');
    
    setTournamentGroups([qualifiedTeams]);
    setTournamentMatches(semiMatches);
    setTournamentPhase('semi');
    setPhaseHistory(prev => [...prev, prevPhase]);
    setTournamentGroupIndex(0);
    setSelectedGroup(0);
  };

  const initializeFinal = () => {
    const semiStandings = getGroupStandings(0, 'semi');
    const finalTeams = semiStandings.slice(0, 2);
    
    const finalMatch = [{
      id: 'final',
      team1: finalTeams[0],
      team2: finalTeams[1],
      round: 0,
      phase: 'final',
      winner: null,
      played: false
    }];
    
    setTournamentGroups([finalTeams]);
    setTournamentMatches(finalMatch);
    setTournamentPhase('final');
    setPhaseHistory(prev => [...prev, 'semi']);
    setTournamentGroupIndex(0);
    setSelectedGroup(0);
  };

  const getPhases = () => {
    const teamCount = teams.length;
    const groupCount = groups.length;
    const groupSize = groups[0]?.length || 0;
    if (groupSize === 10) {
      return ['league', 'pre-quarter', 'quarter', 'semi', 'final', 'winner'];
    } else if (teamCount === 7 || teamCount === 13 || (groupCount > 4 && groupSize <= 3)) {
      return ['league', 'semi', 'final', 'winner'];
    } else if (teamCount === 8 || teamCount === 9 || teamCount === 15) {
      return ['league', 'quarter', 'semi', 'final', 'winner'];
    }
    return ['league', 'quarter', 'semi', 'final', 'winner'];
  };

  const phases = getPhases();

  const levels = phases.map(phase => ({
    teams: getQualifiedTeams(phase),
    name: getPhaseName(phase),
    key: phase,
    matchesInfo: phase === 'league' ? `Groups: ${groups.map((_, i) => `Group ${i + 1} (${getGroupStandings(i).length} teams)`).join(', ')}${oddTeam ? `, Odd Team advances to ${teams.length === 7 || teams.length === 13 ? 'Semi-Final' : 'Quarter-Final'}` : ''}` :
                 phase === 'pre-quarter' ? '10 teams' :
                 phase === 'quarter' ? '6 teams' :
                 phase === 'semi' ? (teams.length === 7 || teams.length === 13 ? 'Top teams from League + Odd Team' : (teams.length === 8 || teams.length === 9 || teams.length === 15) ? 'Top teams from Quarter-Final' : 'Top teams from League') :
                 phase === 'final' ? 'Top 2 teams from Semi-Final' :
                 phase === 'winner' ? 'Tournament Champion' : ''
  }));

  const [activeTab, setActiveTab] = useState('standings');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedStandingsPhase, setSelectedStandingsPhase] = useState('league');

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6 text-purple-400">Tournament Flowchart</h2>
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab('standings')}
          className={`px-4 py-2 ${activeTab === 'standings' ? 'bg-purple-600' : 'bg-gray-700'} rounded-lg`}
        >
          Standings
        </button>
        <button
          onClick={() => setActiveTab('flowchart')}
          className={`px-4 py-2 ${activeTab === 'flowchart' ? 'bg-purple-600' : 'bg-gray-700'} rounded-lg`}
        >
          Flowchart
        </button>
      </div>
      {activeTab === 'flowchart' && (
        levels.length > 0 ? levels.map(level => renderTreeLevel(level.teams, level.name, level.key, level.matchesInfo)) : (
          <div className="text-gray-400 text-center">No rounds played yet</div>
        )
      )}
      {activeTab === 'standings' && (
        selectedGroup === null ? (
          <div>
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Tournament Standings</h2>
            <div className="flex gap-4 mb-4">
              {phases.filter(phase => phaseHistory.includes(phase) || phase === 'league').map(phase => (
                <button
                  key={phase}
                  onClick={() => setSelectedStandingsPhase(phase)}
                  className={`px-4 py-2 ${selectedStandingsPhase === phase ? 'bg-purple-600' : 'bg-gray-700'} hover:bg-purple-700 rounded-lg`}
                >
                  {getPhaseName(phase)}
                </button>
              ))}
            </div>
            {renderPhaseStandings(selectedStandingsPhase)}
          </div>
        ) : (
          renderGroupDetails(selectedGroup, selectedStandingsPhase)
        )
      )}
    </div>
  );
};

// IPLCards Component
const IPLCards = ({ setActiveTab }) => {
  const cards = [
    {
      image: ipl2,
      videoUrl: "https://www.youtube.com/embed/AFEZzf9_EHk?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0",
      title: "Rohit Sharma Hits 140!",
      alt: "Cricket Match 1",
    },
    { image: ipl2022, alt: "Cricket Match 1" },
    { image: ipl2025, alt: "Cricket Match 3" },
    { image: ipl2019, alt: "Cricket Match 1" },
    { image: ipl2019_3, alt: "Cricket Match 2" },
    { image: ipl2021, alt: "Cricket Match 3" },
    { image: ipl2020, alt: "kMatch 1" },
    { image: ipl2018, alt: "Cricket Match 2" },
    { image: advertisement1, alt: "Cricket Match 3" },
  ];

  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handlePhotoUploadClick = () => {
    photoInputRef.current.click();
  };

  const handleVideoUploadClick = () => {
    videoInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      console.log("Uploaded files:", files);
    }
    event.target.value = null;
  };

  const handleNextClick = () => {
    setActiveTab('Match Analytics');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 py-0">
      <div className="flex justify-center gap-6 mb-6 w-full max-w-md">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-lg"
          onClick={handlePhotoUploadClick}>Upload Photo
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-lg"
          onClick={handleVideoUploadClick}>Upload Video
        </button>
        <motion.button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-sm sm:text-base flex-1"
          onClick={handleNextClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next
        </motion.button>
        <input
          type="file"
          accept="image/*"
          ref={photoInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          type="file"
          accept="video/*"
          ref={videoInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={card.image}
              alt={card.alt}
              className="w-[300px] h-[220px] object-cover"
            />
            <div className="flex justify-around items-center w-full py-3">
              <FaHeart className="text-red-500 text-2xl cursor-pointer" />
              <FaCommentDots className="text-black text-2xl cursor-pointer" />
              <FaShareAlt className="text-black text-2xl cursor-pointer" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// WormGraph Component
const WormGraph = () => {
  const data = [
    { over: 1, runs: 5 },
    { over: 2, runs: 15 },
    { over: 3, runs: 25 },
    { over: 4, runs: 35 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
        <XAxis dataKey="over" stroke="#cbd5e0" />
        <YAxis stroke="#cbd5e0" />
        <Tooltip contentStyle={{ backgroundColor: "#374151", color: "#fff" }} />
        <Line type="monotone" dataKey="runs" stroke="#ffc658" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

// WagonWheelChart Component
const WagonWheelChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
      <CartesianGrid stroke="#4a5568" />
      <XAxis type="number" dataKey="distance" name="Distance" domain={[0, 10]} stroke="#cbd5e0" />
      <YAxis type="number" dataKey="angle" name="Angle" domain={[0, 360]} stroke="#cbd5e0" />
      <Tooltip contentStyle={{ backgroundColor: '#374151', color: '#fff' }} />
      <Scatter data={data} fill="#8884d8" />
    </ScatterChart>
  </ResponsiveContainer>
);

// BatsmanHeatmapChart Component
const BatsmanHeatmapChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
      <CartesianGrid stroke="#4a5568" />
      <XAxis type="number" dataKey="x" name="Pitch X" domain={[0, 5]} stroke="#cbd5e0" />
      <YAxis type="number" dataKey="y" name="Pitch Y" domain={[0, 5]} stroke="#cbd5e0" />
      <ZAxis type="number" dataKey="intensity" range={[0, 100]} />
      <Tooltip contentStyle={{ backgroundColor: '#374151', color: '#fff' }} />
      <Scatter data={data} fill="#ffc658" />
    </ScatterChart>
  </ResponsiveContainer>
);

// BowlerHeatmapChart Component
const BowlerHeatmapChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
      <CartesianGrid stroke="#4a5568" />
      <XAxis type="number" dataKey="x" name="Pitch X" domain={[0, 5]} stroke="#cbd5e0" />
      <YAxis type="number" dataKey="y" name="Pitch Y" domain={[0, 5]} stroke="#cbd5e0" />
      <ZAxis type="number" dataKey="intensity" range={[0, 100]} />
      <Tooltip contentStyle={{ backgroundColor: '#374151', color: '#fff' }} />
      <Scatter data={data} fill="#82ca9d" />
    </ScatterChart>
  </ResponsiveContainer>
);

// FallOfWicketsChart Component
const FallOfWicketsChart = () => {
  const data = [
    { over: 5, wickets: 1 },
    { over: 12, wickets: 2 },
    { over: 18, wickets: 3 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
        <XAxis dataKey="over" stroke="#cbd5e0" />
        <YAxis stroke="#cbd5e0" />
        <Tooltip contentStyle={{ backgroundColor: "#374151", color: "#fff" }} />
        <Bar dataKey="wickets" fill="#d9534f" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// FallOfWicketsDetails Component
const FallOfWicketsDetails = () => {
  const data = [
    { wicket: 1, batsman: 'Player A', bowler: 'Bowler X', over: 5, score: 30 },
    { wicket: 2, batsman: 'Player B', bowler: 'Bowler Y', over: 12, score: 65 },
    { wicket: 3, batsman: 'Player C', bowler: 'Bowler Z', over: 18, score: 95 },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Wicket</th>
            <th className="px-4 py-2 text-left">Batsman</th>
            <th className="px-4 py-2 text-left">Bowler</th>
            <th className="px-4 py-2 text-left">Over</th>
            <th className="px-4 py-2 text-left">Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((item) => (
            <tr key={item.wicket}>
              <td className="px-4 py-2">{item.wicket}</td>
              <td className="px-4 py-2">{item.batsman}</td>
              <td className="px-4 py-2">{item.bowler}</td>
              <td className="px-4 py-2">{item.over}</td>
              <td className="px-4 py-2">{item.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// FixtureGenerator Component
const FixtureGenerator = () => {
  const [selectedTeamA, setSelectedTeamA] = useState('');
  const [selectedTeamB, setSelectedTeamB] = useState('');
  const [liveTeamA, setLiveTeamA] = useState({ name: 'Team A', flag: placeholderFlag, score: '0/0', overs: '(0.0)' });
  const [liveTeamB, setLiveTeamB] = useState({ name: 'Team B', flag: placeholderFlag, score: '0/0', overs: '(0.0)' });
  const [winningCaption, setWinningCaption] = useState('');
  const [activeTab, setActiveTab] = useState('Fixture Generator');
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState('scorecard');
  const [generatedFixtures, setGeneratedFixtures] = useState([]);
  const [showFixtures, setShowFixtures] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [matchResultWinner, setMatchResultWinner] = useState(null);
  const [matchResultScore, setMatchResultScore] = useState(null);
  const [matchResultOutcount, setMatchResultOutcount] = useState(null);
  const [cameFromSidebar, setCameFromSidebar] = useState(false);

  const [incomingTournamentState, setIncomingTournamentState] = useState({
    teamA: location.state?.teamA || null,
    teamB: location.state?.teamB || null,
    teams: location.state?.teams || [],
    groups: location.state?.groups || [],
    matches: location.state?.matches || [],
    currentPhase: location.state?.currentPhase || 'league',
    currentGroupIndex: location.state?.currentGroupIndex || 0,
    oddTeam: location.state?.oddTeam || null,
    phaseHistory: location.state?.phaseHistory || [],
    groupResults: location.state?.groupResults || {},
    winner: location.state?.winner || null,
    loser: location.state?.loser || null,
    playedwicket: location.state?.playedwicket || null,
    targetScore: location.state?.targetScore || null,
    playerScore: location.state?.playerScore || null,
    outCount: location.state?.outCount || null,
    teamANRR: location.state?.teamANRR || null,
    teamBNRR: location.state?.teamBNRR || null,
    origin: location.state?.origin || '/tournament-bracket'
  });

  const [localTournamentTeams, setLocalTournamentTeams] = useState(location.state?.teams || []);
  const [localTournamentGroups, setLocalTournamentGroups] = useState(location.state?.groups || []);
  const [localTournamentMatches, setLocalTournamentMatches] = useState(location.state?.matches || []);
  const [localTournamentPhase, setLocalTournamentPhase] = useState(location.state?.currentPhase || 'league');
  const [localTournamentGroupIndex, setLocalTournamentGroupIndex] = useState(location.state?.currentGroupIndex || 0);
  const [localTournamentWinner, setLocalTournamentWinner] = useState(null);
  const [localOddTeam, setLocalOddTeam] = useState(location.state?.oddTeam || null);
  const [localPhaseHistory, setLocalPhaseHistory] = useState(location.state?.phaseHistory || []);
  const [localGroupResults, setLocalGroupResults] = useState(location.state?.groupResults || {});

  const teamsFromTournament = location.state?.selectedTeams || [];

  useEffect(() => {
    if (location.state) {
      setIncomingTournamentState({
        teams: location.state.teams || [],
        groups: location.state.groups || [],
        matches: location.state.matches || [],
        currentPhase: location.state.currentPhase || 'league',
        currentGroupIndex: location.state.currentGroupIndex || 0,
        oddTeam: location.state.oddTeam || null,
        phaseHistory: location.state.phaseHistory || [],
        groupResults: location.state.groupResults || {},
        winner: location.state.winner || null,
        loser: location.state.loser || null,
        teamANRR: location.state.teamANRR || null,
        teamBNRR: location.state.teamBNRR || null,
        origin: location.state.origin || '/tournament-bracket'
      });

      if (location.state.activeTab) {
        setActiveTab(location.state.activeTab);
      }
      if (location.state.winner) {
        setMatchResultWinner(location.state.winner);
        setMatchResultScore(location.state.targetScore);
        setMatchResultOutcount(location.state.outcount);
        setWinningCaption(location.state.winningDifference || `${location.state.winner} won by ${location.state.targetScore}/${location.state.outcount}`);
        setActiveTab('Match Results');
      }
      if (location.state.teamA && location.state.teamB) {
        setLiveTeamA({
          name: location.state.teamA.name,
          flag: location.state.teamA.flagUrl || placeholderFlag,
          score: `${location.state.teamA.score}/${location.state.teamA.wickets}`,
          overs: location.state.teamA.balls ? `(${Math.floor(location.state.teamA.balls / 6)}.${location.state.teamA.balls % 6} overs)` : '(0.0 overs)'
        });
        setLiveTeamB({
          name: location.state.teamB.name,
          flag: location.state.teamB.flagUrl || placeholderFlag,
          score: `${location.state.teamB.score}/${location.state.teamB.wickets}`,
          overs: location.state.teamB.balls ? `(${Math.floor(location.state.teamB.balls / 6)}.${location.state.teamB.balls % 6} overs)` : '(0.0 overs)'
        });
      } else if (location.state.teamA) {
        setLiveTeamA(prevState => ({
          ...prevState,
          name: location.state.teamA.name,
          flag: location.state.teamA.flagUrl || placeholderFlag,
        }));
      } else if (location.state.teamB) {
        setLiveTeamB(prevState => ({
          ...prevState,
          name: location.state.teamB.name,
          flag: location.state.teamB.flagUrl || placeholderFlag,
        }));
      }

      setLocalTournamentTeams(location.state.teams || []);
      setLocalTournamentGroups(location.state.groups || []);
      setLocalTournamentMatches(location.state.matches || []);
      setLocalTournamentPhase(location.state.currentPhase || 'league');
      setLocalTournamentGroupIndex(location.state.currentGroupIndex || 0);
      setLocalOddTeam(location.state.oddTeam || null);
      setLocalPhaseHistory(location.state.phaseHistory || []);
      setLocalGroupResults(location.state.groupResults || {});
    }
  }, [location.state]);

  const handleTeamsSelected = (teamAData, teamBData) => {
    setLiveTeamA({
      name: teamAData.name,
      flag: teamAData.flagUrl,
      score: teamAData.score || '0/0',
      overs: teamAData.overs || '(0.0)'
    });
    setLiveTeamB({
      name: teamBData.name,
      flag: teamBData.flagUrl,
      score: teamBData.score || '0/0',
      overs: teamBData.overs || '(0.0)'
    });
  };

  const defaultTeams = ['India', 'Australia', 'England', 'Pakistan', 'New Zealand', 'Netherlands', 'South Africa'];
  const availableTeams = teamsFromTournament.length > 0 ? teamsFromTournament : defaultTeams;

  const runsComparisonData = [
    { over: 1, teamA: 5, teamB: 6 },
    { over: 2, teamA: 15, teamB: 10 },
    { over: 3, teamA: 25, teamB: 20 },
    { over: 4, teamA: 35, teamB: 30 },
  ];

  const wagonWheelData = [
    { distance: 3, angle: 45 },
    { distance: 5, angle: 90 },
    { distance: 7, angle: 135 },
  ];

  const batsmanHeatmapData = [
    { x: 1, y: 2, intensity: 50 },
    { x: 2, y: 3, intensity: 80 },
    { x: 3, y: 1, intensity: 30 },
  ];

  const bowlerHeatmapData = [
    { x: 1, y: 4, intensity: 70 },
    { x: 2, y: 3, intensity: 60 },
    { x: 3, y: 2, intensity: 40 },
  ];

  const generateFixtures = () => {
    if (!selectedTeamA || !selectedTeamB) {
      alert('Please select both teams');
      return;
    }
    if (selectedTeamA === selectedTeamB) {
      alert('Please select different teams for the fixture');
      return;
    }

    const newFixture = {
      id: Date.now(),
      teamA: selectedTeamA,
      teamB: selectedTeamB,
      date: new Date().toISOString()
    };

    setGeneratedFixtures([...generatedFixtures, newFixture]);
    setShowFixtures(true);
  };

  const handleFixtureNextClick = () => {
    setActiveTab('Start Match');
  };

  const handleBack = () => {
    if (cameFromSidebar) {
      navigate(-1);
    } else {
      switch (activeTab) {
        case 'Fixture Generator':
          navigate('/TournamentPage');
          break;
        case 'Start Match':
          setActiveTab('Fixture Generator');
          break;
        case 'Live Score':
          setActiveTab('Start Match');
          break;
        case 'Match Results':
          setActiveTab('Live Score');
          break;
        case 'Flowchart':
          setActiveTab('Match Results');
          break;
        case 'Highlights':
          setActiveTab('Flowchart');
          break;
        case 'Match Analytics':
          setActiveTab('Highlights');
          break;
        default:
          navigate(-1);
          break;
      }
    }
  };

  const allTabs = ['Fixture Generator', 'Start Match', 'Live Score', 'Match Results', 'Flowchart', 'Highlights', 'Match Analytics'];
  const tabsExceptFixtureGenerator = cameFromSidebar && (activeTab === 'Start Match' || activeTab === 'Live Score' || activeTab === 'Match Results' || activeTab === 'Flowchart' || activeTab === 'Highlights' || activeTab === 'Match Analytics')
    ? ['Start Match', 'Live Score', 'Match Results', 'Flowchart', 'Highlights', 'Match Analytics']
    : allTabs;

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-green-400 via-blue-400 to-blue-200 overflow-x-hidden">
      <header className="w-screen shadow-md">
        <div className="w-full max-w-7xl py-4 flex justify-between items-center mx-auto">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center">
              <motion.img
                src={logo}
                alt="Cricklytics Logo"
                className="h-7 w-7 md:h-10 object-contain block select-none"
                whileHover={{ scale: 1.05 }}
              />
              <h1 className="text-2xl font-bold text-gray-800 pl-3">Cricklytics</h1>
            </div>
            <img
              src={nav}
              alt="Back"
              loading="lazy"
              className="w-10 h-10 -scale-x-100 cursor-pointer mt-[5px] ml-[5px]"
              onClick={handleBack}
            />
          </div>
          <div className="flex items-center overflow-x-auto mt-8 md:mt-8 -ml-20 md:-ml-20">
            <ul className="flex gap-x-2 sm:gap-x-3 md:gap-x-4 lg:gap-x-5">
              {tabsExceptFixtureGenerator.map((tab) => (
                <li key={tab} className="flex-shrink-0">
                  <button
                    className={`py-2 px-3 rounded-lg transition whitespace-nowrap text-sm sm:text-base ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white font-semibold shadow-md'
                        : 'bg-gray-100 text-black hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {activeTab === 'Start Match' ? (
        <Startmatch
          initialTeamA={incomingTournamentState.teamA}
          initialTeamB={incomingTournamentState.teamB}
          origin="/match-start"
          onTeamsSelectedForLiveScore={handleTeamsSelected}
          setActiveTab={setActiveTab}
          teams={incomingTournamentState.teams}
          groups={incomingTournamentState.groups}
          matches={incomingTournamentState.matches}
          currentPhase={incomingTournamentState.currentPhase}
          currentGroupIndex={incomingTournamentState.currentGroupIndex}
          oddTeam={incomingTournamentState.oddTeam}
          phaseHistory={incomingTournamentState.phaseHistory}
          groupResults={incomingTournamentState.groupResults}
          winner={incomingTournamentState.winner}
          loser={incomingTournamentState.loser}
          teamANRR={incomingTournamentState.teamANRR}
          teamBNRR={incomingTournamentState.teamBNRR}
        />
      ) : (
        <main className="w-full max-w-7xl px-4 sm:px-8 py-8 mx-auto">
          {activeTab === 'Fixture Generator' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Fixture Generator</h2>
              <div className="w-full flex flex-col md:flex-row gap-4 sm:gap-6 mb-8 sm:mb-10">
                <div className="flex-1 min-w-0">
                  <label className="block text-gray-700 mb-2 font-medium">Select Team</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                    value={selectedTeamA}
                    onChange={(e) => setSelectedTeamA(e.target.value)}
                  >
                    <option value="">Select Team</option>
                    {availableTeams.map(teamName => (
                      <option key={`teamA-${teamName}`} value={teamName}>{teamName}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-gray-700 mb-2 font-medium">Opponent Team</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                    value={selectedTeamB}
                    onChange={(e) => setSelectedTeamB(e.target.value)}
                  >
                    <option value="">Select Team</option>
                    {availableTeams.filter(t => t !== selectedTeamA).map(teamName => (
                      <option key={`teamB-${teamName}`} value={teamName}>{teamName}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <motion.button
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-purple-700 transition-all"
                    onClick={generateFixtures}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Generate Fixtures
                  </motion.button>
                </div>
              </div>
              {showFixtures && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 overflow-x-auto"
                >
                  <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Tournament Fixtures</h3>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {generatedFixtures.map((fixture) => (
                        <motion.div
                          key={fixture.id}
                          className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 shadow-sm"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">{fixture.teamA}</span>
                            <span className="mx-2 text-gray-500">vs</span>
                            <span className="font-medium text-gray-800">{fixture.teamB}</span>
                          </div>
                          <div className="mt-2 flex justify-between text-sm text-gray-500">
                            <span>Date: TBD</span>
                            <span>Venue: TBD</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="w-full flex justify-end mt-8">
                    <motion.button
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleFixtureNextClick}
                    >
                      Next
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'Live Score' && (
            <div className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6">
                  <h3 className="text-2xl font-bold">ICC Cricket World Cup</h3>
                  <p className="text-sm opacity-90 mt-1">Today • 10:30 AM • Wankhede Stadium, Mumbai</p>
                </div>
                <div className="p-6 bg-gray-50">
                  <div className="flex justify-around items-center mb-6">
                    <motion.div
                      className="text-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-20 h-20 mx-auto mb-2 bg-gray-200 rounded-full overflow-hidden shadow-md">
                        <img
                          src={liveTeamA.flag || placeholderFlag}
                          alt={`${liveTeamA.name || 'Team A'} Flag`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h4 className="font-bold text-xl text-gray-800">{liveTeamA.name || 'Team A'}</h4>
                      <p className="text-3xl font-extrabold text-blue-700 mt-1">{liveTeamA.score || '0価値0'}</p>
                      <p className="text-sm text-gray-600">{liveTeamA.overs || '(0.0 overs)'}</p>
                    </motion.div>
                    <div className="text-3xl font-bold text-gray-600 px-6">vs</div>
                    <motion.div
                      className="text-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-20 h-20 mx-auto mb-2 bg-gray-200 rounded-full overflow-hidden shadow-md">
                        <img
                          src={liveTeamB.flag || placeholderFlag}
                          alt={`${liveTeamB.name || 'Team B'} Flag`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h4 className="font-bold text-xl text-gray-800">{liveTeamB.name || 'Team B'}</h4>
                      <p className="text-3xl font-extrabold text-green-700 mt-1">{liveTeamB.score || '0/0'}</p>
                      <p className="text-sm text-gray-600">{liveTeamB.overs || '(0.0 overs)'}</p>
                    </motion.div>
                  </div>
                  <motion.div
                    className="bg-white p-5 rounded-xl shadow-inner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-700 font-medium">Match Status:</span>
                      {winningCaption ? (
                        <motion.span
                          className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          {winningCaption}
                        </motion.span>
                      ) : (
                        <motion.span
                          className="bg-green-400 text-black px-4 py-1 rounded-full text-sm font-semibold"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          Live
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === 'Match Results' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full min-h-[60vh] rounded-xl shadow-lg flex flex-col bg-white items-center justify-center overflow-hidden"
              style={{ background: 'linear-gradient(to bottom right, #ffe4e6, #ffc1cc)' }}
            >
              <FireworksCanvas />
              <div className="absolute top-4 right-4 z-30">
                <motion.button
                  onClick={() => setActiveTab('Flowchart')}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-md transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next
                </motion.button>
              </div>
              <div className="relative z-20 text-center p-8">
                {matchResultWinner && matchResultWinner !== 'Tie' && (
                  <div className="mb-4">
                    {liveTeamA.name === matchResultWinner && liveTeamA.flag && (
                      <img
                        src={liveTeamA.flag}
                        alt={`${liveTeamA.name} Flag`}
                        className="w-24 h-24 mx-auto object-cover shadow-lg"
                      />
                    )}
                    {liveTeamB.name === matchResultWinner && liveTeamB.flag && (
                      <img
                        src={liveTeamB.flag}
                        alt={`${liveTeamB.name} Flag`}
                        className="w-24 h-24 mx-auto object-cover shadow-lg"
                      />
                    )}
                  </div>
                )}
                <img
                  src={trophy}
                  alt="Trophy"
                  className="w-[300px] h-auto mb-8 drop-shadow-lg mx-auto"
                />
                {matchResultWinner && matchResultWinner !== 'Tie' && (
                  <h1 className="text-4xl text-green-400 font-bold drop-shadow-[0_0_10px_#22c55e]">
                    {matchResultWinner} won the match! {matchResultScore}/{matchResultOutcount}
                  </h1>
                )}
                {matchResultWinner === 'Tie' && (
                  <h1 className="text-xl text-green-400 font-bold drop-shadow-[0_0_10px_#22c55e]">
                    The match was a Tie!
                  </h1>
                )}
                {!matchResultWinner && (
                  <p>No match results available yet.</p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'Flowchart' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full min-h-[60vh] rounded-xl shadow-lg flex flex-col bg-white items-center justify-center overflow-hidden"
            >
              <div className="absolute top-4 right-4 z-30 flex gap-4">
                <motion.button
                   onClick={() => setActiveTab('Start Match')}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow-md transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to Chart
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab('Highlights')}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-md transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next
                </motion.button>
              </div>
              <div className="relative z-20 p-8 w-full">
                <Flowchart
                  teams={localTournamentTeams}
                  groups={localTournamentGroups}
                  currentPhase={localTournamentPhase}
                  matches={localTournamentMatches}
                  groupResults={localGroupResults}
                  tournamentWinner={localTournamentWinner}
                  oddTeam={localOddTeam}
                  phaseHistory={localPhaseHistory}
                  currentGroupIndex={localTournamentGroupIndex}
                  setTournamentTeams={setLocalTournamentTeams}
                  setTournamentGroups={setLocalTournamentGroups}
                  setTournamentMatches={setLocalTournamentMatches}
                  setTournamentPhase={setLocalTournamentPhase}
                  setTournamentGroupIndex={setLocalTournamentGroupIndex}
                  setPhaseHistory={setLocalPhaseHistory}
                  setGroupResults={setLocalGroupResults}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'Highlights' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <IPLCards setActiveTab={setActiveTab} />
            </motion.div>
          )}

          {activeTab === 'Match Analytics' && (
            <div className="rounded-lg p-6 text-white">
              <div className="flex border-b border-gray-700 mb-6">
                <button
                  className={`py-2 px-4 mr-2 ${activeAnalyticsTab === 'scorecard' ? 'border-b-2 border-yellow-500 font-semibold' : 'text-black'}`}
                  onClick={() => setActiveAnalyticsTab('scorecard')}
                >
                  Scorecard
                </button>
                <button
                  className={`py-2 px-4 mr-2 ${activeAnalyticsTab === 'wagonwheel' ? 'border-b-2 border-yellow-500 font-semibold' : 'text-black'}`}
                  onClick={() => setActiveAnalyticsTab('wagonwheel')}
                >
                  Wagon Wheel & Heat Map
                </button>
                <button
                  className={`py-2 px-4 ${activeAnalyticsTab === 'fallofwickets' ? 'border-b-2 border-yellow-500 font-semibold' : 'text-black'}`}
                  onClick={() => setActiveAnalyticsTab('fallofwickets')}
                >
                  Fall of Wickets
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeAnalyticsTab === 'scorecard' && (
                  <>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">Worm Graph</h3>
                      <WormGraph />
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">Bowling Economy</h3>
                      <div className="h-48 bg-gray-600 rounded flex items-end justify-around p-4">
                        <div className="bg-teal-500 h-1/3 w-1/5 rounded-t-md"></div>
                        <div className="bg-teal-500 h-2/3 w-1/5 rounded-t-md"></div>
                        <div className="bg-teal-500 h-1/2 w-1/5 rounded-t-md"></div>
                        <div className="bg-teal-500 h-full w-1/5 rounded-t-md"></div>
                      </div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 md:col-span-2">
                      <h3 className="text-lg font-semibold mb-4">Runs Comparison</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={runsComparisonData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                          <XAxis dataKey="over" stroke="#cbd5e0" />
                          <YAxis stroke="#cbd5e0" />
                          <Tooltip contentStyle={{ backgroundColor: "#374151", color: "#fff" }} />
                          <Legend wrapperStyle={{ color: "#fff" }} />
                          <Line type="monotone" dataKey="teamA" stroke="#ffc658" strokeWidth={2} />
                          <Line type="monotone" dataKey="teamB" stroke="#a4add3" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}
                {activeAnalyticsTab === 'wagonwheel' && (
                  <>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">Wagon Wheel</h3>
                      <WagonWheelChart data={wagonWheelData} />
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">Batsman Heatmap</h3>
                      <BatsmanHeatmapChart data={batsmanHeatmapData} />
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 md:col-span-2">
                      <h3 className="text-lg font-semibold mb-4">Bowler Heatmap</h3>
                      <BowlerHeatmapChart data={bowlerHeatmapData} />
                    </div>
                  </>
                )}
                {activeAnalyticsTab === 'fallofwickets' && (
                  <>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">Fall of Wickets Chart</h3>
                      <FallOfWicketsChart />
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">Fall of Wickets Details</h3>
                      <FallOfWicketsDetails />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default FixtureGenerator;