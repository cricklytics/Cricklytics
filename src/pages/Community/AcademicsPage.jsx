import React, { useState } from 'react';
import { 
  FaBook,
  FaVideo,
  FaCertificate,
  FaSearch,
  FaArrowRight,
  FaStar
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import BattingMasterclass from "../../assets/yogesh/communityimg/battingmasterclass.jpg";
import fastbowling from "../../assets/yogesh/communityimg/Spin-Bowling.webp";
import SpinBowling from "../../assets/yogesh/communityimg/spinningball.png";
import wicketkeeping from "../../assets/yogesh/communityimg/wicketkeeping.jpg";
import backButton from '../../assets/kumar/right-chevron.png'

const AcademicsPage = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Sample data - courses only
  const courses = [
    {
      id: 1,
      title: "Cricket Batting Masterclass",
      instructor: "Rahul Dravid",
      level: "Intermediate",
      duration: "6 weeks",
      rating: 4.8,
      students: 1250,
      image: BattingMasterclass,
      description: "Learn the art of batting from 'The Wall' himself. This course covers technical aspects, mental preparation, and match scenarios.",
      syllabus: [
        "Grip & Stance Fundamentals",
        "Footwork & Balance",
        "Playing Different Bowling Types",
        "Building an Innings",
        "Mental Toughness"
      ]
    },
    {
      id: 2,
      title: "Fast Bowling Techniques",
      instructor: "Brett Lee",
      level: "Advanced",
      duration: "8 weeks",
      rating: 4.9,
      students: 980,
      image: fastbowling,
      description: "Master the art of fast bowling with speed, swing, and seam movement techniques from one of the fastest bowlers in history.",
      syllabus: [
        "Run-up & Delivery Action",
        "Generating Pace",
        "Swing & Seam Control",
        "Yorkers & Bouncers",
        "Injury Prevention"
      ]
    },
    {
      id: 3,
      title: "Spin Bowling Wizardry",
      instructor: "Shane Warne",
      level: "All Levels",
      duration: "4 weeks",
      rating: 4.7,
      students: 2100,
      image: SpinBowling,
      description: "Learn the secrets of spin bowling from the legendary Shane Warne. Covers leg spin, googly, flipper and more.",
      syllabus: [
        "Basic Spin Grip Variations",
        "Flight & Deception",
        "Reading Batsmen",
        "Match Situations",
        "Setting Traps"
      ]
    },
    {
      id: 4,
      title: "Wicketkeeping Excellence",
      instructor: "Adam Gilchrist",
      level: "Beginner",
      duration: "5 weeks",
      rating: 4.6,
      students: 750,
      image: wicketkeeping,
      description: "Comprehensive wicketkeeping course covering stance, catching, stumping, and game awareness.",
      syllabus: [
        "Basic Stance & Positioning",
        "Catching Techniques",
        "Stumping Drills",
        "Diving & Reflexes",
        "Game Awareness"
      ]
    }
  ];

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      i < Math.floor(rating) ?
        <FaStar key={i} className="text-yellow-400 inline" /> :
        <FaStar key={i} className="text-gray-300 inline" />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f28] to-[#06122e] text-white">
      {/* Header */}
      <header className="py-6 px-4 shadow-md">
        <div className="container mx-auto">
          <img
                                                src={backButton}
                                                alt="Back"
                                                className="h-8 w-8 cursor-pointer -scale-x-100"
                                                onClick={() => window.history.back()}
                                              />
          <div className="text-center mt-4">
            <h1 className="text-5xl md:text-5xl font-bold">
              Cricket Academics
            </h1>
            <p className="text-blue-200 mt-2">Elevate your cricket knowledge with expert-led courses</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 bg-[#0b1a3b] border border-blue-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="bg-[#0b1a3b] border border-blue-600/30 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer"
              onClick={() => setSelectedCourse(course)}
            >
              <div className="relative h-48">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-xl font-bold">{course.title}</h3>
                  <p className="text-blue-300">{course.instructor}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-xs">
                    {course.level}
                  </span>
                  <div className="flex items-center">
                    {renderStars(course.rating)}
                    <span className="ml-1 text-sm">{course.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-400 mb-3">
                  <span>{course.duration}</span>
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center">
                  View Details <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Course Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-[#0b1a3b] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-blue-500/30">
              <div className="relative">
                <img
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 text-gray-800"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                    <p className="text-blue-400">By {selectedCourse.instructor}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center">
                    {renderStars(selectedCourse.rating)}
                    <span className="ml-2">{selectedCourse.rating} ({selectedCourse.students.toLocaleString()} students)</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">About This Course</h3>
                  <p className="text-gray-300">{selectedCourse.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-[#1a2342] p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaBook className="text-blue-400 mr-2" />
                      <h4 className="font-semibold">Course Level</h4>
                    </div>
                    <p className="text-gray-300">{selectedCourse.level}</p>
                  </div>
                  <div className="bg-[#1a2342] p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaVideo className="text-blue-400 mr-2" />
                      <h4 className="font-semibold">Duration</h4>
                    </div>
                    <p className="text-gray-300">{selectedCourse.duration}</p>
                  </div>
                  <div className="bg-[#1a2342] p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaCertificate className="text-blue-400 mr-2" />
                      <h4 className="font-semibold">Certificate</h4>
                    </div>
                    <p className="text-gray-300">Included</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedCourse.syllabus.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-400 mr-2">✓</span>
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center">
                    Enroll Now
                  </button>
                  <button className="flex-1 border border-blue-500 text-blue-400 hover:bg-blue-900/50 py-3 rounded-lg font-bold">
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Section */}
        {!selectedCourse && (
          <div className="mt-12 bg-[#0b1a3b]/50 border border-blue-600/30 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Cricket Academics By The Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">25+</p>
                <p className="text-gray-400">Courses Available</p>
              </div>
              <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">15</p>
                <p className="text-gray-400">World-Class Instructors</p>
              </div>
              <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">10,000+</p>
                <p className="text-gray-400">Students Enrolled</p>
              </div>
              <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">4.8</p>
                <p className="text-gray-400">Average Rating</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicsPage;