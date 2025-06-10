import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import nav from '../../assets/kumar/right-chevron.png';

const Selection2 = () => {
  const { state } = useLocation();
  const { teams: teamNames } = state || { teams: [] }; // Rename to teamNames for clarity
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState([]);
  const [semiFinals, setSemiFinals] = useState([]);
  const [finals, setFinals] = useState([]);
  const [tournamentId] = useState(generateTournamentId()); // Generate ID once on mount
  const [showModal, setShowModal] = useState(false);
  const [flowchartData, setFlowchartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasStoredSchedule = useRef(false); // Track if schedule has been stored

  // Transform teamNames into the desired structure
  const teams = teamNames.map(teamName => ({
    teamName,
    points: 0
  }));

  // Generate unique tournament ID
  function generateTournamentId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `tournament_${timestamp}_${random}`;
  }

  // Generate round-robin schedule and initialize playoff phases
  useEffect(() => {
    const generateRoundRobin = (teams) => {
      const n = teams.length;
      const rounds = [];
      let teamList = [...teams];

      if (n % 2 !== 0) {
        teamList.push({ teamName: 'BYE', points: 0 });
      }

      const numTeams = teamList.length;
      const numRounds = numTeams - 1;
      const matchesPerRound = numTeams / 2;

      for (let round = 0; round < numRounds; round++) {
        const roundMatches = [];
        for (let i = 0; i < matchesPerRound; i++) {
          const team1 = teamList[i];
          const team2 = teamList[numTeams - 1 - i];
          if (team1.teamName !== 'BYE' && team2.teamName !== 'BYE') {
            roundMatches.push({
              id: `group_${round + 1}_${i + 1}`,
              phase: `Group Stage ${round + 1}`,
              team1: team1.teamName,
              team2: team2.teamName,
              winner: null
            });
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

    if (teams.length > 0 && !hasStoredSchedule.current) {
      hasStoredSchedule.current = true; // Mark as stored

      const generatedSchedule = generateRoundRobin(teams);
      setSchedule(generatedSchedule);

      const { semiFinals, finals } = initializePlayoffs(teams.length);
      setSemiFinals(semiFinals);
      setFinals(finals);

      const storeSchedule = async () => {
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

          // Use setDoc to set the document ID as tournamentId
          await setDoc(doc(db, 'roundrobin', tournamentId), {
            tournamentId,
            teams, // Store the transformed teams array with teamName and points
            roundRobin: roundRobinObject,
            semiFinals: semiFinalsObject,
            finals: finalsObject,
            createdAt: new Date(),
          });

          console.log(`Tournament stored with ID: ${tournamentId}`);
        } catch (err) {
          console.error('Error storing schedule:', err);
          setError('Failed to save schedule. Please try again.');
          hasStoredSchedule.current = false; // Allow retry on error
        }
      };

      storeSchedule();
    }
  }, [teams, tournamentId]);

  // Fetch tournament data for flowchart modal
  const fetchFlowchartData = async () => {
    if (!tournamentId) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch the specific document using the tournamentId as the document ID
      const tournamentRef = doc(db, 'roundrobin', tournamentId);
      const tournamentDoc = await getDoc(tournamentRef);

      if (tournamentDoc.exists()) {
        const tournamentData = tournamentDoc.data();
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
        } else{
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

  return (
    <section className="bg-gradient-to-b from-[#0D171E] to-[#283F79] text-white p-4 md:px-8 md:pb-1 min-h-screen flex items-center w-full overflow-hidden z-0 relative">
      <div className="z-20 flex overflow-hidden justify-center w-full p-2 md:px-[5rem] md:pt-[1rem] relative">
        <div className="z-30 gap-5 md:gap-10 bg-[#1A2B4C] rounded-xl md:rounded-[2rem] shadow-[8px_-5px_0px_2px_#253A6E] md:shadow-[22px_-14px_0px_5px_#253A6E] flex flex-col items-center justify-around w-full max-w-[70rem] m-2 md:m-4 p-4 md:pl-[5rem] md:pr-[5rem] md:pt-[5rem] md:pb-[1rem] text-start">
          <button
            onClick={() => navigate('/tournament')}
            className="text-sm cursor-pointer absolute top-4 left-4 md:top-10 md:left-10"
          >
            <img src={nav} className="w-8 h-8 md:w-10 md:h-10 -scale-x-100" alt="Back" />
          </button>
          <h1 className="text-2xl md:text-5xl font-bold mb-4 md:mb-2 mt-4 md:-mt-8 text-center">Round Robin Tournament</h1>

          {error && <p className="text-red-500 text-sm md:text-base">{error}</p>}

          {teams.length === 0 ? (
            <p className="text-sm md:text-base">No teams selected. Please go back and select teams.</p>
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

              {/* Round-Robin Phase */}
              <h2 className="text-xl md:text-2xl font-semibold mb-4">Group Stage</h2>
              {schedule.map((round, index) => (
                <div key={index} className="mb-6">
                  {/* <h3 className="text-lg md:text-xl font-bold mb-2">Group Stage {index + 1}</h3> */}
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
              onClick={() => navigate('/tournament')}
            >
              Back
            </button>
            <button
              type="button"
              className="rounded-xl w-32 md:w-44 bg-gradient-to-l from-[#5DE0E6] to-[#004AAD] h-8 md:h-9 text-white cursor-pointer hover:shadow-[0px_0px_13px_0px_#5DE0E6] text-sm md:text-base"
              onClick={() => navigate('/match-start-rr', { state: { activeTab: 'Start Match', selectedTeams: teams, schedule, semiFinals, finals, tournamentId } })}
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