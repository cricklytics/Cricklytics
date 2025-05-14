import React from 'react';
import rajeshsharama from "../../../assets/yogesh/clubimg/rajeshsharama.jpeg"
import PriyaSingh from "../../../assets/yogesh/clubimg/PriyaSingh.jpeg"
import VikramMehta from "../../../assets/yogesh/clubimg/VikramMehta.jpeg"

const more = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gray-800 text-white">
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            About Jaipur Corporate Cricket
          </h1>
          <p className="mt-6 text-xl max-w-3xl mx-auto text-gray-300">
            Celebrating the spirit of cricket and corporate camaraderie since 2015
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Our Story */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-12 border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-2">Our Story</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg text-gray-300 mb-4">
                Founded in 2015, Jaipur Corporate Cricket (JCC) began as a small initiative to bring together 
                professionals from different industries through their shared love for cricket. What started with 
                just 4 teams has now grown into Rajasthan's premier corporate cricket tournament.
              </p>
              <p className="text-lg text-gray-300 mb-4">
                Over the years, we've hosted over 200 matches, featured 500+ corporate players, and entertained 
                thousands of cricket enthusiasts. Our tournament has become a much-anticipated annual event in 
                Jaipur's sporting calendar.
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                alt="Early tournament days"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Mission and Values */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-12 border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-2">Our Mission & Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
              <div className="text-indigo-400 text-4xl mb-4">🏆</div>
              <h3 className="text-white text-xl font-bold mb-2">Promoting Sportsmanship</h3>
              <p className="text-gray-300">
                We believe cricket is more than a game - it's a platform for building character, discipline, 
                and teamwork that translates to professional success.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
              <div className="text-amber-400 text-4xl mb-4">🤝</div>
              <h3 className="text-white text-xl font-bold mb-2">Corporate Networking</h3>
              <p className="text-gray-300">
                Creating opportunities for professionals across industries to connect, collaborate, and build 
                relationships beyond the boardroom.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
              <div className="text-green-400 text-4xl mb-4">🌱</div>
              <h3 className="text-white text-xl font-bold mb-2">Community Development</h3>
              <p className="text-gray-300">
                Through cricket, we support local talent, engage with our community, and contribute to sports 
                infrastructure development in Rajasthan.
              </p>
            </div>
          </div>
        </div>

        {/* Tournament Highlights */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-12 border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-2">Tournament Highlights</h2>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 bg-gray-700 rounded-lg p-4 flex items-center justify-center border border-gray-600">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHSXX1NS5eAFf1_WQfEo5DsGv-5l7IVYRBoQ&s" 
                  alt="Tournament trophy"
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="md:w-2/3">
                <h3 className="text-gray-300 text-xl font-bold mb-2">Growth Over Years</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>2015: Inaugural season with 4 teams</li>
                  <li>2018: Expanded to 8 competitive teams</li>
                  <li>2020: Introduced women's exhibition matches</li>
                  <li>2022: First televised finals with 10,000+ live audience</li>
                  <li>2023: Featured 12 corporate teams from across Rajasthan</li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <p className="text-4xl font-bold text-indigo-400">200+</p>
                <p className="text-gray-300">Matches Played</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <p className="text-4xl font-bold text-indigo-400">500+</p>
                <p className="text-gray-300">Corporate Players</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <p className="text-4xl font-bold text-indigo-400">8</p>
                <p className="text-gray-300">Seasons Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-2">Our Team</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                name: "Rajesh Sharma",
                role: "Founder & Commissioner",
                bio: "Former Ranji Trophy player with a vision to bring corporate cricket to Rajasthan",
                img: rajeshsharama
              },
              {
                name: "Priya Singh",
                role: "Tournament Director",
                bio: "Sports management expert with 10+ years organizing premier tournaments",
                img: PriyaSingh
              },
              {
                name: "Vikram Mehta",
                role: "Head of Operations",
                bio: "Ensures seamless execution of all tournament logistics and facilities",
                img: VikramMehta
              }
            ].map((member, index) => (
              <div key={index} className="bg-gray-700 rounded-lg overflow-hidden shadow-sm border border-gray-600">
                <img 
                  src={member.img} 
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <p className="text-indigo-400 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-300">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - Uncomment if needed */}
      {/* <div className="bg-gray-800 text-white border-t border-gray-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Us?</h2>
          <p className="text-xl mb-6 max-w-3xl mx-auto text-gray-300">
            Whether as a player, sponsor, or volunteer - be part of Rajasthan's most exciting corporate cricket event
          </p>
          <div className="space-x-4">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700">
              Register Your Team
            </button>
            <button className="bg-transparent border-2 border-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-gray-900">
              Contact Us
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default more;