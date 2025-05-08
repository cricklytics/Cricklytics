import React from "react";
import { FaYoutube, FaTwitch, FaUserFriends, FaEye, FaStar, FaArrowLeft } from "react-icons/fa";
import LiveBoundary from "../../assets/yogesh/communityimg/LiveBoundary.jpg";
import TwitchCricketPro from "../../assets/yogesh/communityimg/TwitchCricketPro.jpg";
import CricLive360 from "../../assets/yogesh/communityimg/CricLive360.jpg";
import CrickStreamIndia from "../../assets/yogesh/communityimg/CrickStreamIndia.jpg";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import backButton from '../../assets/kumar/right-chevron.png'
const streamers = [
  {
    id: 1,
    name: "CricLive360",
    platform: "YouTube",
    isLive: true,
    avatar: CricLive360,
    viewers: "12.5K",
    followers: "245K",
    match: "IND vs AUS • 3rd Test",
    rating: 4.8,
    tags: ["Commentary", "HD Stream"],
    // uptime: "95%"
  },
  {
    id: 2,
    name: "TwitchCricketPro",
    platform: "Twitch",
    isLive: false,
    avatar: TwitchCricketPro,
    viewers: "8.2K",
    followers: "178K",
    match: "PAK vs ENG • 2nd ODI",
    rating: 4.5,
    tags: ["Analysis", "Q&A"],
    // uptime: "89%"
  },
  {
    id: 3,
    name: "CrickStreamIndia",
    platform: "YouTube",
    isLive: true,
    avatar: CrickStreamIndia,
    viewers: "23.7K",
    followers: "512K",
    match: "IPL 2023 • Qualifier 1",
    rating: 4.9,
    tags: ["Multi-cam", "Replays"],
    // uptime: "98%"
  },
  {
    id: 4,
    name: "LiveBoundary",
    platform: "Twitch",
    isLive: false,
    avatar: LiveBoundary,
    viewers: "5.6K",
    followers: "92K",
    match: "NZ vs SA • T20 Series",
    rating: 4.3,
    tags: ["Interviews", "BTS"],
    // uptime: "82%"
  },
];

const PlatformIcon = ({ platform }) => {
  const icons = {
    YouTube: <FaYoutube className="text-red-500" />,
    Twitch: <FaTwitch className="text-purple-500" />
  };
  return <span className="text-lg">{icons[platform]}</span>;
};

const StreamersPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page in history
  };

  return (
    <section className="bg-gradient-to-b from-[#0b0f28] to-[#06122e] text-white min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
             <img
                                      src={backButton}
                                      alt="Back"
                                      className="h-8 w-8 cursor-pointer -scale-x-100"
                                      onClick={() => window.history.back()}
                                    />
                                
        </div>
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-400 mb-2 flex items-center justify-center gap-2">
            Cricket Streamers
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Find the best cricket streams across platforms
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {streamers.map((streamer) => (
            <div
              key={streamer.id}
              className="bg-[#111936] rounded-xl p-4 border border-blue-600/20 hover:border-blue-400 shadow-md hover:shadow-blue-700/20 transition-all duration-300 flex flex-col"
            >
              {/* Header with avatar and basic info */}
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={streamer.avatar}
                  alt={streamer.name}
                  className="w-12 h-12 rounded-full border-2 border-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold truncate">{streamer.name}</h2>
                    <PlatformIcon platform={streamer.platform} />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-yellow-400 text-xs">
                      <FaStar className="mr-1" />
                      {streamer.rating}
                    </div>
                    {streamer.isLive ? (
                      <div className="flex items-center bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-xs">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                        LIVE
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Offline</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Current match */}
              <div className="bg-[#1a2342] px-3 py-2 rounded-lg mb-3">
                <p className="text-sm font-medium text-blue-300 truncate">{streamer.match}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <FaEye className="text-green-400" /> {streamer.viewers} watching
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {streamer.tags.map((tag, i) => (
                  <span key={i} className="bg-blue-900/40 text-blue-300 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats bar */}
              <div className="mt-auto space-y-2">
                {streamer.hasOwnProperty('uptime') && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Uptime</span>
                    <span className="font-medium">{streamer.uptime}</span>
                  </div>
                )}
                {/* <UptimeBar percentage={parseInt(streamer.uptime)} /> */}

                <div className="flex justify-between items-center text-xs mt-2">
                  <div className="flex items-center text-gray-400">
                    <FaUserFriends className="mr-1" /> {streamer.followers}
                  </div>
                  <button className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
                    streamer.isLive
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}>
                    {streamer.isLive ? (
                      <>
                        <FaEye /> Watch
                      </>
                    ) : (
                      <>
                        <FaEye /> Watch
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StreamersPage;