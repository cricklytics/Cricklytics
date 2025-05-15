import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiStar, FiMapPin, FiUsers, FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from "react-router-dom";
import colomb from '../assets/yogesh/clubimg/Colomb.png';
import royals from '../assets/yogesh/clubimg/royals.jpeg';
import EasternEaglesCC from '../assets/yogesh/clubimg/EasternEaglesCC.jpeg';
import HambantotaHawks from "../assets/yogesh/clubimg/HambantotaHawks.jpeg";
import NorthernKnights from "../assets/yogesh/clubimg/NorthernKnightsCC.png"
import KandyKingsCricket from "../assets/yogesh/clubimg/KandyKings.jpeg"
import GalleGladiators from "../assets/yogesh/clubimg/GalleGladiators.png"
import backButton from '../assets/kumar/right-chevron.png';

// Mock data remains the same
const mockClubs = [
  {
    id: 1,
    name: 'Royal Cricket Club',
    location: 'Colombo',
    established: 1985,
    members: 120,
    category: 'Premier',
    logo: royals,
    description: 'One of the oldest and most prestigious cricket clubs in the country with multiple championship wins.',
    upcomingMatches: ['vs. Lions CC (May 15)', 'vs. Titans CC (May 22)'],
    facilities: ['2 turf pitches', 'Indoor nets', 'Gym', 'Swimming pool']
  },
  {
    id: 2,
    name: 'Colombo Lions CC',
    location: 'Colombo',
    established: 1992,
    members: 85,
    category: 'First Class',
    logo: colomb,
    description: 'Competitive club with strong youth development programs.',
    upcomingMatches: ['vs. Royal CC (May 15)', 'vs. Kandy Kings (May 29)'],
    facilities: ['Turf pitch', 'Practice nets', 'Clubhouse']
  },
  {
    id: 3,
    name: 'Kandy Kings Cricket Club',
    location: 'Kandy',
    established: 1978,
    members: 95,
    category: 'Premier',
    logo: KandyKingsCricket,
    description: 'Traditional club known for producing national team players.',
    upcomingMatches: ['vs. Galle Gladiators (May 18)', 'vs. Colombo Lions (May 29)'],
    facilities: ['3 turf pitches', 'Indoor academy', 'Gym', 'Sauna']
  },
  {
    id: 4,
    name: 'Galle Gladiators',
    location: 'Galle',
    established: 2005,
    members: 65,
    category: 'First Class',
    logo: GalleGladiators,
    description: 'Community-focused club with emphasis on local talent development.',
    upcomingMatches: ['vs. Galle Gladiators (May 25)', 'vs. Hambantota Hawks (Jun 2)'],
    facilities: ['Practice nets', 'Clubhouse']
  },
  {
    id: 6,
    name: 'Hambantota Hawks',
    location: 'Hambantota',
    established: 2015,
    members: 45,
    category: 'Division II',
    logo: HambantotaHawks,
    description: 'New club with state-of-the-art facilities in the southern region.',
    upcomingMatches: ['vs. Southern Strikers (Jun 2)', 'vs. Eastern Eagles (Jun 9)'],
    facilities: ['Turf pitch', 'Indoor nets', 'Gym']
  },
  {
    id: 7,
    name: 'Eastern Eagles CC',
    location: 'Trincomalee',
    established: 2008,
    members: 55,
    category: 'Division I',
    logo: EasternEaglesCC,
    description: 'Promoting cricket in the eastern province with dedicated coaching programs.',
    upcomingMatches: ['vs. Hambantota Hawks (Jun 9)', 'vs. Northern Knights (Jun 16)'],
    facilities: ['Practice nets', 'Clubhouse']
  },
  {
    id: 8,
    name: 'Northern Knights CC',
    location: 'Jaffna',
    established: 2012,
    members: 60,
    category: 'Division I',
    logo: NorthernKnights,
    description: 'Revitalizing cricket in the northern region after decades of conflict.',
    upcomingMatches: ['vs. Eastern Eagles (Jun 16)', 'vs. Western Warriors (Jun 23)'],
    facilities: ['Turf pitch', 'Practice nets']
  }
];

