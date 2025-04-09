import React from "react";
import stadium from "../../../assets/yogesh/login/stadium.png";

function HeroSection4() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#CFF6F0] to-[#737373] text-black relative font-serif">
      <div className="absolute top-28 w-full text-center">
        <h1 className="text-5xl font-bold flex items-center justify-center font-['Alegreya']">
          Premium <span className="text-yellow-500 ml-2">⭐</span>
        </h1>
      </div>
      <div className="flex flex-col md:flex-row items-center text-black p-6 rounded-lg w-4/5 gap-10 mt-24">
        <div className="w-full md:w-1/2 flex flex-col items-start gap-y-6 mt-38 font-['Alegreya']">
          <ul className="text-lg w-full space-y-6">
            <li><p className="font-bold text-xl font-['Alegreya']">• Clubs</p><p className="text-white font-['Alegreya']">Body text for whatever you’d like to expand on the main point.</p></li>
            <li><p className="font-bold text-xl font-['Alegreya']">• My Cricket</p><p className="text-white font-['Alegreya']">Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes.</p></li>
            <li><p className="font-bold text-xl font-['Alegreya']">• Leader Board</p><p className="text-white font-['Alegreya']">Body text for whatever you’d like to add more to the main point. It provides details, explanations, and context.</p></li>
          </ul>
        </div>
        <div className="w-full md:w-1/2 flex justify-center mt-38">
          <img src={stadium} alt="Cricket" className="rounded-lg w-96 max-w-full h-auto shadow-lg" />
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <button className="bg-black text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-800 transition duration-300">
          Get Premium
        </button>
      </div>
    </div>
  );
}

export default HeroSection4;
