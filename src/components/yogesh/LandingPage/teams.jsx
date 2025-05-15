import React from 'react';

const Teams = () => {
  // Teams data
  const teams = [
    {
      id: 1,
      name: "Golden Warriors XI",
      captain: "Sanjay Singh",
      matches: 7,
      wins: 5,
      losses: 2,
      points: 10,
      lastMatch: "Won by 28 runs vs Jaipur Strikers",
      players: [
        { name: "Sanjay Singh", role: "Batsman", runs: 286, wickets: 8 },
        { name: "Amour Sheikh", role: "All-rounder", runs: 285, wickets: 5 },
        { name: "Mukesh Singh", role: "Bowler", runs: 45, wickets: 14 }
      ]
    },
    {
      id: 2,
      name: "Jaipur Strikers",
      captain: "Rohit Bhatt",
      matches: 7,
      wins: 4,
      losses: 3,
      points: 8,
      lastMatch: "Lost by 28 runs vs Golden Warriors",
      players: [
        { name: "Rohit Bhatt", role: "All-rounder", runs: 177, wickets: 12 },
        { name: "Sankaja Pareek", role: "Batsman", runs: 208, wickets: 2 },
        { name: "Pushpendra Indoria", role: "Batsman", runs: 176, wickets: 0 }
      ]
    },
    {
      id: 3,
      name: "LUT Biggieagles XI",
      captain: "Ajay S Shekhawat",
      matches: 7,
      wins: 4,
      losses: 3,
      points: 8,
      lastMatch: "Won by 5 wickets vs Aavas Financiers",
      players: [
        { name: "Ajay S Shekhawat", role: "Batsman", runs: 178, wickets: 9 },
        { name: "Aniruth Sharma", role: "Batsman", runs: 178, wickets: 1 },
        { name: "Neeraj Singh Blake", role: "All-rounder", runs: 166, wickets: 7 }
      ]
    },
    {
      id: 4,
      name: "Aavas Financiers",
      captain: "Ashish Sharma",
      matches: 7,
      wins: 2,
      losses: 5,
      points: 4,
      lastMatch: "Lost by 5 wickets vs LUT Biggieagles",
      players: [
        { name: "Ashish Sharma", role: "Batsman", runs: 171, wickets: 3 },
        { name: "Haveen Kumawat", role: "Bowler", runs: 170, wickets: 6 },
        { name: "Surya", role: "Batsman", runs: 172, wickets: 0 }
      ]
    }
  ];

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-400">Tournament Teams</h1>
        <p className="text-gray-400 mt-2">SAYAR CUP 2023-24 • Ranveer Singh Cricket Stadium, Jaipur</p>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-700">
            {/* Team Header */}
            <div className="bg-purple-800 p-4 text-white">
              <h2 className="text-xl font-bold truncate">{team.name}</h2>
              <p className="text-sm opacity-90">Captain: {team.captain}</p>
            </div>

            {/* Team Stats */}
            <div className="p-4">
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="bg-gray-700 p-2 rounded">
                  <p className="text-sm text-gray-300">Matches</p>
                  <p className="font-bold">{team.matches}</p>
                </div>
                <div className="bg-gray-700 p-2 rounded">
                  <p className="text-sm text-gray-300">Wins</p>
                  <p className="font-bold text-green-400">{team.wins}</p>
                </div>
                <div className="bg-gray-700 p-2 rounded">
                  <p className="text-sm text-gray-300">Points</p>
                  <p className="font-bold">{team.points}</p>
                </div>
              </div>

              {/* Last Match */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-400">Last Match</p>
                <p className={`text-sm ${team.lastMatch.startsWith('Won') ? 'text-green-400' : 'text-red-400'}`}>
                  {team.lastMatch}
                </p>
              </div>

              {/* Key Players */}
              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">Key Players</p>
                <div className="space-y-2">
                  {team.players.map((player, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-300">{player.name}</span>
                      <div className="flex gap-2">
                        <span className="bg-purple-900 text-purple-300 px-2 py-0.5 rounded text-xs">
                          {player.runs}r
                        </span>
                        {player.wickets > 0 && (
                          <span className="bg-green-900 text-green-300 px-2 py-0.5 rounded text-xs">
                            {player.wickets}w
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* View Team Button */}
            <div className="px-4 pb-4">
              <button className="w-full py-2 bg-purple-900 text-purple-300 rounded-md hover:bg-purple-700 transition font-medium">
                View Full Squad
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Team Comparison Section */}
      <div className="mt-12 bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-gray-200 mb-6">Team Standings</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Played</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Won</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Lost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">NRR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Form</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {teams
                .sort((a, b) => b.points - a.points)
                .map((team, index) => (
                  <tr key={team.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-400">{team.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{team.matches}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{team.wins}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{team.losses}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-200">{team.points}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {index === 0 ? '+1.25' : index === 1 ? '+0.78' : index === 2 ? '+0.45' : '-0.32'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {['W', 'L', 'W', 'W', 'L'].map((result, i) => (
                          <span 
                            key={i} 
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                              result === 'W' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                            }`}
                          >
                            {result}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tournament Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-gray-200 mb-4">Highest Team Totals</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-700">
              <span className="font-medium text-gray-300">202/2</span>
              <span className="text-sm text-gray-400">Jaipur Strikers vs JAY GARHWAL</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-700">
              <span className="font-medium text-gray-300">203/7</span>
              <span className="text-sm text-gray-400">Aloha Warriors XI vs LUT Biggieagles</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-300">169/8</span>
              <span className="text-sm text-gray-400">LUT Biggieagles vs Alejha Warriors</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-gray-200 mb-4">Lowest Team Totals</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-700">
              <span className="font-medium text-gray-300">76/10</span>
              <span className="text-sm text-gray-400">Aavas Financiers vs Golden Warriors</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-700">
              <span className="font-medium text-gray-300">128/9</span>
              <span className="text-sm text-gray-400">JAY GARHWAL vs Jaipur Strikers</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-300">129/3</span>
              <span className="text-sm text-gray-400">LUT Biggieagles vs Aloha Warriors</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-gray-200 mb-4">Biggest Victories</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-700">
              <span className="font-medium text-gray-300">93 runs</span>
              <span className="text-sm text-gray-400">LUT Biggieagles vs Aavas Financiers</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-700">
              <span className="font-medium text-gray-300">74 runs</span>
              <span className="text-sm text-gray-400">Jaipur Strikers vs JAY GARHWAL</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-300">8 wickets</span>
              <span className="text-sm text-gray-400">Golden Warriors vs Jaipur Strikers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;