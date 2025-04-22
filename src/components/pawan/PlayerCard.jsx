import React from 'react';

const PlayerCard = ({ player, onPlay }) => {
  const handleCardClick = () => {
    if (player.audioUrl) {
      onPlay(player.audioUrl); // 🔊 Play using parent-managed audio
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-120 max-w-sm rounded-lg shadow-md bg-white p-6 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-white cursor-pointer"
    >
      <div className="flex items-center gap-4 mb-4">
        <img
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          src={player.photoUrl || 'https://via.placeholder.com/64'}
          alt={player.name}
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{player.name}</h2>
          <p className="text-sm text-gray-600">{player.role || 'Unknown Role'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Batting Avg</span>
          <span className="text-lg font-medium text-gray-800">
            {player.battingAvg ? player.battingAvg.toFixed(2) : 'N/A'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Bowling Avg</span>
          <span className="text-lg font-medium text-gray-800">
            {player.bowlingAvg ? player.bowlingAvg.toFixed(2) : 'N/A'}
          </span>
        </div>
      </div>

      <div>
        <span className="text-sm text-gray-500 block mb-1">Recent Performances</span>
        <div className="flex flex-wrap gap-2 mb-2">
          {player.recentMatches && player.recentMatches.length > 0 ? (
            player.recentMatches.map((score, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
              >
                {score}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">No recent data</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
