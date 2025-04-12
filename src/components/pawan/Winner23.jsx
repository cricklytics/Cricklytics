import React, { useState } from 'react';
import '../../styles/Winner.css';

const Winner23 = () => {
  const [activeCategory, setActiveCategory] = useState('Popularity');

  const categories = ['Popularity', 'Batting', 'Bowling', 'Fielding', 'All Rounder'];

  // Sample data with multiple winners per category
  const winnerData = [
    // Popularity Winners
    {
      category: 'Popularity',
      name: 'Virat Kohli',
      votes: 10000,
      location: 'India',
      stats: { age: 36, inns: 500, runs: 26000, avg: 54.1, sr: 138 },
      image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT0DK7G4StXbLGO8OR8K6dvQu-mRsBOgyqpRe0GFuXHQ6O_5VcCBY0qN5gAEP0UpFxgJg3mG_e7OLfUaBrImOaU_t5mINZrpH6Ad-fSyRI',
    },
    {
      category: 'Popularity',
      name: 'Babar Azam',
      votes: 7600,
      location: 'Pakistan',
      stats: { age: 30, inns: 290, runs: 12000, avg: 49.5, sr: 128 },
      image: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcRiZCzaE9grJSAGjyOnVWCRq4e17VEgWz4Jw2vTy-cbyGIqhA3EaI4m8YVNFXUhNTwc3gWYs-_ZLOMTvs4',
    },
  
    // Batting Winners
    {
      category: 'Batting',
      name: 'Joe Root',
      votes: 8900,
      location: 'England',
      stats: { age: 34, inns: 400, runs: 19000, avg: 50.2, sr: 87 },
      image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcT39RonN6avGmMhvZ1MizK1R7wEOrJed4LqSw1RrkJlIhzMr9I-o8oFvE3xIEhbFFEK4zKOu-i2H3TtVMRUd3-mf5dR4MpjPjPBZ7WVcFbOsz-1md7_YQuCalu-YZE6cMTkkOZJUoHFZQ',
    },
    {
      category: 'Batting',
      name: 'Steve Smith',
      votes: 7700,
      location: 'Australia',
      stats: { age: 35, inns: 380, runs: 18000, avg: 51.7, sr: 90 },
      image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRQhuWEDW86PF4SBVgqNnQgvBJJocwcgDvgrs3n8Yel_0zkI7cLkKPBgV3-M1OfxoeNmNpLSU733hA38r7RbwRP1qyDxm3P5nAmv3zbQsY',
    },
    {
      category: 'Batting',
      name: 'Kane Williamson',
      votes: 7600,
      location: 'New Zealand',
      stats: { age: 34, inns: 360, runs: 17000, avg: 52.3, sr: 87 },
      image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRhoyG49jtPWM3fcjPYy1blKrLA9V3PHgPrJv1TujYPavJegduUXlbFEYc4Nzl5GPBrJL_16ICeHzPZhUs',
    },
    {
        category: 'Batting',
        name: 'Rassie van der Dussen',
        votes: 7300,
        location: 'South Africa',
        stats: { age: 35, inns: 190, runs: 7000, avg: 48.3, sr: 92 },
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTONPjgFAV7BdF5nXj4-cVisGzLE-wjSDevqw&s',
      },
      {
        category: 'Batting',
        name: 'Shubman Gill',
        votes: 7200,
        location: 'India',
        stats: { age: 25, inns: 130, runs: 5800, avg: 50.5, sr: 104 },
        image: 'path/to/shubman-gill.jpg',
      },
  
    // Bowling Winners
    {
      category: 'Bowling',
      name: 'Pat Cummins',
      votes: 7800,
      location: 'Australia',
      stats: { age: 31, inns: 180, wickets: 340, avg: 23.5, econ: 3.9 },
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeoWbSnaFXZNWWC8eTrap_AkK3UP0uf0_U1AWpbmDcu9nFX7javEKWPJqiXWVhaHP6bQh7LG55uTdA0mFjOtMAKw',
    },
    {
      category: 'Bowling',
      name: 'Kagiso Rabada',
      votes: 7500,
      location: 'South Africa',
      stats: { age: 29, inns: 170, wickets: 320, avg: 24.8, econ: 4.1 },
      image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTGVSYeQu_OKtZ-g0BLTf62uFwLGfVvCvxECUCjN3xOciYApKTDPU_LQXgzLvciOcF_Yi8TF-9sXz_8K9-nRb-j0wCo2R7Ym-x9s4Y63A',
    },
    {
      category: 'Bowling',
      name: 'Trent Boult',
      votes: 7400,
      location: 'New Zealand',
      stats: { age: 35, inns: 190, wickets: 330, avg: 25.2, econ: 4.3 },
      image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTcQosiE0AOIl4RccPa7T6APAxVQJFIVYcvYO4p9FrmehzmAQkOIvNIMKmGpMNd2pWH58Pn6zYozIsOn28nWYVJmKNkF0WOGA0AFnGVlw',
    },
  
    // Fielding Winners
    {
      category: 'Fielding',
      name: 'David Warner',
      votes: 8200,
      location: 'Australia',
      stats: { age: 38, matches: 330, catches: 170, runOuts: 28 },
      image: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/DAVID_WARNER_%2811704782453%29.jpg',
    },
    {
      category: 'Fielding',
      name: 'Faf du Plessis',
      votes: 8100,
      location: 'South Africa',
      stats: { age: 40, matches: 300, catches: 160, runOuts: 26 },
      image: 'https://documents.iplt20.com/ipl/IPLHeadshot2025/94.png',
    },
    {
      category: 'Fielding',
      name: 'Ben Stokes',
      votes: 7900,
      location: 'England',
      stats: { age: 34, matches: 320, catches: 150, runOuts: 30 },
      image: 'https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/649c/live/78ca56d0-10ca-11f0-83b1-1fd3218c6da4.jpg.webp',
    },
    {
        category: 'Fielding',
        name: 'Glenn Maxwell',
        votes: 7700,
        location: 'Australia',
        stats: { age: 36, matches: 300, catches: 145, runOuts: 32 },
        image: 'https://static-files.cricket-australia.pulselive.com/headshots/288/591-camedia.png',
      },
      {
        category: 'Fielding',
        name: 'Hardik Pandya',
        votes: 7600,
        location: 'India',
        stats: { age: 31, matches: 240, catches: 138, runOuts: 29 },
        image: 'path/to/hardik-pandya.jpg',
      },
  
    // All Rounder Winner
    {
      category: 'All Rounder',
      name: 'Shakib Al Hasan',
      votes: 7700,
      location: 'Bangladesh',
      stats: { age: 37, inns: 390, runs: 14000, wickets: 300, avg: 41.3, sr: 94 },
      image: 'https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcQk_UwCAHoXmUFDvsgEj_S44wt51d46Z0LGEbKtIAFTGd3ZaMi3XapvoNyyeZlatQ1p2gqyjt2e2AkrQDJZs2_pKrY_IDAjnvO1IIoVo2JoxT_KBXy2Z_Xo0a-dcGeMJfXwdUhvjCz3IA',
    },
    {
      category: 'All Rounder',
      name: 'Ravindra Jadeja',
      votes: 7500,
      location: 'India',
      stats: { age: 36, inns: 370, runs: 9500, wickets: 270, avg: 45.1, sr: 101 },
      image: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcSn11KHsKGmx9SWOEQtYto_ciPvEpj-8QAV3hL3fRtsCMmLQ9Vz-V5E7ROTKeaRxGoxwM4gNZczqZ0_7TU',
    },
    {
      category: 'All Rounder',
      name: 'Marcus Stoinis',
      votes: 7200,
      location: 'Australia',
      stats: { age: 35, inns: 290, runs: 7800, wickets: 150, avg: 39.7, sr: 106 },
      image: 'https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/712b/live/a70d3600-e467-11ef-b734-a507e28e4d9e.jpg.webp',
    },
  ];

  // Get top 3 players per category
  const limitedWinnerData = categories.reduce((acc, category) => {
    const categoryWinners = winnerData
      .filter(winner => winner.category === category)
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 3);
    return [...acc, ...categoryWinners];
  }, []);

  // Get top 3 players overall based on votes for Popularity
  const topThreeOverall = [...limitedWinnerData]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3);

  // Filter winners based on active category
  let filteredWinners = [];

  if (activeCategory === 'Popularity') {
    // For Popularity category, show top 3 overall players
    filteredWinners = topThreeOverall;
  } else {
    // For other categories, show their top 3 players regardless of overlap with Popularity
    filteredWinners = limitedWinnerData
      .filter(winner => winner.category === activeCategory)
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 3);
  }

  return (
    <div className="winner-container">
      <div className="winner-content">
        <h1 className="page-title">Winners of 2023</h1>

        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={`tab-button ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Winner Cards */}
        <div className="winner-cards">
          {filteredWinners.map((winner, index) => (
            <div key={index} className="winner-card">
              <div className="card-header">
                {activeCategory === 'Popularity' ? 'Popularity' : winner.category}
              </div>
              <div className="card-content">
                <img src={winner.image} alt={winner.name} className="player-image" />
                <h2 className="player-name">{winner.name}</h2>
                {activeCategory === 'Popularity' && (
                  <p className="player-votes">{winner.votes} Votes</p>
                )}
                <p className="player-location">{winner.location}</p>
                <table className="stats-table">
                  <tbody>
                    <tr>
                      <td>Age:</td>
                      <td>{winner.stats.age}</td>
                    </tr>
                    <tr>
                      <td>Inns:</td>
                      <td>{winner.stats.inns}</td>
                    </tr>
                    {winner.category === 'Batting' || winner.category === 'All Rounder' || (activeCategory === 'Popularity' && winner.stats.runs) ? (
                      <>
                        <tr>
                          <td>Runs:</td>
                          <td>{winner.stats.runs}</td>
                        </tr>
                        <tr>
                          <td>Avg:</td>
                          <td>{winner.stats.avg}</td>
                        </tr>
                        <tr>
                          <td>SR:</td>
                          <td>{winner.stats.sr}</td>
                        </tr>
                      </>
                    ) : null}
                    {winner.category === 'Bowling' || winner.category === 'All Rounder' ? (
                      <>
                        <tr>
                          <td>Wickets:</td>
                          <td>{winner.stats.wickets}</td>
                        </tr>
                        <tr>
                          <td>Avg:</td>
                          <td>{winner.stats.avg}</td>
                        </tr>
                        <tr>
                          <td>Econ:</td>
                          <td>{winner.stats.econ}</td>
                        </tr>
                      </>
                    ) : null}
                    {winner.category === 'Fielding' ? (
                      <>
                        <tr>
                          <td>Matches:</td>
                          <td>{winner.stats.matches}</td>
                        </tr>
                        <tr>
                          <td>Catches:</td>
                          <td>{winner.stats.catches}</td>
                        </tr>
                        <tr>
                          <td>Run Outs:</td>
                          <td>{winner.stats.runOuts}</td>
                        </tr>
                      </>
                    ) : null}
                  </tbody>
                </table>
              </div>
              <div className="winner-banner">WINNER</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Winner23;