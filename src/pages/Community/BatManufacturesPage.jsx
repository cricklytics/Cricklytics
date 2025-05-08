import { useState, useEffect } from 'react';
import { FiSearch, FiStar, FiShoppingCart, FiHeart, FiExternalLink, FiArrowLeft } from 'react-icons/fi';
import MRFlogo from "../../assets/yogesh/communityimg/MRFlogo.jpg"
import SSlogo from "../../assets/yogesh/communityimg/SSlogo.png"
import Kookaburralogo from "../../assets/yogesh/communityimg/Kookaburralogo.jpg"
import GrayNicollslogo from "../../assets/yogesh/communityimg/GrayNicollslogo.png"
import { useNavigate } from 'react-router-dom';
import backButton from '../../assets/kumar/right-chevron.png'

const BatManufacturersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API fetch
    const fetchManufacturers = async () => {
      setIsLoading(true);
      // Mock data
      const mockData = [
        {
          id: 1,
          name: 'MRF',
          logo: MRFlogo,
          description: 'Official bat manufacturer for many international players',
          rating: 4.5,
          featured: true,
          bats: [
            { id: 101, name: 'MRF Genius Grand Edition', price: 299, image: 'https://via.placeholder.com/150?text=MRF+Bat' },
            { id: 102, name: 'MRF Virat Kohli Edition', price: 399, image: 'https://via.placeholder.com/150?text=MRF+VK' }
          ]
        },
        {
          id: 2,
          name: 'SS',
          logo: SSlogo,
          description: 'Popular choice among professional cricketers',
          rating: 4.2,
          featured: true,
          bats: [
            { id: 201, name: 'SS Ton Player Edition', price: 249, image: 'https://via.placeholder.com/150?text=SS+Bat' },
            { id: 202, name: 'SS Premium English Willow', price: 349, image: 'https://via.placeholder.com/150?text=SS+Premium' }
          ]
        },
        {
          id: 3,
          name: 'Kookaburra',
          logo: Kookaburralogo,
          description: 'Australian brand favored by many international players',
          rating: 4.7,
          featured: true,
          bats: [
            { id: 301, name: 'Kookaburra Ghost Pro', price: 279, image: 'https://via.placeholder.com/150?text=Kookaburra+Bat' },
            { id: 302, name: 'Kookaburra Kahuna', price: 329, image: 'https://via.placeholder.com/150?text=Kookaburra+Kahuna' }
          ]
        },
        {
          id: 4,
          name: 'Gray Nicolls',
          logo: GrayNicollslogo,
          description: 'English brand with a rich cricket heritage',
          rating: 4.3,
          featured: false,
          bats: [
            { id: 401, name: 'Gray Nicolls Predator3', price: 269, image: 'https://via.placeholder.com/150?text=GN+Bat' },
            { id: 402, name: 'Gray Nicolls Powerbow', price: 319, image: 'https://via.placeholder.com/150?text=GN+Powerbow' }
          ]
        }
      ];
      
      setManufacturers(mockData);
      setIsLoading(false);
    };

    fetchManufacturers();
  }, []);

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const filteredManufacturers = manufacturers.filter(manufacturer => {
    const matchesSearch = manufacturer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         manufacturer.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'featured' && manufacturer.featured) || 
                      (activeTab === 'top-rated' && manufacturer.rating >= 4.5);
    
    return matchesSearch && matchesTab;
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FiStar 
        key={i} 
        className={`${i < Math.floor(rating) ? 'fill-current text-yellow-400' : 'text-yellow-400'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f28] to-[#06122e] text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
      <img
      src={backButton}
      alt="Back"
      className="h-8 w-8 cursor-pointer -scale-x-100"
      onClick={() => window.history.back()}
      />
        

        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Cricket Bat Manufacturers
          </h1>
          <p className="text-blue-300 max-w-2xl mx-auto">
            Explore top cricket bat brands and their premium products
          </p>
        </header>

        {/* Search and Filter */}
        <div className="mb-8">
          
          
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-[#0b1a3b] text-gray-300 hover:bg-[#0b1a3b]/80'}`}
            >
              All Brands
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'featured' ? 'bg-blue-600 text-white' : 'bg-[#0b1a3b] text-gray-300 hover:bg-[#0b1a3b]/80'}`}
            >
              Featured
            </button>
            <button
              onClick={() => setActiveTab('top-rated')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'top-rated' ? 'bg-blue-600 text-white' : 'bg-[#0b1a3b] text-gray-300 hover:bg-[#0b1a3b]/80'}`}
            >
              Top Rated
            </button>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Manufacturers Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredManufacturers.map((manufacturer) => (
              <div 
                key={manufacturer.id} 
                className="bg-[#0b1a3b] border border-blue-600/50 rounded-xl overflow-hidden hover:border-blue-400 transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <button 
                      onClick={() => toggleFavorite(manufacturer.id)}
                      className={`p-2 rounded-full ${favorites.includes(manufacturer.id) ? 'text-red-500 bg-[#0b1a3b]' : 'text-gray-400 bg-[#0b1a3b]'}`}
                    >
                      <FiHeart className={favorites.includes(manufacturer.id) ? 'fill-current' : ''} />
                    </button>
                  </div>
                  
                  <div className="h-48 bg-[#0b1a3b]/70 flex items-center justify-center p-4">
                    <img 
                      src={manufacturer.logo} 
                      alt={`${manufacturer.name} logo`} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold">{manufacturer.name}</h2>
                    <div className="flex items-center">
                      {renderStars(manufacturer.rating)}
                      <span className="ml-1 text-sm text-blue-300">{manufacturer.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3">{manufacturer.description}</p>
                  
                  {manufacturer.featured && (
                    <span className="inline-block mb-3 px-2 py-1 text-xs font-semibold bg-yellow-900/50 text-yellow-400 rounded-full">
                      Featured
                    </span>
                  )}                  
                  
                  <div className="mt-4">
                    <button className="w-full py-2 px-4 border border-blue-500 rounded-lg text-sm font-medium text-blue-400 hover:bg-blue-900/30 hover:text-white transition-colors flex items-center justify-center">
                      View All Bats <FiExternalLink className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && filteredManufacturers.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-400 mb-2">No manufacturers found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
              }}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-12 bg-[#0b1a3b]/50 border border-blue-600/30 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Bat Manufacturing Community</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">{manufacturers.length}+</p>
              <p className="text-gray-400">Brands</p>
            </div>
            <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">4.3+</p>
              <p className="text-gray-400">Avg Rating</p>
            </div>
            <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">100%</p>
              <p className="text-gray-400">Premium Quality</p>
            </div>
            <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">50+</p>
              <p className="text-gray-400">Bat Models</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatManufacturersPage;