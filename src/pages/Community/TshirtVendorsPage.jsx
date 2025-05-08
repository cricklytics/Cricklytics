import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiHeart, FiShoppingCart, FiStar, FiChevronLeft, FiChevronRight, FiExternalLink, FiArrowLeft } from 'react-icons/fi';
import StumpsBails from '../../assets/yogesh/communityimg/Stumps & Bails.jpg'
import CricketFanatics from '../../assets/yogesh/communityimg/CricketFanatics.jpg'
import BoundaryMerch from '../../assets/yogesh/communityimg/BoundaryMerch.jpg'
import SixerStore from '../../assets/yogesh/communityimg/SixerStore.jpg'
import CricketLegends from '../../assets/yogesh/communityimg/CricketLegends.jpg'
import IND from "../../assets/yogesh/communityimg/INDflag.png"
import AUS from "../../assets/yogesh/communityimg/AUSflag.png"
import ENG from "../../assets/yogesh/communityimg/ENGflag.png"
import PAK from "../../assets/yogesh/communityimg/PAKflag.png"
import NZ from "../../assets/yogesh/communityimg/NZflag.png"
import backButton from '../../assets/kumar/right-chevron.png'

const TShirtVendorsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  // Sample data
  const teams = [
    { id: 1, name: 'India', logo: IND},
    { id: 2, name: 'Australia', logo: AUS },
    { id: 3, name: 'England', logo: ENG },
    { id: 4, name: 'Pakistan', logo: PAK},
    { id: 5, name: 'New Zealand', logo: NZ},
  ];

  const vendors = [
    {
      id: 1,
      name: 'Cricket Fanatics',
      rating: 4.8,
      products: 42,
      logo: CricketFanatics,
      featured: true,
      team: 'India',
      description: 'Official merchandise partner for Indian cricket team with authentic jerseys and accessories'
    },
    {
      id: 2,
      name: 'Boundary Merch',
      rating: 4.5,
      products: 35,
      logo: BoundaryMerch,
      featured: false,
      team: 'Australia',
      description: 'Specializing in Australian cricket gear with fast worldwide shipping'
    },
    {
      id: 3,
      name: 'Stumps & Bails',
      rating: 4.7,
      products: 28,
      logo: StumpsBails,
      featured: true,
      team: 'England',
      description: 'Premium English cricket apparel with exclusive designs'
    },
    {
      id: 4,
      name: 'Sixer Store',
      rating: 4.3,
      products: 19,
      logo: SixerStore,
      featured: false,
      team: 'Pakistan',
      description: 'Authentic Pakistan cricket merchandise at affordable prices'
    },
    {
      id: 5,
      name: 'Cricket Legends',
      rating: 4.9,
      products: 56,
      logo: CricketLegends,
      featured: true,
      team: 'India',
      description: 'Retro and current Indian cricket jerseys with player customization'
    },
  ];

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = !selectedTeam || vendor.team === selectedTeam;
    const matchesTab = activeTab === 'all' || (activeTab === 'featured' && vendor.featured) || (activeTab === 'top-rated' && vendor.rating >= 4.5);
    
    return matchesSearch && matchesTeam && matchesTab;
  });

  const addToWishlist = (vendorId) => {
    if (wishlist.includes(vendorId)) {
      setWishlist(wishlist.filter(id => id !== vendorId));
    } else {
      setWishlist([...wishlist, vendorId]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f28] to-[#06122e] text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-start mb-8">
          <img
                                      src={backButton}
                                      alt="Back"
                                      className="h-8 w-8 cursor-pointer -scale-x-100"
                                      onClick={() => window.history.back()}
                                    />
          <div className="flex-1 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Cricket Merchandise Vendors
            </h1>
            <p className="text-blue-300 max-w-2xl mx-auto">
              Shop authentic jerseys, t-shirts and accessories from official vendors
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-md mx-auto">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search vendors..."
            className="w-full pl-10 pr-4 py-2 bg-[#0b1a3b] border border-blue-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Team Filter */}
        <div className="mb-8 overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4 text-blue-300">Shop by Team</h3>
          <div className="flex space-x-2 pb-2">
            <button
              onClick={() => setSelectedTeam(null)}
              className={`px-4 py-2 rounded-full ${!selectedTeam ? 'bg-blue-600 text-white' : 'bg-[#0b1a3b] hover:bg-[#0b1a3b]/80'}`}
            >
              All Teams
            </button>
            {teams.map(team => (
              <button
                key={team.id}
                onClick={() => setSelectedTeam(team.name)}
                className={`px-4 py-2 rounded-full flex items-center ${selectedTeam === team.name ? 'bg-blue-600 text-white' : 'bg-[#0b1a3b] hover:bg-[#0b1a3b]/80'}`}
              >
                <img src={team.logo} alt={team.name} className="w-6 h-6 mr-2" />
                {team.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-blue-600/50 mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            All Vendors
          </button>
          <button
            onClick={() => setActiveTab('featured')}
            className={`px-4 py-2 font-medium ${activeTab === 'featured' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            Featured
          </button>
          <button
            onClick={() => setActiveTab('top-rated')}
            className={`px-4 py-2 font-medium ${activeTab === 'top-rated' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            Top Rated
          </button>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map(vendor => (
            <div 
              key={vendor.id} 
              className="bg-[#0b1a3b] border border-blue-600/50 rounded-xl overflow-hidden hover:border-blue-400 transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative h-48 bg-[#0b1a3b]/70 flex items-center justify-center p-4">
                <img 
                  src={vendor.logo} 
                  alt={vendor.name} 
                  className="max-h-full max-w-full object-contain"
                />
                {vendor.featured && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-xs font-bold px-2 py-1 rounded">
                    Featured
                  </div>
                )}
                <button
                  onClick={() => addToWishlist(vendor.id)}
                  className={`absolute top-2 right-2 p-2 rounded-full ${wishlist.includes(vendor.id) ? 'text-red-500 bg-[#0b1a3b]' : 'text-gray-400 bg-[#0b1a3b]'}`}
                >
                  <FiHeart className={wishlist.includes(vendor.id) ? 'fill-current' : ''} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{vendor.name}</h3>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        className={`${i < Math.floor(vendor.rating) ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-blue-300">{vendor.rating}</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">{vendor.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full">
                    {vendor.team}
                  </span>
                  <div className="flex items-center text-blue-400 hover:text-blue-300 text-sm">
                    Visit Store <FiExternalLink className="ml-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <h4 className="text-xl font-medium text-gray-400 mb-4">No vendors found matching your criteria</h4>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedTeam(null);
                setActiveTab('all');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-12 bg-[#0b1a3b]/50 border border-blue-600/30 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Merchandise Community Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">{vendors.length}+</p>
              <p className="text-gray-400">Official Vendors</p>
            </div>
            <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">5+</p>
              <p className="text-gray-400">National Teams</p>
            </div>
            <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">100%</p>
              <p className="text-gray-400">Authentic Merch</p>
            </div>
            <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">4.5+</p>
              <p className="text-gray-400">Avg. Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TShirtVendorsPage;