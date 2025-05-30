import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../../firebase'; // Adjust the path if your firebase.js is elsewhere
import { collection, getDocs } from 'firebase/firestore';

const PlayersList = () => {
  const [playingPlayerId, setPlayingPlayerId] = useState(null); // Tracks the ID of the player whose audio is playing
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

  // Effect to manage audio playback when playingPlayerId changes
  useEffect(() => {
    if (!audioRef.current) return; // Ensure audio element exists

    if (playingPlayerId) {
      // Find the player object based on the ID
      const playerToPlay = players.find(p => p.id === playingPlayerId);

      if (playerToPlay && playerToPlay.audioUrl) {
        // Stop any currently playing audio and reset it
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = playerToPlay.audioUrl;
        audioRef.current.load(); // Load the new audio source

        // Attempt to play, handle potential autoplay policy issues
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.warn("Autoplay prevented:", e);
            // Optionally, inform the user that audio couldn't autoplay
            // You might want to display a message or a manual play button
          });
        }
      } else {
        // No audioUrl for the selected player, or player not found, stop current audio
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = ''; // Clear source
      }
    } else {
      // No player selected to play, stop and reset audio
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = ''; // Clear source
    }

    // Cleanup function: pause and reset audio when component unmounts
    // or when playingPlayerId becomes null
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = ''; // Clear source
      }
    };
  }, [playingPlayerId, players]); // Depend on playingPlayerId and players (to find the player object)

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = teamFilter ? player.team === teamFilter : true;
    const matchesBattingStyle = battingStyleFilter ? player.battingStyle === battingStyleFilter : true;
    return matchesSearch && matchesTeam && matchesBattingStyle;
  });

  const handlePlayerClick = (player) => {
    if (playingPlayerId === player.id) {
      // If the same player is clicked, pause the audio
      audioRef.current.pause();
      setPlayingPlayerId(null); // No player is now playing audio
    } else {
      // If a different player is clicked, or no player is playing, start new audio
      setPlayingPlayerId(player.id);
    }
  };

  // Function to generate the descriptive text
  const generatePlayerDescription = (playerData) => {
    const name = playerData.name;
    const battingDetail = playerData.battingStyle || "not specified";
    const bowlingDetail = playerData.bowlingStyle || "not specified";

    return `${name}, a ${playerData.age}-year-old ${playerData.role} from the ${playerData.team}. ` +
           `${name} is a ${battingDetail}, and ${name}'s bowling style is ${bowlingDetail}.`;
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
    <div className="bg-gray-900 min-h-screen md:p-6">
      {/* Hidden audio element */}
      <audio ref={audioRef} />

      <div>
        <h1 className="text-3xl font-bold text-white mb-6 text-center md:text-left">Players List</h1> {/* Added text-center for mobile */}
        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4"> {/* flex-col for mobile, md:flex-row for larger screens */}
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
                className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden border cursor-pointer p-4 relative
                  ${playingPlayerId === player.id ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-700 hover:border-blue-500 transition'}`}
                onClick={() => handlePlayerClick(player)}
              >
                {/* Image and Basic Info - Responsive adjustments */}
                {/* On mobile, this will naturally stack with flex-col, but flex-row keeps it horizontal on larger screens. */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                  <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gray-600 flex-shrink-0"> {/* Slightly larger image on small screens for better visibility */}
                    <img
                      src={player.image}
                      alt={player.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150"; // Fallback image
                      }}
                    />
                  </div>
                  <div className="text-center sm:text-left"> {/* Center text on mobile, left align on sm screens and up */}
                    <h2 className="text-xl font-bold text-white">{player.name}</h2>
                    <p className="text-gray-400">{player.team}</p>
                    <p className="text-gray-400 text-sm mt-1">Role: <span className="font-medium text-gray-300">{player.role || '-'}</span></p>
                    <p className="text-gray-400 text-sm">Age: <span className="font-medium text-gray-300">{player.age || '-'}</span></p>
                  </div>
                </div>

                {/* Display the generated description */}
                <p className="text-gray-400 text-sm mb-4 text-center sm:text-left"> {/* Center text on mobile, left align on sm screens and up */}
                  {generatePlayerDescription(player)}
                </p>

                {/* Small Container for Stats - Grid layout adapts well */}
                {/* grid-cols-2 for mobile is good, it keeps pairs of stats together. */}
                <div className="bg-gray-700 rounded-lg p-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm border border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Matches:</span>
                    <span className="font-medium text-blue-400">{player.matches || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Runs:</span>
                    <span className="font-medium text-blue-400">{player.runs || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Average:</span>
                    <span className="font-medium text-blue-400">{player.average || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Centuries:</span>
                    <span className="font-medium text-blue-400">{player.centuries || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Wickets:</span>
                    <span className="font-medium text-blue-400">{player.wickets || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Batting:</span>
                    <span className="font-medium text-gray-300">{player.battingStyle || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Bowling:</span>
                    <span className="font-medium text-gray-300">{player.bowlingStyle || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Innings:</span>
                    <span className="font-medium text-gray-300">{player.careerStats?.batting?.innings || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Strike Rate:</span>
                    <span className="font-medium text-gray-300">{player.careerStats?.batting?.strikeRate || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Catches:</span>
                    <span className="font-medium text-gray-300">{player.careerStats?.fielding?.catches || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Stumpings:</span>
                    <span className="font-medium text-gray-300">{player.careerStats?.fielding?.stumpings || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Run Outs:</span>
                    <span className="font-medium text-gray-300">{player.careerStats?.fielding?.runOuts || '-'}</span>
                  </div>
                </div>
                {playingPlayerId === player.id && (
                    <div className="absolute top-2 right-2 text-blue-400 animate-pulse">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.616 3.076a1 1 0 011.09.217L18.414 7H20a1 1 0 011 1v4a1 1 0 01-1 1h-1.586l-2.707 2.707A1 1 0 0114 16V4a1 1 0 01.616-.924z" clipRule="evenodd" />
                      </svg>
                    </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-white text-center col-span-full">No players found matching your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayersList;