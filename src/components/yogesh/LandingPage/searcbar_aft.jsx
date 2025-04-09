import React from 'react';
import { Search } from 'lucide-react';
// import umpireImg from '../assets/images/umpire.png'; // Make sure this path is correct
import umpireaft from "../../../assets/yogesh/LandingPage/umpire-aft.png";
function SearchBarAft() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#021625] px-4">
      <div className="flex flex-col items-center">
        {/* Search Input */}
        <div className="flex items-center bg-gray-600 rounded-full px-4 py-2 w-full max-w-xl relative mb-5">
          {/* Umpire Image */}
          <img
            src={umpireaft}
            alt="Umpire"
            className="w-14 h-14 rounded-full absolute -left-16 top-1/2 transform -translate-y-1/2"
          />

          {/* Search Icon */}
          <div className="flex items-center justify-center w-8 h-8 border-2 border-cyan-400 rounded-full mr-3">
            <Search className="text-black" size={18} />
          </div>

          {/* Input */}
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none text-white w-full placeholder-white"
          />
        </div>

        {/* Tags Section */}
        <div className="flex gap-4 flex-wrap justify-center">
          {['Team', 'Player', 'club', 'Members'].map((tag) => (
            <button
              key={tag}
              className="bg-gray-200 text-black font-bold px-5 py-1.5 rounded-full hover:bg-gray-300 transition duration-200"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchBarAft;
