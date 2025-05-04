import React, { useState } from 'react';
import { FaMapMarkerAlt, FaRegCopyright } from 'react-icons/fa';
import logo from '../assets/sophita/HomePage/picture3_2.png';
import Advertisement from '../assets/sophita/HomePage/Advertisement3.jpg';
import img2019 from '../assets/sophita/HomePage/2019.jpeg';
import img2022 from '../assets/sophita/HomePage/2022.jpeg';
import img2025 from '../assets/sophita/HomePage/2025.jpeg';
import backButton from '../assets/kumar/right-chevron.png';


const myTeams = [
  { location: 'Chennai', captain: 'M S Dhoni', image: Advertisement , name: 'Chennai Super Kings' },
  { location: 'Mumbai', captain: 'Rohit Sharma', image: img2019, name: 'Mumbai Indians' },
  { location: 'Rajastan', captain: 'Sanju Samson', image: img2022 , name: 'Rajasthan Royals' },
  { location: 'Gujarat Titans', captain: 'Shubman Gill', image: img2025, name: 'Gujarat Titans' },
];

const opponentTeams = [
  { location: 'Delhi', captain: 'Rishabh Pant', image: img2025, name: 'Delhi Capitals' },
  { location: 'Kolkata', captain: 'Shreyas Iyer', image: img2019, name: 'Kolkata Knight Riders' },
  { location: 'Punjab', captain: 'Shikhar Dhawan', image: img2022, name: 'Punjab Kings' },
  { location: 'Hyderabad', captain: 'Pat Cummins', image: img2019, name: 'Sunrisers Hyderabad' },
];

export default function TeamDetails() {
  const [activeTab, setActiveTab] = useState('myteam');
  const [followedTeams, setFollowedTeams] = useState([]);
  const teams = activeTab === 'myteam' ? myTeams : opponentTeams;

  return (
<div className="min-h-screen p-4" style={{
      backgroundImage: 'linear-gradient(140deg,#080006 15%,#FF0077)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>

      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center p-4 rounded-lg mb-5">
        <div className="flex items-center gap-4" >
          <img 
            src={logo}
            alt="Cricklytics Logo"
            className="h-7 w-7 md:h-10 object-contain block select-none"
          
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/Picture3 2.png";
            }}
          />
          <span className="text-2xl font-bold text-white whitespace-nowrap text-shadow-[0_0_8px_rgba(93,224,230,0.4)] ">
            Cricklytics
          </span>
        </div>
      </div>

       {/* 🔙 Back Button Below Logo */}
            <div className="mb-4">
              <img
                src={backButton} // Change path if needed
                alt="Back"
                className="h-8 w-8 cursor-pointer absolute w-10 h-10 -scale-x-100 top-25 left-5'"
                onClick={() => window.history.back()}
              />
            </div>
      

      {/* Tabs */}
      <div className="flex justify-center space-x-12 text-white text-lg font-semibold border-b-4 border-white pb-2 mb-6" style={{marginTop:'70px'}}>
        {['myteam', 'opponent', 'following'].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer ${activeTab === tab ? 'border-b-2 border-white text-blue-500' : ''}`}
          >
            {tab === 'myteam' ? 'My Team' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>

      {/* Team Cards */}
      <div className="max-w-xl mx-auto space-y-4">
        {activeTab === 'following' ? (
          <div>
            <h2 className="text-white text-xl mb-4">Following Teams</h2>
            {followedTeams.length === 0 ? (
              <p className="text-white">You are not following any teams yet.</p>
            ) : (
              followedTeams.map((teamName, idx) => (
                <div key={idx} className="rounded-xl p-4 shadow-md shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                  <span className="text-lg font-semibold text-black">{teamName}</span>
                </div>
              ))
            )}
          </div>
        ) : (
          teams.map((team, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] bg-white/5 backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={team.image}
                    alt="team"
                    className="h-14 w-14 rounded-full mr-4 border-2 border-gray-300 object-cover"
                  />
                  <span className="text-lg font-semibold text-white">{team.name}</span>
                </div>

                <div className="text-right text-sm space-y-1 text-white">
                  <div className="flex items-center justify-end gap-2">
                    <FaMapMarkerAlt className="text-white" />
                    <span>{team.location}</span>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <FaRegCopyright className="text-white" />
                    <span>{team.captain}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
