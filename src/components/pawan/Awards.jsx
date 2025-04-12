import React, { useState } from 'react';
import '../../styles/Awards.css';
import x1 from '../../assets/pawan/PlayerProfile/1.svg';
import x2022 from '../../assets/pawan/PlayerProfile/2022.png';
import Logo from '../../assets/pawan/PlayerProfile/logo.png';
import x2023 from '../../assets/pawan/PlayerProfile/2023.png';
import x2024 from '../../assets/pawan/PlayerProfile/2024.png';
import x2025 from '../../assets/pawan/PlayerProfile/2025.png';
import ee85c7eddIccCricketWorldCupChampionship1 from '../../assets/pawan/PlayerProfile/6520ee85c7edd-ICC-cricket-world-cup-championship-1.svg';
import app1288929611 from '../../assets/pawan/PlayerProfile/app-12889296-1-1.png';
import cricklyticsCricketAwards from '../../assets/pawan/PlayerProfile/cricklytics-cricket-awards.png';
import ellipse1 from '../../assets/pawan/PlayerProfile/ellipse-1.png';
import ellipse2 from '../../assets/pawan/PlayerProfile/ellipse-2.png';
import ellipse3 from '../../assets/pawan/PlayerProfile/ellipse-3.png';
import ellipse4 from '../../assets/pawan/PlayerProfile/ellipse-4.png';

