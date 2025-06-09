import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../../assets/pawan/PlayerProfile/picture-312.png';
import backButton from '../../../assets/kumar/right-chevron.png';
import { db, auth } from "../../../firebase";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const Insights = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("batting");
  const [activeSubOption, setActiveSubOption] = useState("high-score");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [insightsData, setInsightsData] = useState({});
  const [formData, setFormData] = useState({ value: "" });
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: "batting", label: "Batting" },
    { id: "bowling", label: "Bowling" },
    { id: "fielding", label: "Fielding" },
    { id: "captain", label: "Captain" },
    { id: "overall", label: "Overall Stats" },
  ];

  const subOptions = {
    batting: [
      { id: "high-score", label: "High Score" },
      { id: "win", label: "Win" },
      { id: "lose", label: "Lose" },
      { id: "matches", label: "Matches" },
      { id: "innings", label: "Innings" },
      { id: "strike-rate", label: "Strike Rate" },
      { id: "30s", label: "30's" },
      { id: "50s", label: "50's" },
      { id: "100s", label: "100's" },
      { id: "4s", label: "4's" },
      { id: "6s", label: "6's" },
      { id: "ducks", label: "Ducks" },
    ],
    bowling: [
      { id: "best-bowl", label: "Best Bowl" },
      { id: "match", label: "Match" },
      { id: "innings", label: "Innings" },
      { id: "overs", label: "Overs" },
      { id: "maiden", label: "Maiden" },
      { id: "runs", label: "Runs" },
      { id: "wickets", label: "Wickets" },
      { id: "3-wickets", label: "3 Wickets" },
      { id: "5-wickets", label: "5 Wickets" },
      { id: "economy", label: "Economy" },
      { id: "average", label: "Average" },
      { id: "wide", label: "Wide" },
      { id: "no-balls", label: "No Balls" },
      { id: "dots", label: "Dots" },
      { id: "4s", label: "4's" },
      { id: "6s", label: "6's" },
    ],
    fielding: [
      { id: "matches", label: "Matches" },
      { id: "catch", label: "Catch" },
      { id: "stumping", label: "Stumping" },
      { id: "run-out", label: "Run Out" },
      { id: "catch-and-bowl", label: "Catch and Bowl" },
    ],
    captain: [
      { id: "matches-captained", label: "Matches Captained" },
    ],
    overall: [],
  };

  // Fetch insights data from Firestore
  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = onSnapshot(collection(db, 'PlayerInsights'), (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(entry => entry.userId === auth.currentUser.uid)
        .reduce((acc, entry) => {
          const { tab, subOption } = entry;
          if (!acc[tab]) acc[tab] = {};
          if (!acc[tab][subOption]) acc[tab][subOption] = [];
          acc[tab][subOption].push(entry);
          return acc;
        }, {});
      setInsightsData(data);
    }, (error) => {
      console.error("Error fetching insights:", error);
    });

    return () => unsubscribe();
  }, []);

  // Calculate overall stats
  const calculateOverallStats = () => {
    const battingMatches = insightsData.batting?.matches?.[0]?.value || 0;
    const runs = (insightsData.batting?.["100s"]?.[0]?.value || 0) * 100 +
                 (insightsData.batting?.["50s"]?.[0]?.value || 0) * 50 +
                 (insightsData.batting?.["30s"]?.[0]?.value || 0) * 30;
    const wickets = insightsData.bowling?.wickets?.[0]?.value || 0;
    const catches = insightsData.fielding?.catch?.[0]?.value || 0;
    const matchesCaptained = insightsData.captain?.["matches-captained"]?.[0]?.value || 0;

    return {
      title: "Overall Stats",
      content: (
        <div className="space-y-4">
          <p><strong>Matches Played:</strong> {battingMatches}</p>
          <p><strong>Runs Scored:</strong> {runs}</p>
          <p><strong>Wickets Taken:</strong> {wickets}</p>
          <p><strong>Catches:</strong> {catches}</p>
          <p><strong>Captaincy:</strong> {matchesCaptained} matches</p>
        </div>
      ),
    };
  };

  // Handle saving or updating data
  const handleSaveData = async () => {
    if (!formData.value.trim()) {
      alert("Please enter a value!");
      return;
    }

    setIsLoading(true);
    try {
      const entryData = {
        tab: activeTab,
        subOption: activeSubOption,
        value: isNaN(formData.value) ? formData.value : parseFloat(formData.value),
        userId: auth.currentUser.uid,
        timestamp: new Date().toISOString(),
      };

      if (editingEntryId) {
        await updateDoc(doc(db, 'PlayerInsights', editingEntryId), entryData);
      } else {
        await addDoc(collection(db, 'PlayerInsights'), entryData);
      }

      setFormData({ value: '' });
      setEditingEntryId(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving data:", err);
      alert("Failed to save data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting data
  const handleDeleteData = async (entryId) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      await deleteDoc(doc(db, 'PlayerInsights', entryId));
    } catch (err) {
      console.error("Error deleting entry:", err);
      alert("Failed to delete data. Please try again.");
    }
  };

  // Handle editing data
  const handleEditData = (entry) => {
    setFormData({ value: entry.value.toString() });
    setEditingEntryId(entry.id);
    setIsModalOpen(true);
  };

  return (
    <div
      className="min-h-full bg-fixed text-white p-5"
      style={{
        backgroundImage: 'linear-gradient(140deg,#080006 15%,#FF0077)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Top Navigation Bar */}
      <div className="flex flex-col mt-0">
        <div className="flex items-start">
          <img
            src={logo}
            alt="Cricklytics Logo"
            className="h-7 w-7 md:h-10 object-cover block select-none"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/photo3.jpg";
            }}
          />
          <span className="p-2 text-2xl font-bold text-white whitespace-nowrap shadow-[1px_1px_10px_rgba(255,255,255,0.5)]">
            Cricklytics
          </span>
        </div>
      </div>
      <div className="md:absolute flex items-center gap-4">
        <img
          src={backButton}
          alt="Back"
          className="h-8 w-8 cursor-pointer -scale-x-100"
          onClick={() => window.history.back()}
        />
      </div>

      {/* Horizontal Navigation Bar */}
      <div className="max-w-5xl mx-auto">
        <div className="flex overflow-x-auto justify-center whitespace-nowrap gap-4 border-b border-white/20 mb-10 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 text-lg font-['Alegreya'] transition-all duration-300 ${
                activeTab === tab.id
                  ? "text-cyan-300 border-b-2 border-cyan-300"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => {
                setActiveTab(tab.id);
                setActiveSubOption(tab.id === "overall" ? "default" : subOptions[tab.id][0].id);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-8 rounded-xl border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.9)] hover:-translate-y-2 transition duration-300">
          {activeTab !== "overall" && subOptions[activeTab].length > 0 && (
            <div>
              <h2 className="text-4xl font-bold text-center mb-6 font-['Alegreya']">
                {tabs.find((tab) => tab.id === activeTab).label}
              </h2>
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => {
                    setFormData({ value: "" });
                    setEditingEntryId(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Add Data
                </button>
              </div>
              <div className="flex overflow-x-auto space-x-4 p-4 scrollbar-thin scrollbar-thumb-cyan-300 scrollbar-track-transparent">
                {subOptions[activeTab].map((option) => (
                  <button
                    key={option.id}
                    className={`flex-shrink-0 px-6 py-3 rounded-lg text-base font-['Alegreya'] transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.8)] ${
                      activeSubOption === option.id
                        ? "text-white bg-blue-500"
                        : "text-white hover:bg-blue-600 hover:text-cyan-300"
                    }`}
                    onClick={() => setActiveSubOption(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4 font-['Alegreya']">
              {subOptions[activeTab].find((opt) => opt.id === activeSubOption)?.label || "Overall Stats"}
            </h3>
            {activeTab === "overall" ? (
              calculateOverallStats().content
            ) : (
              <div>
                {insightsData[activeTab]?.[activeSubOption]?.length > 0 ? (
                  insightsData[activeTab][activeSubOption].map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center mb-2 p-2 border-b border-gray-600">
                      <p>{entry.value}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditData(entry)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteData(entry.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-300">No data available. Add some data!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Adding/Editing Data */}
      {isModalOpen && (
        <div className="border-2 border-white fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
          <div
            className="w-96 rounded-lg p-6 shadow-lg max-h-[80vh] overflow-y-auto"
            style={{
              background: 'linear-gradient(140deg, rgba(8,0,6,0.85) 15%, rgba(255,0,119,0.85))',
              boxShadow: '0 4px 12px rgba(0,0,0,0.75)',
            }}
          >
            <h2 className="text-xl font-bold mb-4 text-white text-center">
              {editingEntryId ? "Edit Data" : "Add Data"}
            </h2>
            <label className="block mb-1 text-white font-semibold" htmlFor="value">
              {subOptions[activeTab].find((opt) => opt.id === activeSubOption)?.label}
            </label>
            <input
              id="value"
              type={["matches", "innings", "strike-rate", "30s", "50s", "100s", "4s", "6s", "ducks", "overs", "maiden", "runs", "wickets", "3-wickets", "5-wickets", "economy", "average", "wide", "no-balls", "dots", "catch", "stumping", "run-out", "catch-and-bowl", "matches-captained"].includes(activeSubOption) ? "number" : "text"}
              placeholder={`Enter ${subOptions[activeTab].find((opt) => opt.id === activeSubOption)?.label}`}
              value={formData.value}
              onChange={(e) => setFormData({ value: e.target.value })}
              className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              disabled={isLoading}
            />
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingEntryId(null);
                  setFormData({ value: "" });
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveData}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded transition"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;