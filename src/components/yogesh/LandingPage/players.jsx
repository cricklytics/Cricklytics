import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../../firebase'; // Adjust the path if your firebase.js is elsewhere
import { collection, getDocs } from 'firebase/firestore';

const PlayersList = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');
  const [showFullBio, setShowFullBio] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [battingStyleFilter, setBattingStyleFilter] = useState('');
  const [players, setPlayers] = useState([]); // State to store fetched players
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const audioRef = useRef(null); // Create a ref for the audio element

  const teams = ['Golden Warriors XI', 'Jaipur Strikers', 'LUT Biggieagles XI', 'Aavas Financiers'];
  const battingStyles = ['Right Handed Bat', 'Left Handed Bat'];

  // Fetch players data from Firebase on component mount
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const playersCollectionRef = collection(db, 'clubPlayers'); // Reference to your 'clubPlayers' collection
        const querySnapshot = await getDocs(playersCollectionRef);
        const playersData = querySnapshot.docs.map(doc => ({
          id: doc.id, // Use doc.id as a unique key
          ...doc.data()
        }));
        setPlayers(playersData);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching players: ", err);
        setError("Failed to load players. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []); // Empty dependency array means this runs once on mount

// Effect to manage audio playback when selectedPlayer changes
  useEffect(() => {
    if (audioRef.current) {
      if (selectedPlayer && selectedPlayer.audioUrl) {
        // First, stop any currently playing audio and reset it
        audioRef.current.pause();
        audioRef.current.currentTime = -1;
        audioRef.current.src = selectedPlayer.audioUrl;
        audioRef.current.load(); // Load the new audio source

        // Introduce a slight delay before playing
        const playTimeout = setTimeout(() => {
          audioRef.current.play().catch(e => {
            console.warn("Autoplay prevented:", e);
            // Optionally, inform the user that audio couldn't autoplay
          });
        }, 1000); // **This is the delay in milliseconds** (0.5 seconds)

        // Cleanup function for useEffect: clear the timeout if component unmounts
        // or selectedPlayer changes again before the timeout fires
        return () => {
          clearTimeout(playTimeout);
          // Also pause and reset audio when selectedPlayer becomes null
          // or a new player is selected before the previous audio starts
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = -1;
          }
        };

      } else {
        // No player selected or no audioUrl, stop any playing audio
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset playback position
      }
    }
  }, [selectedPlayer]);


  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = teamFilter ? player.team === teamFilter : true;
    const matchesBattingStyle = battingStyleFilter ? player.battingStyle === battingStyleFilter : true;
    return matchesSearch && matchesTeam && matchesBattingStyle;
  });

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    setActiveTab('stats');
    setShowFullBio(false);
    // The audio logic is now handled by the useEffect for selectedPlayer
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Loading players...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      {/* Hidden audio element - its 'src' will be dynamically updated by useEffect */}
      <audio ref={audioRef} />

      {!selectedPlayer ? (
        // Players List View
        <div>
          <h1 className="text-3xl font-bold text-white mb-6">Players List</h1>
          {/* Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-lg p-2 w-full md:w-1/3 bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="border rounded-lg p-2 w-full md:w-1/3 bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Teams</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
            <select
              value={battingStyleFilter}
              onChange={(e) => setBattingStyleFilter(e.target.value)}
              className="border rounded-lg p-2 w-full md:w-1/3 bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Batting Styles</option>
              {battingStyles.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map((player) => (
                <div
                  key={player.id}
                  className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition cursor-pointer"
                  onClick={() => handlePlayerClick(player)}
                >
                  <div className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-600">
                        <img
                          src={player.image}
                          alt={player.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">{player.name}</h2>
                        <p className="text-gray-400">{player.team}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white text-center col-span-full">No players found matching your criteria.</p>
            )}
          </div>
        </div>
      ) : (
        // Single Player Detail View
        <div>
          <button
            onClick={() => setSelectedPlayer(null)}
            className="mb-4 flex items-center text-blue-400 hover:text-blue-300"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Players List
          </button>

          {/* Player Header */}
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-700">
            <div className="flex flex-col md:flex-row">
              {/* Player Image and Basic Info */}
              <div className="md:w-1/3 bg-gray-700 p-6 text-white flex flex-col items-center border-r border-gray-600">
                <div className="w-32 h-32 rounded-full mb-4 overflow-hidden border-4 border-gray-600">
                  <img
                    src={selectedPlayer.image}
                    alt={selectedPlayer.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                </div>
                <h1 className="text-2xl font-bold text-center">{selectedPlayer.name}</h1>
                <p className="text-gray-300 text-center">{selectedPlayer.team}</p>

                <div className="mt-4 grid grid-cols-2 gap-3 w-full">
                  <div className="bg-gray-600 p-2 rounded text-center border border-gray-500">
                    <p className="text-xs text-gray-300">Role</p>
                    <p className="font-medium">{selectedPlayer.role}</p>
                  </div>
                  <div className="bg-gray-600 p-2 rounded text-center border border-gray-500">
                    <p className="text-xs text-gray-300">Age</p>
                    <p className="font-medium">{selectedPlayer.age}</p>
                  </div>
                  <div className="bg-gray-600 p-2 rounded text-center border border-gray-500">
                    <p className="text-xs text-gray-300">Batting</p>
                    <p className="font-medium">{selectedPlayer.battingStyle}</p>
                  </div>
                  <div className="bg-gray-600 p-2 rounded text-center border border-gray-500">
                    <p className="text-xs text-gray-300">Bowling</p>
                    <p className="font-medium">{selectedPlayer.bowlingStyle}</p>
                  </div>
                </div>
              </div>

              {/* Player Stats Highlights */}
              <div className="md:w-2/3 p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-700 p-3 rounded-lg text-center border border-gray-600">
                    <p className="text-sm text-gray-300">Matches</p>
                    <p className="text-2xl font-bold text-blue-400">{selectedPlayer.matches}</p>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg text-center border border-gray-600">
                    <p className="text-sm text-gray-300">Runs</p>
                    <p className="text-2xl font-bold text-blue-400">{selectedPlayer.runs}</p>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg text-center border border-gray-600">
                    <p className="text-sm text-gray-300">Highest</p>
                    <p className="text-2xl font-bold text-blue-400">{selectedPlayer.highestScore}</p>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg text-center border border-gray-600">
                    <p className="text-sm text-gray-300">Average</p>
                    <p className="text-2xl font-bold text-blue-400">{selectedPlayer.average}</p>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg text-center border border-gray-600">
                    <p className="text-sm text-gray-300">Centuries</p>
                    <p className="text-2xl font-bold text-blue-400">{selectedPlayer.centuries}</p>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg text-center border border-gray-600">
                    <p className="text-sm text-gray-300">Wickets</p>
                    <p className="text-2xl font-bold text-blue-400">{selectedPlayer.wickets}</p>
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-4">
                  <h3 className="font-bold text-gray-200 mb-2">Player Bio</h3>
                  <p className="text-gray-400">
                    {showFullBio ? selectedPlayer.bio : `${selectedPlayer.bio.substring(0, 150)}...`}
                    <button
                      onClick={() => setShowFullBio(!showFullBio)}
                      className="ml-2 text-blue-400 hover:underline text-sm"
                    >
                      {showFullBio ? 'Show less' : 'Read more'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-6 md:justify-start justify-center">
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'stats' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
              onClick={() => setActiveTab('stats')}
            >
              Career Statistics
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'matches' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
              onClick={() => setActiveTab('matches')}
            >
              Recent Matches
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'achievements' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
            {activeTab === 'stats' && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-200 mb-4">Career Statistics</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Batting Stats */}
                  <div className="border rounded-lg p-4 border-gray-700 bg-gray-700">
                    <h3 className="font-bold text-lg text-gray-200 mb-3 border-b pb-2 border-gray-600">Batting</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Matches</span>
                        <span className="font-medium text-gray-200">{selectedPlayer.careerStats?.batting?.matches || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Innings</span>
                        <span className="font-medium text-gray-200">{selectedPlayer.careerStats?.batting?.innings || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Runs</span>
                        <span className="font-medium text-gray-200">{selectedPlayer.careerStats?.batting?.runs || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Highest Score</span>
                        <span className="font-medium text-gray-200">{selectedPlayer.careerStats?.batting?.highest || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Average</span>
                        <span className="font-medium text-gray-200">{selectedPlayer.careerStats?.batting?.average || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Strike Rate</span>
                        <span className="font-medium text-gray-200">{selectedPlayer.careerStats?.batting?.strikeRate || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Centuries</span>
                        <span className="font-medium text-gray-200">{selectedPlayer.careerStats?.batting?.centuries || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fifties</span>
                        <span className="font-medium text-gray-200">{selectedPlayer.careerStats?.batting?.fifties || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bowling Stats */}
                  <div className="border rounded-lg p-4 border-gray-700 bg-gray-700">
                    <h3 className="font-bold text-lg text-gray-200 mb-3 border-b pb-2 border-gray-600">Bowling</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Innings</span>
                        <span className="font-medium text-gray-200">{selectedPlayer.careerStats?.bowling?.innings || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Wickets</span>
                        <span className="font-medium text-gray-200">{selectedPlayer.careerStats?.bowling?.wickets || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Best Bowling</span>
                        <span className="font-medium text-gray-200">{selectedPlayer.careerStats?.bowling?.best || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Average</span>
                        <span className="font-medium text-gray-200">{selectedPlayer.careerStats?.bowling?.average || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Economy</span>
                        <span className="font-medium text-gray-200">{selectedPlayer.careerStats?.bowling?.economy || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Strike Rate</span>
                        <span className="font-medium text-gray-200">{selectedPlayer.careerStats?.bowling?.strikeRate || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fielding Stats */}
                  <div className="border rounded-lg p-4 border-gray-700 bg-gray-700">
                    <h3 className="font-bold text-lg text-gray-200 mb-3 border-b pb-2 border-gray-600">Fielding</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Catches</span>
                        <span className="font-medium text-gray-200">{selectedPlayer.careerStats?.fielding?.catches || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Stumpings</span>
                        <span className="font-medium text-gray-200">{selectedPlayer.careerStats?.fielding?.stumpings || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Run Outs</span>
                        <span className="font-medium text-gray-200">{selectedPlayer.careerStats?.fielding?.runOuts || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'matches' && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-200 mb-4">Recent Matches</h2>
                <div className="space-y-4">
                  {selectedPlayer.recentMatches && selectedPlayer.recentMatches.length > 0 ? (
                    selectedPlayer.recentMatches.map((match, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0 border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-200">vs {match.opponent}</h3>
                          <span className={`px-2 py-1 rounded text-xs ${
                            match.result.startsWith('Won') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                          }`}>
                            {match.result}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-700 p-3 rounded border border-gray-600">
                            <p className="text-sm text-gray-400">Batting</p>
                            <p className="font-medium text-gray-200">{match.runs} runs</p>
                          </div>
                          <div className="bg-gray-700 p-3 rounded border border-gray-600">
                            <p className="text-sm text-gray-400">Bowling</p>
                            <p className="font-medium text-gray-200">{match.wickets > 0 ? `${match.wickets} wkts` : '-'}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No recent matches recorded for this player.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-200 mb-4">Achievements & Awards</h2>
                <div className="space-y-4">
                  {selectedPlayer.centuries > 0 && (
                    <div className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-700">
                      <h3 className="font-bold text-blue-400">Century Maker</h3>
                      <p className="text-gray-400">Scored {selectedPlayer.centuries} century{selectedPlayer.centuries > 1 ? 's' : ''} in career with highest score of {selectedPlayer.highestScore}</p>
                    </div>
                  )}
                  {selectedPlayer.average > 40 && (
                    <div className="border-l-4 border-amber-500 pl-4 py-2 bg-gray-700">
                      <h3 className="font-bold text-amber-400">Consistent Performer</h3>
                      <p className="text-gray-400">Maintains an excellent batting average of {selectedPlayer.average}</p>
                    </div>
                  )}
                  {selectedPlayer.wickets > 30 && selectedPlayer.bestBowling && (
                    <div className="border-l-4 border-green-500 pl-4 py-2 bg-gray-700">
                      <h3 className="font-bold text-green-400">Wicket Taker</h3>
                      <p className="text-gray-400">Taken {selectedPlayer.wickets} wickets with best bowling figures of {selectedPlayer.bestBowling}</p>
                    </div>
                  )}
                  {(selectedPlayer.role.includes('All-Rounder') || (selectedPlayer.runs > 1000 && selectedPlayer.wickets > 20)) && (
                    <div className="border-l-4 border-purple-500 pl-4 py-2 bg-gray-700">
                      <h3 className="font-bold text-purple-400">Valuable All-Rounder</h3>
                      <p className="text-gray-400">Contributed with both bat ({selectedPlayer.runs} runs) and ball ({selectedPlayer.wickets} wickets)</p>
                    </div>
                  )}
                    {/* Fallback for no achievements */}
                    {selectedPlayer.centuries === 0 && selectedPlayer.average <= 40 && selectedPlayer.wickets <= 30 && !selectedPlayer.role.includes('All-Rounder') && selectedPlayer.runs <= 1000 && selectedPlayer.wickets <= 20 && (
                      <p className="text-gray-400">No specific achievements recorded yet.</p>
                   )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayersList;