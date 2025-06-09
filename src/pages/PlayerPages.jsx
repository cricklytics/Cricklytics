import React, { useEffect, useState } from 'react';
import Frame1321317519 from '../components/pawan/Frame';
import PlayerCard from '../components/pawan/PlayerCard';
import Leaderboard from '../components/pawan/Leaderboard';
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from '../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function PlayerPages() {
  const [players, setPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [battingStyleFilter, setBattingStyleFilter] = useState('');
  const [audio, setAudio] = useState(null);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    battingAvg: '',
    bowlingAvg: '',
    battingStyle: '',
    team: '',
    photoMode: 'url',
    photoUrl: '',
    photoFile: null,
    recentMatches: ''
  });

  const storage = getStorage();

  const handlePlayAudio = (url) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    const newAudio = new Audio(url);
    newAudio.play().catch((err) => console.warn("Playback failed:", err));
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.photoMode === 'upload' && formData.photoFile) {
        const storageRef = ref(storage, `player_photos/${formData.photoFile.name}`);
        await uploadBytes(storageRef, formData.photoFile);
        const downloadURL = await getDownloadURL(storageRef);
        formData.photoUrl = downloadURL;
      }

      const playerData = {
        ...formData,
        battingAvg: parseFloat(formData.battingAvg),
        bowlingAvg: formData.bowlingAvg ? parseFloat(formData.bowlingAvg) : null,
        recentMatches: formData.recentMatches.split(',').map(Number),
        photoMode: undefined,
        photoFile: undefined
      };

      const playerId = playerData.name.toLowerCase().replace(/\s+/g, "_");
      await setDoc(doc(db, "players", playerId), playerData);

      const playersSnapshot = await getDocs(collection(db, "players"));
      const playersList = playersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlayers(playersList);

      setFormData({
        name: '',
        role: '',
        battingAvg: '',
        bowlingAvg: '',
        battingStyle: '',
        team: '',
        photoMode: 'url',
        photoUrl: '',
        photoFile: null,
        recentMatches: ''
      });
      setShowAddPlayerModal(false);
    } catch (err) {
      console.error("Error adding player:", err);
      alert("Failed to add player");
    }
  };

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
      <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mt-8 mb-6">
        Player Profiles
      </h1>

      {/* Search, Filter, and Add Player Section */}
      <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-wrap gap-4 justify-center sm:justify-start items-end relative">
        <div className="w-full sm:w-1/4 min-w-[280px]">
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

        <div className="w-full sm:w-1/4 min-w-[280px]">
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

        <div className="w-full sm:w-1/4 min-w-[280px]">
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

        {/* Add Player Button */}
        <div className="sm:ml-auto">
          <button
            onClick={() => setShowAddPlayerModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-white"
          >
            <span className="text-xl font-bold">+</span> Add Player
          </button>
        </div>
      </div>

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

      {showAddPlayerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Add New Player</h3>
              <button
                onClick={() => setShowAddPlayerModal(false)}
                className="text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-white">
              {[
                { label: "Name", key: "name", example: "e.g., Virat Kohli" },
                { label: "Role (Batsman/Bowler/All-Rounder)", key: "role", example: "e.g., Batsman" },
                { label: "Batting Average", key: "battingAvg", type: "number", example: "e.g., 53.4" },
                { label: "Bowling Average", key: "bowlingAvg", type: "number", example: "Optional, e.g., 28.6" },
                { label: "Batting Style (Right/Left-handed)", key: "battingStyle", example: "e.g., Right-handed" },
                { label: "Team", key: "team", example: "e.g., India" },
                { label: "Recent Matches (comma-separated)", key: "recentMatches", example: "e.g., 50, 34, 23" },
              ].map(({ label, key, type = "text", example }) => (
                <div key={key}>
                  <p className="text-sm text-gray-300 mb-1">{example}</p>
                  <label className="block mb-1 text-white">{label}</label>
                  <input
                    type={type}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                    required={key !== "bowlingAvg"}
                  />
                </div>
              ))}

              <div>
                <label className="block text-white mb-1">Photo Upload Method</label>
                <div className="flex gap-4 text-sm text-white mb-2">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="photoMode"
                      value="url"
                      checked={formData.photoMode === 'url'}
                      onChange={() => setFormData({ ...formData, photoMode: 'url', photoUrl: '' })}
                    />
                    URL
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="photoMode"
                      value="upload"
                      checked={formData.photoMode === 'upload'}
                      onChange={() => setFormData({ ...formData, photoMode: 'upload', photoFile: null, photoUrl: '' })}
                    />
                    Upload from Device
                  </label>
                </div>
              </div>

              {formData.photoMode === 'url' ? (
                <div>
                  <p className="text-sm text-gray-300 mb-1">e.g., https://example.com/photo.jpg</p>
                  <label className="block text-white mb-1">Photo URL</label>
                  <input
                    type="text"
                    name="photoUrl"
                    value={formData.photoUrl}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-white mb-1">Upload Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, photoFile: e.target.files[0] })}
                    className="w-full p-2 bg-gray-700 text-white"
                    required
                  />
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddPlayerModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                >
                  Add Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerPages;
