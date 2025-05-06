import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaUser, FaSearch, FaComment, FaTimes, FaPaperPlane, FaPlus, FaUpload } from "react-icons/fa";
import { Search } from 'lucide-react'; 
import Sidebar from "../components/sophita/HomePage/Sidebar";
import mImg from '../assets/sophita/HomePage/player.png';
import alike from '../assets/yogesh/login/heartafter.png';
import blike from '../assets/yogesh/login/heartbefore.png';
import share from '../assets/yogesh/login/share.png';
import fr1 from '../assets/yogesh/login/friends1.jpg';
import fr2 from '../assets/yogesh/login/friends2.jpg';
import comment from '../assets/yogesh/login/msg.png';
import SearchBar from '../components/yogesh/LandingPage/searcbar_aft';
import AIAssistance from "../components/sophita/HomePage/AIAssistance";
import { useNavigate } from "react-router-dom";

import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
 
const Landingpage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [likedVideos, setLikedVideos] = useState({});
  const [hovered, setHovered] = useState(null);
  const [highlightVisible, setHighlightVisible] = useState(false);
  const [isPriceVisible, setIsPriceVisible] = useState(false);
  const [profileStoryVisible, setProfileStoryVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileImages, setProfileImages] = useState([
    { id: 1, image: fr1, name: 'Friend 1' },
    { id: 2, image: fr2, name: 'Friend 2' },
    { id: 3, image: fr1, name: 'Friend 3' }
  ]);
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [activeTab, setActiveTab] = useState("forYou"); // "forYou", "following", "reels"
 
  const [highlightsData, setHighlightsData] = useState([]);
  const [followersData, setFollowersData] = useState([
    { id: 1, name: "Virat Kohli", image: fr1, isFollowing: true },
    { id: 2, name: "MS Dhoni", image: fr2, isFollowing: true },
    { id: 3, name: "Rohit Sharma", image: fr1, isFollowing: false },
    { id: 4, name: "Jasprit Bumrah", image: fr2, isFollowing: true },
    { id: 5, name: "Hardik Pandya", image: fr1, isFollowing: false },
  ]);
  const [reelsData, setReelsData] = useState([
    { id: 1, title: "Best Wickets of IPL 2023", videoUrl: "https://example.com/reel1", likes: 1245 },
    { id: 2, title: "Top 6s in World Cup", videoUrl: "https://example.com/reel2", likes: 876 },
    { id: 3, title: "Fielding Masterclass", videoUrl: "https://example.com/reel3", likes: 543 },
    { id: 4, title: "Captaincy Moments", videoUrl: "https://example.com/reel4", likes: 321 },
    { id: 3, title: "Fielding Masterclass", videoUrl: "https://example.com/reel3", likes: 543 },
    { id: 4, title: "Captaincy Moments", videoUrl: "https://example.com/reel4", likes: 321 },
  ]);

  const highlightRef = useRef(null);
  const searchBarRef = useRef(null);
  const fileInputRef = useRef(null);
  const reelInputRef = useRef(null);
 
  const [isAIExpanded, setIsAIExpanded] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [activeChatTab, setActiveChatTab] = useState('primary');
  const [messageInput, setMessageInput] = useState('');
  const searchRef = useRef(null);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  const stickyHeaderRef = useRef(null);

  const handleToggleSearch = () => {
    setShowSearch(!showSearch);
  };
 
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Add your message sending logic here
      console.log("Message sent:", messageInput);
      setMessageInput('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        const messageIcon = document.querySelector('.message-icon');
        if (!messageIcon?.contains(event.target)) {
          setShowChat(false);
        }
      }
    };
 
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowSearch(false);
        setShowChat(false);
      }
      if (event.key === 'Enter' && showChat && messageInput) {
        handleSendMessage();
      }
    };
 
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
 
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [messageInput]);

  // Sample chat data
  const chatData = {
    primary: [
      {
        id: 1,
        name: "John Doe",
        lastMessage: "Hey, how are you doing?",
        time: "2h",
        unread: true,
        avatar: "bg-gradient-to-r from-[#5DE0E6] to-[#004AAD]"
      },
      {
        id: 2,
        name: "Jane Smith",
        lastMessage: "Let's meet tomorrow!",
        time: "1d",
        unread: false,
        avatar: "bg-gradient-to-r from-pink-500 to-yellow-500"
      }
    ],
    general: [
      {
        id: 3,
        name: "Team Cricklytics",
        lastMessage: "New features coming soon!",
        time: "3d",
        unread: false,
        avatar: "bg-gradient-to-r from-purple-500 to-red-500"
      }
    ],
    requests: []
  };
 
  // Fetch highlights from Firebase Firestore
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
    // Don't hide highlights if clicking on specific elements OR within the sticky header
    if (
      isPriceVisible ||
      profileStoryVisible ||
      (highlightRef.current && highlightRef.current.contains(e.target)) ||
      (searchBarRef.current && searchBarRef.current.contains(e.target)) ||
      (stickyHeaderRef.current && stickyHeaderRef.current.contains(e.target)) || // <-- Add this check
     //  e.target.closest('.profile-image-container') || // This is now covered by stickyHeaderRef, can be removed if desired
      e.target === fileInputRef.current
    ) {
      return; // Do nothing if click is inside these areas
    }
    // Only hide if the click is truly on the background
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
 
  const handleAddImageClick = (e, profileId) => {
    e.stopPropagation();
    setEditingProfileId(profileId);
    fileInputRef.current.click();
    setHighlightVisible(true); // Ensure highlights remain visible
  };

  const handleReelUploadClick = () => {
    reelInputRef.current.click();
  };

  const handleReelUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Here you would typically upload to your backend
      const newReel = {
        id: reelsData.length + 1,
        title: `My Reel ${reelsData.length + 1}`,
        videoUrl: URL.createObjectURL(file),
        likes: 0
      };
      setReelsData(prev => [newReel, ...prev]);
    }
  };
 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = event.target.result;
        setProfileImages(prev => prev.map(profile =>
          profile.id === editingProfileId
            ? { ...profile, image: newImage }
            : profile
        ));
      };
      reader.readAsDataURL(file);
    }
    setEditingProfileId(null);
  };

  const toggleFollow = (id) => {
    setFollowersData(prev => 
      prev.map(follower => 
        follower.id === id 
          ? { ...follower, isFollowing: !follower.isFollowing } 
          : follower
      )
    );
  };
 
  return (
    <div className="bg-[#02101E]">
      <div
        id="main"
        onClick={handleMainClick}
        className={`fixed inset-0 z-10 bg-[#02101E] transition-all duration-700 ease-in-out ${highlightVisible ? "bg-opacity-40 backdrop-blur-md" : ""}`}
      >
        {/* Hidden file inputs */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <input
          type="file"
          ref={reelInputRef}
          onChange={handleReelUpload}
          accept="video/*"
          style={{ display: 'none' }}
        />
 
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
 
          <div className="mt-1 md:mt-9  flex items-center gap-4 md:gap-8">
            <div className="z-[2000] mt-9  md:mt-5 h-16 md:h-22 w-fit">
              <button className="w-8 h-8 md:w-14 md:h-14 rounded-full border-4 border-cyan-500 flex items-center justify-center" onClick={() => navigate("/search-aft")}>
                <Search className="text-white w-4 h-4 md:w-6 md:h-6" />
              </button>
            </div>
            <span className="text-sm md:text-2xl font-bold cursor-pointer hover:text-[#3edcff] hidden sm:inline">Contact</span>
            <FaBell className="cursor-pointer hover:scale-110" size={24} />

             {/* Message Icon with dropdown */}
          <div className="relative">
            <FaComment
              className="message-icon cursor-pointer text-white transition-transform duration-200 hover:scale-110"
              size={24}
              onClick={() => setShowChat(!showChat)}
            />
           
            {showChat && (
              <div
                ref={chatRef}
                className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-[1050] border border-gray-200 overflow-hidden"
              >
                {/* Chat Header */}
                <div className="bg-white p-3 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#5DE0E6] to-[#004AAD] flex items-center justify-center mr-2">
                      <FaComment className="text-white" size={14} />
                    </div>
                    <h3 className="font-semibold text-gray-800">Messages</h3>
                  </div>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>
 
                {/* Search Bar */}
                <div className="p-2 border-b border-gray-200">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={12} />
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full bg-gray-100 rounded-lg py-1.5 pl-9 pr-3 text-sm text-black focus:outline-none"
                    />
                  </div>
                </div>
 
                {/* Chat List */}
                <div className="flex-1 overflow-y-auto h-64">
                  {chatData[activeChatTab]?.length > 0 ? (
                    chatData[activeChatTab].map((chat) => (
                      <div key={chat.id} className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center">
                        <div className={`w-10 h-10 rounded-full ${chat.avatar} mr-3`}></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className={`font-semibold text-sm ${chat.unread ? 'text-black' : 'text-gray-800'}`}>
                              {chat.name}
                            </span>
                            <span className="text-xs text-gray-400">{chat.time}</span>
                          </div>
                          <p className={`text-xs ${chat.unread ? 'font-medium text-black' : 'text-gray-500'} truncate`}>
                            {chat.lastMessage}
                          </p>
                        </div>
                        {chat.unread && (
                          <div className="w-2 h-2 rounded-full bg-[#5DE0E6] ml-2"></div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 px-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <FaComment className="text-gray-400" size={20} />
                      </div>
                      <h4 className="font-medium text-gray-700 mb-1">
                        {activeChatTab === 'requests'
                          ? "No message requests"
                          : "No messages yet"}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {activeChatTab === 'requests'
                          ? "When someone messages you who you don't follow, it'll appear here"
                          : "Start a conversation with your friends"}
                      </p>
                    </div>
                  )}
                </div>
 
                {/* Message Input (visible only in primary tab) */}
                {activeChatTab === 'primary' && (
                  <div className="p-2 border-t border-gray-200 bg-white">
                    <div className="flex items-center">
                      <input
                        type="text"
                        placeholder="Write a message..."
                        className="flex-1 border rounded-l-lg py-2 px-3 text-sm text-black-400 focus:outline-none"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                      />
                      <button
                        className="bg-[#5DE0E6] text-white py-2 px-4 rounded-r-lg hover:bg-[#4acfd6] flex items-center"
                        onClick={handleSendMessage}
                      >
                        <FaPaperPlane size={14} />
                      </button>
                    </div>
                  </div>
                )}
 
                {/* Bottom Navigation */}
                <div className="p-2 border-t border-gray-200 bg-white flex justify-around z-50">
                  <button
                    className={`hover:text-[#5DE0E6] p-2 ${activeChatTab === 'requests' ? 'text-[#5DE0E6] border-b-2 border-[#5DE0E6]' : 'text-gray-700'}`}
                    onClick={() => setActiveChatTab('requests')}
                  >
                    <span className="text-xs">Requests</span>
                  </button>
                  <button
                    className={`hover:text-[#5DE0E6] p-2 ${activeChatTab === 'primary' ? 'text-[#5DE0E6] border-b-2 border-[#5DE0E6]' : 'text-gray-700'}`}
                    onClick={() => setActiveChatTab('primary')}
                  >
                    <span className="text-xs">Primary</span>
                  </button>
                  <button
                    className={`hover:text-[#5DE0E6] p-2 ${activeChatTab === 'general' ? 'text-[#5DE0E6] border-b-2 border-[#5DE0E6]' : 'text-gray-700'}`}
                    onClick={() => setActiveChatTab('general')}
                  >
                    <span className="text-xs">General</span>
                  </button>
                </div>

              </div>
            )}
          </div>

            
          </div>
          
          
        </nav>
 
        <Sidebar isOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
 
        {/* Content */}
        <div
          className={`absolute z-[1010] flex flex-col items-center p-2 md:p-[1rem] transition-all duration-700 ease-in-out ${
            highlightVisible ? "top-16 md:top-23" : "top-[50%]"
          } w-full ${isAIExpanded ? "opacity-0 pointer-events-none" : "opacity-100"} ${
            showChat ? "pointer-events-none" : "" // Conditional pointer-events
          }`}
          style={{ height: "calc(100vh - 4rem)" }}
        >
          <div
          ref={stickyHeaderRef}
          className={`sticky w-full md:w-[80%] top-0 z-20 bg-[rgba(2,16,30,0.7)] bg-opacity-40 backdrop-blur-md pb-2 md:pb-4 ${highlightVisible && !showChat ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="w-full flex justify-center pt-2 md:pt-4 caret-none">
              <div className="w-full md:w-[50%] flex justify-center gap-2 md:gap-3 md:ml-5 text-white text-sm md:text-xl">
                {profileImages.map((profile) => (
                  <div key={profile.id} className="relative profile-image-container">
                    <button
                      id="profiles-of-users"
                      className="w-13 h-13 md:w-20 md:h-20 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${profile.image})` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProfileClick(profile);
                      }}
                    >
                    </button>
 
                    <button
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full pb-2 bg-gray-800 flex items-center justify-center text-xl text-white font-bold"
                      onClick={(e) => handleAddImageClick(e, profile.id)}
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>
 
            {/* Tabs */}
            <div className="w-full flex justify-center mt-2 md:mt-4">
              <div className="w-full md:w-[50%] flex justify-around text-white text-sm md:text-xl underline cursor-pointer">
                <span 
                  className={`text-base md:text-2xl font-bold hover:text-[#800080] ${activeTab === 'forYou' ? 'text-[#800080]' : ''}`}
                  onClick={() => setActiveTab('forYou')}
                >
                  For You
                </span>
                <span 
                  className={`text-base md:text-2xl font-bold hover:text-[#800080] ${activeTab === 'following' ? 'text-[#800080]' : ''}`}
                  onClick={() => setActiveTab('following')}
                >
                  Following
                </span>
                <span 
                  className={`text-base md:text-2xl font-bold hover:text-[#800080] ${activeTab === 'reels' ? 'text-[#800080]' : ''}`}
                  onClick={() => setActiveTab('reels')}
                >
                  Reels
                </span>
              </div>
            </div>
          </div>
 
          {/* Content based on active tab */}
          <div
            id="highlight"
            ref={highlightRef}
            className={`transition-opacity duration-700 ease-in-out mt-10 md:mt-0 flex justify-center flex-wrap w-full h-full overflow-y-auto scrollbar-hide gap-2 md:gap-4
              ${highlightVisible && !isAIExpanded ? "opacity-100" : "opacity-0"} flex-grow`}
          >
            {activeTab === 'forYou' && (
              highlightsData.length > 0 ? highlightsData.map((item) => (
                <div
                  key={item.id}
                  className="relative h-100 sm:w-[90%] md:w-[45%] bg-gradient-to-b from-[#0A5F68] to-[#000000] aspect-video rounded-lg md:rounded-xl mx-2 md:mx-100 my-4 md:my-10 overflow-hidden shadow-lg md:shadow-2xl border border-white/20 group cursor-pointer transition-transform hover:scale-[1.02]"
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
                      className="absolute inset-0 w-full h-[90%] p-2 md:p-5 pb-2 md:pb-12 brightness-125"
                    />
                  ) : (
                    <>
                      <img
                        src={item.image}
                        alt={`Thumbnail ${item.title}`}
                        className="w-full h-[90%] object-cover brightness-110 p-2 md:p-5 pb-12 md:pb-20"
                      />
                    </>
                  )}
 
                  <div className="absolute h-full inset-0 grid items-end justify-start">
                    <div className="grid">
                      <h3 className="text-white text-sm md:text-lg font-bold m-0 ml-3 md:mr-9">
                        {item.title}
                      </h3>
                      <div className="flex justify-evenly items-end  h-12 w-40 md:w-60 mr-2 mt-3 md:mr-5 mb-2 md:mb-5">
                        <button onClick={() => toggleLike(item.id)} className="z-10">
                          <img src={likedVideos[item.id] ? alike : blike} alt="Like" className="w-6 h-6 md:w-8 md:h-8" />
                        </button>
                        <img src={comment} alt="Comment" className="w-6 h-6 md:w-8 md:h-8 z-10" />
                        <img src={share} alt="Share" className="w-6 h-6 md:w-8 md:h-8 z-7" />
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-white mt-10">No highlights yet. Please add some!</p>
              )
            )}

{activeTab === 'following' && (
  <div className="w-full md:w-1/2 p-4 overflow-y-auto">
    <h2 className="text-white text-2xl font-bold mb-6 ml-4">People You Follow</h2>
    <div className="flex flex-col gap-4 px-4">
      {followersData.map(follower => (
        <div key={follower.id} className="bg-[#0D171E] rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={follower.image} 
              alt={follower.name}
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div>
              <h3 className="text-white font-semibold">{follower.name}</h3>
              <p className="text-gray-400 text-sm">
                {follower.isFollowing ? "Following" : "Not Following"}
              </p>
            </div>
          </div>
          <button
            onClick={() => toggleFollow(follower.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              follower.isFollowing 
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {follower.isFollowing ? "Unfollow" : "Follow"}
          </button>
        </div>
      ))}
    </div>
  </div>
)}

            {activeTab === 'reels' && (
              <div className="w-full md:w-[80%]">
                {/* Upload Reel Button */}
                <div className="p-4 flex justify-center">
                  <button
                    onClick={handleReelUploadClick}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
                  >
                    <FaUpload />
                    Upload Reel
                  </button>
                </div>

                {/* Reels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                  {reelsData.map(reel => (
                    <div key={reel.id} className="bg-[#0D171E] rounded-xl overflow-hidden shadow-lg">
                      <div className="relative pt-[177.78%]"> {/* 16:9 aspect ratio */}
                        <iframe
                          src={reel.videoUrl}
                          title={reel.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute top-0 left-0 w-full h-full"
                        ></iframe>
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-2">{reel.title}</h3>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <button onClick={() => toggleLike(reel.id)} className="mr-2">
                              <img src={likedVideos[reel.id] ? alike : blike} alt="Like" className="w-5 h-5" />
                            </button>
                            <span className="text-white text-sm">{reel.likes} likes</span>
                          </div>
                          <div className="flex gap-3">
                            <button className="text-white">
                              <img src={comment} alt="Comment" className="w-5 h-5" />
                            </button>
                            <button className="text-white">
                              <img src={share} alt="Share" className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <AIAssistance
        isAIExpanded={isAIExpanded}
        setIsAIExpanded={setIsAIExpanded}
      />
    </div>
  );
};
 
export default Landingpage;