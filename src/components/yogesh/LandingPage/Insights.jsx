import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../../assets/pawan/PlayerProfile/picture-312.png';
import backButton from '../../../assets/kumar/right-chevron.png';
import { db, auth } from "../../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const Insights = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("batting");
  const [activeSubOption, setActiveSubOption] = useState("high-score");
  const [insightsData, setInsightsData] = useState({});

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

  // Fetch player data from clubTeams collection
  useEffect(() => {
    if (!auth.currentUser) {
      console.log("No authenticated user found.");
      return;
    }
    console.log("Current User UID:", auth.currentUser.uid); // Debug log

    const q = query(
      collection(db, 'clubTeams'),
      where('createdBy', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let playerFound = false;
      let playerData = null;

      // Find the first player with userId matching current user and user: "Yes"
      for (const doc of snapshot.docs) {
        const teamData = doc.data();
        console.log("Team Data:", JSON.stringify(teamData, null, 2)); // Detailed debug log
        const players = teamData.players || [];
        console.log("Players Array:", players); // Debug log
        const matchingPlayer = players.find(
          (player) => player.userId === auth.currentUser.uid && player.user?.toLowerCase() === "yes"
        );
        if (matchingPlayer) {
          playerData = matchingPlayer;
          playerFound = true;
          console.log("Matching Player Found:", JSON.stringify(playerData, null, 2)); // Detailed debug log
          break;
        }
      }

      const data = {
        batting: {},
        bowling: {},
        fielding: {},
        captain: {},
      };

      if (playerFound && playerData) {
        const careerStats = playerData.careerStats || {
          batting: {},
          bowling: {},
          fielding: {},
        };
        console.log("Career Stats:", JSON.stringify(careerStats, null, 2)); // Detailed debug log

        // Batting stats
        data.batting["high-score"] = [{ value: careerStats.batting.highest ?? 1 }];
        data.batting.win = [{ value: 1 }]; // No teamName.wins in provided data
        data.batting.lose = [{ value: 1 }]; // No teamName.losses in provided data
        data.batting.matches = [{ value: careerStats.batting.matches ?? 1 }];
        data.batting.innings = [{ value: careerStats.batting.innings ?? 1 }];
        data.batting["strike-rate"] = [{ value: careerStats.batting.strikeRate ?? 1 }];
        data.batting["30s"] = [{ value: careerStats.batting.thirties ?? 1 }];
        data.batting["50s"] = [{ value: careerStats.batting.fifties ?? 1 }];
        data.batting["100s"] = [{ value: careerStats.batting.centuries ?? 1 }];
        data.batting["4s"] = [{ value: careerStats.batting.fours ?? 1 }];
        data.batting["6s"] = [{ value: careerStats.batting.sixes ?? 1 }];
        data.batting.ducks = [{ value: careerStats.batting.ducks ?? 1 }];

        // Bowling stats
        data.bowling["best-bowl"] = [{ value: playerData.bestBowling || "1/0" }];
        data.bowling.match = [{ value: careerStats.bowling.matches ?? 1 }];
        data.bowling.innings = [{ value: careerStats.bowling.innings ?? 1 }];
        data.bowling.overs = [{ value: careerStats.bowling.overs ?? 1 }];
        data.bowling.maiden = [{ value: careerStats.bowling.maidens ?? 1 }];
        data.bowling.runs = [{ value: careerStats.bowling.runsConceded ?? 1 }];
        data.bowling.wickets = [{ value: careerStats.bowling.wickets ?? 1 }];
        data.bowling["3-wickets"] = [{ value: careerStats.bowling.threeWickets ?? 1 }];
        data.bowling["5-wickets"] = [{ value: careerStats.bowling.fiveWickets ?? 1 }];
        data.bowling.economy = [{ value: careerStats.bowling.economy ?? 1 }];
        data.bowling.average = [{ value: careerStats.bowling.average ?? 1 }];
        data.bowling.wide = [{ value: careerStats.bowling.wides ?? 1 }];
        data.bowling["no-balls"] = [{ value: careerStats.bowling.noBalls ?? 1 }];
        data.bowling.dots = [{ value: careerStats.bowling.dots ?? 1 }];
        data.bowling["4s"] = [{ value: careerStats.bowling.foursConceded ?? 1 }];
        data.bowling["6s"] = [{ value: careerStats.bowling.sixesConceded ?? 1 }];

        // Fielding stats
        data.fielding.matches = [{ value: careerStats.batting.matches ?? 1 }];
        data.fielding.catch = [{ value: careerStats.fielding.catches ?? 1 }];
        data.fielding.stumping = [{ value: careerStats.fielding.stumpings ?? 1 }];
        data.fielding["run-out"] = [{ value: careerStats.fielding.runOuts ?? 1 }];
        data.fielding["catch-and-bowl"] = [{ value: careerStats.fielding.catchAndBowl ?? 1 }];

        // Captain stats
        data.captain["matches-captained"] = [{ value: careerStats.captain?.matchesCaptained ?? 1 }];
      } else {
        console.log("No matching player found, using defaults.");
        // Initialize with default values if no player is found
        data.batting["high-score"] = [{ value: 1 }];
        data.batting.win = [{ value: 1 }];
        data.batting.lose = [{ value: 1 }];
        data.batting.matches = [{ value: 1 }];
        data.batting.innings = [{ value: 1 }];
        data.batting["strike-rate"] = [{ value: 1 }];
        data.batting["30s"] = [{ value: 1 }];
        data.batting["50s"] = [{ value: 1 }];
        data.batting["100s"] = [{ value: 1 }];
        data.batting["4s"] = [{ value: 1 }];
        data.batting["6s"] = [{ value: 1 }];
        data.batting.ducks = [{ value: 1 }];

        data.bowling["best-bowl"] = [{ value: "1/0" }];
        data.bowling.match = [{ value: 1 }];
        data.bowling.innings = [{ value: 1 }];
        data.bowling.overs = [{ value: 1 }];
        data.bowling.maiden = [{ value: 1 }];
        data.bowling.runs = [{ value: 1 }];
        data.bowling.wickets = [{ value: 1 }];
        data.bowling["3-wickets"] = [{ value: 1 }];
        data.bowling["5-wickets"] = [{ value: 1 }];
        data.bowling.economy = [{ value: 1 }];
        data.bowling.average = [{ value: 1 }];
        data.bowling.wide = [{ value: 1 }];
        data.bowling["no-balls"] = [{ value: 1 }];
        data.bowling.dots = [{ value: 1 }];
        data.bowling["4s"] = [{ value: 1 }];
        data.bowling["6s"] = [{ value: 1 }];

        data.fielding.matches = [{ value: 1 }];
        data.fielding.catch = [{ value: 1 }];
        data.fielding.stumping = [{ value: 1 }];
        data.fielding["run-out"] = [{ value: 1 }];
        data.fielding["catch-and-bowl"] = [{ value: 1 }];

        data.captain["matches-captained"] = [{ value: 1 }];
      }

      setInsightsData(data);
      console.log("Insights Data Set:", data);
    }, (error) => {
      console.error("Error fetching clubTeams data:", error);
      setInsightsData({
        batting: {
          "high-score": [{ value: 1 }],
          win: [{ value: 1 }],
          lose: [{ value: 1 }],
          matches: [{ value: 1 }],
          innings: [{ value: 1 }],
          "strike-rate": [{ value: 1 }],
          "30s": [{ value: 1 }],
          "50s": [{ value: 1 }],
          "100s": [{ value: 1 }],
          "4s": [{ value: 1 }],
          "6s": [{ value: 1 }],
          ducks: [{ value: 1 }],
        },
        bowling: {
          "best-bowl": [{ value: "1/0" }],
          match: [{ value: 1 }],
          innings: [{ value: 1 }],
          overs: [{ value: 1 }],
          maiden: [{ value: 1 }],
          runs: [{ value: 1 }],
          wickets: [{ value: 1 }],
          "3-wickets": [{ value: 1 }],
          "5-wickets": [{ value: 1 }],
          economy: [{ value: 1 }],
          average: [{ value: 1 }],
          wide: [{ value: 1 }],
          "no-balls": [{ value: 1 }],
          dots: [{ value: 1 }],
          "4s": [{ value: 1 }],
          "6s": [{ value: 1 }],
        },
        fielding: {
          matches: [{ value: 1 }],
          catch: [{ value: 1 }],
          stumping: [{ value: 1 }],
          "run-out": [{ value: 1 }],
          "catch-and-bowl": [{ value: 1 }],
        },
        captain: {
          "matches-captained": [{ value: 1 }],
        },
      });
    });

    return () => unsubscribe();
  }, []);

  // Calculate overall stats
  const calculateOverallStats = () => {
    const battingMatches = insightsData.batting?.matches?.[0]?.value || 1;
    const runs = (insightsData.batting?.["100s"]?.[0]?.value || 1) * 100 +
                 (insightsData.batting?.["50s"]?.[0]?.value || 1) * 50 +
                 (insightsData.batting?.["30s"]?.[0]?.value || 1) * 30;
    const wickets = insightsData.bowling?.wickets?.[0]?.value || 1;
    const catches = insightsData.fielding?.catch?.[0]?.value || 1;
    const matchesCaptained = insightsData.captain?.["matches-captained"]?.[0]?.value || 1;

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
            <h3 className="text-xl font-bold mb-4 font-['sm']">
              {subOptions[activeTab].find((opt) => opt.id === activeSubOption)?.label || "Overall Stats"}
            </h3>
            {activeTab === "overall" ? (
              calculateOverallStats().content
            ) : (
              <div>
                {insightsData[activeTab]?.[activeSubOption]?.length > 0 ? (
                  insightsData[activeTab][activeSubOption].map((entry, index) => (
                    <div key={index} className="flex justify-between items-center mb-2 p-2 border-b border-gray-600">
                      <p>{entry.value}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-300">No data available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;