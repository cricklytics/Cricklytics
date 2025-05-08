import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Picture3 from '../../../assets/sophita/HomePage/Picture3.png';
import { motion } from 'framer-motion';
import { FaCrown, FaStar, FaArrowLeft } from 'react-icons/fa';

const FieldingStatsPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Function to generate random avatar image URL
  const getRandomAvatar = (seed) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  };

  // Player data with PRO status and random images
  const fieldingData = [
    { 
      name: "Ajay Bhanderi Surat", 
      matches: 644, 
      dismissals: 1069, 
      catches: 999, 
      rank: "001", 
      other: 63, 
      image: getRandomAvatar("Ajay"),
      isPro: true 
    },
    { 
      name: "Nilesh Der Surat", 
      matches: 597, 
      dismissals: 966, 
      catches: 918, 
      rank: "002", 
      other: 46, 
      image: getRandomAvatar("Nilesh"),
      isPro: false 
    },
    { 
      name: "Sahir Attar Pune", 
      matches: 554, 
      dismissals: 787, 
      catches: 627, 
      rank: "003", 
      other: 150, 
      image: getRandomAvatar("Sahir"),
      isPro: true 
    },
    { 
      name: "Ashuu Surat", 
      matches: 466, 
      dismissals: 717, 
      catches: 666, 
      rank: "004", 
      other: 47, 
      image: getRandomAvatar("Ashuu"),
      isPro: false 
    },
    { 
      name: "Pradeep Rajpurohit Mumbai", 
      matches: 466, 
      dismissals: 677, 
      catches: 547, 
      rank: "005", 
      other: 126, 
      image: getRandomAvatar("Pradeep"),
      isPro: false 
    },
    { 
      name: "Milan Hingrajiya Surat", 
      matches: 417, 
      dismissals: 618, 
      catches: 585, 
      rank: "006", 
      other: 29, 
      image: getRandomAvatar("Milan"),
      isPro: false 
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#03001e] via-[#7303c0] to-[#ec38bc] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-gradient-to-r from-[#03001e] to-[#7303c0] p-4 shadow-lg z-10">
        <div className="flex items-center justify-between">
        <div className="fixed bottom-4 left-4 z-50">
      <button 
        onClick={() => navigate("/landingpage")}
        className="flex items-center gap-2 bg-[#7303c0] hover:bg-[#8a05e6] text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        <FaArrowLeft className="text-xl" />
        <span className="hidden sm:inline">Back</span>
      </button>
    </div>
<div className="flex items-center gap-4">
          <img
            src={Picture3}
            alt="Cricklytics Logo"
            className="h-7 w-7 md:h-10 object-contain block select-none mt-1"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/Picture3 2.png";
            }}
          />
          <span className="text-2xl font-bold text-white whitespace-nowrap text-shadow-[0_0_8px_rgba(93,224,230,0.4)]">
            Cricklytics
          </span>
        </div>
          
          {/* Empty div for balance */}
          <div className="w-10"></div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 px-4 md:px-8 pb-8">
        <motion.div 
          className="overflow-x-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="text-left pb-4 px-2 sm:px-4 w-2/5 sm:w-2/5">Player</th>
                <th className="text-center pb-4 px-1 sm:px-4 w-1/12">Mat</th>
                <th className="text-center pb-4 px-1 sm:px-4 w-1/12">Dismissal</th>
                <th className="text-center pb-4 px-1 sm:px-4 w-1/12">Catches</th>
                <th className="text-center pb-4 px-1 sm:px-4 w-1/12">R/</th>
                <th className="text-center pb-4 px-1 sm:px-4 w-1/12">O</th>
              </tr>
            </thead>
            <tbody>
              {fieldingData.map((player, index) => (
                <motion.tr 
                  key={index} 
                  className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
                  variants={rowVariants}
                  whileHover={{ scale: 1.01 }}
                >
                  <td className="py-4 px-2 sm:px-4 w-2/5 sm:w-2/5 font-medium flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gray-700 border-2 border-purple-400">
                        <img 
                          src={player.image} 
                          alt={player.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-player.jpg";
                          }}
                        />
                      </div>
                      {player.isPro && (
                        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-1 flex items-center justify-center">
                          <FaCrown className="text-xs text-white" />
                        </div>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1">
                        <span className="truncate text-sm sm:text-base">{player.name.split(' ')[0]}</span>
                        {player.isPro && (
                          <span className="text-xs bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-0.5 rounded-full flex items-center">
                            PRO
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`text-xs ${i < Math.floor(index % 3 + 3) ? 'text-yellow-400' : 'text-gray-500'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-1 sm:px-4 w-1/12 text-center text-sm sm:text-base">{player.matches}</td>
                  <td className="py-4 px-1 sm:px-4 w-1/12 text-center font-bold text-purple-300 text-sm sm:text-base">{player.dismissals}</td>
                  <td className="py-4 px-1 sm:px-4 w-1/12 text-center text-sm sm:text-base">{player.catches}</td>
                  <td className="py-4 px-1 sm:px-4 w-1/12 text-center font-bold text-yellow-400 text-sm sm:text-base">{player.rank}</td>
                  <td className="py-4 px-1 sm:px-4 w-1/12 text-center text-sm sm:text-base">{player.other}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Floating Trophy Animation */}
        <motion.div
          className="fixed bottom-8 right-8 text-yellow-400 text-4xl"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 3
          }}
        >
          <FaCrown />
        </motion.div>
      </main>
    </div>
  );
};

export default FieldingStatsPage;