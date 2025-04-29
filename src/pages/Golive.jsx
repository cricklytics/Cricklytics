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
  const [showICC, setShowICC] = useState(false);

  const iccTeams = {
    Asia: ["India", "Pakistan", "Sri Lanka", "Bangladesh", "Afghanistan"],
    Europe: ["England", "Ireland", "Scotland", "Netherlands"],
    Africa: ["South Africa", "Zimbabwe", "Namibia"],
    Australia: ["Australia", "New Zealand"],
    Americas: ["West Indies", "USA", "Canada"]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#001A80] text-white p-5 py-0">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center p-4 bg-black/30 rounded-lg mb-5">
        <div className="flex items-center gap-4">
          <img
            src={Picture3}
            alt="Cricklytics Logo"
            className="h-7 w-7 md:h-10 object-contain block select-none mt-1"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/Picture3 2.png";
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
              className="flex items-center gap-2 cursor-pointer text-lg p-2 hover:bg-white/20 transition-all duration-300"
              onClick={() => {
                setShowCountries(!showCountries);
                setShowT20(false);
                setShowWomens(false);
                setShowICC(false);
              }}
            >
              Countries {showCountries ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {showCountries && (
              <ul className="absolute right-0 bg-[#5DE0E6] text-black rounded-lg py-2 min-w-[200px] max-h-[400px] overflow-y-auto border border-white/50 mt-1 z-[100] shadow-md">
                {["West Indies", "Sri Lanka", "Bangladesh", "Afghanistan", "Zimbabwe", "Ireland", "India", "Australia", "England", "Pakistan", "New Zealand", "South Africa"]
                  .map((country, index, array) => (
                    <React.Fragment key={country}>
                      <li className="px-4 py-2 cursor-pointer hover:bg-[#48C6EF]" onClick={() => navigate(`/${country.replace(/\s+/g, "")}`)}>
                        {country}
                      </li>
                      {index < array.length - 1 && <li className="bg-white/50 h-[2px] my-1"></li>}
                    </React.Fragment>
                  ))}
              </ul>
            )}
          </div>
          {/* ICC Dropdown */}
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer text-lg p-2 hover:bg-white/20 transition-all duration-300"
              onClick={() => {
                setShowICC(!showICC);
                setShowCountries(false);
                setShowT20(false);
                setShowWomens(false);
              }}
            >
              ICC Teams {showICC ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {showICC && (
              <div className="absolute right-0 bg-[#5DE0E6] text-black rounded-lg py-2 min-w-[220px] max-h-[400px] overflow-y-auto border border-white/50 mt-1 z-[100] shadow-md space-y-2 px-2">
                {Object.entries(iccTeams).map(([continent, teams], continentIndex, continentsArray) => (
                  <React.Fragment key={continent}>
                    <div className="mb-2">
                      <h3 className="px-3 py-2 font-bold text-sm bg-[#1E2A78] text-black rounded-md shadow-md">
                        {continent}
                      </h3>
                      {teams.map((team, teamIndex, teamsArray) => (
                        <React.Fragment key={team}>
                          <div
                            className="px-4 py-2 cursor-pointer hover:bg-[#48C6EF] rounded"
                            onClick={() => navigate(`/${team.replace(/\s+/g, "")}`)}
                          >
                            {team}
                          </div>
                          {teamIndex < teamsArray.length - 1 && <div className="bg-white/50 h-[2px] my-1"></div>}
                        </React.Fragment>
                      ))}
                    </div>
                    {continentIndex < continentsArray.length - 1 && <div className="bg-white/50 h-[2px] my-2"></div>}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* T20 League Dropdown */}
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer text-lg p-2 hover:bg-white/20 transition-all duration-300"
              onClick={() => {
                setShowT20(!showT20);
                setShowCountries(false);
                setShowWomens(false);
                setShowICC(false);
              }}
            >
              T20 League {showT20 ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {showT20 && (
              <ul className="absolute right-0 bg-[#5DE0E6] text-black rounded-lg py-2 min-w-[200px] max-h-[400px] overflow-y-auto border border-white/50 mt-1 z-[100] shadow-md">
                {[
                  "India vs Australia", "England vs Pakistan", "South Africa vs New Zealand",
                  "West Indies vs Bangladesh", "Sri Lanka vs Afghanistan", "Zimbabwe vs Ireland"
                ].map((match, index, array) => (
                  <React.Fragment key={match}>
                    <li className="px-4 py-2 cursor-pointer hover:bg-[#48C6EF]" onClick={() => navigate(`/${match.replace(/\s+/g, "-")}`)}>
                      {match}
                    </li>
                    {index < array.length - 1 && <li className="bg-white/50 h-[2px] my-1"></li>}
                  </React.Fragment>
                ))}
              </ul>
            )}
          </div>

          {/* Women's Teams Dropdown */}
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer text-lg p-2 hover:bg-white/20 transition-all duration-300"
              onClick={() => {
                setShowWomens(!showWomens);
                setShowCountries(false);
                setShowT20(false);
                setShowICC(false);
              }}
            >
              Women's Teams {showWomens ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {showWomens && (
              <ul className="absolute right-0 bg-[#5DE0E6] text-black rounded-lg py-2 min-w-[200px] max-h-[400px] overflow-y-auto border border-white/50 mt-1 z-[100] shadow-md">
                {[
                  "India Women vs England Women", "Australia Women vs South Africa Women",
                  "Pakistan Women vs West Indies Women", "New Zealand Women vs Sri Lanka Women",
                  "Bangladesh Women vs Ireland Women"
                ].map((match, index, array) => (
                  <React.Fragment key={match}>
                    <li className="px-4 py-2 cursor-pointer hover:bg-[#48C6EF]" onClick={() => navigate(`/${match.replace(/\s+/g, "-")}`)}>
                      {match}
                    </li>
                    {index < array.length - 1 && <li className="bg-white/50 h-[2px] my-1"></li>}
                  </React.Fragment>
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
        <div className="flex justify-center items-center gap-8 bg-[#F0EDED] p-6 rounded-lg">
          {/* Netherlands */}
          <div className="flex flex-col items-center bg-[#1F048A] p-4 rounded-lg w-48">
            <div className="bg-[#CDC6C6] p-2 rounded-full mb-2">
              <img
                src={Netherland}
                alt="Netherlands Flag"
                className="w-16 h-10 object-cover rounded"
              />
            </div>
            <div className="text-white text-center">
              <p className="font-bold text-lg">Netherlands</p>
              <p className="text-xl">198/6</p>
              <p className="text-sm">(42 Overs)</p>
            </div>
          </div>

          <div className="text-2xl font-bold text-gray-700">VS</div>

          {/* South Africa */}
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

      {/* Bottom Navigation Buttons */}
      <div className="flex justify-center gap-6 items-center mt-10 w-full max-w-[800px] mx-auto px-4">
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition duration-300"
          onClick={() => navigate("/landingpage")}>
          Cancel
        </button>
        {/* <button className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-full transition duration-300"
          onClick={() => navigate("/national")}
        >
          Back
        </button> */}
        {/* <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition duration-300">
          Skip
        </button> */}
      </div>
    </div>
  );
};

export default Golive;