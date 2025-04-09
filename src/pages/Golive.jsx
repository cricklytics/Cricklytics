import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Picture3 from '../assets/sophita/HomePage/Picture3.png';
import Southafrica from '../assets/sophita/HomePage/Southafrica.png';
import Netherland from '../assets/sophita/HomePage/Netherland.jpeg';

const Golive = () => {
  const navigate = useNavigate();
  const [showCountries, setShowCountries] = useState(false);
  const [showT20, setShowT20] = useState(false);
  const [showWomens, setShowWomens] = useState(false);

  return (
    <div class="min-h-screen bg-gradient-to-r from-[#0a1f44] to-[#123456] text-white p-5">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center p-4 bg-black/30 rounded-lg mb-5">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/landingpage")}>
          <img 
            src= {Picture3}
            alt="Cricklytics Logo"
            className="h-10 object-contain block"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = {Picture3};
            }}
          />
          <span className="text-2xl font-bold text-white whitespace-nowrap text-shadow-[0_0_8px_rgba(93,224,230,0.4)]">
            Cricklytics
          </span>
        </div>

        <div className="flex gap-8 relative">
          {/* Countries Dropdown */}
          <div className="relative">
            <div 
              className="flex items-center gap-2 cursor-pointer text-lg p-2 transition-all duration-300 hover:bg-white/20 text-white"
              onClick={() => {
                setShowCountries(!showCountries);
                setShowT20(false);
                setShowWomens(false);
              }}
            >
              Countries {showCountries ? <FaChevronUp className="ml-1 text-sm" /> : <FaChevronDown className="ml-1 text-sm" />}
            </div>
            {showCountries && (
              <ul className="absolute right-0 bg-[#5DE0E6] text-white rounded-lg py-2 min-w-[200px] max-h-[400px] overflow-y-auto border border-white/50 mt-1 z-[100] shadow-md">
                {["West Indies", "Sri Lanka", "Bangladesh", "Afghanistan", "Zimbabwe", "Ireland", "India", "Australia", "England", "Pakistan", "New Zealand", "South Africa"]
                  .map((country) => (
                    <li key={country} className="px-4 py-2 cursor-pointer hover:bg-[#48C6EF]" onClick={() => navigate(`/${country.replace(/\s+/g, "")}`)}>
                      {country}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* T20 League Dropdown */}
          <div className="relative">
            <div 
              className="flex items-center gap-2 cursor-pointer text-lg p-2 transition-all duration-300 hover:bg-white/20 text-white"
              onClick={() => {
                setShowT20(!showT20);
                setShowCountries(false);
                setShowWomens(false);
              }}
            >
              T20 League {showT20 ? <FaChevronUp className="ml-1 text-sm" /> : <FaChevronDown className="ml-1 text-sm" />}
            </div>
            {showT20 && (
              <ul className="absolute right-0 bg-[#5DE0E6] text-white rounded-lg py-2 min-w-[200px] max-h-[400px] overflow-y-auto border border-white/50 mt-1 z-[100] shadow-md">
                {[
                  "India vs Australia", "England vs Pakistan", "South Africa vs New Zealand", 
                  "West Indies vs Bangladesh", "Sri Lanka vs Afghanistan", "Zimbabwe vs Ireland"
                ].map((match) => (
                  <li key={match} className="px-4 py-2 cursor-pointer hover:bg-[#48C6EF]" onClick={() => navigate(`/${match.replace(/\s+/g, "-")}`)}>
                    {match}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Women's Teams Dropdown */}
          <div className="relative">
            <div 
              className="flex items-center gap-2 cursor-pointer text-lg p-2 transition-all duration-300 hover:bg-white/20 text-white"
              onClick={() => {
                setShowWomens(!showWomens);
                setShowCountries(false);
                setShowT20(false);
              }}
            >
              Women's Teams {showWomens ? <FaChevronUp className="ml-1 text-sm" /> : <FaChevronDown className="ml-1 text-sm" />}
            </div>
            {showWomens && (
              <ul className="absolute right-0 bg-[#5DE0E6] text-white rounded-lg py-2 min-w-[200px] max-h-[400px] overflow-y-auto border border-white/50 mt-1 z-[100] shadow-md">
                {[
                  "India Women vs England Women", "Australia Women vs South Africa Women", 
                  "Pakistan Women vs West Indies Women", "New Zealand Women vs Sri Lanka Women", 
                  "Bangladesh Women vs Ireland Women"
                ].map((match) => (
                  <li key={match} className="px-4 py-2 cursor-pointer hover:bg-[#48C6EF]" onClick={() => navigate(`/${match.replace(/\s+/g, "-")}`)}>
                    {match}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Live Score Section */}
      <div className="text-center font-sans text-xl mt-5">
        <h1>Live Score Page</h1>
      </div>
      
      <div className="mt-8 relative bg-[rgba(71,156,182,0.7)] p-6 rounded-xl shadow-lg border border-white/20 w-[90%] max-w-[800px] mx-auto z-10">
  {/* Scoreboard Container - now properly centered */}
  <div className="flex justify-center items-center gap-8 bg-[#F0EDED] p-6 rounded-lg">
    {/* Netherlands Scoreboard */}
    <div className="flex flex-col items-center bg-[#1F048A] p-4 rounded-lg w-48">
      <div className="bg-[#CDC6C6] p-2 rounded-full mb-2">
        <img 
          src={Netherland}
          alt="Netherlands Flag" 
          className="w-16 h-10 object-cover rounded"
        />
      </div>
      <div className="text-white text-center">
        <p className="font-bold text-lg">Netherland</p>
        <p className="text-xl">198/6</p>
        <p className="text-sm">(42 Overs)</p>
      </div>
    </div>

    {/* VS Separator */}
    <div className="text-2xl font-bold text-gray-700">VS</div>

    {/* South Africa Scoreboard */}
    <div className="flex flex-col items-center bg-[#1F048A] p-4 rounded-lg w-48">
      <div className="bg-[#CDC6C6] p-2 rounded-full mb-2">
        <img 
          src={Southafrica}
          alt="South Africa Flag" 
          className="w-16 h-10 object-cover rounded"
        />
      </div>
      <div className="text-white text-center">
        <p className="font-bold text-lg">South Africa</p>
        <p className="text-xl">178/3</p>
        <p className="text-sm">(15.2 Overs)</p>
      </div>
    </div>
  </div>
</div>
      </div>
  );
};

export default Golive;
