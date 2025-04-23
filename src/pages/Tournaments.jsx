import React, { useState } from 'react';
import { FaMapMarkerAlt, FaRegCopyright } from 'react-icons/fa';
import logo from '../assets/sophita/HomePage/picture3_2.png';
import Advertisement from '../assets/sophita/HomePage/Advertisement3.jpg';
import img2019 from '../assets/sophita/HomePage/2019.jpeg';
import img2022 from '../assets/sophita/HomePage/2022.jpeg';
import img2025 from '../assets/sophita/HomePage/2025.jpeg';

const myTeams = [
  {
    location: 'Chennai',
    captain: 'M S Dhoni',
    image: Advertisement,
    name: 'Chennai Super Kings',
  },
  {
    location: 'Mumbai',
    captain: 'Rohit Sharma',
    image: img2019,
    name: 'Mumbai Indians',
  },
  {
    location: 'Rajasthan',
    captain: 'Sanju Samson',
    image: img2022,
    name: 'Rajasthan Royals',
  },
  {
    location: 'Gujarat Titans',
    captain: 'Shubman Gill',
    image: img2025,
    name: 'Gujarat Titans',
  },
];

export default function Tournaments() {
  const [activeTab, setActiveTab] = useState('myteam');
  const followedTeams = []; // Empty following list

  const teams = activeTab === 'myteam' || activeTab === 'all' ? myTeams : [];

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#bfdaa4' }}>
      {/* Top Navbar */}
      <div className="flex justify-between items-center p-4 bg-black/30 rounded-lg mb-5">
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="Cricklytics Logo"
            className="h-10 object-contain block"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/Picture3 2.png";
            }}
          />
          <span className="text-2xl font-bold text-white whitespace-nowrap text-shadow-[0_0_8px_rgba(93,224,230,0.4)]">
            Cricklytics
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-12 text-white text-lg font-semibold border-b-4 border-white pb-2 mb-6">
        <div
          onClick={() => setActiveTab('myteam')}
          className={`cursor-pointer ${activeTab === 'myteam' ? 'border-b-2 border-white' : ''}`}
        >
          My Tournament
        </div>
        <div
          onClick={() => setActiveTab('following')}
          className={`cursor-pointer ${activeTab === 'following' ? 'border-b-2 border-white' : ''}`}
        >
          Following
        </div>
        <div
          onClick={() => setActiveTab('all')}
          className={`cursor-pointer ${activeTab === 'all' ? 'border-b-2 border-white' : ''}`}
        >
          All
        </div>
      </div>

      {/* Team Cards Section */}
      <div className="max-w-xl mx-auto space-y-4">
        {activeTab === 'following' ? (
          <div className="text-white text-center py-10">
            <p className="text-2xl font-semibold">You haven’t followed any teams yet! 😔</p>
          </div>
        ) : (
          teams.map((team, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={team.image}
                    alt="team"
                    className="h-14 w-14 rounded-full mr-4 border-2 border-gray-300 object-cover"
                  />
                  <span className="text-lg font-semibold text-gray-800">{team.name}</span>
                </div>

                <div className="text-right text-sm space-y-1 text-gray-700">
                  <div className="flex items-center justify-end gap-2">
                    <FaMapMarkerAlt className="text-gray-600" />
                    <span>{team.location}</span>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <FaRegCopyright className="text-gray-600" />
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
