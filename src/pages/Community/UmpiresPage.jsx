import React, { useState } from 'react';
import { FiStar, FiMessageSquare, FiUser, FiCalendar, FiMapPin, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import cuslogo from "../../assets/yogesh/communityimg/cuslogo.png";
import backButton from '../../assets/kumar/right-chevron.png'

const UmpiresPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedUmpire, setSelectedUmpire] = useState(null);

  const umpires = [
    {
      id: 1,
      name: 'David Shepherd',
      rating: 4.9,
      matches: 172,
      location: 'London, UK',
      experience: '15 years',
      image: cuslogo,
      bio: 'ICC Elite Panel Umpire with extensive international experience. Specializes in Test matches.',
      available: true
    },
    {
      id: 2,
      name: 'Aleem Dar',
      rating: 4.8,
      matches: 210,
      location: 'Lahore, Pakistan',
      experience: '20 years',
      image: cuslogo,
      bio: 'Most experienced umpire in ICC history. Known for excellent decision-making under pressure.',
      available: true
    },
    {
      id: 3,
      name: 'Simon Taufel',
      rating: 4.7,
      matches: 185,
      location: 'Sydney, Australia',
      experience: '12 years',
      image: cuslogo,
      bio: 'Five-time ICC Umpire of the Year. Now trains new umpires worldwide.',
      available: false
    },
    {
      id: 4,
      name: 'Kumar Dharmasena',
      rating: 4.6,
      matches: 150,
      location: 'Colombo, Sri Lanka',
      experience: '10 years',
      image: cuslogo,
      bio: 'Former international cricketer turned elite umpire. Brings player perspective to decisions.',
      available: true
    },
    {
      id: 5,
      name: 'Marais Erasmus',
      rating: 4.8,
      matches: 195,
      location: 'Cape Town, South Africa',
      experience: '14 years',
      image: cuslogo,
      bio: 'Consistently top-rated umpire known for calm demeanor and accurate decisions.',
      available: true
    },
    {
      id: 6,
      name: 'Annie Jones',
      rating: 4.5,
      matches: 85,
      location: 'Melbourne, Australia',
      experience: '6 years',
      image: cuslogo,
      bio: 'Rising star in women\'s cricket umpiring. Officiated in 3 World Cups.',
      available: false
    }
  ];

  const filteredUmpires = umpires.filter(umpire => {
    const matchesSearch = umpire.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'available') return matchesSearch && umpire.available;
    if (activeTab === 'elite') return matchesSearch && umpire.rating >= 4.7;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f28] to-[#06122e] text-white p-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
        <div className="md:absolute flex items-center gap-4">
          <img
          src={backButton}
          alt="Back"
          className="h-8 w-8 cursor-pointer -scale-x-100"
          onClick={() => window.history.back()}
          />
          </div>      
        <div className="text-center flex-grow">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Umpires</h1>
            <p className="text-blue-300">Find and connect with professional cricket umpires worldwide</p>
          </div>
          <div className="w-24 md:w-32">
            {/* Spacer to keep title centered */}
          </div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Search and filter components can go here if needed */}
        </div>

        {selectedUmpire ? (
          <div className="bg-[#0b1a3b] border border-blue-600/50 rounded-xl p-6 shadow-lg">
            <button
              onClick={() => setSelectedUmpire(null)}
              className="mb-4 flex items-center text-blue-400 hover:text-blue-300"
            >
              <FiArrowLeft className="mr-2" /> Back to all umpires
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <img
                  src={selectedUmpire.image}
                  alt={selectedUmpire.name}
                  className="w-full h-auto rounded-lg object-cover"
                />
                <div className="mt-4 flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm ${selectedUmpire.available ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {selectedUmpire.available ? 'Available' : 'Not Available'}
                  </span>
                  <div className="flex items-center text-yellow-400">
                    <FiStar className="mr-1" />
                    <span>{selectedUmpire.rating}</span>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-2">{selectedUmpire.name}</h2>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center text-blue-300">
                    <FiMapPin className="mr-2" />
                    <span>{selectedUmpire.location}</span>
                  </div>
                  <div className="flex items-center text-blue-300">
                    <FiCalendar className="mr-2" />
                    <span>{selectedUmpire.experience} experience</span>
                  </div>
                  <div className="flex items-center text-blue-300">
                    <FiUser className="mr-2" />
                    <span>{selectedUmpire.matches} matches officiated</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-6">{selectedUmpire.bio}</p>

                <div className="flex flex-wrap gap-4">
                  <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg flex items-center transition-colors">
                    <FiMessageSquare className="mr-2" />
                    Send Message
                  </button>
                  <button className="border border-blue-500 text-blue-400 hover:bg-blue-900/50 px-6 py-2 rounded-lg transition-colors">
                    View Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUmpires.map(umpire => (
              <div
                key={umpire.id}
                className="bg-[#0b1a3b] border border-blue-600/50 rounded-xl p-4 hover:border-blue-400 transition-all cursor-pointer hover:shadow-lg"
                onClick={() => setSelectedUmpire(umpire)}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={umpire.image}
                    alt={umpire.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div>
                    <h3 className="font-bold">{umpire.name}</h3>
                    <div className="flex items-center text-yellow-400 text-sm">
                      <FiStar className="mr-1" />
                      <span>{umpire.rating}</span>
                    </div>
                    <div className="flex items-center text-blue-300 text-sm mt-1">
                      <FiMapPin className="mr-1" />
                      <span>{umpire.location}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-gray-400 text-sm">{umpire.matches} matches</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${umpire.available ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {umpire.available ? 'Available' : 'Booked'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!selectedUmpire && (
          <div className="mt-12 bg-[#0b1a3b]/50 border border-blue-600/30 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Umpiring Community Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{umpires.length}+</p>
                <p className="text-gray-400">Registered Umpires</p>
              </div>
              <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{umpires.filter(u => u.available).length}</p>
                <p className="text-gray-400">Available Now</p>
              </div>
              <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{umpires.reduce((acc, umpire) => acc + umpire.matches, 0)}+</p>
                <p className="text-gray-400">Matches Officiated</p>
              </div>
              <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">20+</p>
                <p className="text-gray-400">Countries</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UmpiresPage;
