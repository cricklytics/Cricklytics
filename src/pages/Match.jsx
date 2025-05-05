import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/pawan/PlayerProfile/picture-312.png';

const Match = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("my-matches");
  const [activeSubOption, setActiveSubOption] = useState("info");

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

  // Dummy data for matches (scalable)
  const dummyMatches = [
    {
      id: 1,
      teams: "India vs Australia",
      date: "2025-05-01",
      status: "Live",
      score: "IND 120/2 (15.0 ov)",
      venue: "Wankhede Stadium, Mumbai",
    },
    {
      id: 2,
      teams: "England vs South Africa",
      date: "2025-04-28",
      status: "Past",
      score: "ENG 250/7, SA 230/8",
      venue: "Lord's, London",
    },
    {
      id: 3,
      teams: "Pakistan vs New Zealand",
      date: "2025-05-02",
      status: "Live",
      score: "PAK 180/4 (18.0 ov)",
      venue: "Gaddafi Stadium, Lahore",
    },
  ];

  // Dummy content for sub-options
  const subOptionContent = {
    info: {
      title: "Match Information",
      content: (
        <div className="space-y-4">
          <p><strong>Date:</strong> May 1, 2025</p>
          <p><strong>Venue:</strong> Wankhede Stadium, Mumbai</p>
          <p><strong>Format:</strong> T20</p>
          <p><strong>Umpires:</strong> Anil Chaudhary, Richard Kettleborough</p>
          <p><strong>Status:</strong> Live</p>
        </div>
      ),
    },
    summary: {
      title: "Match Summary",
      content: (
        <div className="space-y-4">
          <p>India is batting first and has scored 120/2 in 15 overs. Key performances include a 50-run partnership between Rohit Sharma and Virat Kohli.</p>
          <p>Australia's bowlers are struggling to contain the run rate, with Pat Cummins taking 1 wicket so far.</p>
        </div>
      ),
    },
    scorecard: {
      title: "Scorecard",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold">India Batting</h4>
            <p>Rohit Sharma: 45 (30)</p>
            <p>Virat Kohli: 60 (40)</p>
            <p>KL Rahul: 10* (5)</p>
          </div>
          <div>
            <h4 className="font-bold">Australia Bowling</h4>
            <p>Pat Cummins: 1/25 (3 ov)</p>
            <p>Josh Hazlewood: 0/30 (4 ov)</p>
          </div>
        </div>
      ),
    },
    squad: {
      title: "Squad",
      content: (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold">India</h4>
            <p>Rohit Sharma (C)</p>
            <p>Virat Kohli</p>
            <p>KL Rahul</p>
            <p>Jasprit Bumrah</p>
          </div>
          <div>
            <h4 className="font-bold">Australia</h4>
            <p>Pat Cummins (C)</p>
            <p>Steve Smith</p>
            <p>David Warner</p>
            <p>Josh Hazlewood</p>
          </div>
        </div>
      ),
    },
    analysis: {
      title: "Match Analysis",
      content: (
        <div className="space-y-4">
          <p>India's batting has been aggressive, with a run rate of 8.0. The pitch is favoring batsmen, but spinners might play a key role in the later overs.</p>
          <p>Australia needs to break the current partnership to regain control.</p>
        </div>
      ),
    },
    mvp: {
      title: "Most Valuable Player",
      content: (
        <div className="space-y-4">
          <p><strong>Current MVP:</strong> Virat Kohli</p>
          <p>Contribution: 60 runs off 40 balls, stabilizing the innings.</p>
        </div>
      ),
    },
  };

  return (
    <div className="min-h-full bg-fixed text-white p-5" style={{
      backgroundImage: 'linear-gradient(140deg,#080006 15%,#FF0077)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center p-4 rounded-lg mb-5">
        <div className="flex items-center gap-4">
          <img 
            src={logo}
            alt="Cricklytics Logo"
            className="h-7 w-7 md:h-10 object-contain block select-none"
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
      <div className="flex justify-between p-2">
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
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4 font-['Alegreya']">{subOptionContent[activeSubOption].title}</h3>
                {subOptionContent[activeSubOption].content}
              </div>
            </div>
          )}
          {activeTab === "following" && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-6 font-['Alegreya']">Following (Live + Past)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dummyMatches.map((match) => (
                  <div
                    key={match.id}
                    className="bg-[rgba(0,0,0,0.3)] p-6 rounded-lg shadow-md hover:bg-[rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/match/${match.id}`)}
                  >
                    <h3 className="text-lg font-bold font-['Alegreya']">{match.teams}</h3>
                    <p className="text-gray-300">{match.date}</p>
                    <p className="text-cyan-300">{match.status}</p>
                    <p className="mt-2">{match.score}</p>
                    <p className="text-gray-400">{match.venue}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "all" && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-6 font-['Alegreya']">All Matches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dummyMatches.concat(dummyMatches).map((match, index) => (
                  <div
                    key={`${match.id}-${index}`}
                    className="bg-[rgba(0,0,0,0.3)] p-6 rounded-lg shadow-md hover:bg-[rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/match/${match.id}`)}
                  >
                    <h3 className="text-lg font-bold font-['Alegreya']">{match.teams}</h3>
                    <p className="text-gray-300">{match.date}</p>
                    <p className="text-cyan-300">{match.status}</p>
                    <p className="mt-2">{match.score}</p>
                    <p className="text-gray-400">{match.venue}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </div>
        
      </div>
     
    </div>
  );
};

export default Match;