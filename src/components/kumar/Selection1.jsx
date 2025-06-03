import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Selection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [selectedTeamCount, setSelectedTeamCount] = useState(2);
  const [format, setFormat] = useState(null);
  const [matches, setMatches] = useState([]);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [tournamentWinner, setTournamentWinner] = useState(null);
  const [matchHistory, setMatchHistory] = useState([]);
  const [phaseHistory, setPhaseHistory] = useState([]);
  const [liveMatchIndex, setLiveMatchIndex] = useState(0);
  const [superLeagueStandings, setSuperLeagueStandings] = useState([]);
  const [validFormat, setValidFormat] = useState(null);
  const [historicalMatchResults, setHistoricalMatchResults] = useState({});

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const initialTeams = [
    { id: 'team1', name: 'Afghanistan', seed: 1 },
    { id: 'team2', name: 'Australia', seed: 2 },
    { id: 'team3', name: 'Bangladesh', seed: 3 },
    { id: 'team4', name: 'England', seed: 4 },
    { id: 'team5', name: 'India', seed: 5 },
    { id: 'team6', name: 'Ireland', seed: 6 },
    { id: 'team7', name: 'New Zealand', seed: 7 },
    { id: 'team8', name: 'Pakistan', seed: 8 },
    { id: 'team9', name: 'South Africa', seed: 9 },
    { id: 'team10', name: 'Sri Lanka', seed: 10 },
    { id: 'team11', name: 'West Indies', seed: 11 },
    { id: 'team12', name: 'Zimbabwe', seed: 12 },
    { id: 'team13', name: 'Nepal', seed: 13 },
    { id: 'team14', name: 'Scotland', seed: 14 },
    { id: 'team15', name: 'Netherlands', seed: 15 },
    { id: 'team16', name: 'Team 16', seed: 16 },
    { id: 'team17', name: 'Team 17', seed: 17 },
    { id: 'team18', name: 'Team 18', seed: 18 },
  ].map((team) => ({
    ...team,
    id: team.id || generateUUID(),
    points: 0,
    wins: 0,
  }));

