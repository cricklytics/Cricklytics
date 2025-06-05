import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../firebase';
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';

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
  const [matchHistory, setMatchHistory] = useState([]);
  const [tournamentId, setTournamentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canAdvanceToNextRound, setCanAdvanceToNextRound] = useState(false);

  useEffect(() => {
    console.log('TournamentBracket received state:', location.state);

    const fetchTournament = async () => {
      const { tournamentId: stateTournamentId, currentPhase: stateCurrentPhase, teams: stateTeams, format: stateFormat } = location.state || {};

      if (stateTeams && !stateTournamentId) {
        const initialTeams = stateTeams.map((t, i) => ({
          ...t,
          id: t.id || generateUUID(),
          seed: t.seed || i + 1,
        }));
        setTeams(initialTeams);
        setTournamentId(null);
        setCurrentPhase(null);
        setTournamentWinner(null);
        setMatches([]);
        setPhaseHistory([]);
        setMatchHistory([]);
        setFormat(null);
      } else if (stateTournamentId) {
        try {
          const tournamentDocRef = doc(db, 'KnockoutTournamentMatches', stateTournamentId);
          const tournamentDoc = await getDoc(tournamentDocRef);
          if (tournamentDoc.exists()) {
            const data = tournamentDoc.data();
            console.log('Fetched tournament data:', data);
            setTeams(data.teams || []);
            setTournamentId(stateTournamentId);
            setCurrentPhase(stateCurrentPhase || data.currentPhase);
            setTournamentWinner(data.tournamentWinner || null);
            setFormat(data.format || stateFormat);
            const currentRound = data.rounds.find((r) => r.stage === (stateCurrentPhase || data.currentPhase));
            if (currentRound) {
              setMatches(currentRound.matches || []);
              setMatchHistory(currentRound.matches || []);
              setCanAdvanceToNextRound(currentRound.matches.every((m) => m.played));
            }
          } else {
            setError('Tournament not found in database.');
            navigate('/TournamentPage');
            return;
          }
        } catch (err) {
          console.error('Error fetching tournament:', err);
          setError('Failed to load tournament data.');
        }
      } else {
        console.error('No teams or tournamentId provided in location state.');
        alert('Please select teams or provide a valid tournament ID.');
        navigate('/TournamentPage');
        return;
      }
      setLoading(false);
    };

    fetchTournament();
  }, [location.state, navigate]);

  const initializeTournament = async (formatType) => {
    setFormat(formatType);
    const teamCount = teams.length;
    const seededTeams = [...teams].sort((a, b) => a.seed - b.seed);

    if (tournamentId) {
      try {
        const tournamentDocRef = doc(db, 'KnockoutTournamentMatches', tournamentId);
        const tournamentDoc = await getDoc(tournamentDocRef);
        if (tournamentDoc.exists()) {
          const data = tournamentDoc.data();
          const currentRound = data.rounds.find((r) => r.stage === currentPhase);
          if (currentRound && currentRound.matches.length > 0) {
            console.log('Matches already exist for this tournament. Skipping reinitialization.');
            return;
          }
        }
      } catch (error) {
        console.error('Error checking existing matches in Firebase:', error);
      }
    }

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
      const newTournamentId = tournamentId || generateUUID();
      setTournamentId(newTournamentId);
      const preQuarterMatches = [
        {
          id: 'pre-quarter-1',
          team1: seededTeams[8], // Seed 9
          team2: seededTeams[11], // Seed 12
          round: 0,
          phase: 'preQuarter',
          winner: null,
          played: false,
        },
        {
          id: 'pre-quarter-2',
          team1: seededTeams[9], // Seed 10
          team2: seededTeams[10], // Seed 11
          round: 0,
          phase: 'preQuarter',
          winner: null,
          played: false,
        },
      ];
      const rounds = [
        { name: 'Pre-Quarterfinals', matches: preQuarterMatches, roundNumber: 0, stage: 'preQuarter' },
        { name: 'Quarterfinals', matches: [], roundNumber: 1, stage: 'quarter' },
        { name: 'Semifinals', matches: [], roundNumber: 2, stage: 'semi' },
        { name: 'Final', matches: [], roundNumber: 3, stage: 'final' },
      ];

      try {
        console.log('Initializing knockout tournament in Firebase:', {
          format: 'knockout',
          teams: seededTeams,
          rounds,
          currentPhase: 'preQuarter',
          tournamentWinner: null,
        });
        await setDoc(doc(db, 'KnockoutTournamentMatches', newTournamentId), {
          format: 'knockout',
          teams: seededTeams,
          rounds,
          currentPhase: 'preQuarter',
          tournamentWinner: null,
        });
        console.log('Knockout tournament initialized successfully in Firebase');
      } catch (error) {
        console.error('Error initializing tournament in Firebase:', error);
        alert('Failed to initialize tournament. Please try again.');
        window.location.reload();
        return;
      }

      setMatches(preQuarterMatches);
      setMatchHistory(preQuarterMatches);
      setCurrentPhase('preQuarter');
      setPhaseHistory(['preQuarter']);
    } else if (formatType === 'playOff') {
      if (teamCount !== 8) {
        console.error(`Play Off format requires exactly 8 teams, received ${teamCount}.`);
        alert('Play Off format requires exactly 8 teams.');
        window.location.reload();
        return;
      }
      const newTournamentId = tournamentId || generateUUID();
      setTournamentId(newTournamentId);
      const quarterMatches = [
        { id: 'r0-0', team1: seededTeams[0], team2: seededTeams[7], round: 0, phase: 'quarter', winner: null, played: false },
        { id: 'r0-1', team1: seededTeams[1], team2: seededTeams[6], round: 0, phase: 'quarter', winner: null, played: false },
        { id: 'r0-2', team1: seededTeams[2], team2: seededTeams[5], round: 0, phase: 'quarter', winner: null, played: false },
        { id: 'r0-3', team1: seededTeams[3], team2: seededTeams[4], round: 0, phase: 'quarter', winner: null, played: false },
      ];
      const rounds = [
        { name: 'Quarterfinals', matches: quarterMatches, roundNumber: 0, stage: 'quarter' },
        { name: 'Semifinals', matches: [], roundNumber: 1, stage: 'semi' },
        { name: 'Final', matches: [], roundNumber: 2, stage: 'final' },
      ];

      try {
        console.log('Initializing playOff tournament in Firebase:', {
          format: 'playOff',
          teams: seededTeams,
          rounds,
          currentPhase: 'quarter',
          tournamentWinner: null,
        });
        await setDoc(doc(db, 'KnockoutTournamentMatches', newTournamentId), {
          format: 'playOff',
          teams: seededTeams,
          rounds,
          currentPhase: 'quarter',
          tournamentWinner: null,
        });
        console.log('playOff tournament initialized successfully in Firebase');
      } catch (error) {
        console.error('Error initializing tournament in Firebase:', error);
        alert('Failed to initialize tournament. Please try again.');
        window.location.reload();
        return;
      }

      setMatches(quarterMatches);
      setMatchHistory(quarterMatches);
      setCurrentPhase('quarter');
      setPhaseHistory(['quarter']);
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
    setCanAdvanceToNextRound(false);
  };

  const getRoundNumberForPhase = (phase) => {
    switch (phase) {
      case 'preQuarter':
        return 0;
      case 'quarter':
        return 1;
      case 'semi':
        return 2;
      case 'final':
        return 3;
      default:
        return -1;
    }
  };

  const fetchWinnersByRoundFromFirebase = async (tournamentId, roundNumber) => {
    try {
      const tournamentDocRef = doc(db, 'KnockoutTournamentMatches', tournamentId);
      const tournamentDoc = await getDoc(tournamentDocRef);
      if (tournamentDoc.exists()) {
        const data = tournamentDoc.data();
        console.log('Fetched Firebase data for winners:', data);
        const allMatches = data.rounds.flatMap((r) => r.matches);
        console.log(`All matches from Firebase:`, allMatches);
        const roundMatches = allMatches.filter((m) => m.round === roundNumber);
        console.log(`Matches in round ${roundNumber} from Firebase:`, roundMatches);
        const winners = roundMatches
          .filter((m) => m.winner)
          .map((m) => {
            const winnerTeam = m.team1.name === m.winner ? m.team1 : m.team2;
            return { ...winnerTeam };
          });
        console.log(`Winners fetched from Firebase for round ${roundNumber}:`, winners);
        return winners;
      } else {
        console.error('Tournament document not found in Firebase');
        return [];
      }
    } catch (error) {
      console.error('Error fetching winners from Firebase:', error);
      return [];
    }
  };

  useEffect(() => {
    if ((format === 'playOff' || format === 'knockout') && currentPhase && tournamentId) {
      const unsubscribe = onSnapshot(doc(db, 'KnockoutTournamentMatches', tournamentId), (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          console.log('onSnapshot received data:', data);
          const currentRound = data.rounds.find((r) => r.stage === currentPhase);
          if (currentRound) {
            const updatedMatches = currentRound.matches.map((match) => ({
              ...match,
              played: !!match.winner || match.played,
            }));
            console.log('Updated matches from onSnapshot:', updatedMatches);
            setMatches((prevMatches) => {
              const matchesChanged = JSON.stringify(prevMatches) !== JSON.stringify(updatedMatches);
              if (matchesChanged) {
                console.log('Matches updated via onSnapshot:', updatedMatches);
                return [...updatedMatches];
              }
              return prevMatches;
            });
            setMatchHistory((prev) => {
              const existingIds = new Set(prev.map((m) => m.id));
              const newMatches = updatedMatches.filter((m) => !existingIds.has(m.id) || m.winner || m.played);
              const updatedHistory = [...prev.filter((m) => !newMatches.some((nm) => nm.id === m.id)), ...newMatches];
              if (JSON.stringify(prev) !== JSON.stringify(updatedHistory)) {
                console.log('Match history updated via onSnapshot:', updatedHistory);
                return updatedHistory;
              }
              return prev;
            });

            const allMatchesPlayed = updatedMatches.every((m) => m.played);
            console.log(`All matches played in ${currentPhase}: ${allMatchesPlayed}`);
            setCanAdvanceToNextRound(allMatchesPlayed);

            if (allMatchesPlayed) {
              const advanceToNextRound = async () => {
                const roundNumber = getRoundNumberForPhase(currentPhase);
                const winners = await fetchWinnersByRoundFromFirebase(tournamentId, roundNumber);
                if (format === 'playOff') {
                  if (currentPhase === 'quarter' && winners.length === 4) {
                    console.log('Advancing from Quarter Finals to Semi Finals');
                    initializeSemiFinals(winners, tournamentId);
                  } else if (currentPhase === 'semi' && winners.length === 2) {
                    console.log('Advancing from Semi Finals to Final');
                    initializeFinal(winners, tournamentId);
                  } else if (currentPhase === 'final' && winners.length === 1) {
                    console.log('Setting tournament winner');
                    setTournamentWinner(winners[0].name);
                    await setDoc(doc(db, 'KnockoutTournamentMatches', tournamentId), { tournamentWinner: winners[0].name }, { merge: true });
                    console.log(`Tournament winner set: ${winners[0].name}`);
                    setCanAdvanceToNextRound(false);
                  } else {
                    console.warn(`Cannot advance from ${currentPhase}: Expected winners not found. Winners:`, winners);
                  }
                } else if (format === 'knockout') {
                  if (currentPhase === 'preQuarter' && winners.length === 2) {
                    console.log('Advancing from Pre-Quarter Finals to Quarter Finals');
                    initializeQuarterFinals(winners, tournamentId);
                  } else if (currentPhase === 'quarter' && winners.length === 4) {
                    console.log('Advancing from Quarter Finals to Semi Finals');
                    initializeSemiFinals(winners, tournamentId);
                  } else if (currentPhase === 'semi' && winners.length === 2) {
                    console.log('Advancing from Semi Finals to Final');
                    initializeFinal(winners, tournamentId);
                  } else if (currentPhase === 'final' && winners.length === 1) {
                    console.log('Setting tournament winner');
                    setTournamentWinner(winners[0].name);
                    await setDoc(doc(db, 'KnockoutTournamentMatches', tournamentId), { tournamentWinner: winners[0].name }, { merge: true });
                    console.log(`Tournament winner set: ${winners[0].name}`);
                    setCanAdvanceToNextRound(false);
                  } else {
                    console.warn(`Cannot advance from ${currentPhase}: Expected winners not found. Winners:`, winners);
                  }
                }
              };
              advanceToNextRound();
            }
          }
        }
      }, (error) => {
        console.error('onSnapshot error:', error);
      });

      return () => unsubscribe();
    }
  }, [format, currentPhase, teams, tournamentId]);

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
    setCanAdvanceToNextRound(false);
  };

  const initializeQuarterFinals = async (preQuarterWinners, tournamentId) => {
    const topSeeds = teams.sort((a, b) => a.seed - b.seed).slice(0, 6); // Seeds 1-6
    const teamsForQuarter = [...topSeeds, ...preQuarterWinners].sort((a, b) => (a.seed || 0) - (b.seed || 0));
    if (teamsForQuarter.length !== 8) {
      console.error(`Quarter Finals requires 8 teams, got ${teamsForQuarter.length}`);
      alert('Error: Quarter Finals need exactly 8 teams.');
      return;
    }

    const matches = [
      { id: 'quarter-1', team1: teamsForQuarter[0], team2: teamsForQuarter[7], round: 1, phase: 'quarter', winner: null, played: false },
      { id: 'quarter-2', team1: teamsForQuarter[1], team2: teamsForQuarter[6], round: 1, phase: 'quarter', winner: null, played: false },
      { id: 'quarter-3', team1: teamsForQuarter[2], team2: teamsForQuarter[5], round: 1, phase: 'quarter', winner: null, played: false },
      { id: 'quarter-4', team1: teamsForQuarter[3], team2: teamsForQuarter[4], round: 1, phase: 'quarter', winner: null, played: false },
    ];

    try {
      const tournamentDocRef = doc(db, 'KnockoutTournamentMatches', tournamentId);
      const tournamentDoc = await getDoc(tournamentDocRef);
      if (tournamentDoc.exists()) {
        const existingData = tournamentDoc.data();
        console.log('Before initializing quarter-finals, existing rounds:', existingData.rounds);
        const updatedRounds = existingData.rounds.map((round) => {
          if (round.stage === 'quarter') {
            return { ...round, matches };
          }
          return round;
        });
        console.log('After initializing quarter-finals, updated rounds:', updatedRounds);
        await setDoc(tournamentDocRef, {
          rounds: updatedRounds,
          currentPhase: 'quarter',
        }, { merge: true });
        console.log('Quarter-finals initialized successfully in Firebase');
      }
      setMatches(matches);
      setMatchHistory((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newMatches = matches.filter((m) => !existingIds.has(m.id));
        return [...prev, ...newMatches];
      });
      setCurrentPhase('quarter');
      setPhaseHistory((prev) => [...prev, 'preQuarter']);
      setCanAdvanceToNextRound(false);
    } catch (error) {
      console.error('Error initializing quarter-finals in Firebase:', error);
      alert('Failed to initialize quarter-finals. Please try again.');
    }
  };

  const initializeSemiFinals = async (teamsForSemi, tournamentId) => {
    if (teamsForSemi.length !== 4) {
      console.error(`Semi Finals requires 4 teams, got ${teamsForSemi.length}`);
      alert('Failed to update matches for semi-finals. Please try again.');
      return;
    }
    const sortedTeams = [...teamsForSemi].sort((a, b) => (a.seed || 0) - (b.seed || 0));
    const matches = [
      { id: 'semi-1', team1: sortedTeams[0], team2: sortedTeams[3], round: 2, phase: 'semi', winner: null, played: false },
      { id: 'semi-2', team1: sortedTeams[1], team2: sortedTeams[2], round: 2, phase: 'semi', winner: null, played: false },
    ];
    try {
      const tournamentDocRef = doc(db, 'KnockoutTournamentMatches', tournamentId);
      const tournamentDoc = await getDoc(tournamentDocRef);
      if (tournamentDoc.exists()) {
        const existingData = tournamentDoc.data();
        console.log('Before initializing semi-finals, existing rounds:', existingData.rounds);
        const updatedRounds = existingData.rounds.map((round) => {
          if (round.stage === 'semi') {
            return { ...round, matches };
          }
          return round;
        });
        console.log('After initializing semi-finals, updated rounds:', updatedRounds);
        await setDoc(tournamentDocRef, {
          rounds: updatedRounds,
          currentPhase: 'semi',
        }, { merge: true });
        console.log('Semi-finals initialized successfully in Firebase');
      }
      setMatches(matches);
      setMatchHistory((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newMatches = matches.filter((m) => !existingIds.has(m.id));
        return [...prev, ...newMatches];
      });
      setCurrentPhase('semi');
      setPhaseHistory((prev) => [...prev, 'quarter']);
      setCanAdvanceToNextRound(false);
    } catch (error) {
      console.error('Error initializing semi-finals in Firebase:', error);
      alert('Failed to initialize semi-finals. Please try again.');
    }
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
    setCanAdvanceToNextRound(false);
  };

  const initializeFinal = async (winners, tournamentId) => {
    if (winners.length !== 2) {
      console.error(`Final expects 2 teams, received ${winners.length}`);
      alert('Failed to proceed to finals. Please check and try again.');
      return;
    }
    const sortedTeams = [...winners].sort((a, b) => (a.seed || 0) - (b.seed || 0));
    const finalMatch = [
      {
        id: 'final',
        team1: sortedTeams[0],
        team2: sortedTeams[1],
        round: 3,
        phase: 'final',
        winner: null,
        played: false,
      },
    ];
    try {
      const tournamentDocRef = doc(db, 'KnockoutTournamentMatches', tournamentId);
      const tournamentDoc = await getDoc(tournamentDocRef);
      if (tournamentDoc.exists()) {
        const existingData = tournamentDoc.data();
        console.log('Before initializing final, existing rounds:', existingData.rounds);
        const updatedRounds = existingData.rounds.map((round) => {
          if (round.stage === 'final') {
            return { ...round, matches: finalMatch };
          }
          return round;
        });
        console.log('After initializing final, updated rounds:', updatedRounds);
        await setDoc(tournamentDocRef, {
          rounds: updatedRounds,
          currentPhase: 'final',
        }, { merge: true });
        console.log('Final initialized successfully in Firebase');
      }
      setMatches(finalMatch);
      setMatchHistory((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newMatches = finalMatch.filter((m) => !existingIds.has(m.id));
        return [...prev, ...newMatches];
      });
      setCurrentPhase('final');
      setPhaseHistory((prev) => [...prev, 'semi']);
      setCanAdvanceToNextRound(false);
    } catch (error) {
      console.error('Error initializing final in Firebase:', error);
      alert('Failed to initialize final. Please try again.');
    }
  };

  const handleMatchResult = (matchId, winnerId) => {
    if (tournamentWinner) return;

    setMatches((prevMatches) => {
      const updatedMatches = prevMatches.map((match) => {
        if (match.id === matchId) {
          const winnerTeam = match.team1.id === winnerId ? match.team1 : match.team2;
          return { ...match, winner: winnerTeam.name, played: true };
        }
        return match;
      });

      setMatchHistory((prev) => {
        const existingMatch = prev.find((m) => m.id === matchId);
        if (existingMatch) {
          const winnerTeam = existingMatch.team1.id === winnerId ? existingMatch.team1 : existingMatch.team2;
          return prev.map((m) => (m.id === matchId ? { ...m, winner: winnerTeam.name, played: true } : m));
        }
        return [...prev, ...updatedMatches.filter((m) => m.id === matchId)];
      });

      if ((format === 'playOff' || format === 'knockout') && tournamentId) {
        const updateFirebase = async () => {
          try {
            const tournamentDocRef = doc(db, 'KnockoutTournamentMatches', tournamentId);
            const tournamentDoc = await getDoc(tournamentDocRef);
            if (tournamentDoc.exists()) {
              const data = tournamentDoc.data();
              console.log('Before updating match result, existing rounds:', data.rounds);
              const updatedRounds = data.rounds.map((round) => {
                if (round.stage === currentPhase) {
                  const updatedRoundMatches = round.matches.map((m) => {
                    if (m.id === matchId) {
                      const winnerTeam = m.team1.id === winnerId ? m.team1 : m.team2;
                      return { ...m, winner: winnerTeam.name, played: true };
                    }
                    return m;
                  });
                  return { ...round, matches: updatedRoundMatches };
                }
                return round;
              });
              console.log('After updating match result, updated rounds:', updatedRounds);
              await setDoc(tournamentDocRef, { rounds: updatedRounds }, { merge: true });
              console.log(`Match result updated in Firebase: match ${matchId}, winner ${winnerId}`);
            }
          } catch (error) {
            console.error('Error updating match result in Firebase:', error);
            alert('Failed to update match result. Please try again.');
          }
        };
        updateFirebase();
      }

      const phaseMatches = updatedMatches.filter((m) => m.phase === currentPhase);
      if (phaseMatches.every((m) => m.played || m.team1?.isBye || m.team2?.isBye)) {
        if (currentPhase === 'superKnockout') {
          const winners = updatedMatches
            .filter((m) => m.phase === 'superKnockout' && m.winner && !m.team1?.isBye && !m.team2?.isBye)
            .map((m) => ({ name: m.winner }))
            .filter((t) => t);
          const byeTeams = teams.length >= 16 ? teams.slice(0, 4) : teams.length === 15 ? teams.slice(0, 1) : teams.length > 10 ? teams.slice(0, teams.length - 10) : teams.length > 8 ? teams.slice(0, teams.length - 8) : [];
          const nextTeams = [...winners, ...byeTeams].sort((a, b) => (a.seed || 0) - (b.seed || 0));

          if (nextTeams.length === 10) {
            initializePreQuarter(nextTeams);
          } else if (nextTeams.length === 8) {
            initializeQuarterFinals(nextTeams, tournamentId);
          } else {
            console.error(`Unexpected number of teams after Super Knockout: ${nextTeams.length}`);
            alert(`Error advancing from Super Knockout. Expected 8 or 10 teams, got ${nextTeams.length}.`);
            window.location.reload();
            return updatedMatches;
          }
        } else if (currentPhase === 'preQuarter' && format === 'knockout') {
          const winners = updatedMatches
            .filter((m) => m.phase === 'preQuarter' && m.winner)
            .map((m) => {
              const winnerTeam = m.team1.name === m.winner ? m.team1 : m.team2;
              return { ...winnerTeam };
            })
            .filter(Boolean);

          if (winners.length !== 2) {
            console.error(`Expected 2 winners for Quarter Finals from preQuarter, got ${winners.length}`);
            alert(`Error: Expected 2 winners for Quarter Finals from preQuarter, got ${winners.length}`);
            return updatedMatches;
          }

          initializeQuarterFinals(winners, tournamentId);
        } else if (currentPhase === 'quarter' && format === 'knockout') {
          const winners = updatedMatches
            .filter((m) => m.phase === 'quarter' && m.winner)
            .map((m) => {
              const winnerTeam = m.team1.name === m.winner ? m.team1 : m.team2;
              return { ...winnerTeam };
            })
            .filter(Boolean);
          if (winners.length !== 4) {
            console.error(`Expected 4 winners for Semi Finals from ${currentPhase}, got ${winners.length}`);
            alert(`Error: Expected 4 winners for Semi Finals from ${currentPhase}, got ${winners.length}.`);
            return updatedMatches;
          }
          initializeSemiFinals(winners, tournamentId);
        } else if (currentPhase === 'semi' && format === 'knockout') {
          const winners = updatedMatches
            .filter((m) => m.phase === 'semi' && m.winner)
            .map((m) => {
              const winnerTeam = m.team1.name === m.winner ? m.team1 : m.team2;
              return { ...winnerTeam };
            })
            .filter(Boolean);

          if (winners.length === 2) {
            initializeFinal(winners, tournamentId);
          } else {
            console.error(`Expected 2 winners for Final from semi, got ${winners.length}`);
            alert(`Error: Expected 2 winners for Final from semi, got ${winners.length}.`);
            return updatedMatches;
          }
        } else if (currentPhase === 'quarter' && format === 'playOff') {
          const winners = updatedMatches
            .filter((m) => m.phase === 'quarter' && m.winner)
            .map((m) => {
              const winnerTeam = m.team1.name === m.winner ? m.team1 : m.team2;
              return { ...winnerTeam };
            })
            .filter((t) => t);
          if (winners.length !== 4) {
            console.error(`Expected 4 winners for Semi Finals from ${currentPhase}, got ${winners.length}`);
            alert(`Error: Expected 4 winners for Semi Finals from ${currentPhase}, got ${winners.length}.`);
            return updatedMatches;
          }
          initializeSemiFinals(winners, tournamentId);
        } else if (currentPhase === 'semi' && format === 'playOff') {
          const winners = updatedMatches
            .filter((m) => m.phase === 'semi' && m.winner)
            .map((m) => {
              const winnerTeam = m.team1.name === m.winner ? m.team1 : m.team2;
              return { ...winnerTeam };
            })
            .filter(Boolean);

          if (winners.length === 2) {
            initializeFinal(winners, tournamentId);
          } else {
            console.error(`Expected 2 winners for Final from semi, got ${winners.length}`);
            alert(`Error: Expected 2 winners for Final from semi, got ${winners.length}.`);
            return updatedMatches;
          }
        } else if (currentPhase === 'eliminatorElite') {
          const winners = updatedMatches
            .filter((m) => m.phase === 'eliminatorElite' && m.winner)
            .map((m) => {
              const winnerTeam = m.team1.name === m.winner ? m.team1 : m.team2;
              return { ...winnerTeam };
            });
          const losers = updatedMatches
            .filter((m) => m.phase === 'eliminatorElite' && m.winner)
            .map((m) => (m.team1.name === m.winner ? m.team2 : m.team1));
          initializeFinal(winners, tournamentId);
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
        } else if (currentPhase === 'qualifier1' || currentPhase === 'eliminator') {
          if (updatedMatches.filter((m) => m.phase === 'qualifier1' || m.phase === 'eliminator').every((m) => m.played)) {
            initializeQualifier2();
          }
        } else if (currentPhase === 'qualifier2') {
          initializeFinal([], tournamentId);
        } else if (currentPhase === 'championship' || (currentPhase === 'final' && (format === 'knockout' || format === 'playOff'))) {
          const winner = updatedMatches.find((m) => m.phase === currentPhase)?.winner;
          if (winner) {
            setTournamentWinner(winner);
            if (tournamentId) {
              setDoc(doc(db, 'KnockoutTournamentMatches', tournamentId), { tournamentWinner: winner }, { merge: true })
                .then(() => console.log(`Tournament winner set in Firebase: ${winner}`))
                .catch((error) => console.error('Error setting tournament winner in Firebase:', error));
            }
          } else {
            console.error('No winner found for final/championship.');
          }
        }
      }

      return updatedMatches;
    });
  };

  const handleGoToFlowchart = () => {
    navigate('/selection1', {
      state: {
        teams,
        format,
        matches: matchHistory,
        currentPhase,
        tournamentWinner,
        phaseHistory,
        matchHistory,
        tournamentId,
      },
    });
  };

  const handleStartMatch = (match) => {
    if (match.played) {
      console.log(`Match ${match.id} has already been played. Navigation to start-match prevented.`);
      return;
    }

    if ((format === 'playOff' || format === 'knockout') && tournamentId) {
      navigate('/start-match-ko', {
        state: {
          matchId: match.id,
          currentPhase,
          tournamentId,
          teamA: {
            id: match.team1.id,
            name: match.team1.name,
            flagUrl: match.team1.flagUrl || '',
          },
          teamB: {
            id: match.team2.id,
            name: match.team2.name,
            flagUrl: match.team2.flagUrl || '',
          },
          overs: 5,
          origin: '/match-start-ko',
          activeTab: 'Knockout Brackets',
        },
      });
    }
  };

  const handleNextRound = () => {
    if (!canAdvanceToNextRound) return;

    const advanceManually = async () => {
      const roundNumber = getRoundNumberForPhase(currentPhase);
      const winners = await fetchWinnersByRoundFromFirebase(tournamentId, roundNumber);
      if (format === 'playOff') {
        if (currentPhase === 'quarter' && winners.length === 4) {
          console.log('Manually advancing from Quarter Finals to Semi Finals');
          initializeSemiFinals(winners, tournamentId);
        } else if (currentPhase === 'semi' && winners.length === 2) {
          console.log('Manually advancing from Semi Finals to Final');
          initializeFinal(winners, tournamentId);
        } else if (currentPhase === 'final' && winners.length === 1) {
          console.log('Manually setting tournament winner');
          setTournamentWinner(winners[0].name);
          await setDoc(doc(db, 'KnockoutTournamentMatches', tournamentId), { tournamentWinner: winners[0].name }, { merge: true });
          console.log(`Tournament winner set: ${winners[0].name}`);
          setCanAdvanceToNextRound(false);
        } else {
          console.warn(`Cannot advance manually from ${currentPhase}: Expected winners not found. Winners:`, winners);
        }
      } else if (format === 'knockout') {
        if (currentPhase === 'preQuarter' && winners.length === 2) {
          console.log('Manually advancing from Pre-Quarter Finals to Quarter Finals');
          initializeQuarterFinals(winners, tournamentId);
        } else if (currentPhase === 'quarter' && winners.length === 4) {
          console.log('Manually advancing from Quarter Finals to Semi Finals');
          initializeSemiFinals(winners, tournamentId);
        } else if (currentPhase === 'semi' && winners.length === 2) {
          console.log('Manually advancing from Semi Finals to Final');
          initializeFinal(winners, tournamentId);
        } else if (currentPhase === 'final' && winners.length === 1) {
          console.log('Manually setting tournament winner');
          setTournamentWinner(winners[0].name);
          await setDoc(doc(db, 'KnockoutTournamentMatches', tournamentId), { tournamentWinner: winners[0].name }, { merge: true });
          console.log(`Tournament winner set: ${winners[0].name}`);
          setCanAdvanceToNextRound(false);
        } else {
          console.warn(`Cannot advance manually from ${currentPhase}: Expected winners not found. Winners:`, winners);
        }
      }
    };
    advanceManually();
  };

  const renderMatchCard = (match) => (
    <motion.div
      key={match.id}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border-2 border-purple-500 shadow-2xl mb-4"
      whileHover={{ scale: (match.team1?.isBye || match.team2?.isBye || match.played) ? 1 : 1.02 }}
    >
      <div className="flex justify-between items-center mb-2">
        <div className={`flex-1 text-right ${match.winner === match.team1?.name ? 'text-green-400 font-bold' : 'text-gray-300'}`}>
          {match.team1?.isBye ? 'BYE' : match.team1?.name || 'TBD'}
        </div>
        <div className="mx-4 text-xl font-bold text-purple-400">vs</div>
        <div className={`flex-1 text-left ${match.winner === match.team2?.name ? 'text-green-400 font-bold' : 'text-gray-300'}`}>
          {match.team2?.isBye ? 'BYE' : match.team2?.name || 'TBD'}
        </div>
      </div>
      {format !== 'playOff' && format !== 'knockout' && !match.played && !match.team1?.isBye && !match.team2?.isBye && (
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
      {(format === 'playOff' || format === 'knockout') && (
        <div className="text-center mt-2">
          {match.winner ? (
            <div className="text-sm text-green-400">
              Winner: {match.winner}
            </div>
          ) : !match.team1?.isBye && !match.team2?.isBye ? (
            <motion.button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transform transition-all duration-200 hover:scale-105"
              onClick={() => handleStartMatch(match)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Match
            </motion.button>
          ) : null}
        </div>
      )}
    </motion.div>
  );

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-gray-100 p-8 text-center">Loading tournament...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-8 text-center">
        <p>{error}</p>
        <button
          onClick={() => navigate('/TournamentPage')}
          className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

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
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-xl transform transition-all duration-200 hover:scale-110"
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
                  ? 'Super Bracket'
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
                  ? 'Qualifier Finals'
                  : currentPhase === 'playOff'
                  ? 'Play Off'
                  : currentPhase === 'eliminatorElite'
                  ? 'Elite Finals'
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
                    ? 'Qualifier Finals'
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

            {canAdvanceToNextRound && (format === 'playOff' || format === 'knockout') && !tournamentWinner && (
              <div className="text-center mt-8">
                <button
                  onClick={handleNextRound}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white transform transition-all duration-200 hover:scale-105"
                >
                  Next Round
                </button>
              </div>
            )}

            {tournamentWinner && (
              <div className="text-center mt-8">
                <div className="bg-purple-600 p-8 rounded-xl inline-block shadow-2xl">
                  <h2 className="text-4xl font-bold text-white animate-pulse">
                    🏆 Champion: {tournamentWinner} 🏆
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