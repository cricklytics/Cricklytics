import React from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/kumar/logo.png';
import FrameImage from '../../assets/kumar/right-chevron.png';

const HeaderComponent = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/landingpage');
  };

  const handleBackClick = () => {
    navigate(-1); // Go back in history
  };

  return (
    <div className="flex justify-between items-center p-4 rounded-lg mb-5">
      <div className="flex flex-col items-start gap-2">
        <div
          className="flex items-center gap-4 cursor-pointer select-none"
          onClick={handleLogoClick}
        >
          <img
            src={logo}
            alt="Cricklytics Logo"
            className="h-7 w-7 md:h-10 object-contain block select-none"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = logo;
            }}
          />
          <span className="text-2xl font-bold text-white whitespace-nowrap text-shadow-[0_0_8px_rgba(93,224,230,0.4)]">
            Cricklytics
          </span>
        </div>
        <img
          src={FrameImage}
          alt="Frame 1321317522"
          loading="lazy"
          className="w-10 h-10 -scale-x-100 cursor-pointer mt-[5px] ml-[5px]" 
          onClick={() => navigate("/landingpage")}
        />
      </div>
    </div>
  );
};

export default HeaderComponent;