const Clubsmain = () => {
  // All state declarations remain the same
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    category: '',
    establishedAfter: ''
  });

  // Filter function remains the same
  const filterClubs = () => {
    return clubs.filter(club => {
      const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         club.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilters = 
        (filters.location === '' || club.location === filters.location) &&
        (filters.category === '' || club.category === filters.category) &&
        (filters.establishedAfter === '' || club.established >= parseInt(filters.establishedAfter));
      
      return matchesSearch && matchesFilters;
    });
  };

  // Derived data remains the same
  const locations = [...new Set(clubs.map(club => club.location))];
  const categories = [...new Set(clubs.map(club => club.category))];
  const filteredClubs = filterClubs();

  useEffect(() => {
    // Same useEffect
    const timer = setTimeout(() => {
      setClubs(mockClubs);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header - adjusted for mobile */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-4 px-4 shadow-md sticky top-0 z-10"
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={()  => navigate("/landingpage")} // Navigates back
              className="px-2 py-1 rounded-md text-sm md:text-base transition-colors"
            >
              <img 
                src={backButton} 
                alt="Back"
                className="h-7 w-7 md:h-10 w-10 mt-2 ml-1 cursor-pointer transform rotate-180"
                // onClick={() => window.history.back()}
              />
            </button>
            <h1 className="text-xl md:text-3xl font-bold">Cricket Association Clubs</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 md:px-4 md:py-2 bg-green-600 hover:bg-green-700 rounded-md text-white text-sm md:text-base font-medium transition-colors"
          >
            Join Now
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content - adjusted layout for mobile */}
      <div className="container mx-auto px-2 sm:px-4 py-4 flex flex-col md:flex-row gap-4 md:gap-8 items-start">
        {/* Video Column - hidden on small screens */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="hidden md:block w-full md:w-1/3 lg:w-1/4 bg-gray-800 p-4 md:p-6 rounded-lg shadow-md sticky top-20 h-fit border border-gray-700"
        >
          {/* Keep the same content here */}
          <motion.h2 
            whileHover={{ scale: 1.02 }}
            className="text-xl font-bold text-blue-300 mb-4"
          >
            Cricket Clubs Network
          </motion.h2>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <DotLottieReact
              src="https://lottie.host/c7ff62dd-dbbc-445c-a0c4-ed4f9ad79b33/mkNWrGuTcw.lottie"
              loop
              autoplay
            />
          </motion.div>
          
          <div className="space-y-4 mt-4">
            <motion.div 
              whileHover={{ y: -2 }}
              className="p-3 bg-gray-750 rounded-lg border border-gray-600"
            >
              <h3 className="font-medium text-blue-400">Premier Clubs</h3>
              <p className="text-sm text-gray-300 mt-1">
                Our top-tier clubs with international standard facilities and players.
              </p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -2 }}
              className="p-3 bg-gray-750 rounded-lg border border-gray-600"
            >
              <h3 className="font-medium text-green-400">Regional Development</h3>
              <p className="text-sm text-gray-300 mt-1">
                Clubs across all regions promoting cricket at grassroots level.
              </p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -2 }}
              className="p-3 bg-gray-750 rounded-lg border border-gray-600"
            >
              <h3 className="font-medium text-yellow-400">Join a Club</h3>
              <p className="text-sm text-gray-300 mt-1">
                Find a club near you and start your cricket journey today.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Clubs List Column - adjusted for mobile */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          {/* Search and Filter Section - adjusted for mobile */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-700"
          >
            <div className="flex flex-col md:flex-row gap-3">
              <motion.div 
                whileFocus={{ scale: 1.01 }}
                className="relative flex-grow"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search clubs..."
                  className="pl-10 pr-4 py-2 w-full bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm sm:text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </motion.div>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600 text-sm sm:text-base"
              >
                <FiFilter className="text-gray-300" />
                <span className="text-gray-300">Filters</span>
                {filterOpen ? <FiChevronDown className="transform rotate-180 text-gray-300" /> : <FiChevronDown className="text-gray-300" />}
              </motion.button>
            </div>

            {/* Filter Dropdown - adjusted grid for mobile */}
            <AnimatePresence>
              {filterOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 p-3 sm:p-4 border border-gray-700 rounded-lg bg-gray-750">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                      >
                        <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                        <select
                          className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white text-sm"
                          value={filters.location}
                          onChange={(e) => setFilters({...filters, location: e.target.value})}
                        >
                          <option value="">All Locations</option>
                          {locations.map(location => (
                            <option key={location} value={location}>{location}</option>
                          ))}
                        </select>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                      >
                        <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                        <select
                          className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white text-sm"
                          value={filters.category}
                          onChange={(e) => setFilters({...filters, category: e.target.value})}
                        >
                          <option value="">All Categories</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="sm:col-span-2 md:col-span-1"
                      >
                        <label className="block text-sm font-medium text-gray-300 mb-1">Established After</label>
                        <select
                          className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white text-sm"
                          value={filters.establishedAfter}
                          onChange={(e) => setFilters({...filters, establishedAfter: e.target.value})}
                        >
                          <option value="">Any Year</option>
                          <option value="2020">2020</option>
                          <option value="2010">2010</option>
                          <option value="2000">2000</option>
                          <option value="1990">1990</option>
                          <option value="1980">1980</option>
                        </select>
                      </motion.div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFilters({ location: '', category: '', establishedAfter: '' })}
                        className="px-3 py-1 text-xs sm:text-sm text-gray-400 hover:text-gray-200"
                      >
                        Reset Filters
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Clubs List - adjusted spacing for mobile */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <AnimatePresence>
              {filteredClubs.length > 0 ? (
                filteredClubs.map((club, index) => (
                  <motion.div
                    key={club.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <Link 
                      to={`/clubs/${club.id}`} 
                      className="block bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg hover:transform hover:-translate-y-1 border border-gray-700"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.01 }}
                        className="p-3 sm:p-4 flex items-center"
                      >
                        <div className="flex-shrink-0 mr-3 sm:mr-4">
                          <motion.img 
                            whileHover={{ rotate: 5, scale: 1.1 }}
                            src={club.logo} 
                            alt={`${club.name} logo`} 
                            className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-full border-2 border-blue-400" 
                          />
                        </div>
                        <div className="flex-grow overflow-hidden">
                          <div className="flex items-center justify-between">
                            <h2 className="text-sm sm:text-lg font-bold text-white truncate">{club.name}</h2>
                            {club.category === 'Premier' && (
                              <motion.span 
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="flex items-center text-yellow-400 text-xs sm:text-sm ml-2"
                              >
                                <FiStar className="mr-1" /> Premier
                              </motion.span>
                            )}
                          </div>
                          <div className="flex items-center text-xs sm:text-sm text-gray-400 mt-1 truncate">
                            <FiMapPin className="mr-1 flex-shrink-0" /> 
                            <span className="truncate">{club.location}</span>
                          </div>
                          <div className="flex items-center text-xs sm:text-sm text-gray-400 mt-1 truncate">
                            <FiUsers className="mr-1 flex-shrink-0" /> 
                            <span className="truncate">{club.members} members | Est. {club.established}</span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-gray-800 rounded-lg shadow-md p-6 text-center border border-gray-700"
                >
                  <h3 className="text-base sm:text-lg font-medium text-gray-300">No clubs found matching your criteria</h3>
                  <p className="text-gray-500 mt-2 text-sm sm:text-base">Try adjusting your search or filters</p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({ location: '', category: '', establishedAfter: '' });
                    }}
                    className="mt-3 px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    Reset Search
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clubsmain;