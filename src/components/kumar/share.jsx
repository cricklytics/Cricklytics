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

  const [pendingTeams, setPendingTeams] = useState([
    { id: 1, name: 'Team Alpha' },
    { id: 2, name: 'Team Bravo' },
  ]);
  const [acceptedTeams, setAcceptedTeams] = useState([]);

  const handleAddTeamMode = () => {
    setShowTeamCards(true);
  };

  const handleCardClick = (teamName) => {
    const newTeam = { id: Date.now(), name: teamName };
    setTeams((prev) => [...prev, newTeam]);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D171E] to-[#283F79] text-white p-8">
      <div className="z-20 flex overflow-hidden justify-center h-[100%] p-[5rem] relative">
        <form className="z-30 gap-10 bg-[#1A2B4C] rounded-[2rem] shadow-[22px_-14px_0px_5px_#253A6E] flex flex-col items-center justify-center h-[100%] w-[80%] px-[5rem] py-[5rem]">
          <h1 className="text-4xl font-bold mb-6 text-center">Tournament Setup</h1>

          {step === 'menu' && (
            
            <div className="flex gap-10">
                 <button
                onClick={() => navigate('/next')}
                className="mt-10 text-sm cursor-pointer"
              >
                <img src={nav} className="absolute w-10 h-10 -scale-x-100 top-30 left-55" alt="Back" />
              </button>
              <button
                onClick={() => setStep('addManually')}
                className="bg-[linear-gradient(120deg,_#000000,_#001A80)] px-6 py-3 rounded-2xl border border-white border-[1px] hover:bg-green-700 cursor-pointer"
              >
                Add Teams Manually
              </button>
              <button
                onClick={() => {
                  handleShare();
                  setStep('share');
                }}
                className="px-6 py-3 rounded-2xl hover:bg-blue-700 cursor-pointer bg-gradient-to-l bg-[linear-gradient(120deg,_#000000,_#001A80)] border border-white border-[1px]"
              >
                Share With Organisers
              </button>
            </div>
          )}

          {step === 'addManually' && (
            <div className='flex flex-col items-center'>
              <button
                onClick={() => {
                  setStep('menu');
                  setShowTeamCards(false); 
                }}
                className="text-sm cursor-pointer"
              >
                 <img src={nav} className="absolute w-10 h-10 -scale-x-100 top-30 left-55" alt="Back" />
              </button>
              <h2 className="text-2xl text-center font-semibold mb-4">Team List</h2>
              <ul className="w-100 space-y-2">
                {teams.map((team) => (
                  <li key={team.id} className="bg-white/10 px-4 py-2 rounded">
                    {team.name}
                  </li>
                ))}
              </ul>

              <button
                id="+"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddTeamMode();
                }}
                className="mt-4 bg-[linear-gradient(120deg,_#000000,_#001A80)] px-5 py-2 rounded hover:bg-yellow-700 cursor-pointer"
              >
                + Add Team
              </button>

              {showTeamCards && (
                <div id="teams+" className="flex flex-col w-full h-fit my-10 gap-5">
                  {[
                    { id: 'team1', name: 'Team 1', img: frd1 },
                    { id: 'team2', name: 'Team 2', img: frd1 },
                    { id: 'team3', name: 'Team 3', img: frd2 },
                    { id: 'team4', name: 'Team 4', img: frd2 },
                  ].map((team) => (
                    <div
                      key={team.id}
                      id={team.id}
                      className="flex bg-blue-900 items-center gap-5 w-150 h-20 hover:shadow-[0px_0px_13px_0px_#253A6E] hover:bg-blue-400 hover:cursor-pointer rounded-xl"
                      onClick={() => handleCardClick(team.name)}
                    >
                      <img src={team.img} className="h-15 w-15 rounded-full ml-3" alt={team.name} />
                      <div className="w-full h-fit text-center">
                        <h1 className="text-lg font-bold">{team.name}</h1>
                        <h3>Lorem ipsum dolor sit amet consectetur.</h3>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 'share' && (
            <div>
                 <button
                onClick={() => {
                  setStep('menu');
                  setShowTeamCards(false); 
                }}
                className="text-sm cursor-pointer"
              >
                 <img src={nav} className="absolute w-10 h-10 -scale-x-100 top-30 left-55" alt="Back" />
              </button>
              <h2 className="text-2xl font-semibold mb-4">Share with Organisers</h2>
              <p className="mb-2">Send this link to invite teams:</p>
              <div className="bg-white/10 px-4 py-2 rounded mb-4">{sharedLink}</div>
              <div className="flex gap-4">
                <button
                  onClick={handleCopyLink}
                  className="bg-white/10 px-4 py-2 rounded hover:bg-white/20"
                >
                  📋 Copy Link
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    'Join our tournament: ' + sharedLink
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 px-4 py-2 rounded bg-[linear-gradient(120deg,_#000000,_#001A80)]"
                >
                  📤 Share via WhatsApp
                </a>
              </div>

              <h3 className="text-xl font-bold mt-6 mb-2">Pending Teams (Lobby)</h3>
              {pendingTeams.length === 0 && <p>No teams waiting.</p>}
              {pendingTeams.map((team) => (
                <div
                  key={team.id}
                  className="flex justify-between items-center bg-white/10 px-4 py-2 rounded my-2"
                >
                  <span>{team.name}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleAccept(team)}
                      className="bg-blue-900 px-3 py-1 rounded hover:bg-blue-500 cursor-pointer"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(team)}
                      className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}

              {acceptedTeams.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-2">Accepted Teams</h3>
                  <ul className="space-y-2">
                    {acceptedTeams.map((team) => (
                      <li
                        key={team.id}
                        className="bg-green-700 px-4 py-2 rounded text-white"
                      >
                        {team.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TournamentPage;
