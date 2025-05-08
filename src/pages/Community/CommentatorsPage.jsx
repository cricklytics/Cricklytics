import React, { useState } from 'react';
import { FiSearch, FiFilter, FiStar, FiMessageSquare, FiUser, FiCalendar, FiMapPin, FiArrowLeft } from 'react-icons/fi';
import cuslogo from "../../assets/yogesh/communityimg/cuslogo.png";
import { useNavigate } from 'react-router-dom';
import backButton from '../../assets/kumar/right-chevron.png'

const CommentatorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCommentator, setSelectedCommentator] = useState(null);
  const navigate = useNavigate();

  const commentators = [
    {
      id: 1,
      name: "Harsha Bhogle",
      location: "Mumbai, India",
      matches: 1250,
      rating: 4.9,
      reviews: 842,
      languages: ["English", "Hindi"],
      image: cuslogo,
      featured: true,
      bio: "Legendary commentator known for his eloquent descriptions and deep cricket knowledge.",
      available: true,
      experience: "25 years"
    },
    {
      id: 2,
      name: "Danny Morrison",
      location: "Auckland, New Zealand",
      matches: 980,
      rating: 4.7,
      reviews: 756,
      languages: ["English"],
      image: cuslogo,
      bio: "Energetic commentator famous for his enthusiastic style and catchphrases.",
      available: true,
      experience: "18 years"
    },
    {
      id: 3,
      name: "Isa Guha",
      location: "London, UK",
      matches: 720,
      rating: 4.8,
      reviews: 632,
      languages: ["English"],
      image: cuslogo,
      featured: true,
      bio: "Former international cricketer turned insightful commentator with a global perspective.",
      available: false,
      experience: "8 years"
    },
    {
      id: 4,
      name: "Sanjay Manjrekar",
      location: "Bangalore, India",
      matches: 1100,
      rating: 4.5,
      reviews: 587,
      languages: ["English", "Hindi", "Kannada"],
      image: cuslogo,
      bio: "Former Test cricketer known for his analytical approach to commentary.",
      available: true,
      experience: "15 years"
    },
    {
      id: 5,
      name: "Mel Jones",
      location: "Melbourne, Australia",
      matches: 650,
      rating: 4.6,
      reviews: 498,
      languages: ["English"],
      image: cuslogo,
      bio: "Former Australian player providing expert analysis in women's and men's cricket.",
      available: true,
      experience: "10 years"
    },
    {
      id: 6,
      name: "Rameez Raja",
      location: "Lahore, Pakistan",
      matches: 920,
      rating: 4.4,
      reviews: 521,
      languages: ["English", "Urdu"],
      image: cuslogo,
      bio: "Former Pakistan captain offering unique player insights during commentary.",
      available: false,
      experience: "12 years"
    }
  ];

  const filteredCommentators = commentators.filter(commentator => {
    const matchesSearch = commentator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commentator.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'featured') return matchesSearch && commentator.featured;
    if (activeTab === 'available') return matchesSearch && commentator.available;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f28] to-[#06122e] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with back button in top left and centered title */}
        <div className="mb-8 relative">
          <div className="md:absolute flex items-center gap-4">
            <img
              src={backButton}
              alt="Back"
              className="h-8 w-8 cursor-pointer -scale-x-100"
              onClick={() => window.history.back()}
            />
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Cricket Commentators</h1>
            <p className="text-blue-300">Find and connect with professional cricket commentators worldwide</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search commentators by name or location..."
              className="w-full pl-10 pr-4 py-2 bg-[#0b1a3b] border border-blue-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-blue-400" />
            <select
              className="bg-[#0b1a3b] border border-blue-600/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="all">All Commentators</option>
              <option value="featured">Featured</option>
              <option value="available">Available Now</option>
            </select>
          </div>
        </div>

        {selectedCommentator ? (
          <div className="bg-[#0b1a3b] border border-blue-600/50 rounded-xl p-6 shadow-lg">
            <button
              onClick={() => setSelectedCommentator(null)}
              className="mb-4 flex items-center text-red-400 hover:text-red-300 transition-colors"
            >
              <FiArrowLeft className="mr-2" /> Back to all commentators
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <img
                  src={selectedCommentator.image}
                  alt={selectedCommentator.name}
                  className="w-full h-auto rounded-lg object-cover"
                />
                <div className="mt-4 flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm ${selectedCommentator.available ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {selectedCommentator.available ? 'Available' : 'Not Available'}
                  </span>
                  <div className="flex items-center text-yellow-400">
                    <FiStar className="mr-1" />
                    <span>{selectedCommentator.rating}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCommentator.languages.map(lang => (
                      <span key={lang} className="bg-[#0b1a3b] border border-blue-600/30 text-blue-300 px-2 py-1 rounded-full text-xs">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-2">{selectedCommentator.name}</h2>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center text-blue-300">
                    <FiMapPin className="mr-2" />
                    <span>{selectedCommentator.location}</span>
                  </div>
                  <div className="flex items-center text-blue-300">
                    <FiCalendar className="mr-2" />
                    <span>{selectedCommentator.experience} experience</span>
                  </div>
                  <div className="flex items-center text-blue-300">
                    <FiUser className="mr-2" />
                    <span>{selectedCommentator.matches} matches commented</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-6">{selectedCommentator.bio}</p>

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
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommentators.map(commentator => (
              <div
                key={commentator.id}
                className="bg-[#0b1a3b] border border-blue-600/50 rounded-xl p-4 hover:border-blue-400 transition-all cursor-pointer hover:shadow-lg"
                onClick={() => setSelectedCommentator(commentator)}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={commentator.image}
                    alt={commentator.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div>
                    <h3 className="font-bold">{commentator.name}</h3>
                    <div className="flex items-center text-yellow-400 text-sm">
                      <FiStar className="mr-1" />
                      <span>{commentator.rating}</span>
                    </div>
                    <div className="flex items-center text-blue-300 text-sm mt-1">
                      <FiMapPin className="mr-1" />
                      <span>{commentator.location}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-gray-400 text-sm">{commentator.matches} matches</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${commentator.available ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {commentator.available ? 'Available' : 'Booked'}
                  </span>
                </div>
                {commentator.featured && (
                  <div className="mt-2 flex justify-end">
                    <span className="bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded-full flex items-center">
                      <FiStar className="mr-1" /> Featured
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!selectedCommentator && (
          <div className="mt-12 bg-[#0b1a3b]/50 border border-blue-600/30 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Commentary Community Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{commentators.length}+</p>
                <p className="text-gray-400">Professional Commentators</p>
              </div>
              <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{commentators.filter(c => c.available).length}</p>
                <p className="text-gray-400">Available Now</p>
              </div>
              <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{commentators.reduce((acc, c) => acc + c.matches, 0)}+</p>
                <p className="text-gray-400">Matches Commented</p>
              </div>
              <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{new Set(commentators.flatMap(c => c.languages)).size}</p>
                <p className="text-gray-400">Languages Covered</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentatorsPage;