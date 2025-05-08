import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrophy, FaMedal, FaChartLine } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import Picture3 from '../assets/sophita/HomePage/Picture3.png';

const Tabletoppers = () => {
  const [activeTab, setActiveTab] = useState('leather');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const leatherBallData = [
    { rank: "01", team: "Vysarpadi VGM DNS", since: "28-Jul-2022", matches: 42, wins: 35, dominance: "82%", streak: "W5" },
    { rank: "02", team: "Royal Challengers Bangalore (MPT)", since: "06-Dec-2019", matches: 38, wins: 28, dominance: "74%", streak: "W3" },
    { rank: "03", team: "DIWAN WARRIORS", since: "14-Mar-2024", matches: 29, wins: 22, dominance: "76%", streak: "L1" },
    { rank: "04", team: "WIL STARS", since: "28-Jan-2025", matches: 25, wins: 18, dominance: "72%", streak: "W2" },
    { rank: "05", team: "Maharana Kings 11", since: "15-Feb-2024", matches: 23, wins: 16, dominance: "70%", streak: "W1" }
  ];

  const tennisBallData = [
    { rank: "01", team: "Creators 11s", since: "28-Dec-2024", matches: 48, wins: 40, dominance: "83%", streak: "W7" },
    { rank: "02", team: "Apurva CC", since: "09-Apr-2022", matches: 45, wins: 36, dominance: "80%", streak: "L1" },
    { rank: "03", team: "Freedom Clever Boys", since: "07-Jun-2019", matches: 52, wins: 38, dominance: "73%", streak: "W4" },
    { rank: "04", team: "K.C.S SLOGGERS", since: "06-Sep-2020", matches: 39, wins: 29, dominance: "74%", streak: "L2" },
    { rank: "05", team: "SkyWalkers CC", since: "22-Nov-2022", matches: 35, wins: 25, dominance: "71%", streak: "W1" }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const tabVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#03001e] via-[#7303c0] to-[#ec38bc] text-white">
      {/* Header with Logo and Small Back Button */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto px-4 pt-6 pb-2"
      >
        <div className="flex justify-between items-center p-4 bg-black/30 rounded-lg mb-5">
        <div className="flex items-center gap-4">
            <img
              src={Picture3}
              alt="Cricklytics Logo"
              className="h-10 w-10 md:h-12 md:w-12 object-contain select-none"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/Picture3_2.png";
              }}
            />
             <span className="text-2xl font-bold text-white whitespace-nowrap text-shadow-[0_0_8px_rgba(93,224,230,0.4)]">
              Cricklytics
            </span>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="text-white/80 hover:text-white transition-colors flex items-center gap-1 text-sm"
          >
            <FaArrowLeft className="text-sm" />
            <span>Back</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex border-b border-gray-600">
          {['leather', 'tennis'].map((tab) => (
            <button
              key={tab}
              className={`relative py-4 px-6 font-medium text-lg transition-colors ${activeTab === tab ? 'text-white' : 'text-gray-300 hover:text-white'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'leather' ? 'Leather Ball' : 'Tennis Ball'}
              {activeTab === tab && (
                <motion.div 
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400 rounded-t"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="mb-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
            >
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                <FaChartLine className="text-yellow-400" />
                {activeTab === 'leather' ? 'Leather Ball Dominance' : 'Tennis Ball Supremacy'}
              </h2>
              <p className="text-gray-200">
                The {activeTab === 'leather' ? 'leather ball' : 'tennis ball'} rankings showcase the most consistent teams in Chennai's competitive cricket scene.
              </p>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-sm text-gray-300">Total Teams</div>
                  <div className="text-xl font-bold">{activeTab === 'leather' ? '28' : '32'}</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-sm text-gray-300">Avg. Matches</div>
                  <div className="text-xl font-bold">{activeTab === 'leather' ? '31.4' : '43.7'}</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-sm text-gray-300">Top Win %</div>
                  <div className="text-xl font-bold">{activeTab === 'leather' ? '82%' : '83%'}</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-sm text-gray-300">Longest Streak</div>
                  <div className="text-xl font-bold">{activeTab === 'leather' ? 'W9' : 'W12'}</div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={tabVariants} initial="hidden" animate="visible" className="space-y-6">
              {(activeTab === 'leather' ? leatherBallData : tennisBallData).map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`relative overflow-hidden bg-gradient-to-r ${
                    index === 0
                      ? 'from-yellow-500/10 via-yellow-600/10 to-yellow-700/10 border-yellow-400'
                      : 'from-white/5 via-white/10 to-white/5 border-white/20'
                  } rounded-xl border p-6 shadow-lg`}
                >
                  {index === 0 && (
                    <div className="absolute top-0 right-0 bg-yellow-500 text-black px-3 py-1 text-xs font-bold rounded-bl-lg">
                      CHAMPIONS
                    </div>
                  )}
                  <div className="flex items-start">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 ${
                        index === 0
                          ? 'bg-yellow-400 text-black'
                          : index === 1
                          ? 'bg-gray-300 text-black'
                          : index === 2
                          ? 'bg-amber-600 text-white'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      <span className="text-xl font-bold">{item.rank}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold">{item.team}</h3>
                        <div
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.streak.startsWith('W')
                              ? 'bg-green-500/30 text-green-300'
                              : 'bg-red-500/30 text-red-300'
                          }`}
                        >
                          {item.streak}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">Since {item.since}</p>
                      <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-gray-100">
                        <div>Matches: <span className="font-semibold">{item.matches}</span></div>
                        <div>Wins: <span className="font-semibold">{item.wins}</span></div>
                        <div>Dominance: <span className="font-semibold">{item.dominance}</span></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Tabletoppers;
