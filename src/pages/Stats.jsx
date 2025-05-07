import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/pawan/PlayerProfile/picture-312.png";
import backButton from '../assets/kumar/right-chevron.png'

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
      <img
          src={backButton} // Change path if needed
          alt="Back"
          className="w-10 h-10 cursor-pointer -scale-x-100"
          onClick={() => window.history.back()}
        />
          <button 
            className="text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500"
            onClick={() => window.location.reload()}
          >
            Cancel
          </button>
          </div>
      {/* Horizontal Navigation Bar */}
      <div className="max-w-5xl mx-auto px-4">
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 border-b border-white/20 mb-6 py-6">
    
    {/* User Image and Name */}
    <div className="flex items-center gap-3">
    <img 
  src={user.picture} 
  alt="User Pic" 
  className="w-24 h-24 rounded-full object-cover aspect-square"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "/images/user-placeholder.png";
  }}
/>

      <div className="text-2xl sm:text-4xl font-['Alegreya'] text-gray-300">{user.name}</div>
    </div>

    {/* User Location, Spec and Button */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto mt-4 sm:mt-0">
      <div className="text-base sm:text-lg font-['Alegreya'] text-gray-300 mb-1 sm:mb-0">{user.location}</div>
      <div className="text-base sm:text-lg font-['Alegreya'] text-gray-300 mb-2 sm:mb-0 pr-0 sm:pr-4">{user.specification}</div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-xl border border-white/50 shadow-inner shadow-[inset_0_20px_120px_rgba(0,0,0,1)] backdrop-blur">

              <h3 className="text-lg font-bold font-['Alegreya']">Recent Performance</h3>
              <p className="text-gray-300 mt-2">Last Match: 45 runs (30 balls), India vs Australia</p>
              <p className="text-gray-300">Average: 38.5</p>
              <p className="text-gray-300">Strike Rate: 135.2</p>
            </div>
            <div className="p-8 rounded-xl border border-white/50 shadow-inner shadow-[inset_0_20px_120px_rgba(0,0,0,1)] backdrop-blur">

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