import React from "react";
import focusImage from "../../../assets/yogesh/login/focus-image.png";
import cricketbg3 from "../../../assets/yogesh/login/3_-removebg-preview 1.png"; 

const HeroSection3 = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-[#0a1f44] to-[#123456] p-6 relative overflow-hidden">
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-between text-white">
        <div className="max-w-md text-left">
          <h1 className="text-6xl font-bold text-white mb-4 font-['Alegreya']">Focus</h1>
          <p className="text-lg text-white leading-relaxed font-['Alegreya']">
            Cricket primarily focuses on strategy, skill, and teamwork, blending athleticism with tactical decision-making.The sport revolves around batting, bowling, and fielding, where teams compete to score and chase runs within a set number of overs or innings.
          </p>
        </div>
        <div className="relative max-w-sm  mt-34">
          <img src={focusImage} alt="Cricket Strategy" className="rounded-lg shadow-lg" />
        </div>
        <div className="absolute bottom-5 left-5 md:top-100 md:left-10">
          <img src={cricketbg3} alt="Cricket Player" className="w-32 md:w-40" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection3;
