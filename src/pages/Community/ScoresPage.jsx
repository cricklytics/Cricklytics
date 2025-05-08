import React from "react";
// import { Link } from "react-router-dom";
// import { FiArrowLeft } from 'react-icons/fi';
import backButton from '../../assets/kumar/right-chevron.png'
const dummyPlayers = [
  {
    id: 1,
    name: "MALARAMPURIA",
    location: "Hanumangarh",
    matches: 8124,
    rating: 4.0,
    reviews: 48,
  },
  {
    id: 2,
    name: "Shaik Afridi",
    location: "Bellary",
    matches: 5188,
    rating: 4.0,
    reviews: 200,
  },
  {
    id: 3,
    name: "Wasim Akram",
    location: "Chennai",
    matches: 4070,
    rating: 4.1,
    reviews: 270,
  },
  {
    id: 4,
    name: "Karan Soni",
    location: "Ahmedabad",
    matches: 5336,
    rating: 4.6,
    reviews: 257,
  },
  {
    id: 5,
    name: "Nirdosh Choudhary",
    location: "Gangangar",
    matches: 4723,
    rating: 5.0,
    reviews: 5,
  },
  {
    id: 6,
    name: "Rupesh Bhabal 8850674575",
    location: "Mumbai",
    matches: 3859,
    rating: 5.0,
    reviews: 23,
  },
  {
    id: 7,
    name: "1612UMESH",
    location: "Mumbai",
    matches: 5276,
    rating: 4.5,
    reviews: 31,
  },
  {
    id: 8,
    name: "Rahul Bhabal",
    location: "Mumbai",
    matches: 4517,
    rating: 5.0,
    reviews: 26,
  },
  {
    id: 9,
    name: "Saiyad Safvan (Noddy)",
    location: "Jaipur",
    matches: 3845,
    rating: 4.8,
    reviews: 145,
  },
];

const ScoresPage = () => {
  return (
    <section className="bg-[#0b0f28] min-h-screen text-white px-4 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="md:absolute flex items-center gap-4">
                          <img
                            src={backButton}
                            alt="Back"
                            className="h-8 w-8 cursor-pointer -scale-x-100"
                            onClick={() => window.history.back()}
                          />
                      </div>
          <div className="flex-grow">
            <header className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-blue-400">
                Score Profiles
              </h1>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">
                View player statistics and ratings from your cricket community
              </p>
            </header>
          </div>
          <div></div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyPlayers.map((player) => (
            <div
              key={player.id}
              className="bg-[#111936] rounded-xl p-4 border border-blue-500/30 hover:border-blue-400 hover:scale-[1.02] transition-transform duration-300 shadow-lg"
            >
              <div className="mb-3">
                <h2 className="text-xl font-bold text-blue-300">
                  {player.name}
                </h2>
                <p className="text-gray-400 text-sm">{player.location}</p>
              </div>

              <div className="mb-2">
                <p className="text-gray-300">
                  Matches Scored:{" "}
                  <span className="text-green-300 font-bold">
                    {player.matches.toLocaleString()}
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-yellow-400 font-bold mr-1">
                    {player.rating}/5
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(player.rating)
                            ? "text-yellow-400"
                            : "text-gray-600"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <span className="text-gray-400 text-sm">
                  {player.reviews} Review(s)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScoresPage;
