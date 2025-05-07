import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import nav from '../../assets/kumar/right-chevron.png';
import frd1 from '../../assets/kumar/frd1.jpg';
import frd2 from '../../assets/kumar/frd2.jpg';

const TournamentPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('menu');
  const [teams, setTeams] = useState([]);
  const [sharedLink, setSharedLink] = useState('');
  const [showTeamCards, setShowTeamCards] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState([]);
 
  const [pendingTeams, setPendingTeams] = useState([
    { id: 1, name: 'Team Alpha' },
    { id: 2, name: 'Team Bravo' },
  ]);
  const [acceptedTeams, setAcceptedTeams] = useState([]);
 
  const handleAddTeamMode = () => {
    setShowTeamCards(true);
  };
 
  const handleCardClick = (teamName) => {
    // Check if team is already selected
    if (!selectedTeams.includes(teamName)) {
      setSelectedTeams([...selectedTeams, teamName]);
      const newTeam = { id: Date.now(), name: teamName };
      setTeams((prev) => [...prev, newTeam]);
    }
  };
 
  const handleShare = () => {
    const link = `https://tournament.example.com/invite/${Date.now()}`;
    setSharedLink(link);
  };
 
  const handleCopyLink = () => {
    navigator.clipboard.writeText(sharedLink);
    alert('Link copied to clipboard!');
  };
 
  const handleAccept = (team) => {
    setAcceptedTeams([...acceptedTeams, team]);
    setPendingTeams(pendingTeams.filter((t) => t.id !== team.id));
  };
 
  const handleReject = (team) => {
    setPendingTeams(pendingTeams.filter((t) => t.id !== team.id));
  };
 
  const handleCancel = () => {
    // Clear selected teams and reset the display
    setSelectedTeams([]);
    setTeams([]);
    setShowTeamCards(false);
  };
 
  return (
    <section className="bg-gradient-to-b from-[#0D171E] to-[#283F79] text-white p-4 md:px-8 md:pb-1 min-h-screen flex items-center w-full overflow-hidden z-0 relative">
      <div className="z-20 flex overflow-hidden justify-center w-full p-2 md:px-[5rem] md:pt-[1rem] relative">
        <form className="z-30 gap-5 md:gap-10 bg-[#1A2B4C] rounded-xl md:rounded-[2rem] shadow-[8px_-5px_0px_2px_#253A6E] md:shadow-[22px_-14px_0px_5px_#253A6E] flex flex-col items-center justify-around w-full max-w-[70rem] m-2 md:m-4 p-4 md:pl-[5rem] md:pr-[5rem] md:pt-[5rem] md:pb-[1rem] text-start">
          <h1 className="text-2xl md:text-5xl font-bold mb-4 md:mb-2 mt-4 md:-mt-8 text-center">Tournament Setup</h1>
 
          {step === 'menu' && (
            <div className="flex flex-row md:flex-col gap-4 md:gap-10 w-[50%] justify-center">
        
              <button
                onClick={() => navigate('/next')}
                className="text-sm cursor-pointer absolute top-4 left-4 md:top-10 md:left-10"
              >
                <img src={nav} className="w-8 h-8 md:w-10 md:h-10 -scale-x-100" alt="Back" />
              </button>
              <div className='flex flex-col md:flex-row gap-4 md:gap-10 w-full justify-center'>
              <button 
                onClick={() => setStep('addManually')}
                className="bg-[linear-gradient(120deg,_#000000,_#001A80)] px-2 py-4 md:px-6 md:py-3 rounded-xl md:rounded-2xl border border-white hover:bg-green-700 cursor-pointer text-sm md:text-base"
              >
                Add Teams Manually
              </button>
              <button
                onClick={() => {
                  handleShare();
                  setStep('share');
                }}
                className="px-2 py-4 md:px-6 md:py-3 rounded-xl md:rounded-2xl hover:bg-blue-700 cursor-pointer bg-gradient-to-l bg-[linear-gradient(120deg,_#000000,_#001A80)] border border-white text-sm md:text-base"
              >
                Share With Organisers
              </button>
              </div>
              <div className="flex justify-center w-full gap-4 mt-20">
                    <button
                      type="button"
                      className="rounded-xl w-32 md:w-44 bg-gray-500 h-8 md:h-9 text-white cursor-pointer hover:shadow-[0px_0px_13px_0px_#5DE0E6] text-sm md:text-base"
                      onClick={() => navigate("/landingpage")}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl w-32 md:w-44 bg-gradient-to-l from-[#5DE0E6] to-[#004AAD] h-8 md:h-9 text-white cursor-pointer hover:shadow-[0px_0px_13px_0px_#5DE0E6] text-sm md:text-base"
                      onClick={() => navigate('/match-start', { state: { targetTab: 'Fixture Generator' } })}
                    >
                      Next
                    </button>
                  </div>
            </div>
          )}
        
 
          {step === 'addManually' && (
            <div className='flex flex-col items-center w-full'>
              <button
                onClick={() => {
                  setStep('menu');
                  setShowTeamCards(false);
                }}
                className="text-sm cursor-pointer absolute top-4 left-4 md:top-10 md:left-10"
              >
                <img src={nav} className="w-8 h-8 md:w-10 md:h-10 -scale-x-100" alt="Back" />
              </button>
              <h2 className="text-xl md:text-2xl font-semibold mb-1 text-center">Team List</h2>
              <ul className="w-full space-y-2 mb-4">
              {selectedTeams.map((teamName, index) => (
                  <li key={index} className="bg-white/10 px-4 py-2 rounded text-sm md:text-base">
                    {teamName}
                  </li>
                ))}
              </ul>
 
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleAddTeamMode();
                }}
                className="mt-2 md:mt-4 bg-[linear-gradient(120deg,_#000000,_#001A80)] px-4 py-2 md:px-5 md:py-2 rounded hover:bg-yellow-700 cursor-pointer text-sm md:text-base"
              >
                + Add Team
              </button>
 
              {showTeamCards && (
                <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 h-fit my-4 md:mt-10 gap-3 md:gap-5">
                  {[
                    { id: 'team1', name: 'India', img: frd1 },
                    { id: 'team2', name: 'Australia', img: frd1 },
                    { id: 'team3', name: 'England', img: frd2 },
                    { id: 'team4', name: 'Pakistan', img: frd2 },
                    { id: 'team5', name: 'New Zealand', img: frd1 },
                    { id: 'team6', name: 'Netherlands', img: frd1 },
                    { id: 'team7', name: 'South Africa', img: frd1 },
                  ].map((team) => (
                    <div
                      key={team.id}
                      className={`flex bg-blue-900 items-center gap-3 md:gap-5 h-16 md:h-20 hover:shadow-[0px_0px_13px_0px_#253A6E] hover:bg-blue-400 hover:cursor-pointer rounded-lg md:rounded-xl p-2 ${
                        selectedTeams.includes(team.name) ? 'bg-blue-700' : ''
                      }`}
                      onClick={() => handleCardClick(team.name)}
                    >
                      <img src={team.img} className="h-10 w-10 md:h-12 md:w-12 rounded-full" alt={team.name} />
                      <div className="w-full h-fit">
                        <h1 className="text-sm md:text-lg font-bold">{team.name}</h1>
                        <h3 className="text-xs md:text-sm">Lorem ipsum dolor sit amet consectetur.</h3>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-center w-full gap-4 mt-20">
                    <button
                      type="button"
                      className="rounded-xl w-32 md:w-44 bg-gray-500 h-8 md:h-9 text-white cursor-pointer hover:shadow-[0px_0px_13px_0px_#5DE0E6] text-sm md:text-base"
                      onClick={handleCancel}
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      className="rounded-xl w-32 md:w-44 bg-gradient-to-l from-[#5DE0E6] to-[#004AAD] h-8 md:h-9 text-white cursor-pointer hover:shadow-[0px_0px_13px_0px_#5DE0E6] text-sm md:text-base"
                      onClick={() => navigate('/match-start', { state: { selectedTeams: selectedTeams } })}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              {!showTeamCards && ( // Only show if cards are hidden
                 <div className="flex justify-center w-full gap-4 mt-20">
                     <button
                       type="button"
                       className="rounded-xl w-32 md:w-44 bg-gray-500 h-8 md:h-9 text-white cursor-pointer hover:shadow-[0px_0px_13px_0px_#5DE0E6] text-sm md:text-base"
                       onClick={handleCancel}
                     >
                       Clear
                     </button>
                     <button
                       type="button" // Changed to button type
                       className="rounded-xl w-32 md:w-44 bg-gradient-to-l from-[#5DE0E6] to-[#004AAD] h-8 md:h-9 text-white cursor-pointer hover:shadow-[0px_0px_13px_0px_#5DE0E6] text-sm md:text-base"
                       onClick={() => navigate('/match-start', { state: { selectedTeams: selectedTeams } })}
                     >
                       Next
                     </button>
                   </div>
               )}
            </div>
          )}
 
          {step === 'share' && (
            <div className="w-full">
              <button
                onClick={() => {
                  setStep('menu');
                  setShowTeamCards(false);
                }}
                className="text-sm cursor-pointer absolute top-4 left-4 md:top-10 md:left-10"
              >
                <img src={nav} className="w-8 h-8 md:w-10 md:h-10 -scale-x-100" alt="Back" />
              </button>
              <h2 className="text-xl md:text-2xl font-semibold mb-4">Share with Organisers</h2>
              <p className="mb-2 text-sm md:text-base">Send this link to invite teams:</p>
              <div className="bg-white/10 px-4 py-2 rounded mb-4 overflow-x-auto text-xs md:text-base">{sharedLink}</div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-6">
                <button
                  onClick={handleCopyLink}
                  className="bg-white/10 px-4 py-2 rounded hover:bg-white/20 text-sm md:text-base"
                >
                  📋 Copy Link
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    'Join our tournament: ' + sharedLink
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 px-4 py-2 rounded bg-[linear-gradient(120deg,_#000000,_#001A80)] text-center text-sm md:text-base"
                >
                  📤 Share via WhatsApp
                </a>
              </div>
 
              <h3 className="text-lg md:text-xl font-bold mt-4 md:mt-6 mb-2">Pending Teams (Lobby)</h3>
              {pendingTeams.length === 0 && <p className="text-sm md:text-base">No teams waiting.</p>}
              {pendingTeams.map((team) => (
                <div
                  key={team.id}
                  className="flex flex-col md:flex-row md:justify-between md:items-center bg-white/10 px-4 py-2 rounded my-2"
                >
                  <span className="text-sm md:text-base mb-1 md:mb-0">{team.name}</span>
                  <div className="space-x-2 space-y-1 md:space-y-0">
                    <button
                      onClick={() => handleAccept(team)}
                      className="bg-blue-900 px-2 py-1 md:px-3 md:py-1 rounded hover:bg-blue-500 cursor-pointer text-xs md:text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(team)}
                      className="bg-red-500 px-2 py-1 md:px-3 md:py-1 rounded hover:bg-red-600 cursor-pointer text-xs md:text-sm"
                    >
                      Reject
                    </button>
                  </div>
                  
                </div>
                
              ))}
 
              {acceptedTeams.length > 0 && (
                <div className="mt-4 md:mt-6">
                  <h3 className="text-lg md:text-xl font-bold mb-2">Accepted Teams</h3>
                  <ul className="space-y-2">
                    {acceptedTeams.map((team) => (
                      <li
                        key={team.id}
                        className="bg-green-700 px-4 py-2 rounded text-white text-sm md:text-base"
                      >
                        {team.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex justify-center w-full gap-4 mt-20">
                    <button
                      type="button"
                      className="rounded-xl w-32 md:w-44 bg-gray-500 h-8 md:h-9 text-white cursor-pointer hover:shadow-[0px_0px_13px_0px_#5DE0E6] text-sm md:text-base"
                      onClick={handleCancel}
                    >
                      Clear
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl w-32 md:w-44 bg-gradient-to-l from-[#5DE0E6] to-[#004AAD] h-8 md:h-9 text-white cursor-pointer hover:shadow-[0px_0px_13px_0px_#5DE0E6] text-sm md:text-base"
                    >
                      Next
                    </button>
                  </div>
                  
            </div>
            
          )}
          
        </form>
      </div>
    </section>
  );
};
 
export default TournamentPage;