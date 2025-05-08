import React from "react";
import { FaMapMarkerAlt, FaEnvelope, FaCalendarCheck, FaArrowLeft } from "react-icons/fa";
import ChennaiCricket from "../../assets/yogesh/communityimg/ChennaiCricket.png";
import MumbaiSmash from "../../assets/yogesh/communityimg/MumbaiSmash.jpg";
import DelhiPro from "../../assets/yogesh/communityimg/DelhiProCricket.png";
import SouthZone from "../../assets/yogesh/communityimg/SouthZoneTournaments.jpg";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import backButton from '../../assets/kumar/right-chevron.png'

const organisers = [
  {
    id: 1,
    name: "Chennai Cricket Events",
    location: "Chennai, India",
    events: 28,
    avatar: ChennaiCricket,
    email: "contact@ccevents.in",
  },
  {
    id: 2,
    name: "Mumbai Smash League",
    location: "Mumbai, India",
    events: 40,
    avatar: MumbaiSmash,
    email: "info@mumbaismash.in",
  },
  {
    id: 3,
    name: "Delhi Pro Cricket",
    location: "Delhi, India",
    events: 15,
    avatar: DelhiPro,
    email: "connect@delhipro.com",
  },
  {
    id: 4,
    name: "South Zone Tournaments",
    location: "Bengaluru, India",
    events: 32,
    avatar: SouthZone,
    email: "szt@crickorg.com",
  },
];

const OrganisersPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page in history
  };

  return (
    <section className="bg-gradient-to-b from-[#0b0f28] to-[#06122e] text-white min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <img
                                      src={backButton}
                                      alt="Back"
                                      className="h-8 w-8 cursor-pointer -scale-x-100"
                                      onClick={() => window.history.back()}
                                    />
        </div>
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-400 mb-2">
            Cricket Organisers
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Explore organizers conducting leagues, tournaments, and cricket events near you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {organisers.map((org) => (
            <div
              key={org.id}
              className="bg-[#111936] rounded-xl p-5 border border-blue-600/30 hover:border-blue-400 shadow-md hover:shadow-blue-700/20 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={org.avatar}
                  alt={org.name}
                  className="w-16 h-16 rounded-full border-2 border-blue-500"
                />
                <div>
                  <h2 className="text-lg font-semibold">{org.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <FaMapMarkerAlt className="text-blue-400" />
                    <span>{org.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <FaCalendarCheck className="text-green-400" />
                    <span>{org.events} Events Hosted</span>
                  </div>
                </div>
              </div>

              <button
                className="w-full mt-2 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition flex items-center justify-center gap-2"
                onClick={() => window.location = `mailto:${org.email}`}
              >
                <FaEnvelope /> Contact
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default OrganisersPage;
