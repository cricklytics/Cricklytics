import React, { useState } from 'react';
import { MapPin, Users, CalendarCheck, Info, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChepaukStadium from "../../assets/yogesh/communityimg/Chepauk Stadium.jpg";
import EdenGardens from "../../assets/yogesh/communityimg/Eden Gardens.jpg";
import wankedeStadium from "../../assets/yogesh/communityimg/wankede.jpg";
import backButton from '../../assets/kumar/right-chevron.png'

const groundsData = [
  {
    id: 1,
    name: 'Chepauk Stadium',
    location: 'Chennai, India',
    players: 24,
    matches: 3,
    image: ChepaukStadium,
    featured: true,
    bio: 'Iconic cricket stadium known for its passionate crowds and historic matches.',
    facilities: ['floodlights', 'pavilion', 'media-box']
  },
  {
    id: 2,
    name: 'Eden Gardens',
    location: 'Kolkata, India',
    players: 30,
    matches: 5,
    image: EdenGardens,
    featured: false,
    bio: 'One of the largest cricket stadiums in the world with a capacity of 66,000.',
    facilities: ['dressing-rooms', 'practice-nets', 'food-court']
  },
  {
    id: 3,
    name: 'Wankhede Stadium',
    location: 'Mumbai, India',
    players: 20,
    matches: 2,
    image: wankedeStadium,
    featured: true,
    bio: 'Home of Indian cricket with modern facilities and great pitch conditions.',
    facilities: ['media-box', 'practice-nets', 'floodlights']
  },
];

const GroundsPage = () => {
  const [joined, setJoined] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedGround, setSelectedGround] = useState(null);
  const navigate = useNavigate();

  const toggleJoin = (id) => {
    setJoined((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredGrounds = groundsData.filter(ground => {
    const matchesSearch = ground.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         ground.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'featured') return matchesSearch && ground.featured;
    return matchesSearch;
  });

  const getFacilityIcon = (facility) => {
    switch (facility) {
      case 'floodlights': return '💡';
      case 'pavilion': return '🏛️';
      case 'media-box': return '🎥';
      case 'dressing-rooms': return '👕';
      case 'practice-nets': return '🏏';
      case 'food-court': return '🍔';
      default: return '✅';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f28] to-[#06122e] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex justify-between items-center mb-8">
          <img
                                                src={backButton}
                                                alt="Back"
                                                className="h-8 w-8 cursor-pointer -scale-x-100"
                                                onClick={() => window.history.back()}
                                              />
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Cricket Grounds</h1>
            <p className="text-blue-300">Find and book premium cricket grounds for your matches</p>
          </div>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <MapPin className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search grounds by name or location..."
              className="w-full pl-10 pr-4 py-2 bg-[#0b1a3b] border border-blue-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="text-blue-400" />
            <select 
              className="bg-[#0b1a3b] border border-blue-600/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="all">All Grounds</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        {selectedGround ? (
          // Ground Detail View
          <div className="bg-[#0b1a3b] border border-blue-600/50 rounded-xl p-6 shadow-lg">
            <button 
              onClick={() => setSelectedGround(null)}
              className="mb-4 flex items-center text-blue-400 hover:text-blue-300"
            >
              ← Back to all grounds
            </button>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <img 
                  src={selectedGround.image} 
                  alt={selectedGround.name} 
                  className="w-full h-auto rounded-lg object-cover border-2 border-blue-500"
                />
                <div className="mt-4 flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full text-sm bg-blue-900 text-blue-300">
                    {selectedGround.players} players capacity
                  </span>
                  <div className="flex items-center text-yellow-400">
                    <Info className="mr-1" />
                    <span>{selectedGround.matches} matches</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-bold text-blue-400 mb-2">Facilities:</h3>
                  <div className="space-y-2">
                    {selectedGround.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center">
                        <span className="mr-2">{getFacilityIcon(facility)}</span>
                        <span className="capitalize">
                          {facility.split('-').join(' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-2">{selectedGround.name}</h2>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center text-blue-300">
                    <MapPin className="mr-2" />
                    <span>{selectedGround.location}</span>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6">{selectedGround.bio}</p>
                
                <div className="flex flex-wrap gap-4">
                 
                  <button className="border border-blue-500 text-blue-400 hover:bg-blue-900/50 px-6 py-2 rounded-lg transition-colors">
                    View Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Ground List View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGrounds.map(ground => (
              <div 
                key={ground.id} 
                className="bg-[#0b1a3b] border border-blue-600/50 rounded-xl p-4 hover:border-blue-400 transition-all cursor-pointer hover:shadow-lg group"
                onClick={() => setSelectedGround(ground)}
              >
                <div className="flex items-start gap-4">
                  <img 
                    src={ground.image} 
                    alt={ground.name} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 group-hover:border-blue-300 transition-colors"
                  />
                  <div>
                    <h3 className="font-bold">{ground.name}</h3>
                    <div className="flex items-center text-blue-300 text-sm">
                      <MapPin className="mr-1" />
                      <span>{ground.location}</span>
                    </div>
                    <div className="flex items-center text-yellow-400 text-sm mt-1">
                      <Users className="mr-1" />
                      <span>{ground.players} players capacity</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ground.facilities.slice(0, 2).map((facility, index) => (
                        <span key={index} className="text-xs bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded capitalize">
                          {facility.split('-').join(' ')}
                        </span>
                      ))}
                      {ground.facilities.length > 2 && (
                        <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded">
                          +{ground.facilities.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-gray-400 text-sm">{ground.matches} matches</span>
                  {ground.featured && (
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-900 text-yellow-300">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Community Stats */}
        {!selectedGround && (
          <div className="mt-12 bg-[#0b1a3b]/50 border border-blue-600/30 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Grounds Network</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{groundsData.length}+</p>
                <p className="text-gray-400">Premium Grounds</p>
              </div>
              <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{groundsData.filter(g => g.featured).length}</p>
                <p className="text-gray-400">Featured Venues</p>
              </div>
              <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{groundsData.reduce((acc, g) => acc + g.matches, 0)}+</p>
                <p className="text-gray-400">Matches Hosted</p>
              </div>
              <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{groundsData.reduce((acc, g) => acc + g.players, 0)}+</p>
                <p className="text-gray-400">Player Capacity</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroundsPage;