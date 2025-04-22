import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/pawan/PlayerProfile/picture-312.png";

const Stats = () => {
  const navigate = useNavigate();

  // Dummy user data (scalable)
  const user = {
    picture: "https://imgs.search.brave.com/5KiDFDwoFQxMlHrWQdaqIa4qtyBq-gjmWmIxRWwrmgY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi8xLzFlL1By/aW1lX01pbmlzdGVy/X09mX0JoYXJhdF9T/aHJpX05hcmVuZHJh/X0RhbW9kYXJkYXNf/TW9kaV93aXRoX1No/cmlfUm9oaXRfR3Vy/dW5hdGhfU2hhcm1h/XyUyOENyb3BwZWQl/MjkuanBnLzUxMnB4/LVByaW1lX01pbmlz/dGVyX09mX0JoYXJh/dF9TaHJpX05hcmVu/ZHJhX0RhbW9kYXJk/YXNfTW9kaV93aXRo/X1NocmlfUm9oaXRf/R3VydW5hdGhfU2hh/cm1hXyUyOENyb3Bw/ZWQlMjkuanBn",
    name: "Rohit Sharma",
    location: "Mumbai, India",
    specification: "Batsman / Captain",
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
        <div className="flex items-center  gap-6 border-b border-white/20 mb-6 py-6">
          <div className="flex items-center gap-2">
            <img 
              src={user.picture} 
              alt="User Pic" 
              className="w-25 h-25 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/user-placeholder.png";
              }}
            />
          </div>
          <div className="text-4xl font-['Alegreya'] pr-70 text-gray-300">{user.name}</div>
          <div className="text-lg font-['Alegreya'] text-gray-300">{user.location}</div>
          <div className="text-lg font-['Alegreya'] text-gray-300">{user.specification}</div>
          <button
            className="px-6 py-2 bg-[#5DE0E6] text-white rounded-lg text-lg font-['Alegreya'] hover:bg-[#48C6EF] hover:text-cyan-300 transition-all duration-300"
            onClick={() => navigate("/insights")}
          >
            Insights
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-[rgba(71,156,182,0.7)] p-8 rounded-xl shadow-lg border border-white/20">
          <h2 className="text-2xl font-bold text-center mb-6 font-['Alegreya']">Player Stats Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[rgba(0,0,0,0.3)] p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold font-['Alegreya']">Recent Performance</h3>
              <p className="text-gray-300 mt-2">Last Match: 45 runs (30 balls), India vs Australia</p>
              <p className="text-gray-300">Average: 38.5</p>
              <p className="text-gray-300">Strike Rate: 135.2</p>
            </div>
            <div className="bg-[rgba(0,0,0,0.3)] p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold font-['Alegreya']">Career Highlights</h3>
              <p className="text-gray-300 mt-2">Matches: 150</p>
              <p className="text-gray-300">Runs: 4,200</p>
              <p className="text-gray-300">Centuries: 8</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;