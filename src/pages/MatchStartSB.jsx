import React, { useState, useEffect, useRef  } from 'react';
import { motion } from 'framer-motion';
import FireworksCanvas from '../components/sophita/HomePage/FireworksCanvas';
import { FaChevronDown, FaChevronUp, FaTrophy, FaHeart, FaCommentDots, FaShareAlt } from 'react-icons/fa';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { ScatterChart, Scatter, ZAxis, BarChart, Bar } from 'recharts';
import logo from '../assets/sophita/HomePage/Picture3_2.png';
import netherland from '../assets/sophita/HomePage/Netherland.jpeg';
import southAfrica from '../assets/sophita/HomePage/Southafrica.png';
import trophy from '../assets/sophita/HomePage/trophy.png';
import ipl2 from '../assets/sophita/HomePage/ipl2.jpeg';
import ipl2022 from '../assets/sophita/HomePage/2022.jpeg';
import ipl2025 from '../assets/sophita/HomePage/2025.jpeg';
import ipl2019 from '../assets/sophita/HomePage/2019.jpeg';
import ipl2019_3 from '../assets/sophita/HomePage/2019-3.jpeg';
import ipl2021 from '../assets/sophita/HomePage/2021.jpeg';
import ipl2020 from '../assets/sophita/HomePage/2020.jpeg';
import ipl2018 from '../assets/sophita/HomePage/2018.jpeg';
import advertisement1 from '../assets/sophita/HomePage/Advertisement1.webp'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Startmatch  from '../pages/Startmatch';
import nav from '../assets/kumar/right-chevron.png';

