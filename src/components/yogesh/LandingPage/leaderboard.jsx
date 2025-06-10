import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const LeaderboardContent = () => {
  const [showMore, setShowMore] = useState(false);
  const [battingStats, setBattingStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Effect to listen for auth state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
        setError('Please log in to view the leaderboard.');
      }
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Effect to fetch players
  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const q = query(
      collection(db, 'clubPlayers'),
      where('userId', '==', currentUserId),
      // orderBy('runs', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const players = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        players.push({
          id: doc.id,
          name: data.name,
          matches: data.careerStats?.batting?.matches || 0,
          innings: data.careerStats?.batting?.innings || 0,
          runs: data.careerStats?.batting?.runs || 0, // Use top-level runs field as per orderBy
          highestScore: data.careerStats?.batting?.highest || 0,
          notOuts: data.careerStats?.batting?.notOuts || 0,
          average: data.careerStats?.batting?.average || 0,
          strikeRate: data.careerStats?.batting?.strikeRate || 0,
          centuries: data.careerStats?.batting?.centuries || 0,
          fifties: data.careerStats?.batting?.fifties || 0,
          fours: data.careerStats?.batting?.fours || 0,
          sixes: data.careerStats?.batting?.sixes || 0,
        });
      });
      setBattingStats(players.sort((a, b) => b.runs - a.runs));
      setLoading(false);
    }, (err) => {
      console.error("Error fetching club players:", err);
      setError("Failed to load players: " + err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  if (authLoading) {
    return <div className="text-white text-center p-4 bg-gray-900 min-h-screen">Loading authentication...</div>;
  }

  if (!currentUserId) {
    return <div className="text-white text-center p-4 bg-gray-900 min-h-screen">Please log in to view the leaderboard.</div>;
  }

  if (loading) {
    return <div className="text-white text-center p-4 bg-gray-900 min-h-screen">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4 bg-gray-900 min-h-screen">Error: {error}</div>;
  }

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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">100s</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">50s</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">4s</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">6s</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {battingStats.length === 0 ? (
                <tr>
                  <td colSpan="13" className="px-4 py-3 text-center text-sm text-gray-300">
                    No players found.
                  </td>
                </tr>
              ) : (
                battingStats.slice(0, showMore ? battingStats.length : 5).map((player, index) => (
                  <tr key={player.id} className="hover:bg-gray-700">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{player.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.matches}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.innings}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.runs}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.highestScore}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.notOuts}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.average.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.strikeRate.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.centuries}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.fifties}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.fours}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.sixes}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Load More Button */}
      {battingStats.length > 5 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowMore(!showMore)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition-colors"
          >
            {showMore ? 'SHOW LESS' : 'LOAD MORE'}
          </button>
        </div>
      )}
    </div>
  );
};

export default LeaderboardContent;