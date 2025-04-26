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

import { db } from "../firebase"; // ✅ ADD FIREBASE
import { collection, getDocs } from "firebase/firestore"; // ✅ ADD FIRESTORE
 
 
const Landingpage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [likedVideos, setLikedVideos] = useState({});
  const [hovered, setHovered] = useState(null);
  const [highlightVisible, setHighlightVisible] = useState(false);
  const [isPriceVisible, setIsPriceVisible] = useState(false);
  const [profileStoryVisible, setProfileStoryVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const [highlightsData, setHighlightsData] = useState([]);
  const highlightRef = useRef(null);
  const searchBarRef = useRef(null);

  
  // ✅ Fetch highlights from Firebase Firestore
  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "highlights"));
        const highlights = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHighlightsData(highlights);
      } catch (err) {
        console.error("Error fetching highlights:", err);
      }
    };

    fetchHighlights();
  }, []);
 
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
            <div className="bg-gradient-to-b from-[#0D171E] to-[#283F79] p-6 rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[28%] max-w-lg">
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
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <h2 className="text-white text-xl md:text-2xl">{selectedProfile.name}</h2>
                    <p className="text-white mt-2 text-sm md:text-base">Viewing story...</p>
                  </div>
                </div>
                <div className="w-full h-64 md:h-96 rounded-lg bg-yellow-300 m-3 md:m-5"></div>
                <div className="w-full flex justify-between items-center gap-3 md:gap-5">
                  <input
                    type="text"
                    placeholder="Reply"
                    className="bg-transparent border border-white border-[2px] h-8 md:h-10 rounded-3xl text-white w-full pl-3 md:pl-5 text-sm md:text-base"
                  />
                  <button
                    className="w-fit p-1 px-2 md:px-3 text-center rounded-2xl text-sm md:text-xl text-white cursor-pointer bg-[linear-gradient(120deg,_#000000,_#001A80)]"
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
        <nav className="fixed top-0 z-[1000] h-20 md:h-30 flex w-full items-center justify-between bg-gradient-to-b from-[#02101E] to-[#040C15] px-3 md:px-5 py-2 text-white">
          <div className="flex items-center">
            <button
              className="mt-4 md:mt-6 flex cursor-pointer flex-col gap-1 p-1 md:p-2.5"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
            >
              <div className="h-0.5 md:h-1 w-6 md:w-10 rounded bg-white"></div>
              <div className="h-0.5 md:h-1 w-4 md:w-8 rounded bg-white"></div>
              <div className="h-0.5 md:h-1 w-3 md:w-5 rounded bg-white"></div>
            </button>
            <span className="ml-4 md:ml-8 mt-4 md:mt-6 text-xl md:text-3xl font-bold">Cricklytics</span>
          </div>
 
          <div className="fixed inset-0 -z-10 flex items-center justify-center">
            <img
              src={mImg}
              alt="Player"
              className={`h-full w-full -z-[-989] object-contain transition-all duration-300 ${highlightVisible ? "blur-md brightness-75" : ""}`}
            />
          </div>
 
          <div className="mt-4 md:mt-6 flex items-center gap-4 md:gap-8">
            <div ref={searchBarRef} className="z-[2000] mt-3 md:mt-5 h-16 md:h-22 w-fit">
              <SearchBar />
            </div>
            <span className="text-sm md:text-2xl font-bold cursor-pointer hover:text-[#3edcff] hidden sm:inline">Contact</span>
            <FaBell className="cursor-pointer hover:scale-110" size={24} />
            <FaUser className="cursor-pointer hover:scale-110" size={24} />
          </div>
        </nav>
 
        <Sidebar isOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
 
        {/* Content */}
        <div className={`absolute z-[1010] flex flex-col items-center p-2 md:p-[1rem] transition-all duration-700 ease-in-out ${highlightVisible ? "top-16 md:top-23" : "top-[50%]"} w-full`} style={{ height: "calc(100vh - 4rem)" }}>
          <div className={`sticky w-full md:w-[80%] top-0 z-20 bg-[rgba(2,16,30,0.7)] bg-opacity-40 backdrop-blur-md pb-2 md:pb-4 ${highlightVisible ? "opacity-100" : "opacity-0"}`}>
            <div className="w-full flex justify-center pt-2 md:pt-4 caret-none">
              <div className="w-full md:w-[50%] flex justify-center gap-2 md:gap-3 md:ml-5 text-white text-sm md:text-xl">
                {[{ image: fr1, name: 'Friend 1' }, { image: fr2, name: 'Friend 2' }, { image: fr1, name: 'Friend 3' }].map((profile, idx) => (
                  <button
                    key={idx}
                    className="w-12 h-12 md:w-20 md:h-20 bg-yellow-900 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ Prevent highlight hide
                      handleProfileClick(profile);
                    }}
                  >
                    <img src={profile.image} className="w-full h-full rounded-full" alt="Friend" />
                  </button>
                ))}
              </div>
            </div>
 
            {/* Tabs */}
            <div className="w-full flex justify-center mt-2 md:mt-4">
              <div className="w-full md:w-[50%] flex justify-around text-white text-sm md:text-xl underline cursor-pointer">
                <span className="text-base md:text-2xl font-bold hover:text-[#800080]">For You</span>
                <span className="text-base md:text-2xl font-bold hover:text-[#800080]">Following</span>
                <span className="text-base md:text-2xl font-bold hover:text-[#800080]">Reels</span>
              </div>
            </div>
          </div>
 
          {/* Highlights */}
          <div
            id="highlight"
            ref={highlightRef}
            className={`transition-opacity duration-700 ease-in-out flex justify-center flex-wrap w-full h-full overflow-y-auto scrollbar-hide gap-2 md:gap-4 ${highlightVisible ? "opacity-100" : "opacity-0"} flex-grow`}
          >
            {highlightsData.length > 0 ? highlightsData.map((item) => (
            <div
              key={item.id}
              className="relative w-full sm:w-[80%] md:w-[45%] bg-gradient-to-b from-[#0A5F68] to-[#000000] aspect-video rounded-lg md:rounded-xl mx-2 md:mx-100 my-4 md:my-10 overflow-hidden shadow-lg md:shadow-2xl border border-white/20 group cursor-pointer transition-transform hover:scale-[1.02]"
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered === item.id ? (
                <iframe
                  src={item.videoUrl}
                  title={`Highlight ${item.title}`}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full p-2 md:p-5 pb-12 md:pb-20 brightness-125"
                />
              ) : (
                <>
                <img
                  src={item.image}
                  alt={`Thumbnail ${item.title}`}
                  className="w-full h-full object-cover brightness-110 p-2 md:p-5 pb-12 md:pb-20"
                />
                <h3 className="absolute bottom-12 md:bottom-20 left-2 md:left-5 text-white text-sm md:text-lg font-bold">
                      {item.title}
                </h3>
                </>
              )}

              <div className="absolute h-full inset-0 flex flex-col items-start justify-end">
                <div className="flex justify-evenly items-end h-full w-40 md:w-60 mr-2 md:mr-5 mb-4 md:mb-8">
                  <button onClick={() => toggleLike(item.id)} className="z-10">
                    <img src={likedVideos[item.id] ? alike : blike} alt="Like" className="w-6 h-6 md:w-8 md:h-8" />
                  </button>
                  <img src={comment} alt="Comment" className="w-6 h-6 md:w-8 md:h-8 z-10" />
                  <img src={share} alt="Share" className="w-6 h-6 md:w-8 md:h-8 z-7" />
                </div>
              </div>
            </div>
          )) : (
            <p className="text-white mt-10">No highlights yet. Please add some!</p>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default Landingpage;