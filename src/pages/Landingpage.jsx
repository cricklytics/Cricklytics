import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaUser } from "react-icons/fa";
import Sidebar from "../components/sophita/HomePage/Sidebar";
import mImg from '../assets/sophita/HomePage/player.png';
import alike from '../assets/yogesh/login/heartafter.png';
import blike from '../assets/yogesh/login/heartbefore.png';
import share from '../assets/yogesh/login/share.png';
import fr1 from '../assets/yogesh/login/friends1.jpg';
import fr2 from '../assets/yogesh/login/friends2.jpg';
import comment from '../assets/yogesh/login/msg.png';
import SearchBar from '../components/yogesh/LandingPage/SearchBar';
 
const highlightsData = [
  {
    id: 1,
    image: "https://img.youtube.com/vi/AFEZzf9_EHk/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/AFEZzf9_EHk?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0",
    title: "Rohit Sharma Hits 140!"
  },
  {
    id: 2,
    image: "https://img.youtube.com/vi/pQ5xEiZ-5IE/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/pQ5xEiZ-5IE?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0",
    title: "England v New Zealand Final"
  },
  {
    id: 3,
    image: "https://img.youtube.com/vi/Mk7KPsFtK8k/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/Mk7KPsFtK8k?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0",
    title: "Sears 5 Wicket Haul"
  },
  {
    id: 4,
    image: "https://img.youtube.com/vi/swk1fTGGjh0/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/swk1fTGGjh0?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0",
    title: "India vs New Zealand"
  },
  {
    id: 5,
    image: "https://images.icc-cricket.com/image/upload/t_ratio16_9-size40/v1729721261/prd/czkogpplpspzflo5pvhe",
    videoUrl: "https://www.youtube.com/embed/gtaYTRe2Qtw?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0",
  },
  {
    id: 6,
    image: "https://img.youtube.com/vi/H4-pQDMn_m4/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/H4-pQDMn_m4?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0",
  },
];
 
