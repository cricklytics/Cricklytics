import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const National = () => {
  const navigate = useNavigate();
  const [showCountries, setShowCountries] = useState(false);

  const sections = [
    {
      title: "All Countries",
      state: showCountries,
      setState: setShowCountries,
      items: [
        { name: "Australia", flag: "/src/assets/pawan/PlayerProfile/australia.png" },
        { name: "India", flag: "/src/assets/pawan/PlayerProfile/india.png" },
        { name: "England", flag: "/src/assets/pawan/PlayerProfile/england.png" },
        { name: "South Africa", flag: "/src/assets/pawan/PlayerProfile/south-africa.png" },
        { name: "New Zealand", flag: "/src/assets/pawan/PlayerProfile/new-zealand.png" },
        { name: "Pakistan", flag: "/src/assets/pawan/PlayerProfile/pakistan.png" },
        { name: "Sri Lanka", flag: "/src/assets/pawan/PlayerProfile/sri-lanka.png" },
        { name: "West Indies", flag: "/src/assets/pawan/PlayerProfile/west-indies.png" },
        { name: "Bangladesh", flag: "/src/assets/pawan/PlayerProfile/bangladesh.png" },
        { name: "Afghanistan", flag: "/src/assets/pawan/PlayerProfile/afghanistan.png" },
        { name: "Ireland", flag: "/src/assets/pawan/PlayerProfile/ireland.png" },
        { name: "Zimbabwe", flag: "/src/assets/pawan/PlayerProfile/zimbabwe.png" },
        { name: "Netherlands", flag: "/src/assets/pawan/PlayerProfile/netherlands.png" },
        { name: "Scotland", flag: "/src/assets/pawan/PlayerProfile/scotland.png" },
        { name: "Nepal", flag: "/src/assets/pawan/PlayerProfile/nepal.png" }
      ]
    }
  ];

  return (
    <div className="min-h-full bg-gradient-to-b from-black to-[#001A80] bg-fixed text-white p-5">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center p-4 bg-black/30 rounded-lg mb-5">
        <div className="flex items-center gap-4">
          <img 
            src="/images/picture3_2.png"
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
        <button 
          className="text-white bg-[#5DE0E6] px-4 py-2 rounded-lg hover:bg-[#48C6EF]"
          onClick={() => navigate("/go-live")}
        >
          Back to Go Live
        </button>
      </div>

      {/* Container for Title and Dropdowns */}
      <div className="max-w-3xl mx-auto mt-10">
        <div className="bg-[rgba(71,156,182,0.7)] p-8 rounded-xl shadow-lg border border-white/20">
          <h1 className="text-3xl  text-black font-bold text-center mb-6">National Cricket Teams</h1>
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.title} className="relative">
                <div 
                  className="flex items-center justify-between gap-2 cursor-pointer text-lg p-4 bg-[#5DE0E6] text-black rounded-lg transition-all duration-300 hover:bg-[#48C6EF]"
                  onClick={() => section.setState(!section.state)}
                >
                  <span className="font-bold">{section.title}</span>
                  {section.state ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
                </div>
                {section.state && (
                  <ul className="bg-[#1b2627] text-white rounded-lg py-2 mt-2 max-h-[300px] overflow-y-auto border border-white/50 shadow-md">
                    {section.items.map((item) => (
                      <li 
                        key={item.name}
                        className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-[#48C6EF] hover:text-white transition-all duration-200"
                        onClick={() => navigate(`/team/${item.name.toLowerCase().replace(/\s+/g, "-")}`)}
                      >
                        <img 
                          src={item.flag} 
                          alt={`${item.name} flag`} 
                          className="w-6 h-4 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/flags/placeholder.png";
                          }}
                        />
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default National;