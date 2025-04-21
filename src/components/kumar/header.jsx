import React from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/kumar/logo.png';

const HeaderComponent = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/landingpage');
  };

  return (
    <div className="flex justify-between items-center p-4 rounded-lg mb-5">
      <div
        className="flex items-center gap-4 cursor-pointer select-none"
        onClick={handleClick}
      >
        <img
          src={logo}
          alt="Cricklytics Logo"
          className="h-10 object-contain block select-none"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = logo;
          }}
        />
        <span className="text-2xl font-bold text-white whitespace-nowrap text-shadow-[0_0_8px_rgba(93,224,230,0.4)]">
          Cricklytics
        </span>
      </div>
    </div>
  );
};

export default HeaderComponent;
