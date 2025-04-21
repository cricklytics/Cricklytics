// import React from 'react';

// const PlayerCard = ({ player }) => {
//   return (
//     <div className="w-120 max-w-sm rounded-lg shadow-md bg-white p-6 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-white ">
//       {/* Header: Player Image and Info */}
//       <div className="flex items-center gap-4 mb-4">
//         <img
//           className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
//           src={player.photoUrl || 'https://via.placeholder.com/64'}
//           alt={player.name}
//         />
//         <div>
//           <h2 className="text-xl font-semibold text-gray-900">{player.name}</h2>
//           <p className="text-sm text-gray-600">{player.role || 'Unknown Role'}</p>
//         </div>
//       </div>

//       {/* Stats Section */}
//       <div className="grid grid-cols-2 gap-4 mb-4">
//         <div className="flex flex-col">
//           <span className="text-sm text-gray-500">Batting Avg</span>
//           <span className="text-lg font-medium text-gray-800">
//             {player.battingAvg ? player.battingAvg.toFixed(2) : 'N/A'}
//           </span>
//         </div>
//         <div className="flex flex-col">
//           <span className="text-sm text-gray-500">Bowling Avg</span>
//           <span className="text-lg font-medium text-gray-800">
//             {player.bowlingAvg ? player.bowlingAvg.toFixed(2) : 'N/A'}
//           </span>
//         </div>
//       </div>

//       {/* Recent Performances */}
//       <div>
//         <span className="text-sm text-gray-500 block mb-1">Recent Performances</span>
//         <div className="flex flex-wrap gap-2">
//           {player.recentMatches && player.recentMatches.length > 0 ? (
//             player.recentMatches.map((score, index) => (
//               <span
//                 key={index}
//                 className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
//               >
//                 {score}
//               </span>
//             ))
//           ) : (
//             <span className="text-sm text-gray-500">No recent data</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlayerCard;

import React, { useState } from 'react';

const PlayerCard = ({ player }) => {
  const [isReading, setIsReading] = useState(false);

  // Function to read out the player details
  const readPlayerDetails = (player) => {
    const { name, role, battingAvg, bowlingAvg, recentMatches } = player;

    // Build the basic introduction
    let speech = `This is ${name}, a ${role.toLowerCase()}.`;

    // Add batting average or mention if it's not available
    if (battingAvg) {
      speech += ` He have a batting average of ${battingAvg.toFixed(2)}.`;
    } else {
      speech += ` He have no batting average.`;
    }

    // Add bowling average or mention if it's not available
    if (bowlingAvg) {
      speech += ` His bowling average is ${bowlingAvg.toFixed(2)}.`;
    } else if (role.toLowerCase() === 'batsman') {
      speech += ` He doesn't bowl, so there's no bowling average available.`;
    }

    // Add recent performance (runs for batsman, wickets for bowler)
    if (recentMatches && recentMatches.length > 0) {
      let performance = recentMatches.join(', ');
      if (role.toLowerCase() === 'batsman' || role.toLowerCase() === 'all-rounder') {
        speech += ` Recently, in their batting performances, they scored: ${performance} runs.`;
      } else if (role.toLowerCase() === 'bowler') {
        speech += ` In their recent bowling performances, they took: ${performance} wickets.`;
      }
    } else {
      speech += ` No recent performance data available.`;
    }

    // Log the speech text to check if it’s being generated correctly
    console.log("Speech Text: ", speech);

    // Check if speechSynthesis is available
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(speech);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported in this browser.');
    }
  };

  // Handle click event to toggle speech reading
  const handleClick = () => {
    if (isReading) {
      // Stop reading if already speaking
      window.speechSynthesis.cancel();
    } else {
      // Start reading player details
      readPlayerDetails(player);
    }
    setIsReading(!isReading);
  };

  return (
    <div
      onClick={handleClick}
      className="w-120 max-w-sm rounded-lg shadow-md bg-white p-6 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-white cursor-pointer"
    >
      {/* Header: Player Image and Info */}
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

      {/* Stats Section */}
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

      {/* Recent Performances */}
      <div>
        <span className="text-sm text-gray-500 block mb-1">Recent Performances</span>
        <div className="flex flex-wrap gap-2">
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
