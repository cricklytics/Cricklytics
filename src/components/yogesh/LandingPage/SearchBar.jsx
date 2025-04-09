import React, { useState } from 'react';
import { Search } from 'lucide-react';
import umpire from "../../../assets/yogesh/LandingPage/umpire.png";
import umpireaft from "../../../assets/yogesh/LandingPage/umpire-aft.png";


const SearchBar = () => {
  const [showSearch, setShowSearch] = useState(false);

  const handleToggle = () => {
    setShowSearch(!showSearch);
  };

  return (
    <div className="flex items-center justify-center h-screen -mt-35">
          
      {!showSearch ? (
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={handleToggle}
        >
          <img src={umpire} alt="Umpire" className="w-14 h-14 object-contain" />
          <div className="w-14 h-14 rounded-full border-4 border-cyan-500 flex items-center justify-center">
            <Search className="text-white w-6 h-6" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center bg-[#021625] rounded-xl p-6 w-full max-w-xl text-white">
          <div className="flex items-center gap-3 mb-4 w-full">
          <img src={umpireaft} alt="Umpire" className="w-12 h-10 object-contain cursor-pointer" onClick={handleToggle} />
            <div className="flex items-center bg-gray-700 rounded-full px-4 py-2 w-full">
              <div className="w-8 h-8 rounded-full border-4 border-cyan-500 flex items-center justify-center mr-2">
                <Search className="text-white w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-white w-full"
              />
            </div>
          </div>

          <div className="flex gap-3 flex-wrap w-full justify-center">
            {['Team', 'Player', 'Club', 'Members'].map((tag) => (
              <button
                key={tag}
                className="bg-gray-200 text-black font-semibold px-4 py-1 rounded-full hover:bg-gray-300"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
