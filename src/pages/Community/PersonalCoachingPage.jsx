import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaUserTie, FaVideo, FaChartLine, FaCalendarAlt, FaComments, FaPhoneAlt, FaArrowLeft } from 'react-icons/fa';
import PriyaPatel from "../../assets/yogesh/communityimg/PriyaPatel.png" 
import RahulSharma from "../../assets/yogesh/communityimg/RahulSharma.jpg" 
import VikramSingh from "../../assets/yogesh/communityimg/VikramSingh.jpg" 
import SanjayKumar from "../../assets/yogesh/communityimg/SanjayKumar.png"
import AmitPatel from "../../assets/yogesh/communityimg/AmitPatel.png"
import NehaGupta from "../../assets/yogesh/communityimg/NehaGupta.png"
import RajeshIyer from "../../assets/yogesh/communityimg/RajeshIyer.png"
import AnjaliMehta from "../../assets/yogesh/communityimg/AnjaliMehta.png"
import backButton from '../../assets/kumar/right-chevron.png'

const PersonalCoachingPage = () => {
  const [activeTab, setActiveTab] = useState('batting');
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const navigate = useNavigate();

  const coaches = [
    {
      id: 1,
      name: "Rahul Sharma",
      specialty: "Batting Technique",
      experience: "10+ years",
      rating: 4.8,
      sessions: 250,
      image: RahulSharma,
      bio: "Former first-class cricketer specializing in batting techniques. Helped 50+ players improve their averages.",
      category: "batting"
    },
    {
      id: 2,
      name: "Amit Patel",
      specialty: "Power Hitting",
      experience: "7 years",
      rating: 4.6,
      sessions: 180,
      image: SanjayKumar,
      bio: "Specialist in power hitting techniques and improving strike rates. Worked with T20 specialists.",
      category: "batting"
    },
    {
      id: 3,
      name: "Priya Patel",
      specialty: "Spin Bowling",
      experience: "8 years",
      rating: 4.9,
      sessions: 180,
      image: PriyaPatel,
      bio: "International spin bowling consultant with expertise in finger and wrist spin variations.",
      category: "bowling"
    },
    {
      id: 4,
      name: "Vikram Singh",
      specialty: "Fast Bowling",
      experience: "12 years",
      rating: 4.7,
      sessions: 320,
      image: VikramSingh,
      bio: "Pace bowling specialist with focus on speed, swing, and injury prevention techniques.",
      category: "bowling"
    },
    {
      id: 5,
      name: "Sanjay Kumar",
      specialty: "Fielding & Wicketkeeping",
      experience: "9 years",
      rating: 4.5,
      sessions: 210,
      image: AmitPatel,
      bio: "Fielding coach with expertise in ground fielding, catching, and wicketkeeping techniques.",
      category: "fielding"
    },
    {
      id: 6,
      name: "Neha Gupta",
      specialty: "Agility & Reflex Training",
      experience: "6 years",
      rating: 4.4,
      sessions: 150,
      image: NehaGupta,
      bio: "Specializes in improving fielding reflexes, agility, and reaction times.",
      category: "fielding"
    },
    {
      id: 7,
      name: "Rajesh Iyer",
      specialty: "Cricket Fitness",
      experience: "11 years",
      rating: 4.7,
      sessions: 290,
      image: RajeshIyer,
      bio: "Strength and conditioning specialist for cricketers. Focus on injury prevention and performance enhancement.",
      category: "fitness"
    },
    {
      id: 8,
      name: "Dr. Anjali Mehta",
      specialty: "Sports Psychology",
      experience: "15 years",
      rating: 4.9,
      sessions: 175,
      image: AnjaliMehta,
      bio: "Sports psychologist helping players with performance anxiety, focus, and mental toughness.",
      category: "mental"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Arjun Mehta",
      role: "U19 State Player",
      text: "Coach Rahul transformed my batting stance and footwork. My average improved by 35% in just 3 months!",
      rating: 5
    },
    {
      id: 2,
      name: "Neha Gupta",
      role: "Club Cricketer",
      text: "Priya's spin bowling sessions helped me develop a deadly googly that's become my wicket-taking ball.",
      rating: 5
    },
    {
      id: 3,
      name: "Rohan Desai",
      role: "College Team Captain",
      text: "Vikram's fast bowling program increased my pace by 12km/h while reducing my injury frequency.",
      rating: 4
    }
  ];

  const renderStars = (count) => {
    return Array(5).fill(0).map((_, i) => (
      i < count ? <FaStar key={i} className="text-yellow-400" /> : <FaRegStar key={i} className="text-gray-300" />
    ));
  };

  const filteredCoaches = activeTab === 'all' 
    ? coaches 
    : coaches.filter(coach => coach.category === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f28] to-[#06122e]">
      

      {/* Coaching Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {/* Centered Title */}
          <div className="text-center mb-8">
          <img
      src={backButton}
      alt="Back"
      className="h-8 w-8 cursor-pointer -scale-x-100"
      onClick={() => window.history.back()}
      />
            <h2 className="text-3xl font-bold text-white">Specialized Coaching Areas</h2>
            <p className="text-blue-300 mt-2">Find expert coaches for every aspect of your game</p>
          </div>
          
          <div className="flex flex-wrap justify-center mb-8 border-b border-gray-700">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 font-medium ${activeTab === 'all' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300'}`}
            >
              All Coaches
            </button>
            <button 
              onClick={() => setActiveTab('batting')}
              className={`px-6 py-3 font-medium ${activeTab === 'batting' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300'}`}
            >
              Batting
            </button>
            <button 
              onClick={() => setActiveTab('bowling')}
              className={`px-6 py-3 font-medium ${activeTab === 'bowling' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300'}`}
            >
              Bowling
            </button>
            <button 
              onClick={() => setActiveTab('fielding')}
              className={`px-6 py-3 font-medium ${activeTab === 'fielding' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300'}`}
            >
              Fielding
            </button>
            <button 
              onClick={() => setActiveTab('fitness')}
              className={`px-6 py-3 font-medium ${activeTab === 'fitness' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300'}`}
            >
              Fitness
            </button>
            <button 
              onClick={() => setActiveTab('mental')}
              className={`px-6 py-3 font-medium ${activeTab === 'mental' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300'}`}
            >
              Mental Game
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCoaches.map(coach => (
              <div 
                key={coach.id} 
                className="bg-[#0b1a3b] border border-blue-600/30 rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:border-blue-400 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedCoach(coach)}
              >
                <div className="relative">
                  <img 
                    src={coach.image} 
                    alt={coach.name} 
                    className="w-full h-48 object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="text-white text-xl font-bold">{coach.name}</h3>
                    <p className="text-blue-300">{coach.specialty}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      {renderStars(coach.rating)}
                      <span className="ml-2 text-gray-300">{coach.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-gray-400">{coach.sessions}+ sessions</span>
                  </div>
                  <p className="text-gray-400 mb-4">{coach.experience} experience</p>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coach Modal */}
      {selectedCoach && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={selectedCoach.image} 
                alt={selectedCoach.name} 
                className="w-full h-64 object-contain"
              />
              <button 
                onClick={() => setSelectedCoach(null)}
                className="absolute top-4 right-4 bg-[#0b1a3b] rounded-full p-2 shadow-md hover:bg-[#0b1a3b]/80 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedCoach.name}</h2>
                  <p className="text-blue-400 font-medium">{selectedCoach.specialty}</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center">
                  {renderStars(selectedCoach.rating)}
                  <span className="ml-2 text-gray-300">{selectedCoach.rating.toFixed(1)} ({selectedCoach.sessions}+ sessions)</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-white">About Coach</h3>
                <p className="text-gray-300">{selectedCoach.bio}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#0b1a3b]/50 border border-blue-600/30 p-4 rounded-lg">
                  <FaChartLine className="text-blue-400 text-2xl mb-2" />
                  <h4 className="font-semibold text-white">Performance Analysis</h4>
                  <p className="text-sm text-gray-400">Detailed technical assessment</p>
                </div>
                <div className="bg-[#0b1a3b]/50 border border-blue-600/30 p-4 rounded-lg">
                  <FaVideo className="text-blue-400 text-2xl mb-2" />
                  <h4 className="font-semibold text-white">Video Sessions</h4>
                  <p className="text-sm text-gray-400">Frame-by-frame breakdown</p>
                </div>
                <div className="bg-[#0b1a3b]/50 border border-blue-600/30 p-4 rounded-lg">
                  <FaCalendarAlt className="text-blue-400 text-2xl mb-2" />
                  <h4 className="font-semibold text-white">Custom Plans</h4>
                  <p className="text-sm text-gray-400">Tailored to your needs</p>
                </div>
                <div className="bg-[#0b1a3b]/50 border border-blue-600/30 p-4 rounded-lg">
                  <FaComments className="text-blue-400 text-2xl mb-2" />
                  <h4 className="font-semibold text-white">Ongoing Support</h4>
                  <p className="text-sm text-gray-400">Between sessions</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Session Types</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border border-blue-600/30 rounded-lg bg-[#0b1a3b]/50">
                    <div>
                      <h4 className="font-medium text-white">1-Hour Technical Session</h4>
                      <p className="text-sm text-gray-400">In-person or virtual</p>
                    </div>
                    <span className="font-bold text-white">₹1,500</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-blue-600/30 rounded-lg bg-[#0b1a3b]/50">
                    <div>
                      <h4 className="font-medium text-white">3-Session Package</h4>
                      <p className="text-sm text-gray-400">10% discount</p>
                    </div>
                    <span className="font-bold text-white">₹4,050</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-blue-600/30 rounded-lg bg-[#0b1a3b]/50">
                    <div>
                      <h4 className="font-medium text-white">Month-Long Program</h4>
                      <p className="text-sm text-gray-400">8 sessions + analysis</p>
                    </div>
                    <span className="font-bold text-white">₹10,000</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center">
                  <FaCalendarAlt className="mr-2" /> Book Session
                </button>
                <button className="flex-1 bg-[#0b1a3b] hover:bg-[#0b1a3b]/80 text-white border border-blue-600/30 py-3 rounded-lg font-bold flex items-center justify-center">
                  <FaPhoneAlt className="mr-2" /> Contact Coach
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalCoachingPage;