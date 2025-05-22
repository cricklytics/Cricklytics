import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // adjust if needed
import { doc, setDoc, updateDoc, arrayUnion, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage imports

function AdminPanel() {
  // --- EXISTING STATE (DO NOT TOUCH) ---
  const [activeTab, setActiveTab] = useState('Leaderboard player'); // toggle between player/highlights
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    battingAvg: '',
    bowlingAvg: '',
    battingStyle: '',
    team: '',
    photoUrl: '', // This remains for the 'players' collection
    recentMatches: ''
  });
  const [highlightData, setHighlightData] = useState({
    title: '',
    image: '',
    videoUrl: ''
  });

  const [aiData, setAiData] = useState({
    prompt: '',
    context: ''
  });
  const [highlights, setHighlights] = useState([]); // This state seems unused, but keeping it as is.
  // --- END EXISTING STATE ---


  // --- NEW STATE FOR TEAM MANAGEMENT WITH FILE UPLOADS ---
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    flagUrl: ''
  });
  const [flagFile, setFlagFile] = useState(null); // New state for the flag file

  const [playerInTeamFormData, setPlayerInTeamFormData] = useState({
    selectedTeamName: '',
    playerName: '',
    playerPhotoUrl: '', // This will be the URL after upload for 'teams' players
    role: '',
  });
  const [playerPhotoFile, setPlayerPhotoFile] = useState(null); // New state for the player photo file

  const [existingTeamsForDropdown, setExistingTeamsForDropdown] = useState([]);
  // --- END NEW STATE ---

  // Initialize Firebase Storage
  const storage = getStorage();

  // --- EFFECT TO FETCH TEAMS FOR DROPDOWN ---
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsCollectionRef = collection(db, 'teams');
        const teamSnapshot = await getDocs(teamsCollectionRef);
        const teams = teamSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || doc.id
        }));
        setExistingTeamsForDropdown(teams);
      } catch (err) {
        console.error("Error fetching team names for dropdown:", err);
      }
    };
    if (activeTab === 'team' || activeTab === 'addPlayerToTeam') {
      fetchTeams();
    }
  }, [activeTab]);
  // --- END EFFECT ---


  // --- FILE UPLOAD UTILITY FUNCTION ---
  const uploadFile = async (file, path) => {
    if (!file) return null;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };
  // --- END FILE UPLOAD UTILITY ---


  // --- EXISTING HANDLERS (DO NOT TOUCH) ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHighlightChange = (e) => {
    const { name, value } = e.target;
    setHighlightData(prev => ({ ...prev, [name]: value }));
  };

  const handleAiChange = (e) => {
    const { name, value } = e.target;
    setAiData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const playerData = {
        ...formData,
        battingAvg: parseFloat(formData.battingAvg),
        bowlingAvg: formData.bowlingAvg ? parseFloat(formData.bowlingAvg) : null,
        recentMatches: formData.recentMatches.split(',').map(Number)
      };
      const playerId = playerData.name.toLowerCase().replace(/\s+/g, "_");

      await setDoc(doc(db, "players", playerId), playerData);
      alert("Player added successfully!");
      setFormData({
        name: '',
        role: '',
        battingAvg: '',
        bowlingAvg: '',
        battingStyle: '',
        team: '',
        photoUrl: '',
        recentMatches: ''
      });
    } catch (err) {
      console.error("Error adding player:", err);
      alert("Failed to add player");
    }
  };

  const handleHighlightSubmit = async (e) => {
    e.preventDefault();
    try {
      const highlightsData = { ...highlightData };
      const highlightId = highlightsData.title.toLowerCase().replace(/\s+/g, "_");
      await setDoc(doc(db, "highlights", highlightId), highlightsData);
      alert("Highlights added successfully!");
      setHighlightData({
        title: '',
        image: '',
        videoUrl: ''
      });
    } catch (err) {
      console.error("Error adding highlights:", err);
      alert("Failed to add highlights");
    }
  };

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    try {
      const aiId = aiData.prompt.toLowerCase().replace(/\s+/g, "_");
      await setDoc(doc(db, "ai_assistance", aiId), aiData);
      alert("AI data saved successfully!");
      setAiData({
        prompt: '',
        context: ''
      });
    } catch (err) {
      console.error("Error saving AI data:", err);
      alert("Failed to save AI data");
    }
  };
  // --- END EXISTING HANDLERS ---


  // --- NEW HANDLERS FOR TEAM MANAGEMENT WITH FILE UPLOADS ---
  const handleTeamChange = (e) => {
    const { name, value } = e.target;
    setTeamFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFlagFileChange = (e) => {
    if (e.target.files[0]) {
      setFlagFile(e.target.files[0]);
    } else {
      setFlagFile(null);
    }
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    const teamName = teamFormData.name.trim();
    if (!teamName) {
      alert("Team name cannot be empty.");
      return;
    }

    let uploadedFlagUrl = teamFormData.flagUrl; // Start with manually entered URL if any
    try {
      if (flagFile) {
        // Upload flag image to Firebase Storage
        const filePath = `team_flags/${teamName.toLowerCase().replace(/\s+/g, '_')}_${flagFile.name}`;
        uploadedFlagUrl = await uploadFile(flagFile, filePath);
        if (!uploadedFlagUrl) {
          throw new Error("Failed to upload flag image.");
        }
      }

      const teamRef = doc(db, 'teams', teamName);
      await setDoc(teamRef, {
        name: teamName,
        flagUrl: uploadedFlagUrl, // Save the uploaded URL or manual URL
        players: []
      }, { merge: true });
      alert(`Team "${teamName}" added/updated successfully!`);
      setTeamFormData({ name: '', flagUrl: '' });
      setFlagFile(null); // Clear the file input
      // Refresh the dropdown list
      const teamsCollectionRef = collection(db, 'teams');
      const teamSnapshot = await getDocs(teamsCollectionRef);
      const updatedTeams = teamSnapshot.docs.map(doc => ({
        id: doc.id, name: doc.data().name || doc.id
      }));
      setExistingTeamsForDropdown(updatedTeams);
    } catch (err) {
      console.error('Error adding team:', err);
      alert('Failed to add team');
    }
  };

  const handlePlayerInTeamChange = (e) => {
    const { name, value } = e.target;
    setPlayerInTeamFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlayerPhotoFileChange = (e) => {
    if (e.target.files[0]) {
      setPlayerPhotoFile(e.target.files[0]);
    } else {
      setPlayerPhotoFile(null);
    }
  };

  const handleAddPlayerToTeamSubmit = async (e) => {
    e.preventDefault();
    const { selectedTeamName, playerName, role } = playerInTeamFormData; // Removed playerPhotoUrl here as it comes from upload

    if (!selectedTeamName) {
      alert("Please select a team.");
      return;
    }
    if (!playerName) {
      alert("Player name is required.");
      return;
    }
    if (!playerPhotoFile) { // Check if a file is actually selected for upload
        alert("Player photo is required.");
        return;
    }

    let uploadedPlayerPhotoUrl = '';
    try {
      // Upload player photo to Firebase Storage
      const filePath = `player_photos/${selectedTeamName.toLowerCase().replace(/\s+/g, '_')}/${playerName.toLowerCase().replace(/\s+/g, '_')}_${playerPhotoFile.name}`;
      uploadedPlayerPhotoUrl = await uploadFile(playerPhotoFile, filePath);
      if (!uploadedPlayerPhotoUrl) {
        throw new Error("Failed to upload player photo.");
      }

      const playerToAdd = {
        name: playerName,
        photoUrl: uploadedPlayerPhotoUrl, // Save the uploaded URL
        role: role,
      };

      const teamDocRef = doc(db, 'teams', selectedTeamName);
      await updateDoc(teamDocRef, {
        players: arrayUnion(playerToAdd)
      });

      alert(`Player "${playerName}" added to "${selectedTeamName}" successfully!`);
      setPlayerInTeamFormData(prev => ({
        ...{
          selectedTeamName: prev.selectedTeamName,
          playerName: '',
          playerPhotoUrl: '', // Reset for next entry, though value isn't directly used anymore
          role: '',
        }
      }));
      setPlayerPhotoFile(null); // Clear the file input
    } catch (err) {
      console.error("Error adding player to team:", err);
      alert("Failed to add player to team");
    }
  };
  // --- END NEW HANDLERS ---


  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h2 className="text-3xl font-bold mb-6">Admin Panel</h2>

      {/* Toggle Tabs */}
      <div className="flex gap-4 mb-8">
        {['Leaderboard player', 'team', 'addPlayerToTeam', 'highlight', 'ai'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded capitalize ${
              activeTab === tab ? 'bg-blue-600' : 'bg-gray-700'
            }`}
          >
            {tab === 'ai' ? 'AI Assistance' : tab}
          </button>
        ))}
      </div>

      {/* --- EXISTING 'ADD PLAYER' FORM (DO NOT TOUCH) --- */}
      {activeTab === 'Leaderboard player' && (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <h3 className="text-xl font-bold mb-4">Add Individual Player (to 'players' collection)</h3>
          {[
            { label: "Name", key: "name" },
            { label: "Role (Batsman/Bowler/All-Rounder)", key: "role" },
            { label: "Batting Average", key: "battingAvg", type: "number" },
            { label: "Bowling Average", key: "bowlingAvg", type: "number" },
            { label: "Batting Style (Right/Left-handed)", key: "battingStyle" },
            { label: "Team", key: "team" },
            { label: "Photo URL", key: "photoUrl" },
            { label: "Recent Matches (comma-separated)", key: "recentMatches" },
          ].map(({ label, key, type = "text" }) => (
            <div key={key}>
              <label className="block mb-1">{label}</label>
              <input
                type={type}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                required={key !== "bowlingAvg" && key !== "photoUrl"}
              />
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            Add Player
          </button>
        </form>
      )}
      {/* --- END EXISTING 'ADD PLAYER' FORM --- */}


      {/* --- NEW 'ADD/UPDATE TEAM' TAB WITH FILE UPLOAD --- */}
      {activeTab === 'team' && (
        <form onSubmit={handleTeamSubmit} className="space-y-4 max-w-xl">
          <h3 className="text-xl font-bold mb-4">Add/Update Team (in 'teams' collection)</h3>
          <div>
            <label className="block mb-1">Team Name (e.g., "Pakistan", "England")</label>
            <input
              type="text"
              name="name"
              value={teamFormData.name}
              onChange={handleTeamChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Team Flag Image (Upload)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFlagFileChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            />
            {flagFile && <p className="text-sm mt-1 text-gray-400">Selected: {flagFile.name}</p>}
          </div>
          {/* Optional: Add a field for manually pasting URL if needed, but upload is primary */}
          <div>
            <label className="block mb-1">Or Paste Team Flag URL (Optional fallback)</label>
            <input
              type="text"
              name="flagUrl"
              value={teamFormData.flagUrl}
              onChange={handleTeamChange}
              placeholder="https://example.com/flag.png"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            Add/Update Team
          </button>
        </form>
      )}
      {/* --- END NEW 'ADD/UPDATE TEAM' TAB --- */}


      {/* --- NEW 'ADD PLAYER TO TEAM' TAB WITH FILE UPLOAD --- */}
      {activeTab === 'addPlayerToTeam' && (
        <form onSubmit={handleAddPlayerToTeamSubmit} className="space-y-4 max-w-xl">
          <h3 className="text-xl font-bold mb-4">Add Player to Existing Team (in 'teams' collection)</h3>
          <div>
            <label className="block mb-1">Select Team</label>
            <select
              name="selectedTeamName"
              value={playerInTeamFormData.selectedTeamName}
              onChange={handlePlayerInTeamChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              required
            >
              <option value="">-- Select a Team --</option>
              {existingTeamsForDropdown.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Player Name</label>
            <input
              type="text"
              name="playerName"
              value={playerInTeamFormData.playerName}
              onChange={handlePlayerInTeamChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Player Photo (Upload)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePlayerPhotoFileChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              required // Making photo upload required
            />
            {playerPhotoFile && <p className="text-sm mt-1 text-gray-400">Selected: {playerPhotoFile.name}</p>}
          </div>
          <div>
            <label className="block mb-1">Role (Batsman/Bowler/All-Rounder)</label>
            <input
              type="text"
              name="role"
              value={playerInTeamFormData.role}
              onChange={handlePlayerInTeamChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white"
          >
            Add Player to Team
          </button>
        </form>
      )}
      {/* --- END NEW 'ADD PLAYER TO TEAM' TAB --- */}


      {/* --- EXISTING HIGHLIGHTS TAB (DO NOT TOUCH) --- */}
      {activeTab === 'highlight' && (
        <div className="space-y-6 max-w-xl">
          <form onSubmit={handleHighlightSubmit} className="space-y-4">
            {[
              { label: "Highlight Title", key: "title" },
              { label: "Thumbnail Image URL", key: "image" },
              { label: "Video URL (YouTube embed link)", key: "videoUrl" },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block mb-1">{label}</label>
                <input
                  type="text"
                  name={key}
                  value={highlightData[key]}
                  onChange={handleHighlightChange}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
            >
              Add Highlight
            </button>
          </form>
        </div>
      )}
      {/* --- END EXISTING HIGHLIGHTS TAB --- */}

      {/* --- EXISTING AI ASSISTANCE TAB (DO NOT TOUCH) --- */}
      {activeTab === 'ai' && (
        <form onSubmit={handleAiSubmit} className="space-y-4 max-w-xl">
          {[
            { label: "Prompt (question/input)", key: "prompt" },
            { label: "Context or Description", key: "context" }
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block mb-1">{label}</label>
              <textarea
                name={key}
                value={aiData[key]}
                onChange={handleAiChange}
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                rows={4}
                required
              />
            </div>
          ))}
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white">
            Save AI Prompt
          </button>
        </form>
      )}
      {/* --- END EXISTING AI ASSISTANCE TAB --- */}
    </div>
  );
}

export default AdminPanel;