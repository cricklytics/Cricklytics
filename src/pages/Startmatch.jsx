import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import logo from '../assets/pawan/PlayerProfile/picture-312.png';
import bgImg from '../assets/sophita/HomePage/advertisement5.jpeg';

// TournamentSplitter logic
const TournamentSplitter = {
  getOptimalGroups(teamCount) {
    if (teamCount === 4) return { groupCount: 1, size: 4 };
    if (teamCount === 7) return { groupCount: 2, size: 3, removed: 1 };
    if (teamCount === 9) return { groupCount: 3, size: 3 };
    if (teamCount === 10) return { groupCount: 2, size: 5 };
    if (teamCount === 15) return { groupCount: 3, size: 5 };
    if (teamCount === 8) return { groupCount: 2, size: 4 };
    if (teamCount === 12) return { groupCount: 3, size: 4 };
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

    for (let count = 2; count <= 3; count++) {
      const size = teamCount / count;
      if (Number.isInteger(size) && size >= 4 && size <= 15) {
        return { groupCount: count, size };
      }
    }

    if (((teamCount - 1) % 2 === 0 || (teamCount - 1) % 3 === 0)) {
      const remainingTeams = teamCount - 1;
      for (const count of [2, 3]) {
        const size = remainingTeams / count;
        if (Number.isInteger(size) && size >= 3 && size <= 15) {
          return { groupCount: count, size, removed: 1 };
        }
      }
    }

    const baseSize = Math.floor(teamCount / 3);
    const remainder = teamCount % 3;
    const groups = Array(3).fill(baseSize);
    for (let i = 0; i < remainder; i++) groups[i]++;
    return { groupCount: 3, groups };
  }
};

