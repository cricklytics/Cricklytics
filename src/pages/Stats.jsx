import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/pawan/PlayerProfile/picture-312.png";
import backButton from '../assets/kumar/right-chevron.png';
import { db, auth } from "../firebase";
import { collection, onSnapshot, addDoc, doc, onSnapshot as docSnapshot, updateDoc, deleteDoc } from "firebase/firestore";

const Stats = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({
    lastMatch: "",
    average: "",
    strikeRate: "",
    matches: "",
    runs: "",
    centuries: "",
    location: "",
    specification: "",
  });
  const [editingStatId, setEditingStatId] = useState(null);

  // Fetch user profile from Firestore
  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = docSnapshot(doc(db, 'users', auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        setUserProfile({ uid: auth.currentUser.uid, ...doc.data() });
        // Pre-fill location and specification in formData if available
        setFormData(prev => ({
          ...prev,
          location: doc.data().location || "",
          specification: doc.data().specification || "",
        }));
      } else {
        setUserProfile(null);
      }
    }, (error) => {
      console.error("Error fetching user profile:", error);
    });

    return () => unsubscribe();
  }, []);

  // Fetch player stats from Firestore with centric data logic
  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = onSnapshot(collection(db, 'PlayerStats'), (snapshot) => {
      const statsData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(stat => stat.userId === auth.currentUser.uid); // Filter by current user's ID
      setStats(statsData);
    }, (error) => {
      console.error("Error fetching player stats:", error);
    });

    return () => unsubscribe();
  }, []);

  // Handle adding or updating stats and updating user profile
  const handleSaveStats = async () => {
    const statsFields = ["lastMatch", "average", "strikeRate", "matches", "runs", "centuries"];
    const profileFields = ["location", "specification"];
    const isStatsValid = statsFields.every(field => formData[field].trim());
    const isProfileValid = profileFields.every(field => formData[field].trim());

    if (!isStatsValid || !isProfileValid) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      // Update user profile in users collection
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        location: formData.location,
        specification: formData.specification,
      });

      // Add or update player stats
      const statsData = {
        lastMatch: formData.lastMatch,
        average: parseFloat(formData.average),
        strikeRate: parseFloat(formData.strikeRate),
        matches: parseInt(formData.matches),
        runs: parseInt(formData.runs),
        centuries: parseInt(formData.centuries),
        userId: auth.currentUser.uid,
        timestamp: new Date().toISOString(),
      };

      if (editingStatId) {
        // Update existing stat
        await updateDoc(doc(db, 'PlayerStats', editingStatId), statsData);
      } else {
        // Add new stat
        await addDoc(collection(db, 'PlayerStats'), statsData);
      }

      // Reset form data
      setFormData({
        lastMatch: "",
        average: "",
        strikeRate: "",
        matches: "",
        runs: "",
        centuries: "",
        location: formData.location, // Retain current values for next modal open
        specification: formData.specification,
      });
      setEditingStatId(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving data:", err);
      alert("Failed to save data. Please try again.");
    }
  };

  // Handle deleting a stat
  const handleDeleteStat = async (statId) => {
    if (!window.confirm("Are you sure you want to delete this stat entry?")) return;

    try {
      await deleteDoc(doc(db, 'PlayerStats', statId));
    } catch (err) {
      console.error("Error deleting stat:", err);
      alert("Failed to delete stat. Please try again.");
    }
  };

  // Handle editing a stat
  const handleEditStat = (stat) => {
    setFormData({
      lastMatch: stat.lastMatch,
      average: stat.average.toString(),
      strikeRate: stat.strikeRate.toString(),
      matches: stat.matches.toString(),
      runs: stat.runs.toString(),
      centuries: stat.centuries.toString(),
      location: formData.location,
      specification: formData.specification,
    });
    setEditingStatId(stat.id);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-full bg-fixed text-white p-5" style={{
      backgroundImage: 'linear-gradient(140deg,#080006 15%,#FF0077)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      {/* Top Navigation Bar */}
      <div className="flex flex-col mt-0">
        <div className="flex items-start">
          <img 
            src={logo}
            alt="Cricklytics Logo"
            className="h-7 w-7 md:h-10 object-contain block select-none"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/Picture3 2.png";
            }}
          />
          <span className="p-2 text-2xl font-bold text-white whitespace-nowrap text-shadow-[0_0_8px_rgba(93,224,230,0.4)]">
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
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 border-b border-white/20 mb-6 py-6">
          {/* User Image and Name */}
          <div className="flex items-center gap-3">
            <img 
              src={userProfile?.profileImageUrl || "/images/user-placeholder.png"} 
              alt="User Pic" 
              className="w-24 h-24 rounded-full object-cover aspect-square"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/user-placeholder.png";
              }}
            />
            <div className="text-2xl sm:text-4xl font-['Alegreya'] text-gray-300">
              {userProfile?.firstName || "User"}
            </div>
          </div>

          {/* User Location, Spec and Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto mt-4 sm:mt-0">
            <div className="text-base sm:text-lg font-['Alegreya'] text-gray-300 mb-1 sm:mb-0">
              {userProfile?.location || "Location not set"}
            </div>/
            <div className="text-base sm:text-lg font-['Alegreya'] text-gray-300 mb-2 sm:mb-0 pr-0 sm:pr-4">
              {userProfile?.specification || "Role not set"}
            </div>
            <button
              className="p-4 rounded-xl bg-blue-500 text-white shadow-[0_10px_30px_rgba(0,0,0,0.9)] hover:-translate-y-1 transition transform"
              onClick={() => navigate("/insights")}
            >
              Insights
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 rounded-xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] bg-white/5 backdrop-blur">
          <h2 className="text-2xl font-bold text-center mb-6 font-['Alegreya']">Player Stats Overview</h2>
          <div className="flex justify-center mb-6">
            <button
              onClick={() => {
                setEditingStatId(null);
                setFormData({
                  lastMatch: "",
                  average: "",
                  strikeRate: "",
                  matches: "",
                  runs: "",
                  centuries: "",
                  location: formData.location,
                  specification: formData.specification,
                });
                setIsModalOpen(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add Stats
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.length === 0 ? (
              <p className="text-center text-gray-300 col-span-2">No stats available. Add some data!</p>
            ) : (
              stats.map((stat) => (
                <React.Fragment key={stat.id}>
                  <div className="p-8 rounded-xl border border-white/50 shadow-inner shadow-[inset_0_20px_120px_rgba(0,0,0,1)] backdrop-blur">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-bold font-['Alegreya']">Recent Performance</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditStat(stat)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStat(stat.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 mt-2">Last Match: {stat.lastMatch}</p>
                    <p className="text-gray-300">Average: {stat.average}</p>
                    <p className="text-gray-300">Strike Rate: {stat.strikeRate}</p>
                  </div>
                  <div className="p-8 rounded-xl border border-white/50 shadow-inner shadow-[inset_0_20px_120px_rgba(0,0,0,1)] backdrop-blur">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-bold font-['Alegreya']">Career Highlights</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditStat(stat)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStat(stat.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 mt-2">Matches: {stat.matches}</p>
                    <p className="text-gray-300">Runs: {stat.runs}</p>
                    <p className="text-gray-300">Centuries: {stat.centuries}</p>
                  </div>
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal for Adding/Editing Stats and Profile Data */}
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
              {editingStatId ? "Edit Player Stats and Profile" : "Add Player Stats and Profile"}
            </h2>
            <h3 className="text-lg font-semibold text-white mb-2">Player Stats</h3>
            <label className="block mb-1 text-white font-semibold" htmlFor="lastMatch">Last Match</label>
            <input
              id="lastMatch"
              type="text"
              placeholder="e.g., 45 runs (30 balls), India vs Australia"
              value={formData.lastMatch}
              onChange={(e) => setFormData({ ...formData, lastMatch: e.target.value })}
              className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <label className="block mb-1 text-white font-semibold" htmlFor="average">Average</label>
            <input
              id="average"
              type="number"
              step="0.01"
              placeholder="e.g., 38.5"
              value={formData.average}
              onChange={(e) => setFormData({ ...formData, average: e.target.value })}
              className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <label className="block mb-1 text-white font-semibold" htmlFor="strikeRate">Strike Rate</label>
            <input
              id="strikeRate"
              type="number"
              step="0.01"
              placeholder="e.g., 135.2"
              value={formData.strikeRate}
              onChange={(e) => setFormData({ ...formData, strikeRate: e.target.value })}
              className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <label className="block mb-1 text-white font-semibold" htmlFor="matches">Matches</label>
            <input
              id="matches"
              type="number"
              placeholder="e.g., 150"
              value={formData.matches}
              onChange={(e) => setFormData({ ...formData, matches: e.target.value })}
              className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <label className="block mb-1 text-white font-semibold" htmlFor="runs">Runs</label>
            <input
              id="runs"
              type="number"
              placeholder="e.g., 4200"
              value={formData.runs}
              onChange={(e) => setFormData({ ...formData, runs: e.target.value })}
              className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <label className="block mb-1 text-white font-semibold" htmlFor="centuries">Centuries</label>
            <input
              id="centuries"
              type="number"
              placeholder="e.g., 8"
              value={formData.centuries}
              onChange={(e) => setFormData({ ...formData, centuries: e.target.value })}
              className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <h3 className="text-lg font-semibold text-white mb-2">Profile Details</h3>
            <label className="block mb-1 text-white font-semibold" htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              placeholder="e.g., Mumbai, India"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <label className="block mb-1 text-white font-semibold" htmlFor="specification">Role</label>
            <input
              id="specification"
              type="text"
              placeholder="e.g., Batsman / Captain"
              value={formData.specification}
              onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
              className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingStatId(null);
                  setFormData({
                    lastMatch: "",
                    average: "",
                    strikeRate: "",
                    matches: "",
                    runs: "",
                    centuries: "",
                    location: formData.location,
                    specification: formData.specification,
                  });
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStats}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;