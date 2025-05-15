import React, { useState } from 'react';

const LeaderboardContent = () => {
  const [showMore, setShowMore] = useState(false);

  // Batting stats data
  const battingStats = [
    { no: 1, name: 'Sanjay Singh', mat: 6, inn: 6, runs: 286, hs: 108, no: 1, avg: 98.20, sr: 177.25, gs: 17, as: 25, sos: 2, centuries: 1 },
    { no: 2, name: 'Amour Sheikh', mat: 7, inn: 7, runs: 285, hs: 84, no: 0, avg: 37.96, sr: 148.04, gs: 12, as: 27, sos: 3, centuries: 0 },
    { no: 3, name: 'Mukeshringhshakhavat', mat: 6, inn: 6, runs: 266, hs: 96, no: 1, avg: 91.30, sr: 181.56, gs: 20, as: 17, sos: 3, centuries: 0 },
    { no: 4, name: 'Sankaja Pareek', mat: 7, inn: 7, runs: 208, hs: 78, no: 1, avg: 34.67, sr: 150.72, gs: 8, as: 25, sos: 1, centuries: 0 },
    { no: 5, name: 'Ajay S Shekhawat', mat: 4, inn: 4, runs: 178, hs: 109, no: 1, avg: 93.33, sr: 160.36, gs: 8, as: 19, sos: 0, centuries: 1 },
    { no: 6, name: 'Aniruth Sharma', mat: 7, inn: 7, runs: 178, hs: 64, no: 1, avg: 29.97, sr: 141.27, gs: 3, as: 23, sos: 2, centuries: 0 },
    { no: 7, name: 'Rohit Bhatt', mat: 7, inn: 7, runs: 177, hs: 87, no: 0, avg: 25.39, sr: 160.48, gs: 3, as: 28, sos: 1, centuries: 0 },
    { no: 8, name: 'Pushpendra Indoria', mat: 3, inn: 3, runs: 176, hs: 95, no: 0, avg: 58.97, sr: 167.62, gs: 8, as: 17, sos: 2, centuries: 0 },
    { no: 9, name: 'Surya', mat: 4, inn: 4, runs: 172, hs: 96, no: 1, avg: 97.33, sr: 147.01, gs: 11, as: 13, sos: 1, centuries: 0 },
    { no: 10, name: 'Ashish Sharma', mat: 6, inn: 6, runs: 171, hs: 94, no: 1, avg: 34.20, sr: 113.58, gs: 7, as: 24, sos: 1, centuries: 0 },
    { no: 11, name: 'Haveen Kumawat', mat: 5, inn: 5, runs: 170, hs: 67, no: 0, avg: 34.00, sr: 134.92, gs: 7, as: 17, sos: 2, centuries: 0 },
    { no: 12, name: 'Neeraj Singh Blake', mat: 7, inn: 6, runs: 166, hs: 42, no: 2, avg: 41.50, sr: 182.42, gs: 12, as: 8, sos: 0, centuries: 0 },
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto bg-gray-900 min-h-screen">
      {/* Title */}
      <h1 className="text-2xl font-bold text-white mb-4">Batting Leaderboard</h1>

      {/* Stats Table */}
      <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">NO.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Batter</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">MAT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">INN</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">R</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">HS</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">N/O</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">AVG</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">SR</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">GS</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">AS</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">SOS</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">100%</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {battingStats.slice(0, showMore ? battingStats.length : 5).map((player) => (
                <tr key={player.no} className="hover:bg-gray-700">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.no}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{player.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.mat}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.inn}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.runs}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.hs}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.no}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.avg}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.sr}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.gs}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.as}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.sos}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.centuries}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Load More Button */}
      <div className="mt-4 text-center">
        <button
          onClick={() => setShowMore(!showMore)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition-colors"
        >
          {showMore ? 'SHOW LESS' : 'LOAD MORE'}
        </button>
      </div>
    </div>
  );
};

export default LeaderboardContent;