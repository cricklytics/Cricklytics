import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from '../assets/pawan/PlayerProfile/picture-312.png';
import backButton from '../assets/kumar/right-chevron.png';
import { db, auth } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const Match = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("my-matches");
  const [activeSubOption, setActiveSubOption] = useState("info");
  const [matches, setMatches] = useState([]);

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

  // Fetch match data from scoringpage collection
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(collection(db, 'scoringpage'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const matchesData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(match => match.userId === auth.currentUser.uid);
      setMatches(matchesData);
    }, (error) => {
      console.error("Error fetching matches:", error);
    });

    return () => unsubscribe();
  }, []);

  // Set active tab from location state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      setActiveSubOption("info");
    }
  }, [location.state]);

  // Filter matches based on active tab and sub-option
  const filteredMatches = matches.filter(match => {
    if (activeTab === "my-matches") {
      return true; // All matches for my-matches tab
    } else if (activeTab === "following") {
      return match.tabCategory === "following";
    } else {
      return true; // All matches for all tab
    }
  });

  // Format match data based on active sub-option
  const getMatchData = (match, subOption) => {
    const {
      teamA,
      teamB,
      createdAt,
      matchResult,
      firstInnings,
      secondInnings,
      Format,
      venue,
      umpire,
      matchId,
    } = match;

    switch (subOption) {
      case "info":
        return {
          matchId,
          teams: `${teamA.name} vs ${teamB.name}`,
          date: createdAt ? createdAt.toDate().toISOString().split('T')[0] : "Unknown Date",
          status: matchResult ? "Past" : "Live",
          score: `${teamA.totalScore}/${teamA.wickets} (${teamA.overs}) vs ${teamB.totalScore}/${teamB.wickets} (${teamB.overs})`,
          venue: venue || "Unknown Venue",
          Format: Format || "T20",
          umpire: umpire || "Unknown Umpires",
        };
      case "summary":
        let summary = "";
        if (matchResult === "Tie") {
          summary = "Match Tied";
        } else if (teamA.result === "Win") {
          const runDiff = teamA.totalScore - teamB.totalScore;
          if (runDiff > 0) {
            summary = `${teamA.name} beat ${teamB.name} by ${runDiff} runs`;
          }
        } else if (teamB.result === "Win") {
          const wicketsRemaining = 10 - teamB.wickets;
          if (teamB.totalScore >= teamA.totalScore) {
            summary = `${teamB.name} beat ${teamA.name} by ${wicketsRemaining} wickets`;
          }
        } else {
          summary = "Match in progress";
        }
        return {
          matchId,
          score: summary,
        };
      case "scorecard":
        const battingDetails = [
          `${teamA.name}:`,
          ...firstInnings.playerStats
            .filter(p => p.runs > 0 || p.balls > 0)
            .map(p => `${p.name}: ${p.runs} runs (${p.balls} balls)`),
          `\n${teamB.name}:`,
          ...secondInnings.playerStats
            .filter(p => p.runs > 0 || p.balls > 0)
            .map(p => `${p.name}: ${p.runs} runs (${p.balls} balls)`),
        ].join('\n');
        const bowlingDetails = [
          `${teamB.name} Bowling:`,
          ...secondInnings.bowlerStats
            .filter(b => b.oversBowled !== "0.0")
            .map(b => `${b.name}: ${b.wickets}/${b.runsConceded} (${b.oversBowled} overs)`),
          `\n${teamA.name} Bowling:`,
          ...firstInnings.bowlerStats
            .filter(b => b.oversBowled !== "0.0")
            .map(b => `${b.name}: ${b.wickets}/${b.runsConceded} (${b.oversBowled} overs)`),
        ].join('\n');
        return {
          matchId,
          batting: battingDetails,
          bowling: bowlingDetails,
        };
      case "squad":
        const squadIndia = firstInnings.playerStats.map(p => p.name).join(', ');
        const squadAustralia = secondInnings.playerStats.map(p => p.name).join(', ');
        return {
          matchId,
          squadIndia,
          squadAustralia,
        };
      case "analysis":
        const analysis = `Match between ${teamA.name} and ${teamB.name} was played on ${createdAt ? createdAt.toDate().toLocaleDateString() : 'Unknown Date'}. ${teamA.name} scored ${teamA.totalScore}/${teamA.wickets} in ${teamA.overs} overs, while ${teamB.name} scored ${teamB.totalScore}/${teamB.wickets} in ${teamB.overs} overs.`;
        return {
          matchId,
          analysis,
        };
      case "mvp":
        return {
          matchId,
          mvp: "Not specified", // MVP not stored in scoringpage, placeholder
        };
      default:
        return { matchId };
    }
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
                  <p className="text-center text-gray-300">No data available.</p>
                ) : (
                  filteredMatches.map((match) => {
                    const matchData = getMatchData(match, activeSubOption);
                    return (
                      <div key={match.id} className="mb-4 p-4 bg-[rgba(0,0,0,0.3)] rounded-lg">
                        <p><strong>Match ID:</strong> {matchData.matchId}</p>
                        {activeSubOption === "info" && (
                          <div className="space-y-2">
                            <p><strong>Teams:</strong> {matchData.teams}</p>
                            <p><strong>Date:</strong> {matchData.date}</p>
                            <p><strong>Status:</strong> {matchData.status}</p>
                            <p><strong>Score:</strong> {matchData.score}</p>
                            <p><strong>Venue:</strong> {matchData.venue}</p>
                            <p><strong>Format:</strong> {matchData.Format}</p>
                            <p><strong>Umpires:</strong> {matchData.umpire}</p>
                          </div>
                        )}
                        {activeSubOption === "summary" && (
                          <div className="space-y-2">
                            <p><strong>Summary:</strong> {matchData.score}</p>
                          </div>
                        )}
                        {activeSubOption === "scorecard" && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-bold">Batting</h4>
                              <p className="whitespace-pre-line">{matchData.batting}</p>
                            </div>
                            <div>
                              <h4 className="font-bold">Bowling</h4>
                              <p className="whitespace-pre-line">{matchData.bowling}</p>
                            </div>
                          </div>
                        )}
                        {activeSubOption === "squad" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-bold">India</h4>
                              <p>{matchData.squadIndia}</p>
                            </div>
                            <div>
                              <h4 className="font-bold">Australia</h4>
                              <p>{matchData.squadAustralia}</p>
                            </div>
                          </div>
                        )}
                        {activeSubOption === "analysis" && (
                          <div className="space-y-2">
                            <p>{matchData.analysis}</p>
                          </div>
                        )}
                        {activeSubOption === "mvp" && (
                          <div className="space-y-2">
                            <p><strong>MVP:</strong> {matchData.mvp}</p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
          {activeTab === "following" && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-6 font-['Alegreya']">Following (Live + Past)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.length === 0 ? (
                  <p className="text-center text-gray-300 col-span-3">No matches to show here.</p>
                ) : (
                  filteredMatches.map((match) => {
                    const matchData = getMatchData(match, "info");
                    return (
                      <div
                        key={match.id}
                        className="bg-[rgba(0,0,0,0.3)] p-6 rounded-md shadow-md hover:bg-[rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer"
                        onClick={() => navigate(`/match/${match.id}`)}
                      >
                        <p><strong>Match ID:</strong> {matchData.matchId}</p>
                        <h3 className="text-lg font-bold font-semibold">{matchData.teams}</h3>
                        <p className="text-gray-300">{matchData.date}</p>
                        <p className="text-blue-600">{matchData.status}</p>
                        <p className="mt-2">{matchData.score}</p>
                        <p className="text-gray-400">{matchData.venue}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
          {activeTab === "all" && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-6 font-['Alegreya']">All Matches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.length === 0 ? (
                  <p className="text-center text-gray-300 col-span-3">No matches to show here.</p>
                ) : (
                  filteredMatches.map((match) => {
                    const matchData = getMatchData(match, "info");
                    return (
                      <div
                        key={match.id}
                        className="bg-[rgba(0,0,0,0.3)] p-6 rounded-lg shadow-md hover:bg-[rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer"
                        onClick={() => navigate(`/match/${match.id}`)}
                      >
                        <p><strong>Match ID:</strong> {matchData.matchId}</p>
                        <h3 className="text-lg font-bold font-['Alegreya']">{matchData.teams}</h3>
                        <p className="text-gray-300">{matchData.date}</p>
                        <p className="text-cyan-300">{matchData.status}</p>
                        <p className="mt-2">{matchData.score}</p>
                        <p className="text-gray-400">{matchData.venue}</p>
                        <p><strong>Format:</strong> {matchData.Format}</p>
                        <p><strong>Umpires:</strong> {matchData.umpire}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Match;