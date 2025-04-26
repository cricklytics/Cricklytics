import React, { useState } from 'react';
import '../../styles/Awards.css';
import x1 from '../../assets/pawan/PlayerProfile/1.svg';
import Kudos from '../../assets/pawan/PlayerProfile/kudos.png';
import x2025 from '../../assets/pawan/PlayerProfile/2025.png';
import app1288929611 from '../../assets/pawan/PlayerProfile/app-12889296-1-1.png';
import iconDesignArchiveAwards3 from '../../assets/pawan/PlayerProfile/icon-design-archive-awards-3.svg';
import jamInfo from '../../assets/pawan/PlayerProfile/jam-info.svg';
import Picture32 from '../../assets/pawan/PlayerProfile/picture-312.png';

import subtract from '../../assets/pawan/PlayerProfile/subtract.svg';

import Picture312Image from '../../assets/pawan/PlayerProfile/picture-312.png';
import { useNavigate } from "react-router-dom";

const Awards = () => {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const handleButtonHover = (buttonId) => setHoveredButton(buttonId);
  const handleButtonLeave = () => setHoveredButton(null);
  const handleYearClick = (year) => setSelectedYear(year === selectedYear ? null : year);

  const InteractiveButton = ({ children, className, style, onClick, id }) => (
    <button
      className={`interactive-button ${className} ${hoveredButton === id ? 'hovered' : ''}`}
      style={style}
      onClick={onClick}
      onMouseEnter={() => handleButtonHover(id)}
      onMouseLeave={handleButtonLeave}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-white flex flex-col items-center w-full min-h-screen awards-bg-gradient">
      
        {/* Header Section */}
        <div className="relative w-full mt-5px flex flex-col items-center">
          <div className="relative w-full flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/landingpage")}>
              <img src={Picture312Image} alt="Logo" className="w-6 h-6 md:w-8 md:h-8 object-cover" />
              <span className="font-raleway font-bold text-white text-lg md:text-2xl">Cricklytics</span>
            </div>
            <img src={jamInfo} alt="Jam info" className="w-6 h-12 md:w-8 md:h-16" />
          </div>
          <img src={Kudos} alt="Kudos Banner" className="w-full h-auto max-h-[300px] md:max-h-[520px] object-cover" />
        

        {/* About Section */}
        <section className="relative w-full mt-8 md:mt-12 text-center">
          <h2 className="font-merriweather-sans font-bold text-cyan-300 text-xl md:text-4xl mb-4">
            About Cricklytics Kudos
          </h2>
          <p className="font-merriweather-sans text-white text-sm md:text-2xl leading-relaxed px-4 md:px-0">
            The Cricklytics Kudos celebrate the passion, talent, and dedication of cricket’s finest players and teams,
            honoring those who smash boundaries and create unforgettable moments on the field.
          </p>
          <InteractiveButton
            className="mt-6 w-full max-w-[300px] md:max-w-[772px] h-12 md:h-16 bg-[#4cc5dc] shadow-button-shadow text-lg md:text-2xl rounded-3xl"
            id="explore-button"
          >
            Explore
          </InteractiveButton>
        </section>

        {/* Awards Section */}
        <section className="relative w-full mt-12 md:mt-20">
          <div className="relative bg-[#142136] py-8 px-4 rounded-lg">
            <div className="flex flex-col items-center">
              <img src={iconDesignArchiveAwards3} alt="Award Icon" className="w-48 md:w-96 h-auto mb-4" />
              <div className="font-bebas-neue text-[#f09e64] text-lg md:text-2xl text-center tracking-wider [-webkit-text-stroke:1px_#ed8a48]">
                CRICKLYTICS
              </div>
              <img src={x2025} alt="2025" className="w-12 md:w-16 h-auto mt-2" />
            </div>
            
          </div>
          <div className="mt-6 flex justify-center">
    <InteractiveButton
      onClick={() => navigate("/Winner25")}
      id="winners-2025-button"
      className="w-full max-w-[300px] md:max-w-[725px] h-12 md:h-14 bg-[#4cc5dc] shadow-button-shadow text-lg md:text-2xl rounded-3xl"
    >
      Winners of 2025
    </InteractiveButton>
  </div>

          {/* Selection Criteria */}
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center bg-[#142136] py-4 px-4 rounded-lg">
            <h3 className="font-bebas-neue text-white text-2xl md:text-4xl">Selection Criteria</h3>
            <InteractiveButton
              id="sel-criteria"
              onClick={() => navigate("/SelectionCriteria")}
              className="w-12 h-12 md:w-16 md:h-16 bg-[#4cc5dc] rounded-full text-lg md:text-2xl mt-4 md:mt-0"
            >
              →
            </InteractiveButton>
          </div>
{/* Past Winners */}
<div className="mt-6 flex justify-center">
  <InteractiveButton
    onClick={() => navigate("/Winner25")}
    id="past-winners-button"
    className="w-full max-w-[300px] md:max-w-[725px] h-12 md:h-14 bg-[#4cc5dc] shadow-button-shadow text-lg md:text-2xl rounded-3xl"
  >
    Past Winners
  </InteractiveButton>
</div>

          {/* Popularity Award Winner */}
          <div className="mt-8 text-center">
            <h3 className="font-bebas-neue text-white text-3xl md:text-5xl mb-4">Popularity Award Winner</h3>
            <div className="relative w-full max-w-[300px] md:max-w-[435px] mx-auto">
              <div className="relative">
                <img src={subtract} alt="Trophy" className="w-full h-auto" />
                <img src={x1} alt="Element" className="absolute top-1/4 left-1/4 w-1/2 h-auto" />
              </div>
              <InteractiveButton
                id="view-result-button"
                className="mt-4 w-full max-w-[300px] md:max-w-[725px] h-12 md:h-14 bg-[#4cc5dc] shadow-button-shadow text-lg md:text-2xl rounded-3xl"
              >
                View Result
              </InteractiveButton>
            </div>
          </div>

          {/* Categories of 2025 */}
          <div className="mt-12 text-center bg-[#142136] py-6 px-4 rounded-lg">
            <h3 className="font-merriweather-sans text-white text-lg md:text-2xl mb-4">Categories Of 2025</h3>
            <img src={app1288929611} alt="App Icon" className="w-24 md:w-32 h-auto mx-auto mb-4" />
            <InteractiveButton
              id="check-now-1"
              onClick={() => navigate("/Winner25")}
              className="w-full max-w-[200px] md:max-w-[324px] h-12 md:h-16 bg-[#4cc5dc] rounded-3xl shadow-button-inset text-lg md:text-xl"
            >
              CHECK NOW
            </InteractiveButton>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Awards;