const Landingpage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [likedVideos, setLikedVideos] = useState({});
  const [hovered, setHovered] = useState(null);
  const [highlightVisible, setHighlightVisible] = useState(false);
  const [isPriceVisible, setIsPriceVisible] = useState(false);
  const [profileStoryVisible, setProfileStoryVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
 
  const highlightRef = useRef(null);
  const searchBarRef = useRef(null);
 
  const togglePriceVisibility = (e) => {
    e.preventDefault();
    setIsPriceVisible((prev) => {
      const next = !prev;
      if (next) setHighlightVisible(true);
      return next;
    });
  };
 
  useEffect(() => {
    const highlightEl = highlightRef.current;
 
    const showHighlightOnScroll = () => {
      if (highlightEl && highlightEl.scrollTop > 0) {
        setHighlightVisible(true);
      }
    };
 
    if (highlightEl) {
      highlightEl.addEventListener("scroll", showHighlightOnScroll);
    }
 
    const timeoutId = setTimeout(() => {
      setHighlightVisible(true);
    }, 3000);
 
    return () => {
      if (highlightEl) {
        highlightEl.removeEventListener("scroll", showHighlightOnScroll);
      }
      clearTimeout(timeoutId);
    };
  }, []);
 
  useEffect(() => {
    if (highlightVisible && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [highlightVisible]);
 
  const handleMainClick = (e) => {
    if (
      isPriceVisible ||
      profileStoryVisible || // ✅ Fix: Don't hide if profile story is open
      (highlightRef.current && highlightRef.current.contains(e.target)) ||
      (searchBarRef.current && searchBarRef.current.contains(e.target))
    ) {
      return;
    }
    setHighlightVisible(false);
  };
 
  const toggleLike = (id) => {
    setLikedVideos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
 
  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setProfileStoryVisible(true);
  };
 
  return (
    <div className="bg-[#02101E]">
      <div
        id="main"
        onClick={handleMainClick}
        className={`fixed inset-0 z-10 bg-[#02101E] transition-all duration-700 ease-in-out ${highlightVisible ? "bg-opacity-40 backdrop-blur-md" : ""}`}
      >
        {/* Profile Story Modal */}
        {profileStoryVisible && selectedProfile && (
          <div className="fixed inset-0 flex justify-center items-center bg-opacity-60 backdrop-blur-md z-[9999]">
            <div className="bg-gradient-to-b from-[#0D171E] to-[#283F79] p-6 rounded-lg shadow-lg w-[28%] max-w-lg">
              <button
                className="absolute top-4 right-4 text-2xl text-white cursor-pointer"
                onClick={() => setProfileStoryVisible(false)}
              >
                X
              </button>
              <div className="flex justify-center items-center flex-col">
                <div className="flex w-full h-fit px-2 gap-5 items-center">
                  <img
                    src={selectedProfile.image}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <h2 className="text-white text-2xl">{selectedProfile.name}</h2>
                    <p className="text-white mt-2">Viewing story...</p>
                  </div>
                </div>
                <div className="w-full h-100 rounded-lg bg-yellow-300 m-5"></div>
                <div className="w-full flex justify-between items-center gap-5">
                  <input
                    type="text"
                    placeholder="Reply"
                    className="bg-transparent border border-white border-[2px] w-10 h-10 rounded-3xl text-white w-full pl-5"
                  />
                  <button
                    className="w-fit p-1 px-3 text-center rounded-2xl text-xl text-white cursor-pointer bg-[linear-gradient(120deg,_#000000,_#001A80)]"
                    onClick={() => setProfileStoryVisible(false)}
                  >
                    send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
 
        {/* Navbar */}
        <nav className="fixed top-0 z-[1000] h-30 flex w-full items-center justify-between bg-gradient-to-b from-[#02101E] to-[#040C15] px-5 py-2.5 text-white">
          <div className="flex items-center">
            <button
              className="mt-6 flex cursor-pointer flex-col gap-1 p-2.5"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
            >
              <div className="h-1 w-10 rounded bg-white"></div>
              <div className="h-1 w-8 rounded bg-white"></div>
              <div className="h-1 w-5 rounded bg-white"></div>
            </button>
            <span className="ml-8 mt-6 text-3xl font-bold">Cricklytics</span>
          </div>
 
          <div className="fixed inset-0 -z-10 flex items-center justify-center">
            <img
              src={mImg}
              alt="Player"
              className={`h-full w-full -z-[-989] object-contain transition-all duration-300 ${highlightVisible ? "blur-md brightness-75" : ""}`}
            />
          </div>
 
          <div className="mt-6 flex items-center gap-8">
            <div ref={searchBarRef} className="z-[2000] mt-5 h-22 w-fit">
              <SearchBar />
            </div>
            <span className="text-2xl font-bold cursor-pointer hover:text-[#3edcff]">Contact</span>
            <FaBell className="cursor-pointer hover:scale-110" size={24} />
            <FaUser className="cursor-pointer hover:scale-110" size={24} />
          </div>
        </nav>
 
        <Sidebar isOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
 
        {/* Content */}
        <div className={`absolute z-[1010] flex flex-col items-center p-[1rem] transition-all duration-700 ease-in-out ${highlightVisible ? "top-23" : "top-[50%]"} w-full`} style={{ height: "calc(100vh - 5rem)" }}>
          <div className={`sticky w-[80%] top-0 z-20 bg-[rgba(2,16,30,0.7)] bg-opacity-40 backdrop-blur-md pb-4 ${highlightVisible ? "opacity-100" : "opacity-0"}`}>
            <div className="w-full flex justify-center pt-4 caret-none">
              <div className="w-[50%] flex justify-center gap-3 ml-5 text-white text-xl">
                {[{ image: fr1, name: 'Friend 1' }, { image: fr2, name: 'Friend 2' }, { image: fr1, name: 'Friend 3' }].map((profile, idx) => (
                  <button
                    key={idx}
                    className="w-20 h-20 bg-yellow-900 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ Prevent highlight hide
                      handleProfileClick(profile);
                    }}
                  >
                    <img src={profile.image} className="w-20 h-20 rounded-full" alt="Friend" />
                  </button>
                ))}
              </div>
            </div>
 
            {/* Tabs */}
            <div className="w-full flex justify-center mt-4">
              <div className="w-[50%] flex justify-around text-white text-xl underline cursor-pointer">
                <span className="text-2xl font-bold hover:text-[#800080]">For You</span>
                <span className="text-2xl font-bold hover:text-[#800080]">Following</span>
                <span className="text-2xl font-bold hover:text-[#800080]">Reels</span>
              </div>
            </div>
          </div>
 
          {/* Highlights */}
          <div
            id="highlight"
            ref={highlightRef}
            className={`transition-opacity duration-700 ease-in-out flex justify-center flex-wrap w-full h-full overflow-y-auto scrollbar-hide gap-4 ${highlightVisible ? "opacity-100" : "opacity-0"} flex-grow`}
          >
            {highlightsData.map((item) => (
              <div
                key={item.id}
                className="relative w-[45%] bg-gradient-to-b from-[#0A5F68] to-[#000000] aspect-video rounded-xl mx-100 my-10 overflow-hidden shadow-2xl border border-white/20 group cursor-pointer transition-transform hover:scale-[1.02]"
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
                    className="absolute inset-0 w-full h-full p-5 pb-20 brightness-125"
                  />
                ) : (
                  <img
                    src={item.image}
                    alt={`Thumbnail ${item.id}`}
                    className="w-full h-full object-cover brightness-110 p-5 pb-20"
                  />
                )}
 
                <div className="absolute h-full inset-0 flex flex-col items-start justify-end">
                  <div className="flex justify-evenly items-end h-full w-60 mr-5 mb-8">
                    <button onClick={() => toggleLike(item.id)} className="z-10">
                      <img src={likedVideos[item.id] ? alike : blike} alt="Like" className="w-[2rem] h-[2rem]" />
                    </button>
                    <img src={comment} alt="Comment" className="w-[2rem] h-[2rem] z-10" />
                    <img src={share} alt="Share" className="w-[2rem] h-[2rem] z-7" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default Landingpage;