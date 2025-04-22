import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../../assets/pawan/PlayerProfile/picture-312.png';
const Insights = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("batting");
  const [activeSubOption, setActiveSubOption] = useState("high-score");

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

  // Dummy content for sub-options (scalable)
  const subOptionContent = {
    batting: {
      "high-score": { title: "High Score", content: <p>92* vs Australia, 2025</p> },
      win: { title: "Wins", content: <p>85 matches won</p> },
      lose: { title: "Losses", content: <p>45 matches lost</p> },
      matches: { title: "Matches", content: <p>150 matches played</p> },
      innings: { title: "Innings", content: <p>140 innings batted</p> },
      "strike-rate": { title: "Strike Rate", content: <p>135.2</p> },
      "30s": { title: "30's", content: <p>25 scores of 30+</p> },
      "50s": { title: "50's", content: <p>15 half-centuries</p> },
      "100s": { title: "100's", content: <p>8 centuries</p> },
      "4s": { title: "4's", content: <p>350 fours</p> },
      "6s": { title: "6's", content: <p>120 sixes</p> },
      ducks: { title: "Ducks", content: <p>5 ducks</p> },
    },
    bowling: {
      "best-bowl": { title: "Best Bowling", content: <p>4/25 vs England, 2024</p> },
      match: { title: "Matches", content: <p>50 matches bowled</p> },
      innings: { title: "Innings", content: <p>48 innings bowled</p> },
      overs: { title: "Overs", content: <p>180 overs</p> },
      maiden: { title: "Maidens", content: <p>10 maiden overs</p> },
      runs: { title: "Runs Conceded", content: <p>1,200 runs</p> },
      wickets: { title: "Wickets", content: <p>65 wickets</p> },
      "3-wickets": { title: "3 Wickets", content: <p>8 instances</p> },
      "5-wickets": { title: "5 Wickets", content: <p>2 instances</p> },
      economy: { title: "Economy Rate", content: <p>6.67</p> },
      average: { title: "Average", content: <p>18.46</p> },
      wide: { title: "Wides", content: <p>30 wides</p> },
      "no-balls": { title: "No Balls", content: <p>5 no balls</p> },
      dots: { title: "Dot Balls", content: <p>400 dot balls</p> },
      "4s": { title: "4's Conceded", content: <p>100 fours</p> },
      "6s": { title: "6's Conceded", content: <p>25 sixes</p> },
    },
    fielding: {
      matches: { title: "Matches", content: <p>150 matches</p> },
      catch: { title: "Catches", content: <p>70 catches</p> },
      stumping: { title: "Stumpings", content: <p>0 stumpings</p> },
      "run-out": { title: "Run Outs", content: <p>15 run outs</p> },
      "catch-and-bowl": { title: "Catch and Bowl", content: <p>5 catch and bowl</p> },
    },
    captain: {
      "matches-captained": { title: "Matches Captained", content: <p>Captain for 40 matches</p> },
    },
    overall: {
      default: {
        title: "Overall Stats",
        content: (
          <div className="space-y-4">
            <p><strong>Matches Played:</strong> 150</p>
            <p><strong>Runs Scored:</strong> 4,200</p>
            <p><strong>Wickets Taken:</strong> 65</p>
            <p><strong>Catches:</strong> 70</p>
            <p><strong>Captaincy:</strong> 40 matches</p>
          </div>
        ),
      },
    },
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-black to-[#001A80] bg-fixed text-white p-5">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center p-4 bg-black/30 rounded-lg mb-5">
        <div className="flex items-center gap-4">
          <img 
            src={logo}
            alt="Cricklytics Logo"
            className="h-10 object-contain block"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/Picture3 2.png";
            }}
          />
          <span className="text-2xl font-bold text-white whitespace-nowrap text-shadow-[0_0_8px_rgba(93,224,230,0.4)]">
            Cricklytics
          </span>
        </div>
       
      </div>
      <div className="flex gap-330 py-2">
      <button 
            className="text-white bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-500"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button 
            className="text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500"
            onClick={() => window.location.reload()}
          >
            Cancel
          </button>
          </div>
      {/* Horizontal Navigation Bar */}
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-center gap-4 border-b border-white/20 mb-6">
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
        <div className="bg-[rgba(71,156,182,0.7)] p-8 rounded-xl shadow-lg border border-white/20">
          {activeTab !== "overall" && subOptions[activeTab].length > 0 && (
            <div>
              <h2 className="text-4xl font-bold text-center mb-6 font-['Alegreya']">{tabs.find(tab => tab.id === activeTab).label}</h2>
              <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-cyan-300 scrollbar-track-gray-800">
                {subOptions[activeTab].map((option) => (
                  <button
                    key={option.id}
                    className={`flex-shrink-0 px-6 py-3 rounded-lg text-base font-['Alegreya'] transition-all duration-300 shadow-md ${
                      activeSubOption === option.id
                        ? "bg-[#48C6EF] text-white"
                        : "bg-[#5DE0E6] text-white hover:bg-[#48C6EF] hover:text-cyan-300"
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
              {subOptionContent[activeTab][activeSubOption]?.title || "Overall Stats"}
            </h3>
            {subOptionContent[activeTab][activeSubOption]?.content || subOptionContent.overall.default.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;