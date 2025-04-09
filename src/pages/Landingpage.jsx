import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaUser, FaPlay } from "react-icons/fa";
import Sidebar from "../components/sophita/HomePage/Sidebar";
import mImg from '../assets/sophita/HomePage/player.png';
import alike from '../assets/yogesh/login/thumbs-aft.svg';
import blike from '../assets/yogesh/login/thumbs-bef.svg';
import share from '../assets/yogesh/login/share-2-svgrepo-com.svg';
import comment from '../assets/yogesh/login/comments-svgrepo-com.svg';
import SearchBar from '../components/yogesh/LandingPage/SearchBar';


const highlightsData = [
  {
    id: 1,
    image: "https://img.youtube.com/vi/AFEZzf9_EHk/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/AFEZzf9_EHk?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0",
    title: "Rohit Sharma Hits 140! | India v Pakistan - Match Highlights | ICC Cricket World Cup 2019"
  },
  {
    id: 2,
    image: "https://img.youtube.com/vi/pQ5xEiZ-5IE/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/pQ5xEiZ-5IE?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0",
    title: "Cricket World Cup 2019 Final: England v New Zealand | Match Highlights"
  },
  {
    id: 3,
    image: "https://img.youtube.com/vi/Mk7KPsFtK8k/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/Mk7KPsFtK8k?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0",
    title: "Sears 5 Wicket Haul And Bracewell Wonder Catch | 3rd ODI"
  },
  {
    id: 4,
    image: "https://img.youtube.com/vi/swk1fTGGjh0/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/swk1fTGGjh0?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0",
    title: "India vs New Zealand Match Highlights | Cricket"
  },
  {
    id: 5,
    image: "https://images.icc-cricket.com/image/upload/t_ratio16_9-size40/v1729721261/prd/czkogpplpspzflo5pvhe",
    videoUrl: "https://www.youtube.com/embed/gtaYTRe2Qtw?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0",
  },
  {
    id: 6,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOqqxtvvn_d5iH61lfELTNN2E1QiK2C_IDQA&s",
    videoUrl: "https://www.youtube.com/embed/H4-pQDMn_m4?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0",
  },
];

const Landingpage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [highlightVisible, setHighlightVisible] = useState(false);
  const highlightRef = useRef(null);

  useEffect(() => {
    const highlightEl = highlightRef.current;
    const handleScroll = () => {
      if (highlightEl.scrollTop > 0) {
        setHighlightVisible(true);
      }
    };

    if (highlightEl) {
      highlightEl.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (highlightEl) {
        highlightEl.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleMainClick = (e) => {
    if (highlightRef.current && highlightRef.current.contains(e.target)) return;

    setHighlightVisible(false);
  };

  return (
    <html className="bg-[#02101E]">
    <div
      id="main"
      onClick={handleMainClick}
      className="h-dvh m-0 z-10 bg-[#02101E] overflow-hidden"
    >
      {/* Navbar */}
      <nav className="fixed top-0 z-[1000] flex w-full items-center justify-between bg-gradient-to-b from-[#02101E] to-[#040C15] px-5 py-2.5 text-white">
        {/* Left Section */}
        <div className="flex items-center">
          <button 
            className="mt-6 flex cursor-pointer flex-col gap-1 border-none bg-none p-2.5 outline-none"
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from bubbling to #main
              setMenuOpen(!menuOpen);
            }}
          >
            <div className="h-1 w-10 rounded bg-white"></div>
            <div className="h-1 w-8 rounded bg-white"></div>
            <div className="h-1 w-5 rounded bg-white"></div>
          </button>
          <span className="ml-8 mt-6 block cursor-pointer text-3xl font-bold text-white select-none">
            Cricklytics
          </span>
        </div>

        {/* Center Image */}
        <div className="fixed inset-0 -z-10 flex h-screen w-screen items-center justify-center overflow-hidden">
          <img 
            src={mImg} 
            alt="Player" 
            className="h-full z-30 w-full object-contain"
          />
        </div>

        {/* Right Section */}
        <div className="mt-6 flex items-center gap-8">
          <div className="group relative">
            <span className="block cursor-pointer text-2xl font-bold text-white transition-colors duration-300 hover:text-[#3edcff]">
              Contact
              <span className="absolute bottom-0 left-0 h-0.5 w-full origin-center scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100"></span>
            </span>
          </div>
          <FaBell className="cursor-pointer text-white transition-transform duration-200 hover:scale-110" size={24} title="Notifications" />
          <FaUser className="cursor-pointer text-white transition-transform duration-200 hover:scale-110" size={24} title="Profile" />
        </div>
      </nav>
      <Sidebar isOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
         <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[1000] w-[80%] max-w-xl">
          <SearchBar />
        </div>

       {/* Highlights */}
       <div className="z-[1010] absolute p-[1rem] bottom-0 top-[50%] h-full w-full overflow-hidden">
         <h1 className="font-bold text-white mb-3 text-lg">Highlights</h1>
         <div
           id="highlight"
           ref={highlightRef}
           className={`transition-opacity duration-700 ease-in-out flex justify-center flex-wrap w-full bg-[]] h-full overflow-y-auto scrollbar-hide gap-4 ${
             highlightVisible ? "opacity-100" : "opacity-0"
           }`}
         >
           {highlightsData.map((item) => (
             <div
               key={item.id}
               className="relative w-[45%] m-3 aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-black group cursor-pointer transition-transform hover:scale-[1.02]"
               onMouseEnter={() => setHovered(item.id)}
               onMouseLeave={() => setHovered(null)}
             >
               {hovered === item.id ? (
                 <iframe
                   src={item.videoUrl}
                   title={`Highlight ${item.id}`}
                   frameBorder="0"
                   allow="autoplay; encrypted-media"
                   allowFullScreen
                   className="absolute inset-0 w-full h-full"
                 />
               ) : (
                 <img
                   src={item.image}
                   alt={`Thumbnail ${item.id}`}
                   className="w-full h-full object-cover brightness-110"
                 />
               )}
 
               {/* Overlay */}
               <div className="absolute inset-0 flex flex-col items-end justify-center bg-black/30 transition-all">
                 <button onClick={() => setLiked(!liked)} className="m-1 z-10">
                   <img
                     src={liked ? alike : blike}
                     alt="Like"
                     className="w-[2.5rem] h-[2.5rem]"
                   />
                 </button>
                 <img src={comment} alt="Comment" className="w-[2.5rem] h-[2.5rem] m-4 z-10" />
                 <img src={share} alt="Share" className="w-[3rem] h-[3rem] m-4 z-10" />
 
                 {/* Watch button */}
                 <button
                   className="absolute left-5 bottom-5 flex items-center gap-2 px-4 py-2 bg-white/30 backdrop-blur-md text-white font-semibold rounded-full hover:bg-white/40 transition-all duration-300 shadow-lg"
                 >
                   <FaPlay />
                   Watch
                 </button>
               </div>
             </div>
           ))}
         </div>
       </div>
    </div>
    </html>
  );
};

export default Landingpage;
