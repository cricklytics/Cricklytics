// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg
import Frame1321317519 from '../components/pawan/Frame';
// import '../App.css'
import React, { useEffect, useState } from 'react';
import PlayerCard from '../components/pawan/PlayerCard';
import Leaderboard from '../components/pawan/Leaderboard';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase'; // adjust path if needed


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
  

  // const basePlayers = players.length > 0 ? players : samplePlayers;

  //Filter players based on search and filter inputs
  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = teamFilter ? player.team === teamFilter : true;
    const matchesBattingStyle = battingStyleFilter ? player.battingStyle === battingStyleFilter : true;
    return matchesSearch && matchesTeam && matchesBattingStyle;
  });

  // Unique options for filters
  const teams = [...new Set(players.map((player) => player.team))];
  const battingStyles = [...new Set(players.map((player) => player.battingStyle))];

  return (
    <div className="bg-gradient-to-r from-[#0a1f44] to-[#123456] scrollbar-hide">
      <Frame1321317519 />
      {/* Search and Filter Section */}
      {/* <div className="container mx-auto p-6 bg-black   rounded-lg shadow-md mb-6"></div> */}
      <h1 className="text-4xl font-bold text-white mb-6 p-5 text-center">Player Profiles</h1>
      
        
        {/* Search and Filter Section */}
  <div className="container mx-auto flex p-10 flex-wrap justify-center gap-6 mb-8">
  {/* Search Input */}
  
  <div className="w-full md:w-1/4">
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
  <div className="w-full md:w-1/4">
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
  <div className="w-full md:w-1/4">
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
      <div className="container pl-15 mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 cursor-pointer select-none">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player, index) => (
            <PlayerCard key={player.id || index} player={player}  onPlay={handlePlayAudio} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No players found.</p>
        )}
      </div>
      
      <div className="mt-50"></div>  
      <Leaderboard players={filteredPlayers} />
    </div>
  );
}

export default PlayerPages;