const IPLCards = ({ setActiveTab }) => {
  const cards = [
    {
      image: ipl2,
      videoUrl: "https://www.youtube.com/embed/AFEZzf9_EHk?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0",
      title: "Rohit Sharma Hits 140!",
      alt: "Cricket Match 1",
    },
    {
      image: ipl2022,
      alt: "Cricket Match 1",
    },
    {
      image: ipl2025,
      alt: "Cricket Match 3",
    },
    {
      image: ipl2019,
      alt: "Cricket Match 1",
    },
    {
      image: ipl2019_3,
      alt: "Cricket Match 2",
    },
    {
      image: ipl2021,
      alt: "Cricket Match 3",
    },
    {
      image: ipl2020,
      alt: "Cricket Match 1",
    },
    {
      image: ipl2019,
      alt: "Cricket Match 2",
    },
    {
      image: advertisement1,
      alt: "Cricket Match 3",
    },
  ];

  // Create refs for file inputs (optional, but a common pattern)
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handlePhotoUploadClick = () => {
    // Trigger the hidden file input for photos
    photoInputRef.current.click();
  };

  const handleVideoUploadClick = () => {
    // Trigger the hidden file input for videos
    videoInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      // Process the uploaded files here
      console.log("Uploaded files:", files);
      // You would typically upload these files to a server or display them
    }
    // Clear the input value so the same file can be selected again
    event.target.value = null;
  };

    // Handler for the Next button
    const handleNextClick = () => {
      setActiveTab('Match Analytics');
    };
  

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 py-0">
       {/* Buttons for Upload */}
       <div className="flex justify-center gap-6 mb-6 w-full max-w-md"> {/* Adjusted width and added justify-center */}
       <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-lg"
        onClick={handlePhotoUploadClick}>Upload Photo
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-lg"
          onClick={handleVideoUploadClick}>Upload Video
          </button>
           {/* Added Next button */}
          <motion.button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-sm sm:text-base flex-1" // Added flex-1 and green color
            onClick={handleNextClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next
          </motion.button>


          {/* Hidden file input elements */}
          <input
            type="file"
            accept="image/*" // Accept image files
            ref={photoInputRef}
            className="hidden" // Hide the input
            onChange={handleFileChange}
          />
          <input
            type="file"
            accept="video/*" // Accept video files
            ref={videoInputRef}
            className="hidden" // Hide the input
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
              <td className="px-4 py-2">{item.over}</td>
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
  const [activeTab, setActiveTab] = useState('Start Match');
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState('scorecard');
  const [generatedFixtures, setGeneratedFixtures] = useState([]);
  const [showFixtures, setShowFixtures] = useState(false);
  const navigate = useNavigate();

  const location = useLocation(); // Effect to update activeTab based on location state, primarily for direct navigation
  useEffect(() => {
      const tabFromLocationState = location.state?.activeTab;
      if (tabFromLocationState) {
          setActiveTab(tabFromLocationState);
      }
       // Clean up state if you navigate away (optional but good practice)
       return () => {
            // You might want to reset some state here if needed when the component unmounts
       };
  }, [location.state?.activeTab]); // Depend only on activeTab in location state

  const teamsFromTournament = location.state?.selectedTeams || [];

  // Default list of teams if none are passed from TournamentPage (This might not be needed if Fixture Generator is removed)
  const defaultTeams = ['India', 'Australia', 'England', 'Pakistan', 'New Zealand', 'Netherlands', 'South Africa'];

  // Sample data for charts
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
    // Check if selected teams are the same
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

  const handleFixtureNextClick = () => { // Renamed to be specific
    // Switch the tab to show the Startmatch component
    setActiveTab('Start Match');
  };

  // Handler for the Back button - Modified logic
  const handleBack = () => {
      // If not from sidebar, use the original tab cycling logic
      switch (activeTab) {
        case 'Start Match':
          // If came to Start Match from Fixture Generator, go back to Fixture Generator tab
          navigate('/landingpage');
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
          navigate(-1); // Fallback to history if tab is unexpected
          break;
      }
  };

  // This grouping logic seems for display, keeping it for now
  const groupedFixtures = generatedFixtures.reduce((acc, fixture) => {
    // Assuming you might add a 'round' property later if doing multi-round tournaments
    const round = fixture.round || 'Round 1'; // Default to Round 1 if no round property
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
      {/* Header */}
      <header className="w-screen shadow-md">
        {/* Added mx-auto here */}
        <div className="w-full max-w-6xl py-4 flex justify-between items-center">
          {/* Left side: Logo, Title, and Back Button */}
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
              src={nav} // Assuming 'nav' here is the back arrow icon variable
              alt="Back"
              loading="lazy"
              className="w-10 h-10 -scale-x-100 cursor-pointer mt-[5px] ml-[5px]"
              onClick={handleBack}
            />
          </div>

          {/* Right side: Navigation Tabs */}
          <div className="flex items-center overflow-x-auto mt-8 md:mt-8 -ml-20 md:-ml-20">
          <ul className="flex gap-x-2 sm:gap-x-3 md:gap-x-4 lg:gap-x-5">
              {/* Render tabs based on whether we came from the sidebar to Start Match */}
              {allTabs.map((tab) => (
                  <li key={tab} className="flex-shrink-0"> {/* flex-shrink-0 prevents tabs from shrinking */}
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

      {/* Main Content */}
      {activeTab === 'Start Match' ? (
            // Render Startmatch, passing the selected teams
            <Startmatch
                initialTeamA={selectedTeamA}
                initialTeamB={selectedTeamB}
                origin="/match-start-sb" // <--- Prop being passed here
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
                        src={netherland}
                        alt="Netherlands Flag" 
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <h4 className="font-bold text-xl text-gray-800">Netherlands</h4>
                    <p className="text-3xl font-extrabold text-blue-700 mt-1">198/6</p>
                    <p className="text-sm text-gray-600">(42.0 overs)</p>
                  </motion.div>

                  <div className="text-3xl font-bold text-gray-600 px-6">vs</div>

                  <motion.div
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-20 h-20 mx-auto mb-2 bg-gray-200 rounded-full overflow-hidden shadow-md">
                      <img 
                        src={southAfrica}
                        alt="South Africa Flag" 
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <h4 className="font-bold text-xl text-gray-800">South Africa</h4>
                    <p className="text-3xl font-extrabold text-green-700 mt-1">178/3</p>
                    <p className="text-sm text-gray-600">(15.2 overs)</p>
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
                    <motion.span
                      className="bg-green-400 text-black px-4 py-1 rounded-full text-sm font-semibold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      Live
                    </motion.span>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-800 text-lg">
                      South Africa need <span className="text-red-500 font-bold">21 runs</span> from <span className="text-red-500 font-bold">34 balls</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Current RR: <span className="font-semibold">11.60</span> • Required RR: <span className="font-semibold">3.70</span>
                    </p>
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
                onClick={() => setActiveTab('Highlights')}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-md transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next
              </motion.button>
            </div>
            <div className="relative z-20 text-center p-8">
              <img 
                src={trophy}
                alt="Trophy" 
                className="w-[300px] h-auto mb-8 drop-shadow-lg mx-auto"
              />
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
                India Won the Match!
              </h1>
              <p className="text-xl md:text-2xl text-gray-700">
                Won by 25 Runs 🎯
              </p>
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
          <div className=" rounded-lg p-6 text-white">
            {/* Tab Navigation */}
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

            {/* Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeAnalyticsTab === 'scorecard' && (
                <>
                  {/* Worm Graph */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Worm Graph</h3>
                    <WormGraph />
                  </div>

                  {/* Bowling Economy */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Bowling Economy</h3>
                    <div className="h-48 bg-gray-600 rounded flex items-end justify-around p-4">
                      <div className="bg-teal-500 h-1/3 w-1/5 rounded-t-md"></div>
                      <div className="bg-teal-500 h-2/3 w-1/5 rounded-t-md"></div>
                      <div className="bg-teal-500 h-1/2 w-1/5 rounded-t-md"></div>
                      <div className="bg-teal-500 h-full w-1/5 rounded-t-md"></div>
                    </div>
                  </div>

                  {/* Runs Comparison */}
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