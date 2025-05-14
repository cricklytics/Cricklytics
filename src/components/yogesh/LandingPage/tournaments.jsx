import React from 'react';

const Tournament = () => {
  // Tournament information
  const tournamentInfo = {
    name: "SAYAR CUP",
    location: "Ranveer Singh Cricket Stadium, Jaipur",
    season: "2023-24",
    teams: 8,
    matches: 24,
    startDate: "15-Feb-2023",
    endDate: "20-Mar-2023",
    currentStage: "Knockout Round",
    defendingChampion: "Golden Warriors XI"
  };

  // Recent matches
  const recentMatches = [
    {
      teams: "Golden Warriors XI vs Jaipur Strikers",
      date: "15-Mar-2023",
      result: "Golden Warriors won by 28 runs",
      highlight: "Sanjay Singh - 98 runs (54 balls)"
    },
    {
      teams: "LUT Biggieagles vs Aavas Financiers",
      date: "14-Mar-2023",
      result: "LUT Biggieagles won by 5 wickets",
      highlight: "Mukesh Singh - 4/22 (4 overs)"
    }
  ];

  // Upcoming matches
  const upcomingMatches = [
    {
      teams: "Golden Warriors XI vs LUT Biggieagles",
      date: "18-Mar-2023",
      time: "3:30 PM",
      venue: "Stadium Pitch 1"
    },
    {
      teams: "Jaipur Strikers vs Aavas Financiers",
      date: "19-Mar-2023",
      time: "10:30 AM",
      venue: "Stadium Pitch 2"
    }
  ];

  // Top performers
  const topPerformers = {
    batsmen: [
      { name: "Sanjay Singh", runs: 286, avg: 98.20, sr: 177.25 },
      { name: "Amour Sheikh", runs: 285, avg: 37.96, sr: 148.04 }
    ],
    bowlers: [
      { name: "Mukesh Singh", wickets: 14, avg: 12.50, econ: 6.25 },
      { name: "Rohit Bhatt", wickets: 12, avg: 18.33, econ: 7.10 }
    ]
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-gray-100">
      {/* Tournament Header */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-purple-400">{tournamentInfo.name}</h1>
            <p className="text-gray-400 mt-2">
              {tournamentInfo.location} | {tournamentInfo.season}
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <span className="bg-purple-900 text-purple-300 px-3 py-1 rounded-full text-sm">
                {tournamentInfo.teams} Teams
              </span>
              <span className="bg-purple-900 text-purple-300 px-3 py-1 rounded-full text-sm">
                {tournamentInfo.matches} Matches
              </span>
              <span className="bg-purple-900 text-purple-300 px-3 py-1 rounded-full text-sm">
                {tournamentInfo.currentStage}
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 bg-gray-700 p-4 rounded-lg border border-gray-600">
            <h3 className="font-semibold text-gray-300">Defending Champions</h3>
            <p className="text-xl font-bold text-purple-400">{tournamentInfo.defendingChampion}</p>
            <p className="text-sm text-gray-400 mt-1">
              {tournamentInfo.startDate} - {tournamentInfo.endDate}
            </p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Matches */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 lg:col-span-2 border border-gray-700">
          <h2 className="text-xl font-bold text-gray-200 mb-4 border-b border-gray-700 pb-2">Recent Matches</h2>
          <div className="space-y-4">
            {recentMatches.map((match, index) => (
              <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-100">{match.teams}</h3>
                    <p className="text-sm text-gray-400 mt-1">{match.date}</p>
                  </div>
                  <span className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs font-medium">
                    Completed
                  </span>
                </div>
                <p className="mt-2 text-gray-300">{match.result}</p>
                <p className="mt-1 text-sm text-purple-400">⭐ {match.highlight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Matches */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-gray-200 mb-4 border-b border-gray-700 pb-2">Upcoming Matches</h2>
          <div className="space-y-4">
            {upcomingMatches.map((match, index) => (
              <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0 last:pb-0">
                <h3 className="font-medium text-gray-100">{match.teams}</h3>
                <div className="mt-2 flex items-center text-sm text-gray-400">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {match.date} | {match.time}
                </div>
                <div className="mt-1 flex items-center text-sm text-gray-400">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {match.venue}
                </div>
                <button className="mt-3 w-full bg-purple-900 text-purple-300 py-1 rounded text-sm font-medium hover:bg-purple-800 transition">
                  Set Reminder
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-gray-200 mb-4 border-b border-gray-700 pb-2">Top Performers</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-300 mb-2">Batting</h3>
              <div className="space-y-3">
                {topPerformers.batsmen.map((player, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-8 h-8 bg-purple-900 rounded-full flex items-center justify-center text-purple-300 font-bold mr-3">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-100">{player.name}</p>
                      <p className="text-xs text-gray-400">
                        {player.runs} runs | Avg: {player.avg} | SR: {player.sr}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-300 mb-2">Bowling</h3>
              <div className="space-y-3">
                {topPerformers.bowlers.map((player, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-8 h-8 bg-purple-900 rounded-full flex items-center justify-center text-purple-300 font-bold mr-3">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-100">{player.name}</p>
                      <p className="text-xs text-gray-400">
                        {player.wickets} wkts | Avg: {player.avg} | Econ: {player.econ}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Stats */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 lg:col-span-2 border border-gray-700">
          <h2 className="text-xl font-bold text-gray-200 mb-4 border-b border-gray-700 pb-2">Tournament Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg text-center border border-gray-600">
              <p className="text-2xl font-bold text-purple-400">1,842</p>
              <p className="text-sm text-gray-400">Total Runs</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center border border-gray-600">
              <p className="text-2xl font-bold text-purple-400">86</p>
              <p className="text-sm text-gray-400">Wickets Taken</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center border border-gray-600">
              <p className="text-2xl font-bold text-purple-400">9.23</p>
              <p className="text-sm text-gray-400">Avg Run Rate</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center border border-gray-600">
              <p className="text-2xl font-bold text-purple-400">14</p>
              <p className="text-sm text-gray-400">Half Centuries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tournament;