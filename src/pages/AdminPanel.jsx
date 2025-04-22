import React, { useState } from 'react';
import { db } from '../firebase'; // adjust if needed
import { doc, setDoc } from 'firebase/firestore';

function AdminPanel() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    battingAvg: '',
    bowlingAvg: '',
    battingStyle: '',
    team: '',
    photoUrl: '',
    recentMatches: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      const playerId = playerData.name.toLowerCase().replace(/\s+/g, "_"); // e.g., 'Virat Kohli' → 'virat_kohli'

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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h2 className="text-3xl font-bold mb-6">Admin Panel - Add Player</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
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
              required={key !== "bowlingAvg" && key !== "photoUrl"} // optional fields
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
    </div>
  );
}

export default AdminPanel;
