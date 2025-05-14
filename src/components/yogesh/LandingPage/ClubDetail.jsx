// src/components/ClubDetail.jsx
import { useParams } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiUsers, FiCalendar, FiStar, FiMail, FiGlobe } from 'react-icons/fi';
import { Link,navigate } from 'react-router-dom';

const ClubDetail = () => {
  const { id } = useParams();

  // Complete mock data for all 8 clubs
  const mockClubs = [
    {
      id: 1,
      name: 'Royal Cricket Club',
      location: 'Colombo',
      established: 1985,
      members: 120,
      category: 'Premier',
      logo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSzmEFeB0mgig2XnkZmpeg6nLZMAWk5XPtug&s",
      description: 'One of the oldest and most prestigious cricket clubs in the country with multiple championship wins.',
      upcomingMatches: [
        { opponent: 'Lions CC', date: 'May 15', venue: 'R. Premadasa Stadium' },
        { opponent: 'Titans CC', date: 'May 22', venue: 'SSC Ground' }
      ],
      facilities: ['2 turf pitches', 'Indoor nets', 'Gym', 'Swimming pool'],
      contact: {
        email: 'contact@royalcricket.com',
        website: 'www.royalcricket.com',
        phone: '+94 11 2345678'
      },
      achievements: [
        'National Champions 2018, 2020',
        'Premier League Winners 2019',
        'T20 Cup Champions 2021'
      ]
    },
    {
      id: 2,
      name: 'Colombo Lions CC',
      location: 'Colombo',
      established: 1995,
      members: 95,
      category: 'First Class',
      logo: 'https://via.placeholder.com/150',
      description: 'Known for aggressive playing style and strong batting lineup.',
      upcomingMatches: [
        { opponent: 'Royal CC', date: 'May 15', venue: 'CCC Ground' }
      ],
      facilities: ['Turf pitch', 'Practice nets', 'Club house'],
      contact: {
        email: 'info@colombolions.com',
        website: 'www.colombolions.com',
        phone: '+94 11 3456789'
      },
      achievements: [
        'Division 1 Champions 2017',
        'T20 Tournament Winners 2020'
      ]
    },
    {
      id: 3,
      name: 'Kandy Kings Cricket Club',
      location: 'Kandy',
      established: 1978,
      members: 110,
      category: 'Premier',
      logo: 'https://via.placeholder.com/150',
      description: 'Traditional club known for its scenic location and passionate fanbase.',
      upcomingMatches: [
        { opponent: 'Galle United', date: 'May 18', venue: 'Pallekele International Cricket Stadium' },
        { opponent: 'Kurunegala Warriors', date: 'May 25', venue: 'Welagedara Stadium' }
      ],
      facilities: ['3 turf pitches', 'Indoor academy', 'Gym'],
      contact: {
        email: 'kandykings@email.com',
        website: 'www.kandykings.lk',
        phone: '+94 81 2223333'
      },
      achievements: [
        'Provincial Champions 2015',
        'Limited Overs Cup 2022'
      ]
    },
    {
      id: 4,
      name: 'Galle Gladiators',
      location: 'Galle',
      established: 2005,
      members: 75,
      category: 'First Class',
      logo: 'https://via.placeholder.com/150',
      description: 'A modern club focused on developing young talent in the southern province.',
      upcomingMatches: [
        { opponent: 'Kandy Kings', date: 'May 18', venue: 'Galle International Stadium' }
      ],
      facilities: ['Turf pitch', 'Bowling machines', 'Video analysis room', 'Swimming pool'],
      contact: {
        email: 'gallecricket@mail.com',
        website: 'www.gallegladiators.org',
        phone: '+94 91 4445555'
      },
      achievements: [
        'Emerging Clubs Trophy 2021'
      ]
    },
    {
      id: 5,
      name: 'Southern Strikers',
      location: 'Matara',
      established: 2012,
      members: 60,
      category: 'Division I',
      logo: 'https://via.placeholder.com/150',
      description: 'A community-oriented club with a strong emphasis on teamwork and sportsmanship.',
      upcomingMatches: [
        { opponent: 'Hambantota Sharks', date: 'May 22', venue: 'Uyanwatta Stadium' }
      ],
      facilities: ['Practice nets', 'Basic gym', 'Club house'],
      contact: {
        email: 'southernstrikers@email.net',
        website: 'www.southernstrikers.com',
        phone: '+94 41 6667777'
      },
      achievements: [
        'Division II Champions 2019'
      ]
    },
    {
      id: 6,
      name: 'Hambantota Hawks',
      location: 'Hambantota',
      established: 2018,
      members: 50,
      category: 'Division II',
      logo: 'https://via.placeholder.com/150',
      description: 'A relatively new club with modern facilities aiming to promote cricket in the region.',
      upcomingMatches: [
        { opponent: 'Southern Strikers', date: 'May 22', venue: 'Mahinda Rajapaksa International Cricket Stadium' },
        { opponent: 'Eastern Warriors', date: 'May 29', venue: 'Suriyawewa Cricket Ground' }
      ],
      facilities: ['Turf pitch', 'Indoor nets', 'Modern gym'],
      contact: {
        email: 'hambantotahawks@mail.co',
        website: 'www.hambantotahawks.lk',
        phone: '+94 47 8889999'
      },
      achievements: []
    },
    {
      id: 7,
      name: 'Eastern Eagles CC',
      location: 'Trincomalee',
      established: 2000,
      members: 80,
      category: 'Division I',
      logo: 'https://via.placeholder.com/150',
      description: 'Dedicated to fostering cricket talent in the eastern province with experienced coaches.',
      upcomingMatches: [
        { opponent: 'Northern Stars', date: 'May 25', venue: 'Trincomalee Public Ground' }
      ],
      facilities: ['Practice pitches', 'Outdoor nets', 'Small gym'],
      contact: {
        email: 'easterneagles@email.org',
        website: 'www.easterneagles.org',
        phone: '+94 26 3334444'
      },
      achievements: [
        'Eastern Province Champions 2016, 2020'
      ]
    },
    {
      id: 8,
      name: 'Northern Knights CC',
      location: 'Jaffna',
      established: 2015,
      members: 65,
      category: 'Division II',
      logo: 'https://via.placeholder.com/150',
      description: 'Committed to rebuilding and promoting cricket in the northern region.',
      upcomingMatches: [
        { opponent: 'Western Lions', date: 'May 29', venue: 'Jaffna Central College Ground' }
      ],
      facilities: ['Basic pitch', 'Practice area'],
      contact: {
        email: 'northernknights@email.com',
        website: 'www.northernknights.net',
        phone: '+94 21 7778888'
      },
      achievements: []
    }
  ];

  const club = mockClubs.find(c => c.id === parseInt(id));

  if (!club) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Club not found</h1>
          <Link
            to="/Clubsmain"
            className="mt-4 inline-flex items-center px-4 py-2  text-white rounded-md hover:bg-blue-700 transition-colors"  onClick={()=>navigate('/Clubsmain')}
          >
            <FiArrowLeft className="mr-2" />
            Back to Clubs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r text-white py-4 px-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <span
            className="mr-4 p-2 rounded-full hover:bg-blue-700 transition-colors" onClick={()=>navigate('/Clubsmain')}
          >
            <FiArrowLeft className="text-xl" />
          </span>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{club.name}</h1>
            <p className="text-blue-100 text-sm">{club.category} Club</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Club Overview */}
            <div className="md:col-span-1">
              <div className="flex flex-col items-center mb-6">
                <img
                  src={club.logo}
                  alt={`${club.name} logo`}
                 className="w-48 h-48 object-cover rounded-full border-4 border-blue-100 mb-4"
                />
                <div className="text-center">
                  <h2 className="text-xl font-bold">{club.name}</h2>
                  <p className="text-gray-600">{club.location}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-2">Club Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FiUsers className="text-gray-500 mr-2" />
                      <span>{club.members} members</span>
                    </div>
                    <div className="flex items-center">
                      <FiCalendar className="text-gray-500 mr-2" />
                      <span>Established {club.established}</span>
                    </div>
                    {club.category === 'Premier' && (
                      <div className="flex items-center">
                        <FiStar className="text-yellow-500 mr-2" />
                        <span>Premier Club</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-2">Contact</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FiMail className="text-gray-500 mr-2" />
                      <a href={`mailto:${club.contact.email}`} className="text-blue-600 hover:underline">
                        {club.contact.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <FiGlobe className="text-gray-500 mr-2" />
                      <a href={`https://${club.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {club.contact.website}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{club.contact.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Club Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-bold text-gray-800 mb-2">About</h2>
                <p className="text-gray-700">{club.description}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-bold text-gray-800 mb-2">Upcoming Matches</h2>
                <div className="space-y-3">
                  {club.upcomingMatches.length > 0 ? (
                    club.upcomingMatches.map((match, index) => (
                      <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                        <div className="font-medium">vs {match.opponent}</div>
                        <div className="text-sm text-gray-600">{match.date}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          <FiMapPin className="inline mr-1" size={12} />
                          {match.venue}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No upcoming matches scheduled</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-bold text-gray-800 mb-2">Facilities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {club.facilities.map((facility, index) => (
                    <div key={index} className="bg-white p-2 rounded-md shadow-sm text-sm">
                      {facility}
                    </div>
                  ))}
                </div>
              </div>

              {club.achievements && club.achievements.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-bold text-gray-800 mb-2">Achievements</h2>
                  <ul className="space-y-2">
                    {club.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <FiStar className="text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClubDetail;