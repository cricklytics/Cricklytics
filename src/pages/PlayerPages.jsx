import React, { useEffect, useState } from 'react';
import Frame1321317519 from '../components/pawan/Frame';
import PlayerCard from '../components/pawan/PlayerCard';
import Leaderboard from '../components/pawan/Leaderboard';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';

function PlayerPages() {
  const [players, setPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [battingStyleFilter, setBattingStyleFilter] = useState('');
  const [audio, setAudio] = useState(null);

  const handlePlayAudio = (url) => {
    console.log("Attempting to play audio URL:", url);

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  
    const newAudio = new Audio(url);
    newAudio.play().catch((err) => {
      console.warn("Playback failed:", err);
    });
  
    setAudio(newAudio);
  };

  useEffect(() => {
    const fetchPlayersFromFirestore = async () => {
      try {
        const playersSnapshot = await getDocs(collection(db, "players"));
        const playersList = playersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPlayers(playersList);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
  
    fetchPlayersFromFirestore();
  }, []);

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = teamFilter ? player.team === teamFilter : true;
    const matchesBattingStyle = battingStyleFilter ? player.battingStyle === battingStyleFilter : true;
    return matchesSearch && matchesTeam && matchesBattingStyle;
  });

  const teams = [...new Set(players.map((player) => player.team))];
  const battingStyles = [...new Set(players.map((player) => player.battingStyle))];

  return (
    <div className="bg-gradient-to-r from-[#0a1f44] to-[#123456] scrollbar-hide min-h-screen">
      <div className="bg-gradient-to-r from-[#0a1f44] to-[#123456] h-10 w-full">
      <Frame1321317519 />
      </div>
      
      {/* Page Title */}
      <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 px-4 sm:px-5 text-center mt-15">
        Player Profiles
      </h1>
      
      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Search Input */}
        <div className="w-full sm:w-full md:w-1/4 min-w-[280px]">
          <label htmlFor="search" className="block text-sm font-medium text-gray-200 mb-1">
            Search by Name
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter player name..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-gray-500 focus:ring-blue-500"
          />
        </div>

        {/* Team Filter */}
        <div className="w-full sm:w-full md:w-1/4 min-w-[280px]">
          <label htmlFor="team" className="block text-sm font-medium text-gray-200 mb-1">
            Filter by Team
          </label>
          <select
            id="team"
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-gray-500 focus:ring-blue-500"
          >
            <option value="">All Teams</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        {/* Batting Style Filter */}
        <div className="w-full sm:w-full md:w-1/4 min-w-[280px]">
          <label htmlFor="battingStyle" className="block text-sm font-medium text-gray-200 mb-1">
            Filter by Batting Style
          </label>
          <select
            id="battingStyle"
            value={battingStyleFilter}
            onChange={(e) => setBattingStyleFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-gray-500 focus:ring-blue-500"
          >
            <option value="">All Styles</option>
            {battingStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Player Profiles */}
      <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 cursor-pointer select-none">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player, index) => (
            <div key={player.id || index} className="flex justify-center">
              <PlayerCard player={player} onPlay={handlePlayAudio} />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-300 col-span-full py-8">
            No players found matching your criteria.
          </p>
        )}
      </div>
      
      <div className="mt-10 sm:mt-16"></div>
      <Leaderboard players={filteredPlayers} />
    </div>
  );
}

export default PlayerPages;