import iconDesignArchiveAwards3 from '../../assets/pawan/PlayerProfile/icon-design-archive-awards-3.svg';
import jamInfo from '../../assets/pawan/PlayerProfile/jam-info.svg';
import maskGroup from '../../assets/pawan/PlayerProfile/mask-group.png';
import subtract3 from '../../assets/pawan/PlayerProfile/subtract-3.svg';
import subtract4 from '../../assets/pawan/PlayerProfile/subtract-4.svg';
import subtract from '../../assets/pawan/PlayerProfile/subtract.svg';
import { ElementEeceddIcc } from '../pawan/ElementEeceddIcc';
import { ElementIcc } from '../pawan/ElementIcc';
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

  const WinnerCard = ({ year, image, onClick }) => (
    <div className="winner-card" onClick={onClick}>
      <img src={image} alt={`Winner ${year}`} className="winner-image" />
      <p className="winner-year">{year}</p>
      <InteractiveButton id={`view-details-${year}`}>View Details</InteractiveButton>
    </div>
  );

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden border border-solid border-opacity-10 border-black w-[1525px] h-[4396px] relative awards-bg-gradient">
        <div className="absolute w-[2213px] h-[3239px] top-[-346px] left-[-259px]">
          <header className="absolute w-[1889px] h-[930px] top-0 left-[324px] bg-transparent">
            <div className="relative w-[1525px] h-[959px] top-[346px] left-[-65px]">
              <img
                className="absolute w-[342px] h-48 top-[195px] left-[925px] transition-transform duration-300 hover:scale-105"
                alt="Cricklytics cricket"
                src={cricklyticsCricketAwards}
              />
              <img className="absolute w-[1185px] h-[766px] top-0 left-0" alt="Ellipse" src={ellipse1} />
              <img className="absolute w-[704px] h-[830px] top-0 left-[10px]" alt="Ellipse" src={ellipse3} />
              <img className="absolute w-[1400px] h-[959px] top-0 left-[175px]" alt="Ellipse" src={ellipse2} />
              <img className="absolute w-[1500px] h-[925px] top-0 left-[152px]" alt="Ellipse" src={ellipse4} />
              <img
                className="absolute w-[616px] h-[420px] top-[50px] left-[770px]"
                alt="Mask group"
                src={maskGroup}
              />
              <img
                className="absolute w-[616px] h-[420px] top-[200px] left-[100x]"
                alt="Mask group"
                src={Logo}
              />
            </div>
          </header>
          <ElementIcc className="!absolute !left-0 !top-[289px]" />
          <div className="absolute w-[1544px] h-[2265px] top-[974px] left-[255px]">
            <div className="absolute w-[1528px] h-[556px] top-0 left-0">
              <div className="w-[1528px] h-[129px] absolute top-[21px] left-0 rounded-3xl button-gradient shadow-button-shadow" />
              <div className="w-[1528px] h-[129px] absolute top-[396px] left-0 rounded-3xl button-gradient shadow-button-shadow" />
              <div className="absolute w-[802px] h-[183px] top-[50px] left-[500px] font-merriweather-sans font-bold text-black text-5xl leading-[62.4px]">
                About Cricklytics Kudos
              </div>
              <div className="absolute w-[802px] h-[183px] top-[425px] left-[650px] font-merriweather-sans font-bold text-black text-5xl leading-[62.4px]">
                Explore
              </div>
              
              <p className="absolute w-[1326px] h-[216px] top-[180px] left-36 font-merriweather-sans text-white text-[32px] leading-[41.6px]">
                The Cricklytics Kudos celebrate the passion, talent, and dedication of cricket’s finest players and teams,
                honoring those who smash boundaries and create unforgettable moments on the field.
              </p>
            </div>
            <div className="absolute w-[1533px] h-[1709px] top-[556px] left-0">
        
              <div className="absolute w-[1526px] h-[416px] top-0 left-1 bg-[#142136]" />
              <div className="absolute w-[1526px] h-[626px] top-[954px] left-1 bg-[#142136]" />
              <div className="absolute w-[1529px] h-[1653px] top-14 left-1">
                <InteractiveButton
                  onClick={() => navigate("/Winner25")}
                  id="winners-2025-button"
                  className="flex w-[1525px] h-[129px] items-center justify-center gap-2 px-6 py-3.5 absolute top-[375px] left-0 bg-[#4cc5dc] shadow-button-shadow text-5xl"
                >
                  Winners of 2025
                </InteractiveButton>
                {/* <img className="w-[1525px] h-[133px] absolute top-[1523px] left-0" alt="Frame" src={frame} /> */}
                <InteractiveButton
                id="pastt-winners-button"
                className="flex w-[1525px] h-[129px] items-center justify-center gap-2 px-6 py-3.5 absolute top-[1526px] left-0 bg-[#4cc5dc] shadow-button-shadow text-5xl"
              >
                View Result
              </InteractiveButton>
                
                <div className="absolute w-[528px] h-[365px] -top-6 left-[459px]">
                  <img className="absolute w-[528px] h-[365px] top-0 left-0" alt="Icon design archive" src={iconDesignArchiveAwards3} />
                  <div className="absolute w-[298px] h-[72px] top-[138px] left-[111px] font-bebas-neue text-[#f09e64] text-2xl text-center tracking-[2.4px] leading-[64px] [-webkit-text-stroke:1px_#ed8a48]">
                    CRICKLYTICS
                  </div>
                  <img className="absolute w-[74px] h-[34px] top-[292px] left-[225px]" alt="2025" src={x2025} />
                </div>
              </div>
              <div className="absolute w-[1526px] h-[220px] top-[579px] left-1 bg-[#142136]" />
              <div className="absolute w-[600px] h-[122px] top-[650px] left-10 font-bebas-neue text-white text-[64px] leading-[83.2px]">
                Selection Criteria
              </div>
              <div className="absolute w-[868px] h-[122px] top-[1414px] left-[220px] font-bebas-neue text-white text-8xl leading-[124.8px] whitespace-nowrap">
                Popularity Award Winner
              </div>
              <InteractiveButton
            id="sel-criteria"
             className="absolute w-[76px] h-[82px] top-[650px] left-[1390px] bg-[#4cc5dc] rounded-[30px/30px]" 
             onClick={() => navigate("/SelectionCriteria")}> ?
             </InteractiveButton>
               <div className="absolute w-[43px] h-[92px] top-[611px] left-[1409px] font-noto-sans-lao text-white text-5xl leading-[62.4px]">
              </div> 
              <InteractiveButton
                id="past-winners-button"
                onClick={() => navigate("/Winner25")}
                className="flex w-[1525px] h-[129px] items-center justify-center gap-2 px-6 py-3.5 absolute top-[815px] left-0 bg-[#4cc5dc] shadow-button-shadow text-5xl"
              >
                Past Winners
              </InteractiveButton>
            </div>
          </div>
          <div className="absolute w-[435px] h-[315px] top-[2557px] left-[749px]">
            <div className="relative h-[315px]">
              <div className="absolute w-[242px] h-[228px] top-0 left-[97px]">
                <div className="relative w-[248px] h-[232px] -top-px -left-[3px]">
                  <img className="absolute w-[242px] h-[226px] top-px left-[3px]" alt="Subtract" src={subtract} />
                  <div className="absolute w-[194px] h-[179px] top-[26px] left-[26px] rounded-[97.01px/89.51px] border-3 border-solid border-[#d7834e]" />
                  <div className="absolute w-[181px] h-[167px] top-[33px] left-[33px] rounded-[90.27px/83.3px] border-3 border-solid border-[#d7834e]" />
                  <img className="absolute w-[145px] h-[168px] top-[35px] left-[51px]" alt="Element" src={x1} />
                </div>
              </div>
              <div className="absolute w-[435px] h-52 top-[107px] left-0">
                <div className="absolute w-[187px] h-52 top-0 left-[248px]">
                  <img className="absolute w-44 h-[199px] top-0.5 left-2.5" alt="Subtract" src={subtract4} />
                  <img className="absolute w-44 h-[199px] top-0.5 left-2.5" alt="Subtract" src={subtract4} />
                </div>
                <div>
                  <img className="absolute w-44 h-[199px] top-0.5 left-2.5 " alt="Subtract" src={subtract3} />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute w-[150px] h-[20px] top-[355px] left-[300px] font-raleway font-bold text-white text-4xl leading-[20px] whitespace-nowrap cursor-pointer"
          onClick={() => navigate("/landingpage")}>
            Cricklytics
          </div>
          <img
                  src={Picture312Image}
                  alt="Picture3 1 2"
                  loading="lazy"
                  className="absolute left-[260px] top-[350px] w-[30px] h-[30px] object-cover cursor-pointer"
                  onClick={() => navigate("/landingpage")}
                />
          <img className="absolute w-[30px] h-[71px] top-[340px] left-[1730px]" alt="Jam info" src={jamInfo} />
        </div>
        <div className="absolute w-[2386px] h-[4752px] top-[4536px] left-[110px] rounded-md overflow-hidden border border-dashed border-[#9747ff]">
          <ElementEeceddIcc className="!absolute !left-[4041px] !top-[-2820px]" />
        </div>
        <img
          className="absolute w-[2346px] h-[2346px] top-[8618px] left-[4261px]"
          alt="Element ICC"
          src={ee85c7eddIccCricketWorldCupChampionship1}
        />
        <div className="absolute w-[1427px] h-[1239px] top-[2943px] left-[49px]">
          <div className="absolute w-[644px] h-[581px] top-0 left-0 bg-[#142136] rounded-[69px]" />
          <div className="absolute w-[644px] h-[581px] top-[658px] left-[3px] bg-[#142136] rounded-[69px]" />
          <div className="absolute w-[644px] h-[581px] top-2 left-[783px] bg-[#142136] rounded-[69px]" />
          <div className="absolute w-[644px] h-[581px] top-[658px] left-[783px] bg-[#142136] rounded-[69px]" />
          <InteractiveButton
            id="view-result-1"
            className="absolute w-[643px] h-[121px] top-[1118px] left-1 bg-[#4cc5dc] rounded-b-[69px] shadow-button-inset text-5xl"
            onClick={() => navigate("/Winner23")}
          >
            VIEW RESULT
          </InteractiveButton>
          <InteractiveButton
            id="view-result-2"
            className="absolute w-[643px] h-[121px] top-[1118px] left-[784px] bg-[#4cc5dc] rounded-b-[69px] shadow-button-inset text-5xl"
            onClick={() => navigate("/winner")}
          >
            VIEW RESULT
          </InteractiveButton>
          <InteractiveButton
            id="view-result-3"
            className="absolute w-[643px] h-[117px] top-[472px] left-[784px] bg-[#4cc5dc] rounded-b-[69px] shadow-button-inset text-5xl"
            onClick={() => navigate("/winner24")}
          >
            VIEW RESULT
          </InteractiveButton>
          <InteractiveButton
            id="check-now-1"
            className="absolute w-[643px] h-[117px] top-[472px] left-1 bg-[#4cc5dc] rounded-b-[69px] shadow-button-inset text-5xl"
            onClick={() => navigate("/Winner25")}
          >
            CHECK NOW
          </InteractiveButton>
          <div className="absolute w-[173px] h-[35px] top-[161px] left-[1028px] font-bebas-neue text-[#f09e64] text-2xl text-center tracking-[2.4px] leading-[64px] [-webkit-text-stroke:1px_#ed8a48]">
            CRICKLYTICS
          </div>
          <div className="absolute w-[173px] h-[35px] top-[821px] left-[1028px] font-bebas-neue text-[#f09e64] text-2xl text-center tracking-[2.4px] leading-[64px] [-webkit-text-stroke:1px_#ed8a48]">
            CRICKLYTICS
          </div>
          <div className="absolute w-[173px] h-[35px] top-[821px] left-[220px] font-bebas-neue text-[#f09e64] text-2xl text-center tracking-[2.4px] leading-[64px] [-webkit-text-stroke:1px_#ed8a48]">
            CRICKLYTICS
          </div>
          <img className="absolute w-[75px] h-[34px] top-[258px] left-[1076px]" alt="2024" src={x2024} />
          <img className="absolute w-[74px] h-[34px] top-[919px] left-[1076px]" alt="2022" src={x2022} />
          <img className="absolute w-[74px] h-[34px] top-[919px] left-[260px]" alt="2023" src={x2023} />
          <p className="absolute w-[563px] h-[98px] top-[330px] left-[53px] font-merriweather-sans text-white text-6xl text-center leading-[78px]">
            Categories Of 2025
          </p>
          <p className="absolute w-[563px] h-[98px] top-[330px] left-[820px] font-merriweather-sans text-white text-6xl text-center leading-[78px]">
            Winner of 2024
          </p>
          <p className="absolute w-[563px] h-[98px] top-[980px] left-[53px] font-merriweather-sans text-white text-6xl text-center leading-[78px]">
            Winner of 2023
          </p>
          <p className="absolute w-[563px] h-[98px] top-[980px] left-[820px] font-merriweather-sans text-white text-6xl text-center leading-[78px]">
            Winner of 2022
          </p>
          <img
            className="absolute w-[234px] h-[234px] top-[57px] left-[190px] object-cover"
            alt="App"
            src={app1288929611}
          />
        </div>
      </div>
    </div>
  );
};

export default Awards;