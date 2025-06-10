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
  const [finalRankings, setFinalRankings] = useState(null);

  useEffect(() => {
    console.log('TournamentBracket received state:', location.state);

    const fetchTournament = async () => {
      const { tournamentId: stateTournamentId, currentPhase: stateCurrentPhase, teams: stateTeams, format: stateFormat } = location.state || {};

      if (stateTeams && !stateTournamentId) {
        const initialTeams = stateTeams.map((t, i) => ({
          ...t,
          id: t.id || generateUUID(),
          name: t.name || `Team ${i + 1}`,
          seed: t.seed || i + 1,
          flagUrl: t.flagUrl || '',
        }));
        setTeams(initialTeams);
        setTournamentId(null);
        setCurrentPhase(null);
        setTournamentWinner(null);
        setMatches([]);
        setPhaseHistory([]);
        setMatchHistory([]);
        setFormat(null);
        setFinalRankings(null);
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
            setFinalRankings(data.finalRankings || null);
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

    const newTournamentId = tournamentId || generateUUID();
    setTournamentId(newTournamentId);

    if (formatType === 'superKnockout') {
      let byeCount = 0;
      let preQuarterNeeded = false;
      let nextPhaseAfterSuperKnockout = '';

      // Determine bye count and next phase based on team count
      if (teamCount >= 16) {
        byeCount = 4; // Top 4 seeds get byes (16 teams case)
        preQuarterNeeded = true;
        nextPhaseAfterSuperKnockout = 'preQuarter';
      } else if (teamCount === 15) {
        byeCount = 1; // Top seed gets a bye (15 teams case)
        nextPhaseAfterSuperKnockout = 'quarter';
      } else if (teamCount >= 13) {
        byeCount = teamCount - 10; // Get to 10 teams after superKnockout
        preQuarterNeeded = true;
        nextPhaseAfterSuperKnockout = 'preQuarter';
      } else if (teamCount >= 8) {
        byeCount = teamCount - 8; // Get to 8 teams after superKnockout
        nextPhaseAfterSuperKnockout = 'quarter';
      } else if (teamCount >= 4) {
        byeCount = teamCount - 4; // Get to 4 teams after superKnockout
        nextPhaseAfterSuperKnockout = 'semi';
      } else if (teamCount === 2) {
        byeCount = 0; // No byes, straight to final
        nextPhaseAfterSuperKnockout = 'final';
      } else {
        console.error(`Super Knockout requires at least 2 teams, received ${teamCount}.`);
        alert('Super Knockout requires at least 2 teams.');
        window.location.reload();
        return;
      }

      const competingTeams = seededTeams.slice(byeCount);
      const superKnockoutMatches = [];

      for (let i = 0; i < competingTeams.length - 1; i += 2) {
        superKnockoutMatches.push({
          id: `super-knockout-${i / 2}`,
          team1: {
            id: competingTeams[i].id,
            name: competingTeams[i].name,
            seed: competingTeams[i].seed,
            flagUrl: competingTeams[i].flagUrl || '',
          },
          team2: {
            id: competingTeams[i + 1].id,
            name: competingTeams[i + 1].name,
            seed: competingTeams[i + 1].seed,
            flagUrl: competingTeams[i + 1].flagUrl || '',
          },
          round: 0,
          phase: 'superKnockout',
          winner: null,
          played: false,
        });
      }

      if (competingTeams.length % 2 === 1) {
        superKnockoutMatches.push({
          id: `super-knockout-${Math.floor(competingTeams.length / 2)}`,
          team1: {
            id: competingTeams[competingTeams.length - 1].id,
            name: competingTeams[competingTeams.length - 1].name,
            seed: competingTeams[competingTeams.length - 1].seed,
            flagUrl: competingTeams[competingTeams.length - 1].flagUrl || '',
          },
          team2: {
            id: generateUUID(),
            name: 'BYE',
            isBye: true,
          },
          round: 0,
          phase: 'superKnockout',
          winner: competingTeams[competingTeams.length - 1].name,
          played: true,
        });
      }

      const rounds = [
        { name: `Round of ${competingTeams.length}`, matches: superKnockoutMatches, roundNumber: 0, stage: 'superKnockout' },
      ];

      if (teamCount === 2) {
        rounds.push({ name: 'Final', matches: [], roundNumber: 1, stage: 'final' });
      } else if (teamCount <= 4) {
        rounds.push({ name: 'Semifinals', matches: [], roundNumber: 1, stage: 'semi' });
        rounds.push({ name: 'Final', matches: [], roundNumber: 2, stage: 'final' });
      } else {
        if (preQuarterNeeded) {
          rounds.push({ name: 'Pre-Quarterfinals', matches: [], roundNumber: 1, stage: 'preQuarter' });
        }
        rounds.push({ name: 'Quarterfinals', matches: [], roundNumber: preQuarterNeeded ? 2 : 1, stage: 'quarter' });
        rounds.push({ name: 'Semifinals', matches: [], roundNumber: preQuarterNeeded ? 3 : 2, stage: 'semi' });
        rounds.push({ name: 'Final', matches: [], roundNumber: preQuarterNeeded ? 4 : 3, stage: 'final' });
      }

      try {
        await setDoc(doc(db, 'KnockoutTournamentMatches', newTournamentId), {
          format: 'superKnockout',
          teams: seededTeams,
          rounds,
          currentPhase: 'superKnockout',
          tournamentWinner: null,
          finalRankings: null,
        });
        console.log('Super Knockout tournament initialized in Firebase');
      } catch (error) {
        console.error('Error initializing Super Knockout in Firebase:', error);
        alert('Failed to initialize tournament. Please try again.');
        window.location.reload();
        return;
      }

      setMatches(superKnockoutMatches);
      setMatchHistory(superKnockoutMatches);
      setCurrentPhase('superKnockout');
      setPhaseHistory(['superKnockout']);
    } else if (formatType === 'knockout') {
      if (teamCount !== 12) {
        console.error(`Knockout format requires exactly 12 teams, received ${teamCount}.`);
        alert('Knockout requires exactly 12 teams.');
        window.location.reload();
        return;
      }
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
        await setDoc(doc(db, 'KnockoutTournamentMatches', newTournamentId), {
          format: 'knockout',
          teams: seededTeams,
          rounds,
          currentPhase: 'preQuarter',
          tournamentWinner: null,
          finalRankings: null,
        });
        console.log('Knockout tournament initialized in Firebase');
      } catch (error) {
        console.error('Error initializing Knockout in Firebase:', error);
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
        console.error(`PlayOff format requires exactly 8 teams, received ${teamCount}.`);
        alert('Play Off format requires exactly 8 teams.');
        window.location.reload();
        return;
      }
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
        await setDoc(doc(db, 'KnockoutTournamentMatches', newTournamentId), {
          format: 'playOff',
          teams: seededTeams,
          rounds,
          currentPhase: 'quarter',
          tournamentWinner: null,
          finalRankings: null,
        });
        console.log('PlayOff tournament initialized in Firebase');
      } catch (error) {
        console.error('Error initializing PlayOff in Firebase:', error);
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
        alert('Eliminator Elite requires 4 teams.');
        window.location.reload();
        return;
      }
      const initialMatches = [
        { id: 'elite-1', team1: seededTeams[0], team2: seededTeams[3], round: 0, phase: 'eliminatorElite', winner: null, played: false },
        { id: 'elite-2', team1: seededTeams[1], team2: seededTeams[2], round: 0, phase: 'eliminatorElite', winner: null, played: false },
      ];
      const rounds = [
        { name: 'Semifinals', matches: initialMatches, roundNumber: 0, stage: 'eliminatorElite' },
        { name: 'Final', matches: [], roundNumber: 1, stage: 'final' },
        { name: 'Third Place', matches: [], roundNumber: 1, stage: 'thirdPlace' },
      ];

      try {
        await setDoc(doc(db, 'KnockoutTournamentMatches', newTournamentId), {
          format: 'eliminatorElite',
          teams: seededTeams,
          rounds,
          currentPhase: 'eliminatorElite',
          tournamentWinner: null,
          finalRankings: null,
        });
        console.log('Eliminator Elite tournament initialized in Firebase');
      } catch (error) {
        console.error('Error initializing Eliminator Elite in Firebase:', error);
        alert('Failed to initialize tournament. Please try again.');
        window.location.reload();
        return;
      }

      setMatches(initialMatches);
      setMatchHistory(initialMatches);
      setCurrentPhase('eliminatorElite');
      setPhaseHistory(['eliminatorElite']);
    } else if (formatType === 'championship') {
      if (teamCount !== 2) {
        console.error(`Championship format requires exactly 2 teams, received ${teamCount}.`);
        alert('Championship requires 2 teams.');
        window.location.reload();
        return;
      }
      const initialMatches = [
        { id: 'championship', team1: seededTeams[0], team2: seededTeams[1], round: 0, phase: 'championship', winner: null, played: false },
      ];
      const rounds = [
        { name: 'Championship', matches: initialMatches, roundNumber: 0, stage: 'championship' },
      ];

      try {
        await setDoc(doc(db, 'KnockoutTournamentMatches', newTournamentId), {
          format: 'championship',
          teams: seededTeams,
          rounds,
          currentPhase: 'championship',
          tournamentWinner: null,
          finalRankings: null,
        });
        console.log('Championship tournament initialized in Firebase');
      } catch (error) {
        console.error('Error initializing Championship in Firebase:', error);
        alert('Failed to initialize tournament. Please try again.');
        window.location.reload();
        return;
      }

      setMatches(initialMatches);
      setMatchHistory(initialMatches);
      setCurrentPhase('championship');
      setPhaseHistory(['championship']);
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
    if (format === 'playOff') {
      switch (phase) {
        case 'quarter':
          return 0;
        case 'semi':
          return 1;
        case 'final':
          return 2;
        default:
          return -1;
      }
    } else if (format === 'knockout') {
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
    } else if (format === 'superKnockout') {
      const preQuarterNeeded = teams.length >= 13;
      switch (phase) {
        case 'superKnockout':
          return 0;
        case 'preQuarter':
          return 1;
        case 'quarter':
          return preQuarterNeeded ? 2 : 1;
        case 'semi':
          return preQuarterNeeded ? 3 : 2;
        case 'final':
          return preQuarterNeeded ? 4 : 3;
        default:
          return -1;
      }
    } else if (format === 'eliminatorElite') {
      switch (phase) {
        case 'eliminatorElite':
          return 0;
        case 'final':
        case 'thirdPlace':
          return 1;
        default:
          return -1;
      }
    } else if (format === 'championship') {
      switch (phase) {
        case 'championship':
          return 0;
        default:
          return -1;
      }
    }
    return -1;
  };

  const fetchWinnersByRoundFromFirebase = async (tournamentId, roundNumber, phase) => {
    try {
      const tournamentDocRef = doc(db, 'KnockoutTournamentMatches', tournamentId);
      const tournamentDoc = await getDoc(tournamentDocRef);
      if (tournamentDoc.exists()) {
        const data = tournamentDoc.data();
        const round = data.rounds.find((r) => r.stage === phase && r.roundNumber === roundNumber);
        if (!round) {
          console.error(`Round not found for phase ${phase}, roundNumber ${roundNumber}`);
          return [];
        }
        const roundMatches = round.matches || [];
        console.log(`Fetched matches for round ${roundNumber}, phase ${phase}:`, roundMatches);
        const winners = roundMatches
          .filter((m) => m.winner && m.played)
          .map((m) => {
            const winnerTeam = m.team1.name === m.winner ? m.team1 : m.team2;
            return { ...winnerTeam };
          });
        console.log(`Winners for round ${roundNumber}, phase ${phase}:`, winners);
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

  const fetchTeamsByRoundFromFirebase = async (tournamentId, roundNumber, phase) => {
    try {
      const tournamentDocRef = doc(db, 'KnockoutTournamentMatches', tournamentId);
      const tournamentDoc = await getDoc(tournamentDocRef);
      if (tournamentDoc.exists()) {
        const data = tournamentDoc.data();
        const round = data.rounds.find((r) => r.stage === phase && r.roundNumber === roundNumber);
        if (!round) {
          console.error(`Round not found for phase ${phase}, roundNumber ${roundNumber}`);
          return [];
        }
        const roundMatches = round.matches || [];
        const teams = roundMatches
          .filter((m) => m.winner && m.played)
          .map((m) => {
            const winnerTeam = m.team1.name === m.winner ? m.team1 : m.team2;
            return { ...winnerTeam };
          });
        return teams;
      } else {
        console.error('Tournament document not found in Firebase');
        return [];
      }
    } catch (error) {
      console.error('Error fetching teams from Firebase:', error);
      return [];
    }
  };

  useEffect(() => {
    if (['superKnockout', 'playOff', 'knockout', 'eliminatorElite', 'championship'].includes(format) && currentPhase && tournamentId) {
      const unsubscribe = onSnapshot(doc(db, 'KnockoutTournamentMatches', tournamentId), async (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          console.log('onSnapshot received data:', data);
          const currentRound = data.rounds.find((r) => r.stage === currentPhase);
          if (currentRound) {
            const updatedMatches = currentRound.matches.map((match) => ({
              ...match,
              played: !!match.winner || match.played,
            }));
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
            setCanAdvanceToNextRound(allMatchesPlayed);

            if (allMatchesPlayed && !tournamentWinner) {
              const roundNumber = getRoundNumberForPhase(currentPhase);
              const winners = await fetchWinnersByRoundFromFirebase(tournamentId, roundNumber, currentPhase);

              if (format === 'superKnockout') {
                const byeCount = teams.length >= 16 ? 4 : teams.length === 15 ? 1 : teams.length >= 13 ? teams.length - 10 : teams.length >= 8 ? teams.length - 8 : teams.length >= 4 ? teams.length - 4 : 0;
                const byeTeamsSorted = teams.sort((a, b) => a.seed - b.seed).slice(0, byeCount);
                
                if (currentPhase === 'superKnockout') {
                  const nextTeams = [...winners, ...byeTeamsSorted];
                  console.log('Advancing from Super Knockout with teams:', nextTeams);
                  if (nextTeams.length === 10) {
                    console.log('Initializing Pre-Quarterfinals');
                    await initializePreQuarter(nextTeams, tournamentId);
                  } else if (nextTeams.length === 8) {
                    console.log('Initializing Quarterfinals');
                    await initializeQuarterFinals(nextTeams, tournamentId);
                  } else if (nextTeams.length === 6) {
                    console.log('Trimming from 6 to 4 for Semifinals');
                    await initializeTrimToFour(nextTeams, tournamentId);
                  } else if (nextTeams.length === 4) {
                    console.log('Initializing Semifinals');
                    await initializeSemiFinals(nextTeams, tournamentId);
                  } else if (nextTeams.length === 2) {
                    console.log('Initializing Final');
                    await initializeFinal(nextTeams, tournamentId);
                  }
                } else if (currentPhase === 'preQuarter' && winners.length === 2) {
                  console.log('Advancing from Pre-Quarterfinals to Quarterfinals');
                  // Fetch the teams from superKnockout phase (winners + byes)
                  const superKnockoutTeams = await fetchTeamsByRoundFromFirebase(tournamentId, 0, 'superKnockout');
                  const superKnockoutWinners = superKnockoutTeams.filter((w) => !w.isBye);
                  const byeTeams = teams.sort((a, b) => a.seed - b.seed).slice(0, byeCount);
                  // Exclude the teams that played in preQuarter (seeds 7-10)
                  const remainingSuperKnockoutWinners = superKnockoutWinners
                    .filter((w) => !winners.some((pw) => pw.name === w.name))
                    .sort((a, b) => a.seed - b.seed);
                  // Combine: top 4 byes + 2 remaining superKnockout winners + 2 preQuarter winners
                  const nextTeams = [...byeTeams, ...remainingSuperKnockoutWinners.slice(0, 2), ...winners];
                  console.log('Quarterfinal teams:', nextTeams);
                  await initializeQuarterFinals(nextTeams, tournamentId);
                } else if (currentPhase === 'trimToFour' && winners.length === 1) {
                  console.log('Advancing from TrimToFour to Semifinals');
                  const trimRoundTeams = await fetchTeamsByRoundFromFirebase(tournamentId, getRoundNumberForPhase('superKnockout'), 'superKnockout');
                  const byeTeams = teams.sort((a, b) => a.seed - b.seed).slice(0, byeCount);
                  const superKnockoutWinners = trimRoundTeams.filter((w) => !w.isBye);
                  const remainingTeams = [...byeTeams, ...superKnockoutWinners]
                    .filter((t) => !t.isBye)
                    .sort((a, b) => a.seed - b.seed)
                    .slice(0, 3);
                  const nextTeams = [...remainingTeams, ...winners];
                  await initializeSemiFinals(nextTeams, tournamentId);
                } else if (currentPhase === 'quarter' && winners.length === 4) {
                  console.log('Advancing from Quarterfinals to Semifinals');
                  await initializeSemiFinals(winners, tournamentId);
                } else if (currentPhase === 'semi' && winners.length === 2) {
                  console.log('Advancing from Semifinals to Final');
                  await initializeFinal(winners, tournamentId);
                } else if (currentPhase === 'final' && winners.length === 1) {
                  console.log('Setting tournament winner:', winners[0].name);
                  setTournamentWinner(winners[0].name);
                  await setDoc(doc(db, 'KnockoutTournamentMatches', tournamentId), { tournamentWinner: winners[0].name }, { merge: true });
                  setCanAdvanceToNextRound(false);
                }
              } else if (format === 'playOff') {
                if (currentPhase === 'quarter' && winners.length === 4) {
                  console.log('Advancing from Quarter Finals to Semi Finals');
                  await initializeSemiFinals(winners, tournamentId);
                } else if (currentPhase === 'semi' && winners.length === 2) {
                  console.log('Advancing from Semifinals to Final');
                  await initializeFinal(winners, tournamentId);
                } else if (currentPhase === 'final' && winners.length === 1) {
                  console.log('Setting tournament winner');
                  setTournamentWinner(winners[0].name);
                  await setDoc(doc(db, 'KnockoutTournamentMatches', tournamentId), { tournamentWinner: winners[0].name }, { merge: true });
                  setCanAdvanceToNextRound(false);
                }
              } else if (format === 'knockout') {
                if (currentPhase === 'preQuarter' && winners.length === 2) {
                  console.log('Advancing from Pre-Quarterfinals to Quarterfinals');
                  const topSixSeeds = teams
                    .sort((a, b) => a.seed - b.seed)
                    .slice(0, 6);
                  const quarterFinalTeams = [...topSixSeeds, ...winners];
                  console.log('Quarterfinal teams:', quarterFinalTeams);
                  await initializeQuarterFinals(quarterFinalTeams, tournamentId);
                } else if (currentPhase === 'quarter' && winners.length === 4) {
                  console.log('Advancing from Quarterfinals to Semifinals');
                  await initializeSemiFinals(winners, tournamentId);
                } else if (currentPhase === 'semi' && winners.length === 2) {
                  console.log('Advancing from Semifinals to Final');
                  await initializeFinal(winners, tournamentId);
                } else if (currentPhase === 'final' && winners.length === 1) {
                  console.log('Setting tournament winner');
                  setTournamentWinner(winners[0].name);
                  await setDoc(doc(db, 'KnockoutTournamentMatches', tournamentId), { tournamentWinner: winners[0].name }, { merge: true });
                  setCanAdvanceToNextRound(false);
                }
              } else if (format === 'eliminatorElite') {
                if (currentPhase === 'eliminatorElite' && updatedMatches.length === 2) {
                  console.log('Advancing from Eliminator Elite to Final');
                  const winners = updatedMatches
                    .filter((m) => m.winner)
                    .map((m) => (m.team1.name === m.winner ? m.team1 : m.team2));
                  const losers = updatedMatches
                    .filter((m) => m.winner)
                    .map((m) => (m.team1.name === m.winner ? m.team2 : m.team1));
                  if (winners.length === 2 && losers.length === 2) {
                    const finalMatch = [
                      {
                        id: 'final',
                        team1: winners[0],
                        team2: winners[1],
                        round: 1,
                        phase: 'final',
                        winner: null,
                        played: false,
                      },
                    ];
                    const thirdPlaceMatch = [
                      {
                        id: 'third-place',
                        team1: losers[0],
                        team2: losers[1],
                        round: 1,
                        phase: 'thirdPlace',
                        winner: null,
                        played: false,
                      },
                    ];
                    const tournamentDocRef = doc(db, 'KnockoutTournamentMatches', tournamentId);
                    const tournamentDoc = await getDoc(tournamentDocRef);
                    if (tournamentDoc.exists()) {
                      const existingData = tournamentDoc.data();
                      const updatedRounds = existingData.rounds.map((round) => {
                        if (round.stage === 'final') {
                          return { ...round, matches: finalMatch };
                        }
                        if (round.stage === 'thirdPlace') {
                          return { ...round, matches: thirdPlaceMatch };
                        }
                        return round;
                      });
                      await setDoc(tournamentDocRef, {
                        rounds: updatedRounds,
                        currentPhase: 'final',
                      }, { merge: true });
                      console.log('Final and Third Place matches initialized in Firebase');
                    }
                    setMatches(finalMatch);
                    setMatchHistory((prev) => [...prev, ...finalMatch, ...thirdPlaceMatch]);
                    setCurrentPhase('final');
                    setPhaseHistory((prev) => [...prev, 'eliminatorElite']);
                  }
                } else if (currentPhase === 'final' && updatedMatches.length === 1) {
                  console.log('Advancing from Final to Third Place');
                  const tournamentDocRef = doc(db, 'KnockoutTournamentMatches', tournamentId);
                  const tournamentDoc = await getDoc(tournamentDocRef);
                  if (tournamentDoc.exists()) {
                    const data = tournamentDoc.data();
                    const thirdPlaceRound = data.rounds.find((r) => r.stage === 'thirdPlace');
                    if (thirdPlaceRound && thirdPlaceRound.matches.length === 1) {
                      await setDoc(tournamentDocRef, { currentPhase: 'thirdPlace' }, { merge: true });
                      setMatches(thirdPlaceRound.matches);
                      setCurrentPhase('thirdPlace');
                      setPhaseHistory((prev) => [...prev, 'final']);
                      setCanAdvanceToNextRound(false);
                      console.log('Transitioned to Third Place phase');
                    }
                  }
                } else if (currentPhase === 'thirdPlace' && updatedMatches.length === 1) {
                  console.log('Setting final rankings for Eliminator Elite');
                  const tournamentDocRef = doc(db, 'KnockoutTournamentMatches', tournamentId);
                  const tournamentDoc = await getDoc(tournamentDocRef);
                  if (tournamentDoc.exists()) {
                    const data = tournamentDoc.data();
                    const finalMatch = data.rounds.find((r) => r.stage === 'final')?.matches[0];
                    const thirdPlaceMatch = data.rounds.find((r) => r.stage === 'thirdPlace')?.matches[0];
                    if (finalMatch?.played && thirdPlaceMatch?.played) {
                      const firstPlace = finalMatch.winner;
                      const secondPlace = finalMatch.team1.name === finalMatch.winner ? finalMatch.team2.name : finalMatch.team1.name;
                      const thirdPlace = thirdPlaceMatch.winner;
                      const fourthPlace = thirdPlaceMatch.team1.name === thirdPlaceMatch.winner ? thirdPlaceMatch.team2.name : thirdPlaceMatch.team1.name;
                      const rankings = { first: firstPlace, second: secondPlace, third: thirdPlace, fourth: fourthPlace };
                      setTournamentWinner(firstPlace);
                      setFinalRankings(rankings);
                      await setDoc(tournamentDocRef, {
                        tournamentWinner: firstPlace,
                        finalRankings: rankings,
                        currentPhase: 'completed',
                      }, { merge: true });
                      console.log('Final rankings set in Firebase:', rankings);
                      setCanAdvanceToNextRound(false);
                    }
                  }
                }
              } else if (format === 'championship') {
                if (currentPhase === 'championship' && winners.length === 1) {
                  console.log('Setting tournament winner');
                  setTournamentWinner(winners[0].name);
                  await setDoc(doc(db, 'KnockoutTournamentMatches', tournamentId), { tournamentWinner: winners[0].name }, { merge: true });
                  setCanAdvanceToNextRound(false);
                }
              }
            }
          }
        }
      }, (error) => {
        console.error('onSnapshot error:', error);
      });

      return () => unsubscribe();
    }
  }, [format, currentPhase, teams, tournamentId, tournamentWinner]);

  const initializePreQuarter = async (nextTeams, tournamentId) => {
    if (nextTeams.length !== 10) {
      console.error(`PreQuarter expects 10 teams, received ${nextTeams.length}`);
      alert('Error: Incorrect number of teams for Pre-Quarter Finals.');
      return;
    }

    // Ensure all teams have required properties
    const validTeams = nextTeams.every(team => team && team.id && team.name && typeof team.seed === 'number');
    if (!validTeams) {
      console.error('Invalid team data in nextTeams:', nextTeams);
      alert('Error: Invalid team data for Pre-Quarter Finals.');
      return;
    }

    const sortedTeams = [...nextTeams].sort((a, b) => (a.seed || 0) - (b.seed || 0));
    const preQuarterMatches = [
      { id: 'pre-quarter-1', team1: sortedTeams[6], team2: sortedTeams[9], round: 1, phase: 'preQuarter', winner: null, played: false },
      { id: 'pre-quarter-2', team1: sortedTeams[7], team2: sortedTeams[8], round: 1, phase: 'preQuarter', winner: null, played: false },
    ];

    try {
      const tournamentDocRef = doc(db, 'KnockoutTournamentMatches', tournamentId);
      const tournamentDoc = await getDoc(tournamentDocRef);
      if (tournamentDoc.exists()) {
        const existingData = tournamentDoc.data();
        let updatedRounds = [...existingData.rounds];

        // Ensure the preQuarter stage exists in rounds
        const preQuarterIndex = updatedRounds.findIndex(round => round.stage === 'preQuarter');
        if (preQuarterIndex === -1) {
          console.warn('Pre-Quarter stage missing in rounds. Adding it now.');
          // Insert preQuarter stage at the correct position (after superKnockout)
          updatedRounds.splice(1, 0, {
            name: 'Pre-Quarterfinals',
            matches: preQuarterMatches,
            roundNumber: 1,
            stage: 'preQuarter'
          });
          // Adjust round numbers for subsequent rounds
          for (let i = 2; i < updatedRounds.length; i++) {
            updatedRounds[i].roundNumber += 1;
          }
        } else {
          updatedRounds = updatedRounds.map((round) => {
            if (round.stage === 'preQuarter') {
              return { ...round, matches: preQuarterMatches };
            }
            return round;
          });
        }

        await setDoc(tournamentDocRef, {
          rounds: updatedRounds,
          currentPhase: 'preQuarter',
        }, { merge: true });
        console.log('Pre-Quarterfinals initialized in Firebase');
      } else {
        console.error('Tournament document not found in Firebase');
        alert('Error: Tournament data not found. Please restart the tournament.');
        navigate('/TournamentPage');
        return;
      }
    } catch (error) {
      console.error('Error initializing Pre-Quarterfinals in Firebase:', error);
      alert('Failed to initialize Pre-Quarterfinals. Please try again.');
      navigate('/TournamentPage');
      return;
    }

    setMatches(preQuarterMatches);
    setMatchHistory((prev) => [...prev, ...preQuarterMatches]);
    setCurrentPhase('preQuarter');
    setPhaseHistory((prev) => [...prev, 'superKnockout']);
    setCanAdvanceToNextRound(false);
  };

  const initializeTrimToFour = async (nextTeams, tournamentId) => {
    if (nextTeams.length !== 6) {
      console.error(`TrimToFour expects 6 teams, received ${nextTeams.length}`);
      alert('Error: Incorrect number of teams for Trim to Four.');
      return;
    }
    const sortedTeams = [...nextTeams].sort((a, b) => (a.seed || 0) - (b.seed || 0));
    const trimMatches = [
      { id: 'trim-1', team1: sortedTeams[4], team2: sortedTeams[5], round: 1, phase: 'trimToFour', winner: null, played: false },
    ];
    try {
      const tournamentDocRef = doc(db, 'KnockoutTournamentMatches', tournamentId);
      const tournamentDoc = await getDoc(tournamentDocRef);
      if (tournamentDoc.exists()) {
        const existingData = tournamentDoc.data();
        const updatedRounds = existingData.rounds.map((round) => {
          if (round.stage === 'trimToFour') {
            return { ...round, matches: trimMatches };
          }
          return round;
        });
        // If trimToFour stage doesn't exist, add it
        if (!updatedRounds.some((round) => round.stage === 'trimToFour')) {
          updatedRounds.splice(1, 0, { name: 'Trim to Four', matches: trimMatches, roundNumber: 1, stage: 'trimToFour' });
          // Adjust round numbers for subsequent rounds
          for (let i = 2; i < updatedRounds.length; i++) {
            updatedRounds[i].roundNumber += 1;
          }
        }
        await setDoc(tournamentDocRef, {
          rounds: updatedRounds,
          currentPhase: 'trimToFour',
        }, { merge: true });
        console.log('Trim to Four initialized in Firebase');
      }
    } catch (error) {
      console.error('Error initializing Trim to Four in Firebase:', error);
      alert('Failed to initialize Trim to Four. Please try again.');
      return;
    }
    setMatches(trimMatches);
    setMatchHistory((prev) => [...prev, ...trimMatches]);
    setCurrentPhase('trimToFour');
    setPhaseHistory((prev) => [...prev, 'superKnockout']);
    setCanAdvanceToNextRound(false);
  };

  const initializeQuarterFinals = async (teamsForQuarter, tournamentId) => {
    if (teamsForQuarter.length !== 8) {
      console.error(`Quarter Finals requires exactly 8 teams, got ${teamsForQuarter.length}`);
      alert('Error: Quarter Finals need exactly 8 teams.');
      return;
    }
    const sortedTeams = [...teamsForQuarter].sort((a, b) => (a.seed || 0) - (b?.seed || 0));
    const roundNumber = format === 'playOff' ? 0 : format === 'knockout' ? 1 : teams.length >= 13 ? 2 : 1;
    const matches = [
      { id: 'quarter-1', team1: sortedTeams[0], team2: sortedTeams[7], round: roundNumber, phase: 'quarter', winner: null, played: false },
      { id: 'quarter-2', team1: sortedTeams[1], team2: sortedTeams[6], round: roundNumber, phase: 'quarter', winner: null, played: false },
      { id: 'quarter-3', team1: sortedTeams[2], team2: sortedTeams[5], round: roundNumber, phase: 'quarter', winner: null, played: false },
      { id: 'quarter-4', team1: sortedTeams[3], team2: sortedTeams[4], round: roundNumber, phase: 'quarter', winner: null, played: false },
    ];
    try {
      const tournamentDocRef = doc(db, 'KnockoutTournamentMatches', tournamentId);
      const tournamentDoc = await getDoc(tournamentDocRef);
      if (tournamentDoc.exists()) {
        const existingData = tournamentDoc.data();
        const updatedRounds = existingData.rounds.map((round) => {
          if (round.stage === 'quarter') {
            return { ...round, matches };
          }
          return round;
        });
        await setDoc(tournamentDocRef, {
          rounds: updatedRounds,
          currentPhase: 'quarter',
        }, { merge: true });
        console.log('Quarter-finals initialized in Firebase');
      }
    } catch (error) {
      console.error('Error initializing quarter-finals in Firebase:', error);
      alert('Failed to initialize quarter-finals.');
      return;
    }
    setMatches(matches);
    setMatchHistory((prev) => [...prev, ...matches]);
    setCurrentPhase('quarter');
    setPhaseHistory((prev) => [...prev, format === 'knockout' ? 'preQuarter' : teams.length >= 13 ? 'preQuarter' : 'superKnockout']);
    setCanAdvanceToNextRound(false);
  };

  const initializeSemiFinals = async (teamsForSemi, tournamentId) => {
    if (teamsForSemi.length !== 4) {
      console.error(`Semi Finals requires exactly 4 teams, got ${teamsForSemi.length}`);
      alert('Failed to update matches for semi-finals. Please try again.');
      return;
    }
    const sortedTeams = [...teamsForSemi].sort((a, b) => (a?.seed || 0) - (b?.seed || 0));
    const roundNumber = format === 'playOff' ? 1 : format === 'knockout' ? 2 : teams.length >= 13 ? 3 : 2;
    const matches = [
      { id: 'semi-1', team1: sortedTeams[0], team2: sortedTeams[3], round: roundNumber, phase: 'semi', winner: null, played: false },
      { id: 'semi-2', team1: sortedTeams[1], team2: sortedTeams[2], round: roundNumber, phase: 'semi', winner: null, played: false },
    ];
    try {
      const tournamentDocRef = doc(db, 'KnockoutTournamentMatches', tournamentId);
      const tournamentDoc = await getDoc(tournamentDocRef);
      if (tournamentDoc.exists()) {
        const existingData = tournamentDoc.data();
        const updatedRounds = existingData.rounds.map((round) => {
          if (round.stage === 'semi') {
            return { ...round, matches };
          }
          return round;
        });
        await setDoc(tournamentDocRef, {
          rounds: updatedRounds,
          currentPhase: 'semi',
        }, { merge: true });
        console.log('Semi-finals initialized in Firebase');
      }
    } catch (err) {
      console.error('Error initializing semi-finals in Firebase:', err);
      alert('Failed to initialize tournament semi-finals. Please try again.');
      return;
    }
    setMatches(matches);
    setMatchHistory((prevHistory) => [...prevHistory, ...matches]);
    setCurrentPhase('semi');
    setPhaseHistory((prevPhase) => [...prevPhase, previousPhase => previousPhase === 'trimToFour' ? 'trimToFour' : 'quarter']);
    setCanAdvanceToNextRound(false);
  };

  const initializeFinal = async (winners, tournamentId) => {
    if (winners.length !== 2) {
      console.error(`Final expects 2 teams, received ${winners.length}`);
      alert('Failed to proceed to final.');
      return;
    }
    const sortedTeams = [...winners].sort((a, b) => (a?.seed || 0) - (b?.seed || 0));
    const roundNumber = format === 'playOff' ? 2 : format === 'knockout' ? 3 : teams.length >= 13 ? 4 : 3;
    const finalMatch = [
      {
        id: 'final',
        team1: sortedTeams[0],
        team2: sortedTeams[1],
        round: roundNumber,
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
        const updatedRounds = existingData.rounds.map((round) => {
          if (round.stage === 'final') {
            return { ...round, matches: finalMatch };
          }
          return round;
        });
        await setDoc(tournamentDocRef, {
          rounds: updatedRounds,
          currentPhase: 'final',
        }, { merge: true });
        console.log('Final initialized in Firebase');
      }
    } catch (error) {
      console.error('Error initializing final in Firebase:', error);
      alert('Failed to initialize final.');
      return;
    }
    setMatches(finalMatch);
    setMatchHistory((prev) => [...prev, ...finalMatch]);
    setCurrentPhase('final');
    setPhaseHistory((prev) => [...prev, 'semi']);
    setCanAdvanceToNextRound(false);
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

      if (['superKnockout', 'playOff', 'knockout', 'eliminatorElite', 'championship'].includes(format) && tournamentId) {
        const updateFirebase = async () => {
          try {
            const tournamentDocRef = doc(db, 'KnockoutTournamentMatches', tournamentId);
            const tournamentDoc = await getDoc(tournamentDocRef);
            if (tournamentDoc.exists()) {
              const data = tournamentDoc.data();
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
        finalRankings,
      },
    });
  };

  const handleStartMatch = (match) => {
    if (match.played) {
      console.log(`Match ${match.id} has already been played. Navigation to start-match stopped.`);
      return;
    }

    if (match.team1?.isBye || match.team2?.isBye) {
      console.log(`Match ${match.id} involves a BYE team. Navigation to start-match stopped.`);
      return;
    }

    if (!match.team1?.id || !match.team1?.name || !match.team2?.id || !match.team2?.name) {
      console.error(`Invalid team data for match ${match.id}:`, match);
      alert('Error: Invalid team data for this match.');
      return;
    }

    if (['superKnockout', 'playOff', 'knockout', 'eliminatorElite', 'championship'].includes(format) && tournamentId) {
      console.log(`Navigating to start-match-ko for match ${match.id} with teams:`, {
        teamA: match.team1,
        teamB: match.team2,
      });
      navigate('/start-match-ko', {
        state: {
          matchId: match.id,
          currentPhase,
          tournamentId,
          teamA: {
            id: match.team1.id,
            name: match.team1.name,
            flagUrl: match.team1?.flagUrl || '',
          },
          teamB: {
            id: match.team2.id,
            name: match.team2.name,
            flagUrl: match.team2?.flagUrl || '',
          },
          overs: 5,
          origin: '/match-start-ko',
          activeTab: 'Knockout Brackets',
        },
      });
    }
  };

  const handleNextRound = async () => {
    if (!canAdvanceToNextRound || tournamentWinner) return;

    const roundNumber = getRoundNumberForPhase(currentPhase);
    const winners = await fetchWinnersByRoundFromFirebase(tournamentId, roundNumber, currentPhase);

    if (format === 'superKnockout') {
      const byeCount = teams.length >= 16 ? 4 : teams.length === 15 ? 1 : teams.length >= 13 ? teams.length - 10 : teams.length >= 8 ? teams.length - 8 : teams.length >= 4 ? teams.length - 4 : 0;
      const byeTeamsSorted = teams.sort((a, b) => a.seed - b.seed).slice(0, byeCount);
      
      if (currentPhase === 'superKnockout') {
        const nextTeams = [...winners, ...byeTeamsSorted];
        if (nextTeams.length === 10) {
          console.log('Manually advancing from Super Knockout to Pre-Quarterfinals');
          await initializePreQuarter(nextTeams, tournamentId);
        } else if (nextTeams.length === 8) {
          console.log('Manually advancing from Super Knockout to Quarterfinals');
          await initializeQuarterFinals(nextTeams, tournamentId);
        } else if (nextTeams.length === 6) {
          console.log('Manually trimming from 6 to 4 for Semifinals');
          await initializeTrimToFour(nextTeams, tournamentId);
        } else if (nextTeams.length === 4) {
          console.log('Manually advancing from Super Knockout to Semifinals');
          await initializeSemiFinals(nextTeams, tournamentId);
        } else if (nextTeams.length === 2) {
          console.log('Manually advancing from Super Knockout to Final');
          await initializeFinal(nextTeams, tournamentId);
        }
      } else if (currentPhase === 'preQuarter' && winners.length === 2) {
        console.log('Manually advancing from Pre-Quarterfinals to Quarterfinals');
        const superKnockoutTeams = await fetchTeamsByRoundFromFirebase(tournamentId, 0, 'superKnockout');
        const superKnockoutWinners = superKnockoutTeams.filter((w) => !w.isBye);
        const byeTeams = teams.sort((a, b) => a.seed - b.seed).slice(0, byeCount);
        const remainingSuperKnockoutWinners = superKnockoutWinners
          .filter((w) => !winners.some((pw) => pw.name === w.name))
          .sort((a, b) => a.seed - b.seed);
        const nextTeams = [...byeTeams, ...remainingSuperKnockoutWinners.slice(0, 2), ...winners];
        console.log('Quarterfinal teams:', nextTeams);
        await initializeQuarterFinals(nextTeams, tournamentId);
      } else if (currentPhase === 'trimToFour' && winners.length === 1) {
        console.log('Manually advancing from TrimToFour to Semifinals');
        const trimRoundTeams = await fetchTeamsByRoundFromFirebase(tournamentId, getRoundNumberForPhase('superKnockout'), 'superKnockout');
        const byeTeams = teams.sort((a, b) => a.seed - b.seed).slice(0, byeCount);
        const superKnockoutWinners = trimRoundTeams.filter((w) => !w.isBye);
        const remainingTeams = [...byeTeams, ...superKnockoutWinners]
          .filter((t) => !t.isBye)
          .sort((a, b) => a.seed - b.seed)
          .slice(0, 3);
        const nextTeams = [...remainingTeams, ...winners];
        await initializeSemiFinals(nextTeams, tournamentId);
      } else if (currentPhase === 'quarter' && winners.length === 4) {
        console.log('Manually advancing from Quarterfinals to Semifinals');
        await initializeSemiFinals(winners, tournamentId);
      } else if (currentPhase === 'semi' && winners.length === 2) {
        console.log('Manually advancing from Semifinals to Final');
        await initializeFinal(winners, tournamentId);
      } else if (currentPhase === 'final' && winners.length === 1) {
        console.log('Manually setting tournament winner');
        setTournamentWinner(winners[0].name);
        await setDoc(doc(db, 'KnockoutTournamentMatches', tournamentId), { tournamentWinner: winners[0].name }, { merge: true });
        setCanAdvanceToNextRound(false);
      }
    } else if (format === 'playOff') {
      if (currentPhase === 'quarter' && winners.length === 4) {
        console.log('Manually advancing from quarterfinals to semifinals');
        await initializeSemiFinals(winners, tournamentId);
      } else if (currentPhase === 'semi' && winners.length === 2) {
        console.log('Manually advancing from Semifinals to Final');
        await initializeFinal(winners, tournamentId);
      } else if (currentPhase === 'final' && winners.length === 1) {
        console.log('Manually setting tournament winner');
        setTournamentWinner(winners[0].name);
        await setDoc(doc(db, 'KnockoutTournamentMatches', tournamentId), { tournamentWinner: winners[0].name }, { merge: true });
        setCanAdvanceToNextRound(false);
      }
    } else if (format === 'knockout') {
      if (currentPhase === 'preQuarter' && winners.length === 2) {
        console.log('Manually advancing from Pre-Quarterfinals to Quarterfinals');
        const topSixSeeds = teams
          .sort((a, b) => a.seed - b.seed)
          .slice(0, 6);
        const quarterFinalTeams = [...topSixSeeds, ...winners];
        console.log('Quarterfinal teams:', quarterFinalTeams);
        await initializeQuarterFinals(quarterFinalTeams, tournamentId);
      } else if (currentPhase === 'quarter' && winners.length === 4) {
        console.log('Manually advancing from Quarterfinals to Semifinals');
        await initializeSemiFinals(winners, tournamentId);
      } else if (currentPhase === 'semi' && winners.length === 2) {
        console.log('Manually advancing from Semifinals to Final');
        await initializeFinal(winners, tournamentId);
      } else if (currentPhase === 'final' && winners.length === 1) {
        console.log('Manually setting tournament winner');
        setTournamentWinner(winners[0].name);
        await setDoc(doc(db, 'KnockoutTournamentMatches', tournamentId), { tournamentWinner: winners[0].name }, { merge: true });
        setCanAdvanceToNextRound(false);
      }
    } else if (format === 'eliminatorElite') {
      if (currentPhase === 'eliminatorElite' && winners.length === 2) {
        console.log('Manually advancing from Eliminator Elite to Final');
        const losers = matches
          .filter((m) => m.winner)
          .map((m) => (m.team1.name === m.winner ? m.team2 : m.team1));
        const finalMatch = [
          { id: 'final', team1: winners[0], team2: winners[1], round: 1, phase: 'final', winner: null, played: false },
        ];
        const thirdPlaceMatch = [
          { id: 'third-place', team1: losers[0], team2: losers[1], round: 1, phase: 'thirdPlace', winner: null, played: false },
        ];
        const tournamentDocRef = doc(db, 'KnockoutTournamentMatches', tournamentId);
        const tournamentDoc = await getDoc(tournamentDocRef);
        if (tournamentDoc.exists()) {
          const existingData = tournamentDoc.data();
          const updatedRounds = existingData.rounds.map((round) => {
            if (round.stage === 'final') return { ...round, matches: finalMatch };
            if (round.stage === 'thirdPlace') return { ...round, matches: thirdPlaceMatch };
            return round;
          });
          await setDoc(tournamentDocRef, { rounds: updatedRounds, currentPhase: 'final' }, { merge: true });
        }
        setMatches(finalMatch);
        setMatchHistory((prev) => [...prev, ...finalMatch, ...thirdPlaceMatch]);
        setCurrentPhase('final');
        setPhaseHistory((prev) => [...prev, 'eliminatorElite']);
        setCanAdvanceToNextRound(false);
      } else if (currentPhase === 'final' && winners.length === 1) {
        console.log('Manually advancing from Final to Third Place');
        const tournamentDocRef = doc(db, 'KnockoutTournamentMatches', tournamentId);
        const tournamentDoc = await getDoc(tournamentDocRef);
        if (tournamentDoc.exists()) {
          const data = tournamentDoc.data();
          const thirdPlaceRound = data.rounds.find((r) => r.stage === 'thirdPlace');
          if (thirdPlaceRound && thirdPlaceRound.matches.length === 1) {
            await setDoc(tournamentDocRef, { currentPhase: 'thirdPlace' }, { merge: true });
            setMatches(thirdPlaceRound.matches);
            setCurrentPhase('thirdPlace');
            setPhaseHistory((prev) => [...prev, 'final']);
            setCanAdvanceToNextRound(false);
          }
        }
      } else if (currentPhase === 'thirdPlace' && winners.length === 1) {
        console.log('Manually setting final rankings for Eliminator Elite');
        const tournamentDocRef = doc(db, 'KnockoutTournamentMatches', tournamentId);
        const tournamentDoc = await getDoc(tournamentDocRef);
        if (tournamentDoc.exists()) {
          const data = tournamentDoc.data();
          const finalMatch = data.rounds.find((r) => r.stage === 'final')?.matches[0];
          const thirdPlaceMatch = data.rounds.find((r) => r.stage === 'thirdPlace')?.matches[0];
          if (finalMatch?.played && thirdPlaceMatch?.played) {
            const firstPlace = finalMatch.winner;
            const secondPlace = finalMatch.team1.name === finalMatch.winner ? finalMatch.team2.name : finalMatch.team1.name;
            const thirdPlace = thirdPlaceMatch.winner;
            const fourthPlace = thirdPlaceMatch.team1.name === thirdPlaceMatch.winner ? thirdPlaceMatch.team2.name : thirdPlaceMatch.team1.name;
            const rankings = { first: firstPlace, second: secondPlace, third: thirdPlace, fourth: fourthPlace };
            setTournamentWinner(firstPlace);
            setFinalRankings(rankings);
            await setDoc(tournamentDocRef, {
              tournamentWinner: firstPlace,
              finalRankings: rankings,
              currentPhase: 'completed',
            }, { merge: true });
            setCanAdvanceToNextRound(false);
          }
        }
      }
    } else if (format === 'championship') {
      if (currentPhase === 'championship' && winners.length === 1) {
        console.log('Manually setting tournament winner');
        setTournamentWinner(winners[0].name);
        await setDoc(doc(db, 'KnockoutTournamentMatches', tournamentId), { tournamentWinner: winners[0].name }, { merge: true });
        setCanAdvanceToNextRound(false);
      }
    }
  };

  const renderMatchCard = (match) => (
    <motion.div
      key={match.id}
      className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg mb-6 border-2 border-purple-500"
      whileHover={{ scale: (match.team1?.isBye || match.team2?.isBye || match.played) ? 1 : 1.02 }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className={`flex-1 text-right ${match.winner === match.team1?.name ? 'text-green-400 font-bold' : 'text-gray-300'}`}>
          {match.team1?.isBye ? 'BYE' : match.team1?.name || 'TBD'}
        </div>
        <div className="mx-4 text-xl font-bold text-purple-400">vs</div>
        <div className={`flex-1 text-left ${match.winner === match.team2?.name ? 'text-green-400 font-bold' : 'text-gray-300'}`}>
          {match.team2?.isBye ? 'BYE' : match.team2?.name || 'TBD'}
        </div>
      </div>
      {['superKnockout', 'playOff', 'knockout', 'eliminatorElite', 'championship'].includes(format) && (
        <div className="text-center mt-2">
          {match.winner ? (
            <div className="text-sm text-green-500">
              Winner: {match.winner}
            </div>
          ) : !match.team1?.isBye && !match.team2?.isBye ? (
            <motion.button 
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-all duration-200"
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center">Loading tournament...</div>
        ) : error ? (
          <div className="text-center">
            <p>{error}</p>
            <button 
              onClick={() => navigate('/TournamentPage')}
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-blue-800 rounded-lg text-white"
            >
              Go Back
            </button>
          </div>
        ) : !format ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-8 text-blue-400">Select Tournament Format</h1>
            <div className="flex flex-wrap justify-center gap-4">
              {['superKnockout', 'knockout', 'playOff', 'eliminatorElite', 'championship'].map((formatType) => (
                <button 
                  key={formatType}
                  onClick={() => initializeTournament(formatType)}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-lg font-semibold mb-2 transition-transform duration-200 hover:scale-105"
                >
                  {formatType === 'superKnockout' ? 'Super Knockout' 
                    : formatType === 'knockout' ? 'Knockout' 
                    : formatType === 'playOff' ? 'Play Off' 
                    : formatType === 'eliminatorElite' ? 'Eliminator Elite' 
                    : 'Championship'}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-blue-400">
                {currentPhase === 'superKnockout' ? 'Super Knockout' 
                  : currentPhase === 'preQuarter' ? 'Pre-Quarter Finals' 
                  : currentPhase === 'trimToFour' ? 'Trim to Four'
                  : currentPhase === 'quarter' ? 'Quarter Finals' 
                  : currentPhase === 'semi' ? 'Semi Finals' 
                  : currentPhase === 'final' ? 'Final' 
                  : currentPhase === 'eliminatorElite' ? 'Semifinals' 
                  : currentPhase === 'championship' ? 'Championship' 
                  : currentPhase === 'thirdPlace' ? 'Third Place Match' 
                  : currentPhase === 'completed' ? 'Tournament Completed' 
                  : 'Tournament'}
              </h1>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-blue-400">
                  {currentPhase === 'superKnockout' ? 'Super Knockout' 
                    : currentPhase === 'preQuarter' ? 'Pre-Quarterfinals' 
                    : currentPhase === 'trimToFour' ? 'Trim to Four'
                    : currentPhase === 'quarter' ? 'Quarterfinals' 
                    : currentPhase === 'semi' ? 'Semifinals' 
                    : currentPhase === 'final' ? 'Final' 
                    : currentPhase === 'eliminatorElite' ? 'Semifinals' 
                    : currentPhase === 'championship' ? 'Championship' 
                    : currentPhase === 'thirdPlace' ? 'Third Place Match' 
                    : currentPhase === 'completed' ? 'Tournament Matches' 
                    : 'Tournament'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matches.map((match) => renderMatchCard(match))}
                </div>
              </div>
            </div>

            {canAdvanceToNextRound && ['superKnockout', 'playOff', 'knockout', 'eliminatorElite'].includes(format) && !tournamentWinner && currentPhase !== 'completed' && (
              <div className="text-center mt-8">
                <button 
                  onClick={handleNextRound}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-transform duration-200 hover:scale-105"
                >
                  Next Round
                </button>
              </div>
            )}
            {tournamentWinner && (
              <div className="text-center mt-8">
                <div className="bg-blue-500 p-8 rounded-full mx-auto shadow-lg w-fit">
                  <h2 className="text-4xl font-bold text-white mb-4 animate-pulse">
                    🏆 Champion: {tournamentWinner} 🏆
                  </h2>
                </div>

                <button 
                  onClick={handleGoToFlowchart}
                  className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg text-white font-semibold transition-all duration-200 hover:scale-105"
                >
                  Go to Flowchart
                </button>

                {finalRankings && format === 'eliminatorElite' && (
                  <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-lg inline-block">
                    <h3 className="text-2xl font-bold text-blue-600 mb-2">Final Rankings</h3>
                    <p className="text-lg text-gray-900">1st: {finalRankings.first}</p>
                    <p className="text-lg text-gray-700">2nd: {finalRankings.second}</p>
                    <p className="text-lg text-gray-700">3rd: {finalRankings.third}</p>
                    <p className="text-lg text-gray-600">4th: {finalRankings.fourth}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TournamentBracket;