// RoundRobinScheduler logic
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

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Flowchart Component
const Flowchart = ({ teams, groups, currentPhase, matches, groupResults, tournamentWinner, oddTeam, phaseHistory }) => {
  const navigate = useNavigate();

  const getGroupStandings = (groupIndex, phase = 'league') => {
    if (!groups[groupIndex]) return [];
    return groups[groupIndex]
      .map(team => ({
        ...team,
        ...groupResults[phase]?.[team.id] || {}
      }))
      .sort((a, b) => (b.points || 0) - (a.points || 0) || (b.netRunRate || 0) - (a.netRunRate || 0) || (b.wins || 0) - (a.wins || 0));
  };

  const getExpectedTeamCount = (phase) => {
    if (phase === 'league') {
      return teams.length;
    } else if (phase === 'quarter') {
      if (teams.length === 7) {
        const splitResult = TournamentSplitter.getOptimalGroups(teams.length);
        const groupCount = splitResult.groups ? splitResult.groups.length : splitResult.groupCount;
        return groupCount * 2 + (splitResult.removed ? 1 : 0);
      }
      const splitResult = TournamentSplitter.getOptimalGroups(teams.length);
      const groupCount = splitResult.groups ? splitResult.groups.length : splitResult.groupCount;
      const teamsPerGroup = teams.length === 9 ? 2 : 3;
      return groupCount * teamsPerGroup + (splitResult.removed ? 1 : 0);
    } else if (phase === 'super') {
      const splitResult = TournamentSplitter.getOptimalGroups(teams.length);
      const groupCount = splitResult.groups ? splitResult.groups.length : splitResult.groupCount;
      const teamsPerGroup = teams.length === 9 ? 2 : 3;
      return groupCount * teamsPerGroup + (splitResult.removed ? 1 : 0);
    } else if (phase === 'semi') {
      return teams.length === 4 || teams.length === 7 || teams.length === 8 ? 4 : getExpectedTeamCount('quarter') > 4 ? 4 : 0;
    } else if (phase === 'final') {
      return 2;
    } else if (phase === 'winner') {
      return 1;
    }
    return 0;
  };

  const getQualifiedTeams = (phase) => {
    if (phase === 'league') {
      return teams.map(team => ({ ...team, name: team.name }));
    } else if (phase === 'quarter' && teams.length === 7) {
      if (currentPhase !== 'league') {
        return groups[0]?.map(team => ({ ...team, name: team.name })) || [];
      }
      const quarterTeamCount = getExpectedTeamCount('quarter');
      return Array(quarterTeamCount).fill().map((_, i) => ({
        id: `placeholder-quarter-${i}`,
        name: oddTeam && i === quarterTeamCount - 1 ? oddTeam.name : 'Team'
      }));
    } else if (phase === 'super') {
      if (currentPhase !== 'league') {
        return groups[0]?.map(team => ({ ...team, name: team.name })) || [];
      }
      const superTeamCount = getExpectedTeamCount('super');
      return Array(superTeamCount).fill().map((_, i) => ({
        id: `placeholder-super-${i}`,
        name: oddTeam && i === superTeamCount - 1 ? oddTeam.name : 'Team'
      }));
    } else if (phase === 'semi') {
      if (currentPhase === 'semi' || currentPhase === 'final') {
        return getGroupStandings(0, teams.length === 7 ? 'quarter' : 'super').slice(0, 4).map(team => ({ ...team, name: team.name }));
      }
      return getExpectedTeamCount('semi') > 0
        ? Array(4).fill().map((_, i) => ({ id: `placeholder-semi-${i}`, name: 'Team' }))
        : [];
    } else if (phase === 'final') {
      if (currentPhase === 'final') {
        if (phaseHistory.includes('semi')) {
          return matches
            .filter(m => m.phase === 'semi' && m.winner)
            .map(m => teams.find(t => t.id === m.winner))
            .map(team => ({ ...team, name: team.name }));
        } else {
          return getGroupStandings(0, phaseHistory.includes('super') ? 'super' : 'league')
            .slice(0, 2)
            .map(team => ({ ...team, name: team.name }));
        }
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
    if (phase === 'super') return `Super ${getExpectedTeamCount('super') || 'X'}`;
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
        level === 'super' ? 'bg-gradient-to-r from-green-700 to-green-500' :
        level === 'quarter' ? 'bg-gradient-to-r from-teal-700 to-teal-500' :
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

  const phases = (teams.length === 4 || teams.length === 7 || teams.length === 8 ?
    ['league', 'semi', 'final', 'winner'] :
    ['league', 'super', 'quarter', 'semi', 'final', 'winner']).filter(phase =>
    phase !== 'super' || (teams.length !== 4 && teams.length !== 7 && teams.length !== 8) ||
    phase !== 'quarter' || (getExpectedTeamCount('super') > 4 && teams.length !== 7)
  );

  const levels = phases.map(phase => ({
    teams: getQualifiedTeams(phase),
    name: getPhaseName(phase),
    key: phase,
    matchesInfo: phase === 'league' ? `Groups: ${groups.map((_, i) => `Group ${i + 1} (${getGroupStandings(i).length} teams)`).join(', ')}${oddTeam ? ', Odd Team advances to Quarter-Final' : ''}` :
                 phase === 'super' ? `${getExpectedTeamCount('super')} teams${oddTeam ? ' (including Odd Team)' : ''}` :
                 phase === 'quarter' ? teams.length === 7 ? 'Top 4 teams from League + Odd Team' : 'Top 4 teams from Super stage' :
                 phase === 'semi' ? (teams.length === 7 ? 'Top 4 teams from Quarter-Final' : teams.length === 8 || teams.length === 4 ? 'Top teams from League' : 'Top 4 teams from Super stage') :
                 phase === 'final' ? (getExpectedTeamCount(teams.length === 7 ? 'quarter' : teams.length === 8 || teams.length === 4 ? 'league' : 'super') > 4 ? 'Winners from Semi-Final' : 'Top 2 teams from Super stage') :
                 phase === 'winner' ? 'Tournament Champion' : ''
  }));

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6 text-purple-400">Tournament Flowchart</h2>
      {levels.length > 0 ? levels.map(level => renderTreeLevel(level.teams, level.name, level.key, level.matchesInfo)) : (
        <div className="text-gray-400 text-center">No rounds played yet</div>
      )}
    </div>
  );
};

const Startmatch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { teams: initialTeams } = location.state || {};
  const [allTeams, setAllTeams] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [teamFetchError, setTeamFetchError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [selectedTeamA, setSelectedTeamA] = useState('');
  const [selectedTeamB, setSelectedTeamB] = useState('');
  const [tossWinner, setTossWinner] = useState('');
  const [tossDecision, setTossDecision] = useState('Batting');
  const [overs, setOvers] = useState('');
  const [scorer, setScorer] = useState('');
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);
  const [showFlowchart, setShowFlowchart] = useState(false);
  const [activeTab, setActiveTab] = useState('matches');
  const [groups, setGroups] = useState([]);
  const [matches, setMatches] = useState([]);
  const [currentPhase, setCurrentPhase] = useState('league');
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [groupResults, setGroupResults] = useState({});
  const [historicalGroupResults, setHistoricalGroupResults] = useState({});
  const [tournamentWinner, setTournamentWinner] = useState(null);
  const [oddTeam, setOddTeam] = useState(null);
  const [phaseHistory, setPhaseHistory] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedStandingsPhase, setSelectedStandingsPhase] = useState('league');
  const [playedMatches, setPlayedMatches] = useState([]);
  const scorers = ['John Doe', 'Jane Smith', 'Mike Johnson'];

  // Load state from localStorage
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
          seed: doc.data().seed || Math.random() * 100
        }));
        setAllTeams(fetchedTeams);

        // Load state from localStorage
        const savedState = JSON.parse(localStorage.getItem('tournamentState')) || {};
        const savedTeams = savedState.teams || (initialTeams && initialTeams.length > 0 ? initialTeams.map((t, i) => ({
          ...t,
          id: t.id || generateUUID(),
          seed: t.seed || i + 1
        })) : []);

        if (savedTeams.length > 0) {
          setTeams(savedTeams);
          setGroups(savedState.groups || []);
          setMatches(savedState.matches || []);
          setCurrentPhase(savedState.currentPhase || 'league');
          setCurrentGroupIndex(savedState.currentGroupIndex || 0);
          setGroupResults(savedState.groupResults || {});
          setHistoricalGroupResults(savedState.historicalGroupResults || { league: {} });
          setTournamentWinner(savedState.tournamentWinner || null);
          setOddTeam(savedState.oddTeam || null);
          setPhaseHistory(savedState.phaseHistory || []);
          setPlayedMatches(savedState.playedMatches || []);

          if (!savedState.groups || savedState.groups.length === 0) {
            initializeTournament(savedTeams);
            initializeGroupResults(savedTeams);
          }
        } else if (initialTeams && initialTeams.length > 0) {
          const initializedTeams = initialTeams.map((t, i) => ({
            ...t,
            id: t.id || generateUUID(),
            seed: t.seed || i + 1
          }));
          setTeams(initializedTeams);
          initializeTournament(initializedTeams);
          initializeGroupResults(initializedTeams);
        }
      } catch (err) {
        console.error("Error fetching teams:", err);
        setTeamFetchError("Failed to load teams from database.");
      } finally {
        setLoadingTeams(false);
      }
    };
    fetchAllTeams();
  }, []);

  // Save state to localStorage
  useEffect(() => {
    const stateToSave = {
      teams,
      groups,
      matches,
      currentPhase,
      currentGroupIndex,
      groupResults,
      historicalGroupResults,
      tournamentWinner,
      oddTeam,
      phaseHistory,
      playedMatches
    };
    localStorage.setItem('tournamentState', JSON.stringify(stateToSave));
  }, [teams, groups, matches, currentPhase, currentGroupIndex, groupResults, historicalGroupResults, tournamentWinner, oddTeam, phaseHistory, playedMatches]);

  // Handle match result from StartMatchPlayers
  useEffect(() => {
    if (location.state?.winner && location.state?.matchResult) {
      handleMatchResult(location.state.winner, location.state.matchResult);
      // Clear location.state to prevent re-processing
      navigate(location.pathname, { replace: true, state: { teams, groups, matches, currentPhase, currentGroupIndex } });
    }
  }, [location.state]);

  const initializeGroupResults = (teams) => {
    const initialResults = {};
    teams.forEach(team => {
      initialResults[team.id] = {
        points: 0,
        wins: 0,
        losses: 0,
        runsFor: 0,
        oversFor: 0,
        runsAgainst: 0,
        oversAgainst: 0,
        netRunRate: 0,
        matchesPlayed: 0
      };
    });
    setGroupResults(initialResults);
    setHistoricalGroupResults({ league: { ...initialResults } });
  };

  const calculateNetRunRate = (runsFor, oversFor, runsAgainst, oversAgainst) => {
    const forRate = oversFor > 0 ? runsFor / oversFor : 0;
    const againstRate = oversAgainst > 0 ? runsAgainst / oversAgainst : 0;
    return parseFloat((forRate - againstRate).toFixed(3));
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

  const initializeTournament = (teamsToUse) => {
    const teamCount = teamsToUse.length;
    let newGroups = [];
    let newMatches = [];
    let newOddTeam = null;

    const splitResult = TournamentSplitter.getOptimalGroups(teamCount);

    if (splitResult.groups) {
      let start = 0;
      newGroups = splitResult.groups.map(size => {
        const group = teamsToUse.slice(start, start + size);
        start += size;
        return group;
      });
    } else {
      const { groupCount, size, removed } = splitResult;
      if (removed) {
        newOddTeam = teamsToUse[teamCount - 1];
        const actualTeams = teamsToUse.slice(0, teamCount - removed);
        newGroups = Array.from({ length: groupCount }, (_, i) =>
          actualTeams.slice(i * size, (i + 1) * size)
        );
      } else {
        newGroups = Array.from({ length: groupCount }, (_, i) =>
          teamsToUse.slice(i * size, (i + 1) * size)
        );
      }
    }

    newMatches.push(...generateGroupMatches(newGroups[0], 0, 'league'));
    setGroups(newGroups);
    setOddTeam(newOddTeam);
    setMatches(newMatches);
    setCurrentPhase('league');
    setCurrentGroupIndex(0);
    setPlayedMatches([]);
  };

  const updateMatchesPlayed = (match) => {
    setGroupResults(prev => {
      const newStats = { ...prev };
      const team1Stats = { ...newStats[match.team1.id] };
      const team2Stats = { ...newStats[match.team2.id] };

      team1Stats.matchesPlayed = (team1Stats.matchesPlayed || 0) + 1;
      team2Stats.matchesPlayed = (team2Stats.matchesPlayed || 0) + 1;

      const updatedStats = { ...newStats, [match.team1.id]: team1Stats, [match.team2.id]: team2Stats };

      setHistoricalGroupResults(prevHistorical => ({
        ...prevHistorical,
        [match.phase]: { ...updatedStats }
      }));

      return updatedStats;
    });
  };

  const handleMatchResult = (winnerTeamName, matchResult) => {
    const currentMatch = matches.find(m => m.group === currentGroupIndex && m.phase === currentPhase && m.id === matchResult.matchId);
    if (!currentMatch) return;

    const winnerId = teams.find(t => t.name === winnerTeamName)?.id;
    if (!winnerId && winnerTeamName !== 'Tie') return;

    setMatches(prevMatches => {
      const updatedMatches = prevMatches.map(match => {
        if (match.id === currentMatch.id) {
          const updated = { ...match, winner: winnerId, played: true };

          if (['league', 'quarter', 'super'].includes(match.phase)) {
            setGroupResults(prev => {
              const newStats = { ...prev };
              const team1Stats = { ...newStats[match.team1.id] };
              const team2Stats = { ...newStats[match.team2.id] };

              if (winnerId === match.team1.id) {
                team1Stats.wins = (team1Stats.wins || 0) + 1;
                team2Stats.losses = (team2Stats.losses || 0) + 1;
                team1Stats.points = (team1Stats.points || 0) + 2;
              } else if (winnerId === match.team2.id) {
                team2Stats.wins = (team2Stats.wins || 0) + 1;
                team1Stats.losses = (team1Stats.losses || 0) + 1;
                team2Stats.points = (team2Stats.points || 0) + 2;
              } else if (winnerTeamName === 'Tie') {
                team1Stats.points = (team1Stats.points || 0) + 1;
                team2Stats.points = (team2Stats.points || 0) + 1;
              }

              team1Stats.runsFor = (team1Stats.runsFor || 0) + (matchResult.team1Runs || 0);
              team1Stats.oversFor = (team1Stats.oversFor || 0) + (matchResult.team1Overs || 0);
              team1Stats.runsAgainst = (team1Stats.runsAgainst || 0) + (matchResult.team2Runs || 0);
              team1Stats.oversAgainst = (team1Stats.oversAgainst || 0) + (matchResult.team2Overs || 0);
              team2Stats.runsFor = (team2Stats.runsFor || 0) + (matchResult.team2Runs || 0);
              team2Stats.oversFor = (team2Stats.oversFor || 0) + (matchResult.team2Overs || 0);
              team2Stats.runsAgainst = (team2Stats.runsAgainst || 0) + (matchResult.team1Runs || 0);
              team2Stats.oversAgainst = (team2Stats.oversAgainst || 0) + (matchResult.team1Overs || 0);

              team1Stats.netRunRate = calculateNetRunRate(
                team1Stats.runsFor,
                team1Stats.oversFor,
                team1Stats.runsAgainst,
                team1Stats.oversAgainst
              );
              team2Stats.netRunRate = calculateNetRunRate(
                team2Stats.runsFor,
                team2Stats.oversFor,
                team2Stats.runsAgainst,
                team2Stats.oversAgainst
              );

              const updatedStats = { ...newStats, [match.team1.id]: team1Stats, [match.team2.id]: team2Stats };

              setHistoricalGroupResults(prevHistorical => ({
                ...prevHistorical,
                [match.phase]: { ...updatedStats }
              }));

              return updatedStats;
            });
          }

          return updated;
        }
        return match;
      });

      const currentGroupMatches = updatedMatches.filter(m => m.group === currentGroupIndex && m.phase === currentPhase);
      if (currentGroupMatches.every(m => m.played) && ['league', 'quarter', 'super'].includes(currentPhase)) {
        if (currentGroupIndex < groups.length - 1 && currentPhase === 'league') {
          const nextGroupIndex = currentGroupIndex + 1;
          setMatches(prev => [
            ...prev.filter(m => m.group !== nextGroupIndex || m.phase !== currentPhase),
            ...generateGroupMatches(groups[nextGroupIndex], nextGroupIndex, currentPhase)
          ]);
          setCurrentGroupIndex(nextGroupIndex);
          setPlayedMatches([]);
        } else {
          if (currentPhase === 'league') {
            if (teams.length === 4 || teams.length === 8) {
              initializeSemiFinals();
            } else if (teams.length === 7) {
              const qualifiedTeams = groups.flatMap((group, groupIndex) => {
                const sorted = getGroupStandings(groupIndex);
                return sorted.slice(0, 2);
              });
              const quarterTeams = oddTeam ? [...qualifiedTeams, oddTeam] : qualifiedTeams;
              advanceToQuarterFinal([quarterTeams], 'quarter');
            } else {
              const teamsPerGroup = teams.length === 9 ? 2 : 3;
              const qualifiedTeams = groups.flatMap((group, groupIndex) => {
                const sorted = getGroupStandings(groupIndex);
                return sorted.slice(0, teamsPerGroup);
              });
              const superTeams = oddTeam ? [...qualifiedTeams, oddTeam] : qualifiedTeams;
              advanceToSuperStage([superTeams], 'super');
            }
          } else if (currentPhase === 'super') {
            const superTeams = groups[0];
            if (superTeams.length <= 4) {
              initializeFinal();
            } else {
              initializeSemiFinals();
            }
          } else if (currentPhase === 'quarter' && teams.length === 7) {
            initializeSemiFinals();
          }
        }
      } else if (currentPhase === 'semi') {
        if (updatedMatches.filter(m => m.phase === 'semi').every(m => m.played)) {
          initializeFinal();
        }
      } else if (currentPhase === 'final') {
        if (updatedMatches.filter(m => m.phase === 'final').every(m => m.played)) {
          setTournamentWinner(updatedMatches.find(m => m.phase === 'final').winner);
        }
      }

      return updatedMatches;
    });
  };

  const getGroupStandings = (groupIndex, phase = 'league') => {
    if (!groups[groupIndex]) return [];
    return groups[groupIndex]
      .map(team => ({
        ...team,
        ...historicalGroupResults[phase]?.[team.id] || groupResults[team.id] || {}
      }))
      .sort((a, b) => (b.points || 0) - (a.points || 0) || (b.netRunRate || 0) - (a.netRunRate || 0) || (b.wins || 0) - (a.wins || 0));
  };

  const getOverallStandings = (phase = 'league') => {
    return teams
      .map(team => ({
        ...team,
        ...historicalGroupResults[phase]?.[team.id] || groupResults[team.id] || {}
      }))
      .sort((a, b) => (b.points || 0) - (a.points || 0) || (b.netRunRate || 0) - (a.netRunRate || 0) || (b.wins || 0) - (a.wins || 0));
  };

  const advanceToSuperStage = (superGroups, phase) => {
    const superMatches = superGroups.flatMap((group, index) =>
      generateGroupMatches(group, index, phase)
    );

    setGroups(superGroups);
    setMatches(superMatches);
    setCurrentPhase(phase);
    setPhaseHistory(prev => [...prev, 'league']);
    setCurrentGroupIndex(0);
    setPlayedMatches([]);
  };

  const advanceToQuarterFinal = (quarterGroups, phase) => {
    const quarterMatches = quarterGroups.flatMap((group, index) =>
      generateGroupMatches(group, index, phase)
    );

    setGroups(quarterGroups);
    setMatches(quarterMatches);
    setCurrentPhase(phase);
    setPhaseHistory(prev => [...prev, 'league']);
    setCurrentGroupIndex(0);
    setPlayedMatches([]);
  };

  const initializeSemiFinals = () => {
    const qualifiedTeams = getGroupStandings(0, teams.length === 7 ? 'quarter' : teams.length === 8 || teams.length === 4 ? 'league' : 'super').slice(0, 4);

    const semiMatches = [];
    for (let i = 0; i < qualifiedTeams.length / 2; i++) {
      semiMatches.push({
        id: `semi-${i + 1}`,
        team1: qualifiedTeams[i],
        team2: qualifiedTeams[qualifiedTeams.length - 1 - i],
        round: 0,
        phase: 'semi',
        winner: null,
        played: false
      });
    }

    setMatches(semiMatches);
    setGroups([qualifiedTeams]);
    setCurrentPhase('semi');
    setPhaseHistory(prev => [...prev, teams.length === 7 ? 'quarter' : teams.length === 8 || teams.length === 4 ? 'league' : 'super']);
    setCurrentGroupIndex(0);
    setPlayedMatches([]);
  };

  const initializeFinal = () => {
    let finalTeams;
    if (phaseHistory.includes('semi')) {
      finalTeams = matches
        .filter(m => m.phase === 'semi' && m.winner)
        .map(m => teams.find(t => t.id === m.winner));
    } else {
      finalTeams = getGroupStandings(0, currentPhase === 'league' ? 'league' : 'super').slice(0, 2);
    }

    const finalMatch = [{
      id: 'final',
      team1: finalTeams[0],
      team2: finalTeams[1],
      round: 0,
      phase: 'final',
      winner: null,
      played: false
    }];

    setMatches(finalMatch);
    setGroups([finalTeams]);
    setCurrentPhase('final');
    setPhaseHistory(prev => [...prev, phaseHistory.includes('semi') ? 'semi' : teams.length === 7 ? 'quarter' : teams.length === 8 || teams.length === 4 ? 'league' : 'super']);
    setCurrentGroupIndex(0);
    setPlayedMatches([]);
  };

  const getAvailableMatches = () => {
    if (!matches || !currentPhase || currentGroupIndex === undefined) return [];
    return matches
      .filter(m => m.group === currentGroupIndex && m.phase === currentPhase && !playedMatches.includes(m.id))
      .map(m => ({
        id: m.id,
        team1: m.team1,
        team2: m.team2,
        label: `${m.team1.name} vs ${m.team2.name}`,
        played: m.played,
        winner: m.winner ? teams.find(t => t.id === m.winner)?.name : null
      }));
  };

  const handleMatchSelection = (matchId) => {
    setSelectedMatch(matchId);
    const selected = matches.find(m => m.id === matchId);
    if (selected) {
      setSelectedTeamA(selected.team1.name);
      setSelectedTeamB(selected.team2.name);
    }
  };

  const handleNext = () => {
    if (!selectedMatch || !selectedTeamA || !selectedTeamB || !overs) {
      alert('Please select a match and enter overs.');
      return;
    }
    if (selectedTeamA === selectedTeamB) {
      alert('Teams A and B cannot be the same.');
      return;
    }

    const teamAData = allTeams.find(team => team.name === selectedTeamA);
    const teamBData = allTeams.find(team => team.name === selectedTeamB);

    if (!teamAData || !teamBData) {
      alert('Selected teams not found in database.');
      return;
    }
    if (!teamAData.players || teamAData.players.length === 0) {
      alert(`Team "${selectedTeamA}" has no players registered.`);
      return;
    }
    if (!teamBData.players || teamBData.players.length === 0) {
      alert(`Team "${selectedTeamB}" has no players registered.`);
      return;
    }

    // Mark match as played and update matchesPlayed
    const currentMatch = matches.find(m => m.id === selectedMatch);
    if (currentMatch) {
      setPlayedMatches(prev => [...prev, currentMatch.id]);
      updateMatchesPlayed(currentMatch);
    }

    setShowPlayerSelector(true);
  };

  const renderGroupDetails = (groupIndex, phase = 'league') => {
    const standings = getGroupStandings(groupIndex, phase);
    const groupMatches = matches.filter(m => m.group === groupIndex && m.phase === phase);
    const teamsToAdvance = phase === 'league' ? (teams.length === 7 || teams.length === 9 ? 2 : 3) :
                           phase === 'quarter' && teams.length === 7 ? 4 :
                           phase === 'super' && standings.length > 4 ? 4 : 2;

    return (
      <div className="bg-gray-800 p-6 rounded-xl mt-4">
        <button
          onClick={() => setSelectedGroup(null)}
          className="mb-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
        >
          Back to Standings
        </button>
        <h3 className="text-xl font-bold text-purple-400 mb-4">{phase === 'league' ? `Group ${groupIndex + 1}` : phase === 'quarter' ? 'Quarter-Final' : 'Super Stage'} Details ({phase.charAt(0).toUpperCase() + phase.slice(1)})</h3>
        <h4 className="text-lg font-semibold text-gray-200 mb-2">Teams ({standings.length})</h4>
        <div className="mb-4">
          {standings.map((team, i) => (
            <div
              key={team.id}
              className={`p-2 rounded ${i < teamsToAdvance ? 'bg-purple-900' : 'bg-gray-700'} mb-2 ${team.id === oddTeam?.id ? 'border-2 border-yellow-400' : ''}`}
            >
              {team.name} (Points: {team.points || 0}, Wins: {team.wins || 0}, Losses: {team.losses || 0}, Matches Played: {team.matchesPlayed || 0}, NRR: {(team.netRunRate || 0)})
              {i < teamsToAdvance && <span className="ml-2 text-green-400">✓ Advances</span>}
              {team.id === oddTeam?.id && phase === 'league' && <span className="ml-2 text-yellow-400">✓ Advances to Quarter-Final</span>}
            </div>
          ))}
        </div>
        <h4 className="text-lg font-semibold text-gray-200 mb-2">Matches</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groupMatches.map(match => (
            <div key={match.id} className={`p-4 rounded-lg ${playedMatches.includes(match.id) ? 'bg-blue-600' : 'bg-gray-700'} ${match.played ? 'opacity-75 bg-gray-600' : ''}`}>
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
            </div>
          ))}
        </div>
        <p className="mt-4 text-gray-200">
          Advancing: Top {teamsToAdvance} team{teamsToAdvance > 1 ? 's' : ''} from this {phase === 'league' ? 'group' : 'stage'}${oddTeam && phase === 'league' ? ' + Odd Team to Quarter-Final' : ''}
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
              <div key={match.id} className={`p-4 rounded-lg ${playedMatches.includes(match.id) ? 'bg-blue-600' : 'bg-gray-700'} ${match.played ? 'opacity-75 bg-gray-600' : ''}`}>
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
              <th className="p-4">Team</th>
              <th className="p-4">Points</th>
              <th className="p-4">W/L</th>
              <th className="p-4">Matches</th>
              <th className="p-4">NRR</th>
            </tr>
          </thead>
          <tbody>
            {(phase === 'league' && oddTeam ? teams.filter(t => t.id !== oddTeam.id) : getOverallStandings(phase)).map(team => (
              <tr key={`${phase}-${team.id}`} className="border-b border-gray-700">
                <td className="p-4">{team.name}{team.id === oddTeam?.id ? ' (Odd Team)' : ''}</td>
                <td className="p-4">{team.points || 0}</td>
                <td className="p-4">{team.wins || 0}-{team.losses || 0}</td>
                <td className="p-4">{team.matchesPlayed || 0}</td>
                <td className="p-4">{(team.netRunRate || 0)}</td>
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
                Odd Team: {oddTeam.name} (Advances to Quarter-Final)
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setSelectedGroup(0)}
              className={`p-4 font-bold rounded-lg ${currentGroupIndex === 0 ? 'bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              {phase === 'quarter' ? 'Quarter-Final' : 'Super Stage'} ({groups[0]?.length} Teams)
            </button>
          </div>
        )}
      </div>
    );
  };

  const PlayerSelector = ({ teamA, teamB, overs, groupIndex, phase, matches, matchId }) => {
    const [leftSearch, setLeftSearch] = useState('');
    const [rightSearch, setRightSearch] = useState('');
    const [selectedPlayers, setSelectedPlayers] = useState({ left: [], right: [] });

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

      // Mark the match as played
      const currentMatch = matches.find(m => m.id === matchId);
      if (currentMatch) {
        setPlayedMatches(prev => [...prev, matchId]);
        updateMatchesPlayed(currentMatch);
      }

      navigate('/StartMatchPlayers', {
        state: {
          overs,
          teamA,
          teamB,
          selectedPlayers,
          groupIndex,
          phase,
          matches,
          teams,
          groups,
          currentPhase,
          currentGroupIndex,
          matchId,
          origin: '/start-match'
        }
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
                  <span className="text-xl font-semibold text-indigo-700">{teamB?.name || 'Team B'}</span>
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

  if (loadingTeams) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl">Loading Teams...</p>
      </div>
    );
  }

  if (teamFetchError) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-500 flex items-center justify-center">
        <p className="text-xl">Error: {teamFetchError}</p>
      </div>
    );
  }

  if (allTeams.length < 2) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl text-center">
          Not enough teams registered. Please add at least two teams and their players via the Admin Panel.
        </p>
      </div>
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
            Tournament Dashboard
          </motion.h1>

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-purple-400">
              {currentPhase === 'league' ? `League Stage (Group ${currentGroupIndex + 1} of ${groups.length})` :
               currentPhase === 'super' ? `Super ${groups[0]?.length || 'Stage'}` :
               currentPhase === 'quarter' ? 'Quarter-Final' :
               currentPhase === 'semi' ? 'Semi-Final' :
               currentPhase === 'final' ? 'Final' : 'Tournament'}
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('matches')}
                className={`px-4 py-2 ${activeTab === 'matches' ? 'bg-purple-600' : 'bg-gray-700'} rounded-lg`}
              >
                Matches
              </button>
              <button
                onClick={() => setActiveTab('standings')}
                className={`px-4 py-2 ${activeTab === 'standings' ? 'bg-purple-600' : 'bg-gray-700'} rounded-lg`}
              >
                Standings
              </button>
              <button
                onClick={() => setShowFlowchart(!showFlowchart)}
                className={`px-4 py-2 ${showFlowchart ? 'bg-purple-600' : 'bg-gray-700'} rounded-lg`}
              >
                Flowchart
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Back
              </button>
            </div>
          </div>

          {activeTab === 'standings' && !showFlowchart && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Tournament Standings</h2>
              <div className="flex gap-4 mb-4">
                {['league', 'super', 'quarter', 'semi', 'final'].map(phase => (
                  (phaseHistory.includes(phase) || phase === 'league') && (
                    <button
                      key={phase}
                      onClick={() => setSelectedStandingsPhase(phase)}
                      className={`px-4 py-2 ${selectedStandingsPhase === phase ? 'bg-purple-600' : 'bg-gray-700'} hover:bg-purple-700 rounded-lg`}
                    >
                      {phase === 'league' ? 'League' : phase === 'super' ? 'Super Stage' : phase === 'quarter' ? 'Quarter-Final' : phase === 'semi' ? 'Semi-Final' : 'Final'}
                    </button>
                  )
                ))}
              </div>
              {selectedGroup === null ? renderPhaseStandings(selectedStandingsPhase) : renderGroupDetails(selectedGroup, selectedStandingsPhase)}
            </div>
          )}

          {showFlowchart && (
            <div className="mb-8">
              <button
                onClick={() => setShowFlowchart(false)}
                className="mb-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
              >
                Back to Dashboard
              </button>
              <Flowchart
                teams={teams}
                groups={groups}
                currentPhase={currentPhase}
                matches={matches}
                groupResults={historicalGroupResults}
                tournamentWinner={tournamentWinner}
                oddTeam={oddTeam}
                phaseHistory={phaseHistory}
              />
            </div>
          )}

          {activeTab === 'matches' && !showFlowchart && !showPlayerSelector && (
            <motion.div className="mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mt-4">
                <motion.div
                  className="flex flex-col space-y-6 w-full"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <motion.div
                    className="min-h-[350px] bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl p-6 w-full border border-blue-100 flex flex-col"
                    whileHover={{ scale: 1.01 }}
                  >
                    <h2 className="text-xl font-semibold mb-4 text-blue-800">
                      Match Details
                    </h2>
                    <div className="space-y-4 w-full flex-1">
                      <div className="w-full">
                        <label className="block text-gray-700 mb-2 font-medium">
                          Select Battle (
                          {currentPhase === 'league'
                            ? `Group ${currentGroupIndex + 1}`
                            : currentPhase === 'super'
                              ? 'Super Stage'
                              : currentPhase === 'quarter'
                                ? 'Quarter-Final'
                                : currentPhase === 'semi'
                                  ? 'Semi-Final'
                                  : 'Final'}
                          )
                        </label>
                        <select id='battleselection'
                          className="w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                          value={selectedMatch}
                          onChange={(e) => handleMatchSelection(e.target.value)}
                        >
                          <option value="">Select a match</option>
                          {getAvailableMatches()
                            .filter((match) => !match.played)
                            .map((match) => (
                              <option key={match.id} value={match.id}>
                                {match.label}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="w-full">
                        <label className="block text-gray-700 mb-2 font-medium">
                          Team A
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 bg-gray-200"
                          value={selectedTeamA}
                          readOnly
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-gray-700 mb-2 font-medium">
                          Team B
                        </label>
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
                    <h2 className="text-xl font-semibold mb-4 text-blue-800">
                      Choose Overs
                    </h2>
                    <div className="w-full">
                      <input
                        type="number"
                        placeholder="Enter overs (e.g. 20)"
                        className={`w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${overs ? 'bg-gray-200 text-gray-700' : 'bg-white'}`}
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
                    className="min-h-[350px] bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl p-6 w-full border border-blue-100 flex flex-col"
                    whileHover={{ scale: 1.01 }}
                  >
                    <h2 className="text-xl font-semibold mb-4 text-blue-800">
                      Toss Details
                    </h2>
                    <div className="space-y-4 w-full flex-1">
                      <div className="w-full">
                        <label className="block text-gray-700 mb-2 font-medium">
                          Record Toss & Decision
                        </label>
                        <select
                          className={`w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${tossWinner ? 'bg-gray-200 text-gray-700' : 'bg-white'}`}
                          value={tossWinner}
                          onChange={(e) => setTossWinner(e.target.value)}
                        >
                          <option value="">Select Team</option>
                          {selectedTeamA && (
                            <option value={selectedTeamA}>{selectedTeamA}</option>
                          )}
                          {selectedTeamB && (
                            <option value={selectedTeamB}>{selectedTeamB}</option>
                          )}
                        </select>
                      </div>
                      <div className="w-full">
                        <label className="block text-gray-700 mb-2 font-medium">
                          Elected to:
                        </label>
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
                            <span className="text-blue-800">Batting</span>
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
                            <span className="text-blue-800">Bowling</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    className="min-h-[200px] bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl p-6 w-full border border-blue-100 flex flex-col justify-center"
                    whileHover={{ scale: 1.01 }}
                  >
                    <h2 className="text-xl font-semibold mb-4 text-blue-800">
                      Assign Scorer
                    </h2>
                    <div className="w-full">
                      <select
                        className={`w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${scorer ? 'bg-gray-200 text-gray-700' : 'bg-white'}`}
                        value={scorer}
                        onChange={(e) => setScorer(e.target.value)}
                      >
                        <option value="">Select Scorer</option>
                        {scorers.map((person) => (
                          <option key={person} value={person}>
                            {person}
                          </option>
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

                  whileHover={{
                    scale: 1.03,
                    boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Next
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {showPlayerSelector && (
            <PlayerSelector
              teamA={allTeams.find(team => team.name === selectedTeamA)}
              teamB={allTeams.find(team => team.name === selectedTeamB)}
              overs={overs}
              groupIndex={currentGroupIndex}
              phase={currentPhase}
              matches={matches}
              matchId={selectedMatch}
            />
          )}

          {tournamentWinner && (
            <div className="text-center mt-8">
              <div className="bg-purple-600 p-8 rounded-xl inline-block shadow-xl">
                <h2 className="text-4xl font-bold text-white animate-pulse">
                  🏆 Champion: {teams.find(t => t.id === tournamentWinner)?.name} 🏆
                </h2>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Startmatch;