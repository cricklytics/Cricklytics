import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/pawan/PlayerProfile/picture-312.png';
import backButton from '../assets/kumar/right-chevron.png';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';

const Match = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("my-matches");
  const [activeSubOption, setActiveSubOption] = useState("info");
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // Tracks which modal to show
  const [formData, setFormData] = useState({
    teams: "",
    date: "",
    status: "",
    score: "",
    venue: "",
    format: "",
    umpires: "",
    batting: "",
    bowling: "",
    squadIndia: "",
    squadAustralia: "",
    analysis: "",
    mvp: "",
    tabCategory: "my-matches",
    subOption: "info",
  });

  const tabs = [
    { id: "my-matches", label: "My Matches (Live + Past)" },
    { id: "following", label: "Following (Live + Past)" },
    { id: "all", label: "All" },
  ];

  const subOptions = [
    { id: "info", label: "Info" },
    { id: "summary", label: "Summary" },
    { id: "scorecard", label: "Scorecard" },
    { id: "squad", label: "Squad" },
    { id: "analysis", label: "Analysis" },
    { id: "mvp", label: "MVP" },
  ];

  // Fetch data from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Matches'), (snapshot) => {
      const matchesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMatches(matchesData);
    });

    return () => unsubscribe();
  }, []);

  // Handle adding new match data
  const handleAddMatch = async () => {
    let requiredFields = [];

    if (modalType === "following" || modalType === "all") {
      requiredFields = ["teams", "date", "status", "score", "venue"];
    } else if (modalType === "sub-option") {
      switch (activeSubOption) {
        case "info":
          requiredFields = ["teams", "date", "status", "score", "venue", "format", "umpires"];
          break;
        case "summary":
          requiredFields = ["score"];
          break;
        case "scorecard":
          requiredFields = ["batting", "bowling"];
          break;
        case "squad":
          requiredFields = ["squadIndia", "squadAustralia"];
          break;
        case "analysis":
          requiredFields = ["analysis"];
          break;
        case "mvp":
          requiredFields = ["mvp"];
          break;
        default:
          requiredFields = [];
      }
    }

    const isValid = requiredFields.every(field => formData[field].trim());

    if (isValid) {
      await addDoc(collection(db, 'Matches'), {
        ...formData,
        tabCategory: activeTab,
        subCategory: modalType === "sub-option" ? activeSubOption : null,
      });
      setFormData({
        teams: "",
        date: "",
        status: "",
        score: "",
        venue: "",
        format: "",
        umpires: "",
        batting: "",
        bowling: "",
        squadIndia: "",
        squadAustralia: "",
        analysis: "",
        mvp: "",
        tabCategory: "my-matches",
        subOption: "info",
      });
      setIsModalOpen(false);
    } else {
      alert('Please fill all required fields!');
    }
  };

  // Handle deleting match data
  const handleDeleteMatch = async (id) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      await deleteDoc(doc(db, 'Matches', id));
    }
  };

  // Filter matches based on active tab and sub-option
  const filteredMatches = matches.filter(match => {
    if (activeTab === "my-matches") {
      return match.tabCategory === "my-matches" && match.subCategory === activeSubOption;
    } else if (activeTab === "following") {
      return match.tabCategory === "following";
    } else {
      // For "all" tab, only show matches with subCategory "info"
      return match.subCategory === "info";
    }
  });

  // Open modal with appropriate type
  const openModal = (type) => {
    setModalType(type);
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
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-center gap-4 border-b border-white/20 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 text-lg font-['Alegreya'] transition-all duration-300 ${
                activeTab === tab.id
                  ? "text-blue-500 border-b-2 border-cyan-300"
                  : "text-white hover:text-white"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-8 rounded-xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] bg-white/5 backdrop-blur">
          {activeTab === "my-matches" && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-6 font-['Alegreya']">My Matches</h2>
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => openModal("sub-option")}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Add Match Data
                </button>
              </div>
              <div className="flex overflow-x-auto md:justify-center item-center space-x-4 p-4 scrollbar-thin scrollbar-thumb-cyan-300 scrollbar-track-gray-800">
                {subOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`flex-shrink-0 px-6 py-3 rounded-lg text-base font-['Alegreya'] transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.8)] ${
                      activeSubOption === option.id
                        ? "bg-gradient-to-r from-[#48C6EF] to-[#6F86D6] text-white scale-105"
                        : "bg-transparent text-white hover:bg-white/10 hover:scale-105"
                    }`}
                    onClick={() => setActiveSubOption(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="">
                <h3 className="text-xl font-bold mb-4 font-['Alegreya']">
                  {activeSubOption.charAt(0).toUpperCase() + activeSubOption.slice(1)}
                </h3>
                {filteredMatches.length === 0 ? (
                  <p className="text-center text-gray-300">No data available. Add some data!</p>
                ) : (
                  filteredMatches.map((match) => (
                    <div key={match.id} className="mb-4 p-4 bg-[rgba(0,0,0,0.3)] rounded-lg relative">
                      {activeSubOption === "info" && (
                        <div className="space-y-2">
                          <p><strong>Teams:</strong> {match.teams}</p>
                          <p><strong>Date:</strong> {match.date}</p>
                          <p><strong>Status:</strong> {match.status}</p>
                          <p><strong>Score:</strong> {match.score}</p>
                          <p><strong>Venue:</strong> {match.venue}</p>
                          <p><strong>Format:</strong> {match.format}</p>
                          <p><strong>Umpires:</strong> {match.umpires}</p>
                        </div>
                      )}
                      {activeSubOption === "summary" && (
                        <div className="space-y-2">
                          <p><strong>Summary:</strong> {match.score}</p>
                        </div>
                      )}
                      {activeSubOption === "scorecard" && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-bold">Batting</h4>
                            <p>{match.batting}</p>
                          </div>
                          <div>
                            <h4 className="font-bold">Bowling</h4>
                            <p>{match.bowling}</p>
                          </div>
                        </div>
                      )}
                      {activeSubOption === "squad" && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-bold">India</h4>
                            <p>{match.squadIndia}</p>
                          </div>
                          <div>
                            <h4 className="font-bold">Australia</h4>
                            <p>{match.squadAustralia}</p>
                          </div>
                        </div>
                      )}
                      {activeSubOption === "analysis" && (
                        <div className="space-y-2">
                          <p>{match.analysis}</p>
                        </div>
                      )}
                      {activeSubOption === "mvp" && (
                        <div className="space-y-2">
                          <p><strong>MVP:</strong> {match.mvp}</p>
                        </div>
                      )}
                      <button
                        onClick={() => handleDeleteMatch(match.id)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
                        aria-label="Delete Match"
                        title="Delete Match"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {activeTab === "following" && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-6 font-['Alegreya']">Following (Live + Past)</h2>
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => openModal("following")}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Add Match
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.length === 0 ? (
                  <p className="text-center text-gray-300 col-span-3">No matches to show here.</p>
                ) : (
                  filteredMatches.map((match) => (
                    <div
                      key={match.id}
                      className="bg-[rgba(0,0,0,0.3)] p-6 rounded-lg shadow-md hover:bg-[rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer relative"
                      onClick={() => navigate(`/match/${match.id}`)}
                    >
                      <h3 className="text-lg font-bold font-['Alegreya']">{match.teams}</h3>
                      <p className="text-gray-300">{match.date}</p>
                      <p className="text-cyan-300">{match.status}</p>
                      <p className="mt-2">{match.score}</p>
                      <p className="text-gray-400">{match.venue}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMatch(match.id);
                        }}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
                        aria-label="Delete Match"
                        title="Delete Match"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {activeTab === "all" && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-6 font-['Alegreya']">All Matches</h2>
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => openModal("all")}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Add Match
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.length === 0 ? (
                  <p className="text-center text-gray-300 col-span-3">No matches to show here.</p>
                ) : (
                  filteredMatches.map((match) => (
                    <div
                      key={match.id}
                      className="bg-[rgba(0,0,0,0.3)] p-6 rounded-lg shadow-md hover:bg-[rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer relative"
                      onClick={() => navigate(`/match/${match.id}`)}
                    >
                      <h3 className="text-lg font-bold font-['Alegreya']">{match.teams}</h3>
                      <p className="text-gray-300">{match.date}</p>
                      <p className="text-cyan-300">{match.status}</p>
                      <p className="mt-2">{match.score}</p>
                      <p className="text-gray-400">{match.venue}</p>
                      <p><strong>Format:</strong> {match.format}</p>
                      <p><strong>Umpires:</strong> {match.umpires}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMatch(match.id);
                        }}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
                        aria-label="Delete Match"
                        title="Delete Match"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Adding Match Data */}
      {isModalOpen && (
        <div className="border-2 border-white fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
          <div
            className="w-96 rounded-lg p-6 shadow-lg"
            style={{
              background: 'linear-gradient(140deg, rgba(8,0,6,0.85) 15%, rgba(255,0,119,0.85))',
              boxShadow: '0 4px 12px rgba(0,0,0,0.75)',
            }}
          >
            <h2 className="text-xl font-bold mb-4 text-white text-center">
              {modalType === "sub-option" ? `Add ${activeSubOption.charAt(0).toUpperCase() + activeSubOption.slice(1)} Data` : `Add Match (${activeTab})`}
            </h2>

            {/* Common Fields for Following and All Tabs */}
            {(modalType === "following" || modalType === "all") && (
              <>
                <label className="block mb-1 text-white font-semibold" htmlFor="teams">Teams</label>
                <input
                  id="teams"
                  type="text"
                  placeholder="Enter teams (e.g., India vs Australia)"
                  value={formData.teams}
                  onChange={(e) => setFormData({ ...formData, teams: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />

                <label className="block mb-1 text-white font-semibold" htmlFor="date">Date</label>
                <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />

                <label className="block mb-1 text-white font-semibold" htmlFor="status">Status</label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option className="text-black" value="">Select Status</option>
                  <option className="text-black" value="Live">Live</option>
                  <option className="text-black" value="Past">Past</option>
                </select>

                <label className="block mb-1 text-white font-semibold" htmlFor="score">Score</label>
                <input
                  id="score"
                  type="text"
                  placeholder="Enter score (e.g., IND 120/2)"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />

                <label className="block mb-1 text-white font-semibold" htmlFor="venue">Venue</label>
                <input
                  id="venue"
                  type="text"
                  placeholder="Enter venue"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </>
            )}

            {/* Fields for My Matches Sub-Options */}
            {modalType === "sub-option" && activeSubOption === "info" && (
              <>
                <label className="block mb-1 text-white font-semibold" htmlFor="teams">Teams</label>
                <input
                  id="teams"
                  type="text"
                  placeholder="Enter teams (e.g., India vs Australia)"
                  value={formData.teams}
                  onChange={(e) => setFormData({ ...formData, teams: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />

                <label className="block mb-1 text-white font-semibold" htmlFor="date">Date</label>
                <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />

                <label className="block mb-1 text-white font-semibold" htmlFor="status">Status</label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option className="text-black" value="">Select Status</option>
                  <option className="text-black" value="Live">Live</option>
                  <option className="text-black" value="Past">Past</option>
                </select>

                <label className="block mb-1 text-white font-semibold" htmlFor="score">Score</label>
                <input
                  id="score"
                  type="text"
                  placeholder="Enter score (e.g., IND 120/2)"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />

                <label className="block mb-1 text-white font-semibold" htmlFor="venue">Venue</label>
                <input
                  id="venue"
                  type="text"
                  placeholder="Enter venue"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />

                <label className="block mb-1 text-white font-semibold" htmlFor="format">Format</label>
                <input
                  id="format"
                  type="text"
                  placeholder="Enter format (e.g., T20)"
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />

                <label className="block mb-1 text-white font-semibold" htmlFor="umpires">Umpires</label>
                <input
                  id="umpires"
                  type="text"
                  placeholder="Enter umpires"
                  value={formData.umpires}
                  onChange={(e) => setFormData({ ...formData, umpires: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </>
            )}
            {modalType === "sub-option" && activeSubOption === "summary" && (
              <>
                <label className="block mb-1 text-white font-semibold" htmlFor="score">Summary</label>
                <textarea
                  id="score"
                  placeholder="Enter match summary"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows="4"
                />
              </>
            )}
            {modalType === "sub-option" && activeSubOption === "scorecard" && (
              <>
                <label className="block mb-1 text-white font-semibold" htmlFor="batting">Batting</label>
                <textarea
                  id="batting"
                  placeholder="Enter batting details"
                  value={formData.batting}
                  onChange={(e) => setFormData({ ...formData, batting: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows="4"
                />

                <label className="block mb-1 text-white font-semibold" htmlFor="bowling">Bowling</label>
                <textarea
                  id="bowling"
                  placeholder="Enter bowling details"
                  value={formData.bowling}
                  onChange={(e) => setFormData({ ...formData, bowling: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows="4"
                />
              </>
            )}
            {modalType === "sub-option" && activeSubOption === "squad" && (
              <>
                <label className="block mb-1 text-white font-semibold" htmlFor="squadIndia">India Squad</label>
                <textarea
                  id="squadIndia"
                  placeholder="Enter India squad"
                  value={formData.squadIndia}
                  onChange={(e) => setFormData({ ...formData, squadIndia: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows="4"
                />

                <label className="block mb-1 text-white font-semibold" htmlFor="squadAustralia">Australia Squad</label>
                <textarea
                  id="squadAustralia"
                  placeholder="Enter Australia squad"
                  value={formData.squadAustralia}
                  onChange={(e) => setFormData({ ...formData, squadAustralia: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows="4"
                />
              </>
            )}
            {modalType === "sub-option" && activeSubOption === "analysis" && (
              <>
                <label className="block mb-1 text-white font-semibold" htmlFor="analysis">Analysis</label>
                <textarea
                  id="analysis"
                  placeholder="Enter match analysis"
                  value={formData.analysis}
                  onChange={(e) => setFormData({ ...formData, analysis: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows="4"
                />
              </>
            )}
            {modalType === "sub-option" && activeSubOption === "mvp" && (
              <>
                <label className="block mb-1 text-white font-semibold" htmlFor="mvp">MVP</label>
                <input
                  id="mvp"
                  type="text"
                  placeholder="Enter MVP details"
                  value={formData.mvp}
                  onChange={(e) => setFormData({ ...formData, mvp: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </>
            )}

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMatch}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Match;