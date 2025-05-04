import React, { useState } from 'react';
import { db } from '../firebase'; // adjust if needed
import { doc, setDoc } from 'firebase/firestore';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('player'); // toggle between player/highlights
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
  const [highlightData, setHighlightData] = useState({
    title: '',
    image: '',
    videoUrl: ''
  });

  const [aiData, setAiData] = useState({
    prompt: '',
    context: ''
  });


  const [highlights, setHighlights] = useState([]);

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

  const handleHighlightSubmit = async (e) => {
    e.preventDefault();
    try {
      const highlightsData = {...highlightData};
      const highlightId = highlightData.title.toLowerCase().replace(/\s+/g, "_");
      await setDoc(doc(db, "highlights", highlightId), highlightsData);
      alert("Highlights, added successfully!");
      setHighlightData({
        title: '',
        image: '',
        videoUrl: ''
      });
    } catch (err){
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
  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h2 className="text-3xl font-bold mb-6">Admin Panel - Add Player</h2>
            {/* Toggle Tabs */}
      <div className="flex gap-4 mb-8">
        {['player', 'highlight', 'ai'].map(tab => (
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

      {activeTab === 'player' && (
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
      )}


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

           {/* AI ASSISTANCE TAB */}
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
    </div>
  );
}

export default AdminPanel;
