import React from 'react';
import Picture312Image from '../../assets/pawan/PlayerProfile/picture-312.png';
import VectorImage from '../../assets/pawan/PlayerProfile/jam-info.svg';
import FrameImage from '../../assets/pawan/PlayerProfile/right-11.png';
import { useNavigate } from "react-router-dom";

const Frame1321317519 = () => {

    const navigate = useNavigate();

  return (
    <div>
      {/* Cricklytics Text */}
      <div
        className="absolute left-[30px] top-[6px] w-[50px] h-[20px] text-white font-raleway font-bold text-[20px] leading-[100%] text-left whitespace-pre-wrap
        cursor-pointer"
        onClick={() => navigate("/landingpage")}>
        Cricklytics
      </div>

      {/* Picture3 1 2 Image */}
      <img
        src={Picture312Image}
        alt="Picture3 1 2"
        loading="lazy"
        className="absolute left-[5px] top-[6px] w-[20px] h-[20px] object-cover cursor-pointer" onClick={() => navigate("/landingpage")}
      />

      {/* JamInfo Container */}
      <div
        className="absolute right-[20px] top-[1px] w-[20px] h-[20px] object-cover"
      >
        <img
          src={VectorImage}
          alt="Vector"
          loading="lazy"
          className="absolute left-[6px] top-[1px] w-[62.5px] h-[59.17px]"
        />
      </div>

      {/* Frame 1321317522 Image */}
      <img
        src={FrameImage}
        alt="Frame 1321317522"
        loading="lazy"
        className="absolute left-[1px] top-[30px] w-[40px] h-[53px] cursor-pointer "onClick={() => navigate("/awards")}
      />
    </div>
  );
};

export default Frame1321317519;