useEffect(() => {
  if (location.state) {
    const {
      teams: stateTeams,
      format: stateFormat,
      matches: stateMatches,
      currentPhase: statePhase,
      matchHistory: stateMatchHistory,
      phaseHistory: statePhaseHistory,
      liveMatchIndex: stateLiveMatchIndex,
      tournamentWinner: stateWinner,
    } = location.state;

    if (stateTeams?.length) {
      setTeams(stateTeams);
      setSelectedTeamCount(stateTeams.length);
    } else {
      setTeams(initialTeams.slice(0, selectedTeamCount).sort((a, b) => a.seed - b.seed));
    }

    let selectedFormat = null;
    if (selectedTeamCount === 2) {
      selectedFormat = 'championship';
    } else if (selectedTeamCount === 4) {
      selectedFormat = 'eliminatorElite';
    } else if (selectedTeamCount === 8) {
      selectedFormat = 'playOff';
    } else if (selectedTeamCount === 12) {
      selectedFormat = 'knockout';
    } else if (selectedTeamCount >= 2) {
      selectedFormat = 'superKnockout';
    }
    setValidFormat(selectedFormat);

    // Handle format initialization
    if (stateTeams?.length) {
      // If stateTeams exist (navigation case), use stateFormat if valid
      if (stateFormat && selectedFormat === stateFormat) {
        setFormat(stateFormat);
        initializeBracket(stateFormat);
      } else {
        // Reset if stateFormat doesn't match selectedFormat
        setFormat(null);
        setMatches([]);
        setMatchHistory([]);
        setCurrentPhase(null);
      }
    } else {
      // On refresh (no stateTeams), initialize based on selectedTeamCount
      if (selectedFormat) {
        setFormat(selectedFormat);
        initializeBracket(selectedFormat);
      } else {
        setFormat(null);
        setMatches([]);
        setMatchHistory([]);
        setCurrentPhase(null);
      }
    }

    setMatches(stateMatches || []);
    setCurrentPhase(statePhase || null);
    setMatchHistory(stateMatchHistory || []);
    setPhaseHistory(statePhaseHistory || []);
    setLiveMatchIndex(stateLiveMatchIndex || 0);
    setTournamentWinner(stateWinner || null);

    const initialResults = {};
    (stateTeams || initialTeams.slice(0, selectedTeamCount)).forEach((team) => {
      initialResults[team.id] = { points: 0, wins: 0, matchesPlayed: 0 };
    });
    setHistoricalMatchResults({});

    if (!selectedFormat) {
      alert(`Invalid number of teams: ${selectedTeamCount}. Please select 2, 4, 8, 12, or more teams for Super Knockout.`);
    }

    if (location.state?.matchId && location.state?.winner) {
      handleMatchResult(location.state.matchId, location.state.winner);
    }
  }
}, [location.state, selectedTeamCount]);

  const getTournamentStructure = () => {
    const teamCount = teams.length;
    const structure = [];

    if (format === 'championship') {
      structure.push({ phase: 'final', roundName: 'Final', matchCount: 1 });
    } else if (format === 'eliminatorElite') {
      structure.push({ phase: 'eliminatorElite', roundName: 'Semifinals', matchCount: 2 });
      structure.push({ phase: 'final', roundName: 'Final', matchCount: 1 });
      structure.push({ phase: 'thirdPlace', roundName: 'Third Place', matchCount: 1 });
    } else if (format === 'playOff') {
      structure.push({ phase: 'playOff', roundName: 'Quarterfinals', matchCount: 4 });
      structure.push({ phase: 'semi', roundName: 'Semifinals', matchCount: 2 });
      structure.push({ phase: 'final', roundName: 'Final', matchCount: 1 });
    } else if (format === 'superLeague') {
      structure.push({ phase: 'superLeague', roundName: 'League Stage', matchCount: (teamCount * (teamCount - 1)) / 2 });
      structure.push({ phase: 'semi', roundName: 'Semifinals', matchCount: 2 });
      structure.push({ phase: 'final', roundName: 'Final', matchCount: 1 });
    } else if (format === 'knockout') {
      structure.push({ phase: 'preQuarter', roundName: 'Pre-Quarterfinals', matchCount: 2 });
      structure.push({ phase: 'quarter', roundName: 'Quarterfinals', matchCount: 4 });
      structure.push({ phase: 'semi', roundName: 'Semifinals', matchCount: 2 });
      structure.push({ phase: 'final', roundName: 'Final', matchCount: 1 });
    } else if (format === 'superKnockout') {
      const byeCount = teamCount >= 16 ? 4 : teamCount === 15 ? 1 : teamCount > 10 ? teamCount - 10 : teamCount > 8 ? teamCount - 8 : 0;
      const competingTeams = teamCount - byeCount;
      if (teamCount >= 10) {
        structure.push({ phase: 'superKnockout', roundName: `Round of ${competingTeams}`, matchCount: Math.floor(competingTeams / 2) });
        if (teamCount >= 13) {
          structure.push({ phase: 'preQuarter', roundName: 'Pre-Quarterfinals', matchCount: 3 });
          structure.push({ phase: 'quarter', roundName: 'Quarterfinals', matchCount: 4 });
        } else {
          structure.push({ phase: 'quarter', roundName: 'Quarterfinals', matchCount: 4 });
        }
        structure.push({ phase: 'semi', roundName: 'Semifinals', matchCount: 2 });
        structure.push({ phase: 'final', roundName: 'Final', matchCount: 1 });
      } else if (teamCount >= 4) {
        structure.push({ phase: 'superKnockout', roundName: `Round of ${competingTeams}`, matchCount: Math.floor(competingTeams / 2) });
        structure.push({ phase: 'semi', roundName: 'Semifinals', matchCount: 2 });
        structure.push({ phase: 'final', roundName: 'Final', matchCount: 1 });
      } else {
        structure.push({ phase: 'superKnockout', roundName: 'Final', matchCount: 1 });
      }
    }

    return structure;
  };

  const initializeBracket = (selectedFormat) => {
    const teamCount = teams.length;
    const selectedTeams = [...teams].sort((a, b) => a.seed - b.seed);
    let newMatches = [];
    let initialPhase = '';

    if (selectedFormat === 'superKnockout') {
      let byeCount = 0;
      if (teamCount >= 16) byeCount = 4;
      else if (teamCount === 15) byeCount = 1;
      else if (teamCount > 10) byeCount = teamCount - 10;
      else if (teamCount > 8) byeCount = teamCount - 8;
      byeCount = Math.min(byeCount, Math.floor(teamCount / 2));

      const competingTeams = selectedTeams.slice(byeCount);
      if (competingTeams.length < 2 && !byeCount) {
        alert('Super Knockout requires at least 2 competing teams.');
        return;
      }

      for (let i = 0; i < competingTeams.length - 1; i += 2) {
        newMatches.push({
          id: `super-knockout-${i / 2 + 1}`,
          team1: competingTeams[i],
          team2: competingTeams[i + 1],
          round: 0,
          phase: 'superKnockout',
          winner: null,
          played: false,
          live: i === 0,
        });
      }
      if (competingTeams.length % 2 === 1) {
        newMatches.push({
          id: `super-knockout-${Math.floor(competingTeams.length / 2) + 1}`,
          team1: competingTeams[competingTeams.length - 1],
          team2: { name: 'BYE', id: generateUUID(), isBye: true },
          round: 0,
          phase: 'superKnockout',
          winner: competingTeams[competingTeams.length - 1].id,
          played: true,
          live: false,
        });
      }
      initialPhase = 'superKnockout';
    } else if (selectedFormat === 'knockout') {
      newMatches = [
        {
          id: 'pre-quarter-1',
          team1: selectedTeams[8],
          team2: selectedTeams[11],
          round: 0,
          phase: 'preQuarter',
          winner: null,
          played: false,
          live: true,
        },
        {
          id: 'pre-quarter-2',
          team1: selectedTeams[9],
          team2: selectedTeams[10],
          round: 0,
          phase: 'preQuarter',
          winner: null,
          played: false,
          live: false,
        },
      ];
      initialPhase = 'preQuarter';
    } else if (selectedFormat === 'playOff') {
      newMatches = [
        { id: 'playoff-1', team1: selectedTeams[0], team2: selectedTeams[7], round: 0, phase: 'playOff', winner: null, played: false, live: true },
        { id: 'playoff-2', team1: selectedTeams[1], team2: selectedTeams[6], round: 0, phase: 'playOff', winner: null, played: false, live: false },
        { id: 'playoff-3', team1: selectedTeams[2], team2: selectedTeams[5], round: 0, phase: 'playOff', winner: null, played: false, live: false },
        { id: 'playoff-4', team1: selectedTeams[3], team2: selectedTeams[4], round: 0, phase: 'playOff', winner: null, played: false, live: false },
      ];
      initialPhase = 'playOff';
    } else if (selectedFormat === 'eliminatorElite') {
      newMatches = [
        { id: 'elite-1', team1: selectedTeams[0], team2: selectedTeams[3], round: 0, phase: 'eliminatorElite', winner: null, played: false, live: true },
        { id: 'elite-2', team1: selectedTeams[1], team2: selectedTeams[2], round: 0, phase: 'eliminatorElite', winner: null, played: false, live: false },
      ];
      initialPhase = 'eliminatorElite';
    } else if (selectedFormat === 'championship') {
      newMatches = [
        { id: 'championship', team1: selectedTeams[0], team2: selectedTeams[1], round: 0, phase: 'final', winner: null, played: false, live: true },
      ];
      initialPhase = 'final';
    } else if (selectedFormat === 'superLeague') {
      for (let i = 0; i < selectedTeams.length; i++) {
        for (let j = i + 1; j < selectedTeams.length; j++) {
          newMatches.push({
            id: `super-league-${i + 1}-${j + 1}`,
            team1: selectedTeams[i],
            team2: selectedTeams[j],
            round: 0,
            phase: 'superLeague',
            winner: null,
            played: false,
            live: i === 0 && j === 1,
          });
        }
      }
      setSuperLeagueStandings(selectedTeams.map((team) => ({ ...team, points: 0, wins: 0 })));
      initialPhase = 'superLeague';
    }

    setMatches(newMatches);
    setMatchHistory(newMatches);
    setPhaseHistory([initialPhase]);
    setCurrentPhase(initialPhase);
    setTournamentWinner(null);
    setFormat(selectedFormat);
    setLiveMatchIndex(0);
  };

  const handleMatchResult = (matchId, winnerId) => {
    if (tournamentWinner || !teams.find((t) => t.id === winnerId)) return;

    setMatches((prevMatches) => {
      let updatedMatches = prevMatches.map((match) => {
        if (match.id === matchId && !match.team1?.isBye && !match.team2?.isBye) {
          return { ...match, winner: winnerId, played: true, live: false };
        }
        return { ...match, live: false };
      });

      const nextLiveIndex = updatedMatches.findIndex((m, i) => i > liveMatchIndex && !m.played && !m.team1?.isBye && !m.team2?.isBye);
      if (nextLiveIndex !== -1) {
        updatedMatches = updatedMatches.map((m, i) => ({
          ...m,
          live: i === nextLiveIndex,
        }));
      }

      if (currentPhase === 'superLeague') {
        setSuperLeagueStandings((prevTeams) =>
          prevTeams.map((team) =>
            team.id === winnerId
              ? { ...team, points: team.points + 2, wins: team.wins + 1 }
              : team
          )
        );

        setHistoricalMatchResults((prev) => {
          const newResults = { ...prev };
          if (!newResults[currentPhase]) {
            newResults[currentPhase] = {};
            teams.forEach((team) => {
              newResults[currentPhase][team.id] = { points: 0, wins: 0, matchesPlayed: 0 };
            });
          }
          newResults[currentPhase][winnerId] = {
            ...newResults[currentPhase][winnerId],
            points: newResults[currentPhase][winnerId].points + 2,
            wins: newResults[currentPhase][winnerId].wins + 1,
            matchesPlayed: newResults[currentPhase][winnerId].matchesPlayed + 1,
          };
          const loserId = updatedMatches.find((m) => m.id === matchId).team1.id === winnerId
            ? updatedMatches.find((m) => m.id === matchId).team2.id
            : updatedMatches.find((m) => m.id === matchId).team1.id;
          newResults[currentPhase][loserId] = {
            ...newResults[currentPhase][loserId],
            matchesPlayed: newResults[currentPhase][loserId].matchesPlayed + 1,
          };
          return newResults;
        });
      }

      setMatchHistory((prev) => {
        const existingMatch = prev.find((m) => m.id === matchId);
        if (existingMatch) {
          return prev.map((m) =>
            m.id === matchId ? { ...m, winner: winnerId, played: true, live: false } : m
          );
        }
        return [...prev, ...updatedMatches.filter((m) => m.id === matchId)];
      });

      setLiveMatchIndex(nextLiveIndex !== -1 ? nextLiveIndex : liveMatchIndex + 1);

      const currentMatches = updatedMatches.filter((m) => m.phase === currentPhase);
      if (currentMatches.every((m) => m.played || m.team1?.isBye || m.team2?.isBye)) {
        if (currentPhase === 'championship' || currentPhase === 'final') {
          const winner = currentMatches.find((m) => m.winner)?.winner;
          if (winner) setTournamentWinner(winner);
        } else if (currentPhase === 'superLeague') {
          advanceSuperLeague();
        } else {
          advancePhase(updatedMatches);
        }
      }

      return updatedMatches;
    });
  };

  const advancePhase = (currentMatches) => {
    let newTeams = [];
    let newMatches = [];
    let nextPhase = '';

    if (currentPhase === 'superKnockout') {
      const winners = currentMatches
        .filter((m) => m.phase === 'superKnockout' && m.winner)
        .map((m) => teams.find((t) => t.id === m.winner));
      const byeCount = teams.length >= 16 ? 4 : teams.length === 15 ? 1 : teams.length > 10 ? teams.length - 10 : teams.length > 8 ? teams.length - 8 : 0;
      const byeTeams = teams.slice(0, byeCount);
      newTeams = [...winners, ...byeTeams].sort((a, b) => a.seed - b.seed);

      if (newTeams.length >= 10) {
        nextPhase = 'preQuarter';
        newMatches = [
          { id: 'pre-quarter-1', team1: newTeams[4], team2: newTeams[9], round: 1, phase: 'preQuarter', winner: null, played: false, live: true },
          { id: 'pre-quarter-2', team1: newTeams[5], team2: newTeams[8], round: 1, phase: 'preQuarter', winner: null, played: false, live: false },
          { id: 'pre-quarter-3', team1: newTeams[6], team2: newTeams[7], round: 1, phase: 'preQuarter', winner: null, played: false, live: false },
        ];
      } else if (newTeams.length === 8) {
        nextPhase = 'quarter';
        newMatches = [
          { id: 'quarter-1', team1: newTeams[0], team2: newTeams[7], round: 2, phase: 'quarter', winner: null, played: false, live: true },
          { id: 'quarter-2', team1: newTeams[1], team2: newTeams[6], round: 2, phase: 'quarter', winner: null, played: false, live: false },
          { id: 'quarter-3', team1: newTeams[2], team2: newTeams[5], round: 2, phase: 'quarter', winner: null, played: false, live: false },
          { id: 'quarter-4', team1: newTeams[3], team2: newTeams[4], round: 2, phase: 'quarter', winner: null, played: false, live: false },
        ];
      } else if (newTeams.length === 4) {
        nextPhase = 'semi';
        newMatches = [
          { id: 'semi-1', team1: newTeams[0], team2: newTeams[3], round: 3, phase: 'semi', winner: null, played: false, live: true },
          { id: 'semi-2', team1: newTeams[1], team2: newTeams[2], round: 3, phase: 'semi', winner: null, played: false, live: false },
        ];
      } else if (newTeams.length === 2) {
        nextPhase = 'final';
        newMatches = [
          { id: 'final', team1: newTeams[0], team2: newTeams[1], round: 4, phase: 'final', winner: null, played: false, live: true },
        ];
      } else {
        alert(`Unexpected number of teams after Super Knockout: ${newTeams.length}`);
        return;
      }
    } else if (currentPhase === 'preQuarter') {
      const winners = currentMatches
        .filter((m) => m.winner)
        .map((m) => teams.find((t) => t.id === m.winner));
      const topSeeds = teams.slice(0, 8);
      newTeams = [...topSeeds, ...winners].sort((a, b) => a.seed - b.seed).slice(0, 8);
      if (newTeams.length < 8) {
        alert(`Insufficient teams for quarter-finals: ${newTeams.length}`);
        return;
      }
      nextPhase = 'quarter';
      newMatches = [
        { id: 'quarter-1', team1: newTeams[0], team2: newTeams[7], round: 2, phase: 'quarter', winner: null, played: false, live: true },
        { id: 'quarter-2', team1: newTeams[1], team2: newTeams[6], round: 2, phase: 'quarter', winner: null, played: false, live: false },
        { id: 'quarter-3', team1: newTeams[2], team2: newTeams[5], round: 2, phase: 'quarter', winner: null, played: false, live: false },
        { id: 'quarter-4', team1: newTeams[3], team2: newTeams[4], round: 2, phase: 'quarter', winner: null, played: false, live: false },
      ];
    } else if (currentPhase === 'quarter' || currentPhase === 'playOff') {
      newTeams = currentMatches
        .filter((m) => m.winner)
        .map((m) => teams.find((t) => t.id === m.winner));
      if (newTeams.length < 4) {
        alert(`Insufficient teams for semi-finals: ${newTeams.length}`);
        return;
      }
      nextPhase = 'semi';
      newMatches = [
        { id: 'semi-1', team1: newTeams[0], team2: newTeams[3], round: 3, phase: 'semi', winner: null, played: false, live: true },
        { id: 'semi-2', team1: newTeams[1], team2: newTeams[2], round: 3, phase: 'semi', winner: null, played: false, live: false },
      ];
    } else if (currentPhase === 'eliminatorElite') {
      const winners = currentMatches
        .filter((m) => m.winner)
        .map((m) => teams.find((t) => t.id === m.winner));
      const losers = currentMatches
        .filter((m) => m.winner)
        .map((m) => (m.team1.id === m.winner ? m.team2 : m.team1));
      if (winners.length < 2) {
        alert(`Insufficient winners for final: ${winners.length}`);
        return;
      }
      nextPhase = 'final';
      newMatches = [
        { id: 'final', team1: winners[0], team2: winners[1], round: 4, phase: 'final', winner: null, played: false, live: true },
      ];
      if (losers.length === 2) {
        newMatches.push({
          id: 'third-place',
          team1: losers[0],
          team2: losers[1],
          round: 4,
          phase: 'thirdPlace',
          winner: null,
          played: false,
          live: false,
        });
      }
    } else if (currentPhase === 'semi') {
      newTeams = currentMatches
        .filter((m) => m.winner)
        .map((m) => teams.find((t) => t.id === m.winner));
      if (newTeams.length < 2) {
        alert(`Insufficient teams for final: ${newTeams.length}`);
        return;
      }
      nextPhase = 'final';
      newMatches = [
        { id: 'final', team1: newTeams[0], team2: newTeams[1], round: 4, phase: 'final', winner: null, played: false, live: true },
      ];
    }

    if (newMatches.length > 0) {
      setMatches(newMatches);
      setMatchHistory((prev) => [...prev, ...newMatches]);
      setCurrentPhase(nextPhase);
      setPhaseHistory((prev) => [...prev, nextPhase]);
      setLiveMatchIndex(0);
    }
  };

  const advanceSuperLeague = () => {
    const sortedStandings = [...superLeagueStandings].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.wins - a.wins;
    });
    const topFour = sortedStandings.slice(0, 4);
    if (topFour.length < 4) {
      alert(`Insufficient teams for Super League semi-finals: ${topFour.length}`);
      return;
    }
    const newMatches = [
      { id: 'semi-1', team1: topFour[0], team2: topFour[3], round: 1, phase: 'semi', winner: null, played: false, live: true },
      { id: 'semi-2', team1: topFour[1], team2: topFour[2], round: 1, phase: 'semi', winner: null, played: false, live: false },
    ];
    setMatches(newMatches);
    setMatchHistory((prev) => [...prev, ...newMatches]);
    setCurrentPhase('semi');
    setPhaseHistory((prev) => [...prev, 'semi']);
    setLiveMatchIndex(0);
  };

  const getNextLiveMatch = () => {
    return matches.find((m) => m.live && !m.played && !m.team1?.isBye && !m.team2?.isBye);
  };

  const handleNext = () => {
    const liveMatch = getNextLiveMatch();
    if (!liveMatch) {
      alert('No live matches available.');
      return;
    }
    navigate('/match-start-ko', {
      state: {
        teams,
        matches,
        currentPhase,
        matchId: liveMatch.id,
        match: liveMatch,
        format,
        matchHistory,
        phaseHistory,
        superLeagueStandings,
        liveMatchIndex,
        tournamentWinner,
        origin: '/selection',
        activeTab: 'Start Match'
      },
    });
  };

  const getPhaseName = (phase, teamCount = teams.length) => {
    if (phase === 'superKnockout') {
      const byeCount = teamCount >= 16 ? 4 : teamCount === 15 ? 1 : teamCount > 10 ? teamCount - 10 : teamCount > 8 ? teamCount - 8 : 0;
      const competingTeams = teamCount - byeCount;
      return teamCount <= 2 ? 'Final' : `Round of ${competingTeams}`;
    }
    switch (phase) {
      case 'preQuarter': return 'Pre-Quarterfinals';
      case 'quarter': return 'Quarterfinals';
      case 'playOff': return 'Quarterfinals';
      case 'semi': return 'Semifinals';
      case 'eliminatorElite': return 'Semifinals';
      case 'final': return 'Final';
      case 'championship': return 'Final';
      case 'thirdPlace': return 'Third Place';
      case 'superLeague': return 'League Stage';
      default: return phase.charAt(0).toUpperCase() + phase.slice(1);
    }
  };

  const handleFormatSelection = (selectedFormat) => {
    const teamCount = teams.length;
    if (selectedFormat === 'championship' && teamCount !== 2) {
      alert('Championship format requires exactly 2 teams.');
      return;
    } else if (selectedFormat === 'eliminatorElite' && teamCount !== 4) {
      alert('Eliminator Elite format requires exactly 4 teams.');
      return;
    } else if (selectedFormat === 'playOff' && teamCount !== 8) {
      alert('Play Off format requires exactly 8 teams.');
      return;
    } else if (selectedFormat === 'superLeague' && teamCount !== 8) {
      alert('Super League format requires exactly 8 teams.');
      return;
    } else if (selectedFormat === 'knockout' && teamCount !== 12) {
      alert('Knockout format requires exactly 12 teams.');
      return;
    } else if (selectedFormat === 'superKnockout' && teamCount < 2) {
      alert('Super Knockout format requires at least 2 teams.');
      return;
    }
    initializeBracket(selectedFormat);
  };

  const handleTeamCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setSelectedTeamCount(count);
    setFormat(null);
    setMatches([]);
    setMatchHistory([]);
    setCurrentPhase(null);
    setTournamentWinner(null);
    setLiveMatchIndex(0);
    setSuperLeagueStandings([]);
    setHistoricalMatchResults({});
  };

  const renderMatch = (match, isFuture = false) => {
    const isLive = match.live && !match.played && !match.team1?.isBye && !match.team2?.isBye && !isFuture;
    const isCompleted = match.played && !isFuture;
    const hasBye = match.team1?.isBye || match.team2?.isBye;

    return (
      <motion.div
        key={match.id}
        className={`p-3 rounded-lg border-2 ${
          isFuture ? 'border-gray-300 bg-gray-50 opacity-50' :
          hasBye ? 'border-gray-400 bg-gray-100' :
          isLive ? 'border-yellow-600 bg-yellow-50 animate-pulse' :
          isCompleted ? 'border-green-600 bg-green-100' :
          'border-blue-400 bg-blue-100'
        } w-64`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center">
          <div className={`w-full p-2 mb-1 rounded ${
            match.winner === match.team1?.id ? 'font-bold text-green-700' :
            match.winner && match.winner !== match.team1?.id ? 'text-red-600' :
            'text-gray-800'
          }`}>
            {match.team1?.isBye ? 'BYE' : match.team1?.name || 'TBD'}
          </div>
          <div className="text-center font-bold">vs</div>
          <div className={`w-full p-2 mt-1 rounded ${
            match.winner === match.team2?.id ? 'font-bold text-green-700' :
            match.winner && match.winner !== match.team2?.id ? 'text-red-600' :
            'text-gray-800'
          }`}>
            {match.team2?.isBye ? 'BYE' : match.team2?.name || 'TBD'}
          </div>
          {isCompleted && match.winner && (
            <div className="mt-2 text-sm font-semibold text-center text-green-700">
              Winner: {teams.find((t) => t.id === match.winner)?.name || 'Unknown'}
            </div>
          )}
          {isLive && (
            <div className="mt-2 text-sm font-semibold text-center text-yellow-600">
              Live Match
            </div>
          )}
          {isFuture && (
            <div className="mt-2 text-sm font-semibold text-center text-gray-500">
              Upcoming
            </div>
          )}
          </div>
        </motion.div>
      );
  };

  const renderKnockoutTree = () => {
    if (!format || !teams.length) {
      return (
        <div className="text-center p-4 text-red-600">
          Error: Unable to render tournament structure
        </div>
      );
    }

    const structure = getTournamentStructure();
    const getPhaseColor = (phase, isCurrent) => {
      const baseColor = (() => {
        switch (phase) {
          case 'final':
          case 'championship':
            return 'border-green-200 text-green-600';
          case 'semi':
          case 'eliminatorElite':
            return 'border-purple-200 text-purple-600';
          case 'quarter':
          case 'playOff':
          case 'superLeague':
            return 'border-yellow-200 text-yellow-600';
          case 'superKnockout':
          case 'preQuarter':
            return 'border-blue-200 text-blue-600';
          default:
            return 'border-gray-200 text-gray-600';
        }
      })();
      return isCurrent ? baseColor.replace('200', '400') : baseColor;
    };

    const getFutureMatches = (phase, index) => {
      const prevPhaseMatches = index === 0 ? [] : matchHistory.filter((m) => m.phase === structure[index - 1].phase);
      let matches = [];
      const matchCount = structure[index].matchCount;

      if (phase === 'preQuarter' && format === 'knockout') {
        matches = [
          { id: 'pre-quarter-1', team1: teams[8], team2: teams[11], round: 0, phase: 'preQuarter', winner: null, played: false, live: false },
          { id: 'pre-quarter-2', team1: teams[9], team2: teams[10], round: 0, phase: 'preQuarter', winner: null, played: false, live: false },
        ];
      } else if (phase === 'quarter' && format === 'knockout') {
        const preQuarterWinners = prevPhaseMatches.filter((m) => m.winner).map((m) => teams.find((t) => t.id === m.winner));
        matches = [
          { id: 'quarter-1', team1: teams[0], team2: preQuarterWinners[0] || { name: 'TBD' }, round: 1, phase: 'quarter', winner: null, played: false, live: false },
          { id: 'quarter-2', team1: teams[1], team2: preQuarterWinners[1] || { name: 'TBD' }, round: 1, phase: 'quarter', winner: null, played: false, live: false },
          { id: 'quarter-3', team1: teams[2], team2: teams[5], round: 1, phase: 'quarter', winner: null, played: false, live: false },
          { id: 'quarter-4', team1: teams[3], team2: teams[4], round: 1, phase: 'quarter', winner: null, played: false, live: false },
        ];
      } else if (phase === 'quarter' && format === 'superKnockout') {
        const prevWinners = prevPhaseMatches.filter((m) => m.winner).map((m) => teams.find((t) => t.id === m.winner));
        const byeTeams = teams.slice(0, teams.length >= 16 ? 4 : teams.length === 15 ? 1 : teams.length > 10 ? teams.length - 10 : teams.length - 8);
        const nextTeams = [...prevWinners, ...byeTeams].sort((a, b) => a.seed - b.seed);
        matches = [
          { id: 'quarter-1', team1: nextTeams[0] || { name: 'TBD' }, team2: nextTeams[7] || { name: 'TBD' }, round: 1, phase: 'quarter', winner: null, played: false, live: false },
          { id: 'quarter-2', team1: nextTeams[1] || { name: 'TBD' }, team2: nextTeams[6] || { name: 'TBD' }, round: 1, phase: 'quarter', winner: null, played: false, live: false },
          { id: 'quarter-3', team1: nextTeams[2] || { name: 'TBD' }, team2: nextTeams[5] || { name: 'TBD' }, round: 1, phase: 'quarter', winner: null, played: false, live: false },
          { id: 'quarter-4', team1: nextTeams[3] || { name: 'TBD' }, team2: nextTeams[4] || { name: 'TBD' }, round: 1, phase: 'quarter', winner: null, played: false, live: false },
        ];
      } else if (phase === 'semi') {
        const prevWinners = prevPhaseMatches.filter((m) => m.winner).map((m) => teams.find((t) => t.id === m.winner));
        matches = [
          { id: 'semi-1', team1: prevWinners[0] || { name: 'Winner of Q1' }, team2: prevWinners[3] || { name: 'Winner of Q4' }, round: index, phase: 'semi', winner: null, played: false, live: false },
          { id: 'semi-2', team1: prevWinners[1] || { name: 'Winner of Q2' }, team2: prevWinners[2] || { name: 'Winner of Q3' }, round: index, phase: 'semi', winner: null, played: false, live: false },
        ];
      } else if (phase === 'final') {
        const prevWinners = prevPhaseMatches.filter((m) => m.winner).map((m) => teams.find((t) => t.id === m.winner));
        matches = [
          { id: 'final', team1: prevWinners[0] || { name: 'Winner of S1' }, team2: prevWinners[1] || { name: 'Winner of S2' }, round: index, phase: 'final', winner: null, played: false, live: false },
        ];
      } else if (phase === 'thirdPlace') {
        const prevLosers = prevPhaseMatches
          .filter((m) => m.winner && m.phase === 'eliminatorElite')
          .map((m) => (m.team1.id === m.winner ? m.team2 : m.team1));
        matches = [
          { id: 'third-place', team1: prevLosers[0] || { name: 'Loser of S1' }, team2: prevLosers[1] || { name: 'Loser of S2' }, round: index, phase: 'thirdPlace', winner: null, played: false, live: false },
        ];
      } else {
        for (let i = 0; i < matchCount; i++) {
          matches.push({
            id: `${phase}-${i + 1}`,
            team1: { name: 'TBD' },
            team2: { name: 'TBD' },
            round: index,
            phase,
            winner: null,
            played: false,
            live: false,
          });
        }
      }
      return matches;
    };

    return (
      <div className="w-full max-w-6xl mx-auto space-y-12">
        {structure.map((stage, index) => {
          const isCurrent = stage.phase === currentPhase;
          const isFuture = phaseHistory.indexOf(stage.phase) === -1 && !isCurrent;
          const actualMatches = matchHistory.filter((m) => m.phase === stage.phase);
          const displayMatches = actualMatches.length > 0 ? actualMatches : getFutureMatches(stage.phase, index);

          return (
            <div
              key={stage.phase}
              className={`bg-white p-6 rounded-xl shadow-lg border-2 ${getPhaseColor(stage.phase, isCurrent)} ${
                isFuture ? 'opacity-50' : ''
              } relative`}
            >
              <h3 className={`text-2xl font-bold mb-4 ${getPhaseColor(stage.phase, isCurrent).split(' ')[1]}`}>
                {stage.roundName} {isCurrent && !tournamentWinner ? '(Current)' : ''}
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {displayMatches.map((match) => renderMatch(match, isFuture))}
              </div>
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Fixtures</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-gray-800">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-3">Match ID</th>
                        <th className="p-3">Team 1</th>
                        <th className="p-3">Team 2</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Winner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayMatches.map((match) => (
                        <tr key={match.id} className="border-b border-gray-300">
                          <td className="p-3">{match.id}</td>
                          <td className="p-3">{match.team1?.name || 'TBD'}</td>
                          <td className="p-3">{match.team2?.name || 'TBD'}</td>
                          <td className="p-3">
                            {isFuture ? 'Scheduled' : match.played ? 'Played' : match.live ? 'Live' : 'Scheduled'}
                          </td>
                          <td className="p-3">
                            {match.winner ? teams.find((t) => t.id === match.winner)?.name || 'Unknown' : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {index < structure.length - 1 && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gray-400"></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderSuperLeagueStandings = () => {
    if (currentPhase !== 'superLeague' || !superLeagueStandings.length) return null;
    const sortedStandings = [...superLeagueStandings].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.wins - a.wins;
    });

    return (
      <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Super League Standings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-800">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3">Rank</th>
                <th className="p-3">Team</th>
                <th className="p-3">Points</th>
                <th className="p-3">Wins</th>
              </tr>
            </thead>
            <tbody>
              {sortedStandings.map((team, index) => (
                <tr key={team.id} className="border-b border-gray-300">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{team.name}</td>
                  <td className="p-3">{team.points}</td>
                  <td className="p-3">{team.wins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Number of Teams
          </h2>
          <select
            value={selectedTeamCount}
            onChange={handleTeamCountChange}
            className="px-4 py-2 rounded-lg border-2 border-gray-400 focus:outline-none focus:border-purple-600"
          >
            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((count) => (
              <option key={count} value={count}>{count} Teams</option>
            ))}
          </select>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Select Tournament Format
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['championship', 'eliminatorElite', 'playOff',  'knockout', 'superKnockout'].map((formatType) => (
              <button
                key={formatType}
                onClick={() => handleFormatSelection(formatType)}
                className={`px-6 py-3 rounded-lg text-white ${
                  format === formatType ? 'bg-purple-700' :
                  (formatType === validFormat || (formatType === 'superLeague' && selectedTeamCount === 8)) ? 'bg-purple-600 hover:bg-purple-700' :
                  'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!(formatType === validFormat || (formatType === 'superLeague' && selectedTeamCount === 8))}
              >
                {formatType === 'superKnockout' ? 'Super Knockout' :
                 formatType === 'knockout' ? 'Knockout' :
                 formatType === 'playOff' ? 'Play Off' :
                 formatType === 'eliminatorElite' ? 'Eliminator Elite' :
                 formatType === 'championship' ? 'Championship' :
                 'Super League'}
              </button>
            ))}
          </div>
        </div>

        {format && (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
              {format.charAt(0).toUpperCase() + format.slice(1)} Flowchart
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
              {renderSuperLeagueStandings()}
            </div>

            {!tournamentWinner && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                  disabled={!getNextLiveMatch()}
                >
                  Next Match
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Selection;