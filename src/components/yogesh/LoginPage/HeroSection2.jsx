import React from "react";
import aboutimg from "../../../assets/yogesh/login/about.png";  
import cricketbg from "../../../assets/yogesh/login/2-removebg-preview 1.png";  

const HeroSection2 = ({ isActive }) => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0F618D] to-[#041B27] px-10 relative">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="relative w-full md:w-1/2 flex justify-center  mt-24">
          <img src={aboutimg} alt="Stadium Background" className="w-1/2 rounded-lg shadow-lg" />
        </div>
        <div className="w-full md:w-1/2 text-white px-8 text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4 font-['Alegreya']">About Us</h1>
          <p className="text-lg opacity-80 leading-relaxed font-['Alegreya']">
          The time of to play or the time to watch the league of match
          according to our comfort and the instance score of the match
          without delay her the we to keep you update on the score of t
          the match.The time of to play or the time to watch the league 
          according to our comfort and the instance score of the match
          without delay her the we to keep you update on the score of 
          the match
          </p>
        </div>
      </div>
      {/* Cricket Player Illustration */}
      <div className="absolute bottom-5 right-5">
        <img src={cricketbg} alt="Cricket Player" className="w-40 md:w-52" />
      </div>
    </div>



  );
};

export default HeroSection2;
