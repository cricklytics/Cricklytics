import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import FireworksCanvas from '../../components/sophita/HomePage/FireworksCanvas';
import { FaChevronDown, FaChevronUp, FaTrophy, FaHeart, FaCommentDots, FaShareAlt } from 'react-icons/fa';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { ScatterChart, Scatter, ZAxis, BarChart, Bar } from 'recharts';
import logo from '../../assets/sophita/HomePage/Picture3_2.png';
import trophy from '../../assets/sophita/HomePage/trophy.png';
import advertisement1 from '../../assets/sophita/HomePage/Advertisement1.webp';
import { useNavigate, useLocation } from 'react-router-dom';
import Startmatch from '../RoundRobin/StartmatchRR';
import nav from '../../assets/kumar/right-chevron.png';
import placeholderFlag from '../../assets/sophita/HomePage/Netherland.jpeg';
import { db, storage } from '../../firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const IPLCards = ({ setActiveTab, tournamentId }) => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Fetch highlights from Firestore
  useEffect(() => {
    const fetchHighlights = async () => {
      if (!tournamentId) {
        setError('No tournament ID provided.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const highlightsRef = collection(db, 'matchstartRR', tournamentId, 'highlights');
        const snapshot = await getDocs(highlightsRef);
        const fetchedHighlights = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Sort by uploadedAt descending (newest first)
        fetchedHighlights.sort((a, b) => b.uploadedAt?.seconds - a.uploadedAt?.seconds);
        setHighlights(fetchedHighlights);
      } catch (err) {
        console.error('Error fetching highlights:', err);
        setError('Failed to load highlights.');
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, [tournamentId]);

  const handlePhotoUploadClick = () => {
    photoInputRef.current.click();
  };

  const handleVideoUploadClick = () => {
    videoInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files.length === 0 || !tournamentId) {
      alert('No file selected or tournament ID missing.');
      return;
    }

    const file = files[0];
    const fileType = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : null;
    if (!fileType) {
      alert('Unsupported file type. Please upload an image or video.');
      return;
    }

    try {
      // Upload to Firebase Storage
      const storagePath = `highlights/${tournamentId}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Save metadata to Firestore
      const highlightsRef = collection(db, 'matchstartRR', tournamentId, 'highlights');
      await addDoc(highlightsRef, {
        url: downloadURL,
        type: fileType,
        title: file.name, // Use file name as title (can be enhanced with user input)
        uploadedAt: serverTimestamp(),
      });

      // Update local state to reflect new highlight
      setHighlights(prev => [
        {
          url: downloadURL,
          type: fileType,
          title: file.name,
          uploadedAt: { seconds: Math.floor(Date.now() / 1000) }, // Approximate for immediate display
        },
        ...prev,
      ]);

      alert(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} uploaded successfully!`);
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Failed to upload file.');
    }

    event.target.value = null; // Reset input
  };

  const handleNextClick = () => {
    setActiveTab('Match Analytics');
  };

  if (loading) {
    return <div className="text-center text-white">Loading highlights...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 py-0">
      <div className="flex justify-center gap-6 mb-6 w-full max-w-md">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-lg"
          onClick={handlePhotoUploadClick}
        >
          Upload Photo
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-lg"
          onClick={handleVideoUploadClick}
        >
          Upload Video
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
        {highlights.length === 0 ? (
          <p className="text-white text-lg">No highlights available for this tournament.</p>
        ) : (
          highlights.map((highlight, index) => (
            <motion.div
              key={highlight.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
            >
              {highlight.type === 'image' ? (
                <img
                  src={highlight.url}
                  alt={highlight.title}
                  className="w-[300px] h-[220px] object-cover"
                />
              ) : (
                <video
                  src={highlight.url}
                  controls
                  className="w-[300px] h-[220px] object-cover"
                />
              )}
              <div className="flex justify-around items-center w-full py-3">
                <FaHeart className="text-red-500 text-2xl cursor-pointer" />
                <FaCommentDots className="text-black text-2xl cursor-pointer" />
                <FaShareAlt className="text-black text-2xl cursor-pointer" />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

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
              <td className="px-4 py-2">{item.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FixtureGenerator = () => {
  const [selectedTeamA, setSelectedTeamA] = useState('');
  const [selectedTeamB, setSelectedTeamB] = useState('');
  const [liveTeamA, setLiveTeamA] = useState({ name: 'Team A', flag: placeholderFlag, score: '0/0', overs: '(0.0)' });
  const [liveTeamB, setLiveTeamB] = useState({ name: 'Team B', flag: placeholderFlag, score: '0/0', overs: '(0.0)' });
  const [winningCaption, setWinningCaption] = useState('');
  const [activeTab, setActiveTab] = useState('Start Match');
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState('scorecard');
  const [generatedFixtures, setGeneratedFixtures] = useState([]);
  const [showFixtures, setShowFixtures] = useState(false);
  const [matchResultWinner, setMatchResultWinner] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      if (location.state.activeTab) {
        setActiveTab(location.state.activeTab);
      }
      if (location.state.winner) {
        setMatchResultWinner(location.state.winner);
        setWinningCaption(location.state.winningDifference);
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

  const teamsFromTournament = location.state?.selectedTeams || [];
  const defaultTeams = ['India', 'Australia', 'England', 'Pakistan', 'New Zealand', 'Netherlands', 'South Africa'];

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
    switch (activeTab) {
      case 'Start Match':
        navigate('/TournamentPage');
        break;
      case 'Live Score':
        setActiveTab('Start Match');
        break;
      case 'Match Results':
        setActiveTab('Live Score');
        break;
      case 'Highlights':
        setActiveTab('Match Results');
        break;
      case 'Match Analytics':
        setActiveTab('Highlights');
        break;
      default:
        navigate(-1);
        break;
    }
  };

  const groupedFixtures = generatedFixtures.reduce((acc, fixture) => {
    const round = fixture.round || 'Round 1';
    if (!acc[round]) {
      acc[round] = [];
    }
    acc[round].push(fixture);
    return acc;
  }, {});

  console.log('match-start-sb activeTab:', activeTab);
  const allTabs = ['Start Match', 'Live Score', 'Match Results', 'Highlights', 'Match Analytics'];

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-green-400 via-blue-400 to-blue-200 overflow-x-hidden">
      <header className="w-screen shadow-md">
        <div className="w-full max-w-6xl py-4 flex justify-between items-center">
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
              {allTabs.map((tab) => (
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
          initialTeamA={selectedTeamA}
          initialTeamB={selectedTeamB}
          tournamentId={location.state?.tournamentId || ''}
          schedule={location.state?.schedule || []}
          semiFinals={location.state?.semiFinals || []}
          finals={location.state?.finals || []}
          selectedTeams={location.state?.selectedTeams || []}
          origin="/match-start-rr"
          onTeamsSelectedForLiveScore={handleTeamsSelected}
          setActiveTab={setActiveTab}
        />
      ) : (
        <main className="w-full max-w-7xl px-4 sm:px-8 py-8 mx-auto">
          {activeTab === 'Live Score' && (
            <div className="w-full">
              <motion.div
                className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-3xl mx-auto mt-10"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6">
                  <h3 className="text-2xl font-bold">ICC Cricket World Cup</h3>
                  <p className="text-sm opacity-90 mt-1">Today • 10:00 AM • Wankhede Stadium, Mumbai</p>
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
                      <p className="text-3xl font-extrabold text-blue-700 mt-1">{liveTeamA.score || '198/6'}</p>
                      <p className="text-sm text-gray-600">{liveTeamA.overs || '(42.0 overs)'}</p>
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
                      <p className="text-3xl font-extrabold text-green-700 mt-1">{liveTeamB.score || '178/3'}</p>
                      <p className="text-sm text-gray-600">{liveTeamB.overs || '(15.2 overs)'}</p>
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
              style={{
                background: 'linear-gradient(to bottom right, #ffe4e6, #ffc1cc)'
              }}
            >
              <FireworksCanvas />
              <div className="absolute top-4 right-4 z-30">
                <motion.button
                  onClick={() => setActiveTab('Start Match')}
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
                  <h1 className="text-4xl text-green-400 font-bold drop-shadow-[0_0_10px_#22c55e]">{matchResultWinner} won the match!</h1>
                )}
                {matchResultWinner === 'Tie' && (
                  <h1 className="text-xl text-green-400 font-bold drop-shadow-[0_0_10px_#22c55e]">The match was a Tie!</h1>
                )}
                {!matchResultWinner && (
                  <p>No match results available yet.</p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'Highlights' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <IPLCards setActiveTab={setActiveTab} tournamentId={location.state?.tournamentId || ''} />
            </motion.div>
          )}

          {activeTab === 'Match Analytics' && (
            <div className="rounded-lg p-6 text-white">
              <div className="flex border-b border-gray-700 mb-6">
                <button
                  className={`py-2 px-4 mr-2 ${activeAnalyticsTab === 'scorecard' ? 'border-b-2 border-yellow-500 font-semibold' : 'text-gray-300'}`}
                  onClick={() => setActiveAnalyticsTab('scorecard')}
                >
                  Scorecard
                </button>
                <button
                  className={`py-2 px-4 mr-2 ${activeAnalyticsTab === 'wagonwheel' ? 'border-b-2 border-yellow-500 font-semibold' : 'text-gray-300'}`}
                  onClick={() => setActiveAnalyticsTab('wagonwheel')}
                >
                  Wagon Wheel & Heat Map
                </button>
                <button
                  className={`py-2 px-4 ${activeAnalyticsTab === 'fallofwickets' ? 'border-b-2 border-yellow-500 font-semibold' : 'text-gray-300'}`}
                  onClick={() => setActiveAnalyticsTab('fallofwickets')}
                >
                  Fall of Wickets
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeAnalyticsTab === 'scorecard' && (
                  <>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">Worm Graph</h3>
                      <WormGraph />
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">Bowling Economy</h3>
                      <div className="h-48 bg-gray-700 rounded flex items-end justify-around p-4">
                        <div className="bg-teal-500 h-1/3 w-1/5 rounded-t-md"></div>
                        <div className="bg-teal-500 h-2/3 w-1/5 rounded-t-md"></div>
                        <div className="bg-teal-500 h-1/2 w-1/5 rounded-t-md"></div>
                        <div className="bg-teal-500 h-full w-1/5 rounded-t-md"></div>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 md:col-span-2">
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
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">Wagon Wheel</h3>
                      <WagonWheelChart data={wagonWheelData} />
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">Batsman Heatmap</h3>
                      <BatsmanHeatmapChart data={batsmanHeatmapData} />
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 md:col-span-2">
                      <h3 className="text-lg font-semibold mb-4">Bowler Heatmap</h3>
                      <BowlerHeatmapChart data={bowlerHeatmapData} />
                    </div>
                  </>
                )}

                {activeAnalyticsTab === 'fallofwickets' && (
                  <>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">Fall of Wickets Chart</h3>
                      <FallOfWicketsChart />
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
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