import React, { useState } from 'react';

const Players = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [showFullBio, setShowFullBio] = useState(false);

  // Player data
  const player = {
    id: 1,
    name: "Sanjay Singh",
    team: "Golden Warriors XI",
    role: "Top Order Batsman",
    age: 28,
    battingStyle: "Right Handed Bat",
    bowlingStyle: "Right Arm Off Spin",
    matches: 42,
    runs: 1560,
    highestScore: 124,
    average: 48.75,
    strikeRate: 142.36,
    centuries: 4,
    fifties: 12,
    wickets: 18,
    bestBowling: "3/22",
    bio: "Sanjay Singh is one of the most consistent performers in the Jaipur Corporate Cricket league. Known for his aggressive batting style and ability to anchor innings, he has been the backbone of Golden Warriors XI's batting lineup for the past 5 seasons. His technique against both pace and spin makes him a formidable opponent. Sanjay made his debut in 2018 and was named Player of the Tournament in the 2021 season when he scored 487 runs at an average of 69.57.",
    recentMatches: [
      { opponent: "Jaipur Strikers", runs: 98, wickets: 1, result: "Won by 28 runs" },
      { opponent: "LUT Biggieagles", runs: 64, wickets: 0, result: "Lost by 5 wickets" },
      { opponent: "Aavas Financiers", runs: 112, wickets: 2, result: "Won by 45 runs" }
    ],
    careerStats: {
      batting: {
        matches: 42,
        innings: 40,
        notOuts: 8,
        runs: 1560,
        highest: 124,
        average: 48.75,
        strikeRate: 142.36,
        centuries: 4,
        fifties: 12,
        fours: 156,
        sixes: 42
      },
      bowling: {
        innings: 28,
        wickets: 18,
        best: "3/22",
        average: 32.44,
        economy: 7.25,
        strikeRate: 26.8
      },
      fielding: {
        catches: 22,
        stumpings: 0,
        runOuts: 5
      }
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      {/* Player Header */}
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-700">
        <div className="flex flex-col md:flex-row">
          {/* Player Image and Basic Info */}
          <div className="md:w-1/3 bg-gray-700 p-6 text-white flex flex-col items-center border-r border-gray-600">
            <div className="w-32 h-32 bg-gray-600 rounded-full mb-4 flex items-center justify-center text-4xl font-bold">
              {player.name.charAt(0)}
            </div>
            <h1 className="text-2xl font-bold text-center">{player.name}</h1>
            <p className="text-gray-300 text-center">{player.team}</p>
            
            <div className="mt-4 grid grid-cols-2 gap-3 w-full">
              <div className="bg-gray-600 p-2 rounded text-center border border-gray-500">
                <p className="text-xs text-gray-300">Role</p>
                <p className="font-medium">{player.role}</p>
              </div>
              <div className="bg-gray-600 p-2 rounded text-center border border-gray-500">
                <p className="text-xs text-gray-300">Age</p>
                <p className="font-medium">{player.age}</p>
              </div>
              <div className="bg-gray-600 p-2 rounded text-center border border-gray-500">
                <p className="text-xs text-gray-300">Batting</p>
                <p className="font-medium">{player.battingStyle}</p>
              </div>
              <div className="bg-gray-600 p-2 rounded text-center border border-gray-500">
                <p className="text-xs text-gray-300">Bowling</p>
                <p className="font-medium">{player.bowlingStyle}</p>
              </div>
            </div>
          </div>

          {/* Player Stats Highlights */}
          <div className="md:w-2/3 p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-700 p-3 rounded-lg text-center border border-gray-600">
                <p className="text-sm text-gray-300">Matches</p>
                <p className="text-2xl font-bold text-blue-400">{player.matches}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg text-center border border-gray-600">
                <p className="text-sm text-gray-300">Runs</p>
                <p className="text-2xl font-bold text-blue-400">{player.runs}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg text-center border border-gray-600">
                <p className="text-sm text-gray-300">Highest</p>
                <p className="text-2xl font-bold text-blue-400">{player.highestScore}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg text-center border border-gray-600">
                <p className="text-sm text-gray-300">Average</p>
                <p className="text-2xl font-bold text-blue-400">{player.average}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg text-center border border-gray-600">
                <p className="text-sm text-gray-300">Centuries</p>
                <p className="text-2xl font-bold text-blue-400">{player.centuries}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg text-center border border-gray-600">
                <p className="text-sm text-gray-300">Wickets</p>
                <p className="text-2xl font-bold text-blue-400">{player.wickets}</p>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <h3 className="font-bold text-gray-200 mb-2">Player Bio</h3>
              <p className="text-gray-400">
                {showFullBio ? player.bio : `${player.bio.substring(0, 150)}...`}
                <button 
                  onClick={() => setShowFullBio(!showFullBio)}
                  className="ml-2 text-blue-400 hover:underline text-sm"
                >
                  {showFullBio ? 'Show less' : 'Read more'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'stats' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setActiveTab('stats')}
        >
          Career Statistics
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'matches' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setActiveTab('matches')}
        >
          Recent Matches
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'achievements' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
        {activeTab === 'stats' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Career Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Batting Stats */}
              <div className="border rounded-lg p-4 border-gray-700 bg-gray-700">
                <h3 className="font-bold text-lg text-gray-200 mb-3 border-b pb-2 border-gray-600">Batting</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Matches</span>
                    <span className="font-medium text-gray-200">{player.careerStats.batting.matches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Innings</span>
                    <span className="font-medium text-gray-200">{player.careerStats.batting.innings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Runs</span>
                    <span className="font-medium text-gray-200">{player.careerStats.batting.runs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Highest Score</span>
                    <span className="font-medium text-gray-200">{player.careerStats.batting.highest}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average</span>
                    <span className="font-medium text-gray-200">{player.careerStats.batting.average}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Strike Rate</span>
                    <span className="font-medium text-gray-200">{player.careerStats.batting.strikeRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Centuries</span>
                    <span className="font-medium text-gray-200">{player.careerStats.batting.centuries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fifties</span>
                    <span className="font-medium text-gray-200">{player.careerStats.batting.fifties}</span>
                  </div>
                </div>
              </div>

              {/* Bowling Stats */}
              <div className="border rounded-lg p-4 border-gray-700 bg-gray-700">
                <h3 className="font-bold text-lg text-gray-200 mb-3 border-b pb-2 border-gray-600">Bowling</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Innings</span>
                    <span className="font-medium text-gray-200">{player.careerStats.bowling.innings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Wickets</span>
                    <span className="font-medium text-gray-200">{player.careerStats.bowling.wickets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Best Bowling</span>
                    <span className="font-medium text-gray-200">{player.careerStats.bowling.best}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average</span>
                    <span className="font-medium text-gray-200">{player.careerStats.bowling.average}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Economy</span>
                    <span className="font-medium text-gray-200">{player.careerStats.bowling.economy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Strike Rate</span>
                    <span className="font-medium text-gray-200">{player.careerStats.bowling.strikeRate}</span>
                  </div>
                </div>
              </div>

              {/* Fielding Stats */}
              <div className="border rounded-lg p-4 border-gray-700 bg-gray-700">
                <h3 className="font-bold text-lg text-gray-200 mb-3 border-b pb-2 border-gray-600">Fielding</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Catches</span>
                    <span className="font-medium text-gray-200">{player.careerStats.fielding.catches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stumpings</span>
                    <span className="font-medium text-gray-200">{player.careerStats.fielding.stumpings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Run Outs</span>
                    <span className="font-medium text-gray-200">{player.careerStats.fielding.runOuts}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Recent Matches</h2>
            <div className="space-y-4">
              {player.recentMatches.map((match, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0 border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-200">vs {match.opponent}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      match.result.startsWith('Won') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                    }`}>
                      {match.result}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 p-3 rounded border border-gray-600">
                      <p className="text-sm text-gray-400">Batting</p>
                      <p className="font-medium text-gray-200">{match.runs} runs</p>
                    </div>
                    <div className="bg-gray-700 p-3 rounded border border-gray-600">
                      <p className="text-sm text-gray-400">Bowling</p>
                      <p className="font-medium text-gray-200">{match.wickets > 0 ? `${match.wickets} wkts` : '-'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Achievements & Awards</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-700">
                <h3 className="font-bold text-blue-400">Player of the Tournament - 2021</h3>
                <p className="text-gray-400">Scored 487 runs at an average of 69.57 with 2 centuries</p>
              </div>
              <div className="border-l-4 border-amber-500 pl-4 py-2 bg-gray-700">
                <h3 className="font-bold text-amber-400">Most Valuable Player - 2022</h3>
                <p className="text-gray-400">Awarded for all-round performance (412 runs and 14 wickets)</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-2 bg-gray-700">
                <h3 className="font-bold text-green-400">Fastest Century Record</h3>
                <p className="text-gray-400">Scored 100 off 42 balls against Jaipur Strikers (2020)</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 py-2 bg-gray-700">
                <h3 className="font-bold text-purple-400">Team Captain - 2023</h3>
                <p className="text-gray-400">Led Golden Warriors XI to tournament victory</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;