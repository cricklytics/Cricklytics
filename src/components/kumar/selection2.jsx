import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase';
import { doc, setDoc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import nav from '../../assets/kumar/right-chevron.png';

const Selection2 = () => {
  const { state } = useLocation();
  const { teams: teamNames = [], tournamentName = '', tournamentId: passedTournamentId = null, information = '', startDate = '2025-03-07', endDate = '2025-03-21' } = state || {};
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState([]);
  const [semiFinals, setSemiFinals] = useState([]);
  const [finals, setFinals] = useState([]);
  const [tournamentId, setTournamentId] = useState(passedTournamentId || generateTournamentId());
  const [currentTournamentName, setCurrentTournamentName] = useState(tournamentName);
  const [showModal, setShowModal] = useState(false);
  const [showTimetable, setShowTimetable] = useState(false);
  const [flowchartData, setFlowchartData] = useState([]);
  const [matchSchedule, setMatchSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);
  const hasStoredSchedule = useRef(false);
  const hasFetchedData = useRef(false);

  console.log('Current tournamentName:', currentTournamentName);
  console.log('Received information:', information);

  // Generate unique tournament ID
  function generateTournamentId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `tournament_${timestamp}_${random}`;
  }

  // Generate match schedule with dates and times
  const generateMatchSchedule = (groupStageMatches, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const groupStageDays = totalDays - 2; // Reserve last 2 days for semi-finals and finals
    const matches = groupStageMatches.flat();
    const matchSchedule = [];
    const times = ['10:00 AM', '1:00 PM', '3:00 PM', '6:00 PM'];

    // Calculate matches per day
    const matchesPerDay = Math.ceil(matches.length / groupStageDays);
    let matchIndex = 0;

    for (let day = 0; day < groupStageDays && matchIndex < matches.length; day++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + day);
      const formattedDate = currentDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      });

      // Assign matches to the current day
      for (let i = 0; i < matchesPerDay && matchIndex < matches.length; i++) {
        const match = matches[matchIndex];
        if (match.team1 !== 'BYE' && match.team2 !== 'BYE') {
          const time = times[i % times.length]; // Cycle through available times
          matchSchedule.push({
            date: formattedDate,
            match: `${match.team1} vs ${match.team2}`,
            time: time,
            matchId: match.id,
            played: match.played || false,
            winner: match.winner || null,
          });
        }
        matchIndex++;
      }
    }

    return matchSchedule;
  };

  // Fetch tournament data from Firebase or generate new schedule
  useEffect(() => {
    const fetchTournamentData = async () => {
      if (hasFetchedData.current) return;
      hasFetchedData.current = true;

      setLoading(true);
      try {
        const currentUserId = auth.currentUser?.uid;

        // Case 1: Fetch by passedTournamentId
        if (passedTournamentId) {
          const tournamentRef = doc(db, 'roundrobin', passedTournamentId);
          const tournamentDoc = await getDoc(tournamentRef);

          if (tournamentDoc.exists()) {
            const tournamentData = tournamentDoc.data();

            // Check if the userId matches the current user's ID
            if (tournamentData.userId !== currentUserId) {
              setError('You do not have permission to view this tournament.');
              setLoading(false);
              return;
            }

            hasStoredSchedule.current = true;

            const fetchedTeams = Array.isArray(teamNames) && teamNames.length > 0
              ? teamNames.map(teamName => ({ teamName, points: 0 }))
              : (tournamentData.teams || []).map(team => ({ teamName: team.teamName, points: team.points || 0 }));
            
            setTeams(fetchedTeams);
            setCurrentTournamentName(tournamentData.tournamentName || tournamentName);

            const roundRobin = Object.values(tournamentData.roundRobin || {}).filter(round => round.length > 0);
            setSchedule(roundRobin);

            const semiFinalMatches = Object.values(tournamentData.semiFinals || {});
            setSemiFinals(semiFinalMatches);

            const finalMatches = Object.values(tournamentData.finals || {});
            setFinals(finalMatches);

            // Load match schedule if it exists
            if (tournamentData.matchSchedule && tournamentData.scheduled) {
              setMatchSchedule(tournamentData.matchSchedule);
            } else if (roundRobin.length > 0) {
              // Generate and store match schedule
              const generatedMatchSchedule = generateMatchSchedule(roundRobin, startDate, endDate);
              setMatchSchedule(generatedMatchSchedule);
              await setDoc(doc(db, 'roundrobin', passedTournamentId), {
                ...tournamentData,
                matchSchedule: generatedMatchSchedule,
                scheduled: true,
              }, { merge: true });
            }

            console.log(`Tournament data fetched for ID: ${passedTournamentId}`);
          } else {
            // If no data exists and teamNames is provided, generate new schedule
            if (Array.isArray(teamNames) && teamNames.length > 0) {
              const newTeams = teamNames.map(teamName => ({ teamName, points: 0 }));
              setTeams(newTeams);
              await generateAndStoreSchedule(newTeams);
            } else {
              setError('No tournament data found and no teams provided.');
            }
          }
        } 
        // Case 2: No passedTournamentId, try to fetch recent tournament with tournamentWinner: null
        else if (!passedTournamentId && !(Array.isArray(teamNames) && teamNames.length > 0)) {
          const tournamentsCollectionRef = collection(db, 'roundrobin');
          const q = query(
            tournamentsCollectionRef,
            where('tournamentWinner', '==', null),
            where('userId', '==', currentUserId),
            orderBy('createdAt', 'desc'),
            limit(1)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const tournamentDoc = querySnapshot.docs[0];
            const tournamentData = tournamentDoc.data();
            hasStoredSchedule.current = true;

            setTournamentId(tournamentData.tournamentId);
            setCurrentTournamentName(tournamentData.tournamentName || '');
            setTeams(tournamentData.teams.map(team => ({ teamName: team.teamName, points: team.points || 0 })));

            const roundRobin = Object.values(tournamentData.roundRobin || {}).filter(round => round.length > 0);
            setSchedule(roundRobin);

            const semiFinalMatches = Object.values(tournamentData.semiFinals || {});
            setSemiFinals(semiFinalMatches);

            const finalMatches = Object.values(tournamentData.finals || {});
            setFinals(finalMatches);

            // Load match schedule if it exists
            if (tournamentData.matchSchedule && tournamentData.scheduled) {
              setMatchSchedule(tournamentData.matchSchedule);
            } else if (roundRobin.length > 0) {
              // Generate and store match schedule
              const generatedMatchSchedule = generateMatchSchedule(roundRobin, startDate, endDate);
              setMatchSchedule(generatedMatchSchedule);
              await setDoc(doc(db, 'roundrobin', tournamentData.tournamentId), {
                ...tournamentData,
                matchSchedule: generatedMatchSchedule,
                scheduled: true,
              }, { merge: true });
            }

            console.log(`Recent tournament fetched with ID: ${tournamentData.tournamentId}`);
          } else {
            setError('No ongoing tournaments found for this user.');
          }
        } 
        // Case 3: Generate new schedule if teamNames is provided
        else if (Array.isArray(teamNames) && teamNames.length > 0) {
          const newTeams = teamNames.map(teamName => ({ teamName, points: 0 }));
          setTeams(newTeams);
          await generateAndStoreSchedule(newTeams);
        }
      } catch (err) {
        console.error('Error fetching tournament data:', err);
        setError('Failed to load tournament data.');
        // Fallback to generating a new schedule if teamNames is provided
        if (Array.isArray(teamNames) && teamNames.length > 0) {
          const newTeams = teamNames.map(teamName => ({ teamName, points: 0 }));
          setTeams(newTeams);
          await generateAndStoreSchedule(newTeams);
        }
      } finally {
        setLoading(false);
      }
    };

    const generateRoundRobin = (teams) => {
      const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
      };

      const n = teams.length;
      const rounds = [];
      let teamList = [...teams];

      if (n % 2 !== 0) {
        teamList.push({ teamName: 'BYE', points: 0 });
      }

      teamList = shuffleArray(teamList);

      const numTeams = teamList.length;
      const numRounds = numTeams - 1;
      const matchesPerRound = numTeams / 2;

      for (let round = 0; round < numRounds; round++) {
        const roundMatches = [];
        for (let i = 0; i < matchesPerRound; i++) {
          const team1Candidate = teamList[i];
          const team2Candidate = teamList[numTeams - 1 - i];
          if (team1Candidate.teamName !== 'BYE' && team2Candidate.teamName !== 'BYE') {
            const assignTeam1First = Math.random() < 0.5;
            const match = {
              id: `group_${round + 1}_${i + 1}`,
              phase: `Group Stage ${round + 1}`,
              team1: assignTeam1First ? team1Candidate.teamName : team2Candidate.teamName,
              team2: assignTeam1First ? team2Candidate.teamName : team1Candidate.teamName,
              winner: null,
              played: false,
            };
            roundMatches.push(match);
          }
        }
        rounds.push(roundMatches);

        teamList = [
          teamList[0],
          teamList[numTeams - 1],
          ...teamList.slice(1, numTeams - 1),
        ];
      }

      return rounds;
    };

    const initializePlayoffs = (numTeams) => {
      let semiFinalMatches = [];
      let finalMatch = [];

      if (numTeams >= 4) {
        semiFinalMatches = [
          { id: 'semi_1', phase: 'Semi-Final 1', team1: 'TBD', team2: 'TBD', winner: null },
          { id: 'semi_2', phase: 'Semi-Final 2', team1: 'TBD', team2: 'TBD', winner: null },
        ];
        finalMatch = [{ id: 'final_1', phase: 'Final', team1: 'TBD', team2: 'TBD', winner: null }];
      } else if (numTeams === 3) {
        semiFinalMatches = [{ id: 'semi_1', phase: 'Semi-Final 1', team1: 'TBD', team2: 'TBD', winner: null }];
        finalMatch = [{ id: 'final_1', phase: 'Final', team1: 'TBD', team2: 'TBD', winner: null }];
      } else if (numTeams === 2) {
        finalMatch = [{ id: 'final_1', phase: 'Final', team1: 'TBD', team2: 'TBD', winner: null }];
      }

      return { semiFinals: semiFinalMatches, finals: finalMatch };
    };

    const generateAndStoreSchedule = async (teamsToUse) => {
      if (teamsToUse.length > 0 && !hasStoredSchedule.current) {
        hasStoredSchedule.current = true;

        const generatedSchedule = generateRoundRobin(teamsToUse);
        setSchedule(generatedSchedule);

        const { semiFinals, finals } = initializePlayoffs(teamsToUse.length);
        setSemiFinals(semiFinals);
        setFinals(finals);

        const generatedMatchSchedule = generateMatchSchedule(generatedSchedule, startDate, endDate);
        setMatchSchedule(generatedMatchSchedule);

        try {
          const roundRobinObject = generatedSchedule.reduce((acc, round, index) => {
            acc[`group_stage_${index + 1}`] = round;
            return acc;
          }, {});
          const semiFinalsObject = semiFinals.reduce((acc, match, index) => {
            acc[`match_${index + 1}`] = match;
            return acc;
          }, {});
          const finalsObject = finals.reduce((acc, match, index) => {
            acc[`match_${index + 1}`] = match;
            return acc;
          }, {});

          const userId = auth.currentUser ? auth.currentUser.uid : null;

          await setDoc(doc(db, 'roundrobin', tournamentId), {
            tournamentId,
            tournamentName: currentTournamentName || tournamentName,
            teams: teamsToUse,
            roundRobin: roundRobinObject,
            semiFinals: semiFinalsObject,
            finals: finalsObject,
            matchSchedule: generatedMatchSchedule,
            scheduled: true,
            createdAt: new Date(),
            tournamentWinner: null,
            userId,
          });

          console.log(`Tournament stored with ID: ${tournamentId}`);
        } catch (err) {
          console.error('Error storing schedule:', err);
          setError('Failed to save schedule. Please try again.');
          hasStoredSchedule.current = false;
        }
      }
    };

    fetchTournamentData();
  }, [passedTournamentId, teamNames, tournamentId, tournamentName, startDate, endDate]);

  // Fetch tournament data for flowchart modal
  const fetchFlowchartData = async () => {
    if (!tournamentId) return;

    setLoading(true);
    setError(null);

    try {
      const tournamentRef = doc(db, 'roundrobin', tournamentId);
      const tournamentDoc = await getDoc(tournamentRef);

      if (tournamentDoc.exists()) {
        const tournamentData = tournamentDoc.data();
        
        // Check if the userId matches the current user's ID
        const currentUserId = auth.currentUser?.uid;
        if (tournamentData.userId !== currentUserId) {
          setError('You do not have permission to view this tournament flowchart.');
          setLoading(false);
          return;
        }

        const flowchart = [];

        if (tournamentData.roundRobin && Object.keys(tournamentData.roundRobin).length > 0) {
          flowchart.push({
            phase: 'Group Stage',
            teams: tournamentData.teams
              .filter((team) => team.teamName !== 'BYE')
              .map((team) => team.teamName),
          });
        }

        let semiFinalTeams = [];
        let semiFinalMatches = Object.values(tournamentData.semiFinals || {});
        if (semiFinalMatches.length > 0 && semiFinalMatches[0].team1 !== 'TBD') {
          semiFinalTeams = semiFinalMatches.flatMap((match) => [match.team1, match.team2]);
          setSemiFinals(semiFinalMatches);
        } else {
          if (teams.length >= 4) {
            semiFinalMatches = [
              { id: 'semi_1', phase: 'Semi-Final 1', team1: 'TBD', team2: 'TBD', winner: null },
              { id: 'semi_2', phase: 'Semi-Final 2', team1: 'TBD', team2: 'TBD', winner: null },
            ];
            semiFinalTeams = ['TBD', 'TBD', 'TBD', 'TBD'];
          } else if (teams.length === 3) {
            semiFinalMatches = [{ id: 'semi_1', phase: 'Semi-Final 1', team1: 'TBD', team2: 'TBD', winner: null }];
            semiFinalTeams = ['TBD', 'TBD'];
          } else {
            semiFinalMatches = [];
            semiFinalTeams = [];
          }
          setSemiFinals(semiFinalMatches);
        }

        if (semiFinalTeams.length > 0) {
          flowchart.push({
            phase: 'Semi-Finals',
            teams: semiFinalTeams,
          });
        }

        let finalTeams = [];
        let finalMatches = Object.values(tournamentData.finals || {});
        if (finalMatches.length > 0 && finalMatches[0].team1 !== 'TBD') {
          finalTeams = finalMatches.flatMap((match) => [match.team1, match.team2]);
          setFinals(finalMatches);
        } else {
          if (teams.length >= 2) {
            finalMatches = [{ id: 'final_1', phase: 'Final', team1: 'TBD', team2: 'TBD', winner: null }];
            finalTeams = ['TBD', 'TBD'];
          } else {
            finalMatches = [];
            finalTeams = [];
          }
          setFinals(finalMatches);
        }

        if (finalTeams.length > 0) {
          flowchart.push({
            phase: 'Finals',
            teams: finalTeams,
          });
        }

        setFlowchartData(flowchart);
      } else {
        setError('No tournament data found.');
      }
    } catch (err) {
      console.error('Error fetching flowchart data:', err);
      setError('Failed to load flowchart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Open modal and fetch data
  const handleOpenModal = () => {
    setShowModal(true);
    fetchFlowchartData();
  };

  const handleBack = () => {
    if (information === 'FromSidebar') {
      navigate('/landingpage');
    } else {
      navigate('/TournamentPage', { state: { tournamentName: currentTournamentName || tournamentName, tournamentId } });
    }
  };

  // Check if a match date has passed and its status
  const getRowColor = (matchDate, played, winner) => {
    const today = new Date();
    const matchDateObj = new Date(matchDate.split('-').reverse().join('-')); // Convert DD-MMM-YY to YYYY-MMM-DD
    const isPast = matchDateObj < today;
    if (isPast && (played || winner)) {
      return 'bg-green-600'; // Played or has a winner
    } else if (isPast && !played && !winner) {
      return 'bg-red-600'; // Not played and date has passed
    }
    return 'bg-blue-900'; // Future match or no status
  };

  return (
    <section className="bg-gradient-to-b from-[#0D171E] to-[#283F79] text-white p-4 md:px-8 md:pb-1 min-h-screen flex items-center w-full overflow-hidden z-0 relative">
      <div className="z-20 flex overflow-hidden justify-center w-full p-2 md:px-[5rem] md:pt-[1rem] relative">
        <div className="z-30 gap-5 md:gap-10 bg-[#1A2B4C] rounded-xl md:rounded-[2rem] shadow-[8px_-5px_0px_2px_#253A6E] md:shadow-[22px_-14px_0px_5px_#253A6E] flex flex-col items-center justify-around w-full max-w-[70rem] m-2 md:m-4 p-4 md:pl-[5rem] md:pr-[5rem] md:pt-[5rem] md:pb-[1rem] text-start">
          <button
            onClick={handleBack}
            className="text-sm cursor-pointer absolute top-4 left-4 md:top-10 md:left-10"
          >
            <img src={nav} className="w-8 h-8 md:w-10 md:h-10 -scale-x-100" alt="Back" />
          </button>
          <button
            onClick={() => setShowTimetable(!showTimetable)}
            className="text-sm cursor-pointer absolute top-4 right-4 md:top-10 md:right-10 bg-[linear-gradient(120deg,_#000000,_#001A80)] px-4 py-2 rounded hover:bg-green-700"
          >
            {showTimetable ? 'Hide Timetable' : 'Show Timetable'}
          </button>
          <h1 className="text-2xl md:text-5xl font-bold mb-4 md:mb-2 mt-4 md:-mt-8 text-center">Round Robin Tournament</h1>

          {currentTournamentName && (
            <p className="text-sm md:text-base mb-4">Tournament Name: {currentTournamentName}</p>
          )}

          {error && <p className="text-red-500 text-sm md:text-base">{error}</p>}
          {loading && <p className="text-sm md:text-base">Loading tournament data...</p>}

          {teams.length === 0 ? (
            <p className="text-sm md:text-base">No teams available. Please go back and select teams or ensure a valid tournament ID.</p>
          ) : (
            <div className="w-full">
              <p className="text-sm md:text-base mb-4">
                {teams.length} teams selected. Total matches: {Math.floor((teams.length * (teams.length - 1)) / 2) + semiFinals.length + finals.length}
              </p>
              <p className="text-sm md:text-base mb-4">Tournament ID: {tournamentId}</p>
              <button
                onClick={handleOpenModal}
                className="mb-6 bg-[linear-gradient(120deg,_#000000,_#001A80)] px-4 py-2 rounded hover:bg-green-700 cursor-pointer text-sm md:text-base"
              >
                View Flowchart
              </button>

              {/* Match Schedule Table */}
              {showTimetable && matchSchedule.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl md:text-2xl font-semibold mb-4">Match Schedule</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm md:text-base">
                      <thead>
                        <tr className="bg-blue-800">
                          <th className="p-2 text-left">Date</th>
                          <th className="p-2 text-left">Match</th>
                          <th className="p-2 text-left">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matchSchedule.map((match, index) => (
                          <tr
                            key={index}
                            className={`${getRowColor(match.date, match.played, match.winner)} p-2 rounded-lg hover:shadow-[0px_0px_13px_0px_#253A6E]`}
                          >
                            <td className="p-2">{match.date}</td>
                            <td className="p-2">{match.match}</td>
                            <td className="p-2">{match.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Round-Robin Phase */}
              <h2 className="text-xl md:text-2xl font-semibold mb-4 mt-8">Group Stage</h2>
              {schedule.map((round, index) => (
                <div key={index} className="mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5">
                    {round.map((match, matchIndex) => (
                      <div
                        key={match.id}
                        className="bg-blue-900 p-4 rounded-lg md:rounded-xl hover:shadow-[0px_0px_13px_0px_#253A6E] flex justify-between items-center"
                      >
                        <span className="text-sm md:text-base">{match.team1}</span>
                        <span className="text-sm md:text-base font-bold">vs</span>
                        <span className="text-sm md:text-base">{match.team2}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Semi-Finals Phase */}
              {semiFinals.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl md:text-2xl font-semibold mb-4">Semi-Finals</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5">
                    {semiFinals.map((match) => (
                      <div
                        key={match.id}
                        className="bg-blue-900 p-4 rounded-lg md:rounded-xl hover:shadow-[0px_0px_13px_0px_#253A6E] flex justify-between items-center"
                      >
                        <span className="text-sm md:text-base">{match.team1}</span>
                        <span className="text-sm md:text-base font-bold">vs</span>
                        <span className="text-sm md:text-base">{match.team2}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Finals Phase */}
              {finals.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl md:text-2xl font-semibold mb-4">Finals</h2>
                  <div className="grid grid-cols-1 gap-3 md:gap-5">
                    {finals.map((match) => (
                      <div
                        key={match.id}
                        className="bg-blue-900 p-4 rounded-lg md:rounded-xl hover:shadow-[0px_0px_13px_0px_#253A6E] flex justify-between items-center"
                      >
                        <span className="text-sm md:text-base">{match.team1}</span>
                        <span className="text-sm md:text-base font-bold">vs</span>
                        <span className="text-sm md:text-base">{match.team2}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center w-full gap-4 mt-20">
            <button
              type="button"
              className="rounded-xl w-32 md:w-44 bg-gray-500 h-8 md:h-9 text-white cursor-pointer hover:shadow-[0px_0px_13px_0px_#5DE0E6] text-sm md:text-base"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              type="button"
              className="rounded-xl w-32 md:w-44 bg-gradient-to-l from-[#5DE0E6] to-[#004AAD] h-8 md:h-9 text-white cursor-pointer hover:shadow-[0px_0px_13px_0px_#5DE0E6] text-sm md:text-base"
              onClick={() => navigate('/match-start-rr', { state: { activeTab: 'Start Match', selectedTeams: teams, schedule, semiFinals, finals, tournamentId, tournamentName: currentTournamentName || tournamentName } })}
            >
              Proceed
            </button>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-[#1A2B4C] rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">Tournament Flowchart</h2>
                {loading && <p className="text-sm md:text-base">Loading flowchart...</p>}
                {error && <p className="text-red-500 text-sm md:text-base">{error}</p>}
                {!loading && !error && flowchartData.length > 0 && (
                  <div className="space-y-6">
                    {flowchartData.map((phase, index) => (
                      <div key={index} className="flex flex-row items-start">
                        <div className="w-1/4 text-left pr-4">
                          <h3 className="text-lg md:text-xl font-bold mb-2">{phase.phase}</h3>
                        </div>
                        <div className="w-3/4">
                          <div className="flex flex-row flex-wrap gap-2">
                            {phase.teams.map((team, teamIndex) => (
                              <div
                                key={teamIndex}
                                className="bg-blue-900 p-3 rounded-lg text-center text-sm md:text-base min-w-[100px]"
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
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-6 w-full bg-gray-500 px-4 py-2 rounded hover:bg-gray-600 text-sm md:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Selection2;