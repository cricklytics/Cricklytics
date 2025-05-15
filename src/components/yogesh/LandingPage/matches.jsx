import React, { useState } from 'react';

const Matches = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Tournament data
  const tournaments = [
    {
      id: 1,
      name: "SAYAR CUP",
      location: "Ranveer Singh Cricket Stadium, Jaipur",
      date: "13-Feb-22",
      overs: "20 Ov.",
      status: "PAST",
      stage: "FINAL",
      team1: "Alejha Warriors XI",
      score1: "144/9 (20.0)",
      team2: "LUT Biggieagles XI",
      score2: "169/8 (20.0)",
      result: "LUT Biggieagles XI won by 25 runs"
    },
    {
      id: 2,
      name: "SAYAR CUP",
      location: "Ranveer Singh Cricket Stadium, Jaipur",
      date: "13-Feb-22",
      overs: "20 Ov.",
      status: "PAST",
      stage: "THIRD POSITION",
      team1: "Jaipur Royal Strikers",
      score1: "166/9 (20.0)",
      team2: "GOLDEN WARRIORS 11",
      score2: "147/6 (18.3)",
      result: "GOLDEN WARRIORS 11 won by 9 runs [DLS - Match reduced to 15.0 overs, target 117 runs]"
    },
    {
      id: 3,
      name: "SAYAR CUP",
      location: "Ranveer Singh Cricket Stadium, Jaipur",
      date: "19-Sep-21",
      overs: "20 Ov.",
      status: "PAST",
      stage: "SEMI FINAL",
      team1: "Aavas Financiers",
      score1: "76/10 (14.5)",
      team2: "GOLDEN WARRIORS 11",
      score2: "126/4 (15.0)",
      result: "GOLDEN WARRIORS 11 won by 4 wickets"
    },
    {
      id: 4,
      name: "SAYAR CUP",
      location: "Ranveer Singh Cricket Stadium, Jaipur",
      date: "19-Sep-21",
      overs: "20 Ov.",
      status: "PAST",
      stage: "SUPER FOUR",
      team1: "JAY GARHWAL",
      score1: "128/9 (20.0)",
      team2: "Jaipur Strikers...",
      score2: "202/2 (20.0)",
      result: "Jaipur Strikers won by 74 runs"
    },
    {
      id: 5,
      name: "SAYAR CUP",
      location: "Ranveer Singh Cricket Stadium, Jaipur",
      date: "14-Aug-21",
      overs: "20 Ov.",
      status: "PAST",
      stage: "SEMI FINAL",
      team1: "LUT Biggieagles XI",
      score1: "129/3 (13.0)",
      team2: "Aloha Warriors XI",
      score2: "203/7 (19.0)",
      result: "Aloha Warriors XI won by 74 runs"
    }
  ];

  // Filter tabs
  const filterTabs = [
    { id: 'live', label: 'LIVE' },
    { id: 'upcoming', label: 'UPCOMING' },
    { id: 'past', label: 'PAST' },
  ];

  return (
    <div className="bg-gray-900 p-4 min-h-screen">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
              activeFilter === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
            onClick={() => setActiveFilter(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tournaments List */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-purple-400 mb-4">SAYAR CUP</h1>
        
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-colors">
            <div className="p-4 border-b border-gray-700">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <h2 className="text-lg font-bold text-purple-400">{tournament.name}</h2>
                <span className="text-sm text-gray-400">
                  {tournament.location}, {tournament.date}, {tournament.overs}, {tournament.status}
                </span>
              </div>
              <div className="mt-2">
                <span className="inline-block bg-purple-900 text-purple-300 text-xs px-2 py-1 rounded font-medium">
                  {tournament.stage}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-base font-semibold text-gray-100">{tournament.team1}</div>
                <div className="text-base font-bold text-gray-100">{tournament.score1}</div>
              </div>
              <div className="flex justify-between items-center mb-3">
                <div className="text-base font-semibold text-gray-100">{tournament.team2}</div>
                <div className="text-base font-bold text-gray-100">{tournament.score2}</div>
              </div>
              <div className="mt-3 p-2 bg-green-900 bg-opacity-30 rounded border border-green-800">
                <p className="font-medium text-green-400">{tournament.result}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matches;