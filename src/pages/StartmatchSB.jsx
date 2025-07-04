import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where, addDoc, doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FiPlusCircle } from 'react-icons/fi';

import logo from '../assets/pawan/PlayerProfile/picture-312.png';
import bgImg from '../assets/sophita/HomePage/advertisement5.jpeg';

const storage = getStorage();

const uploadFile = async (file, filePath) => {
  if (!file) return null;
  const storageRef = ref(storage, filePath);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

const generateUniquePlayerId = async () => {
  const playersCollectionRef = collection(db, 'clubPlayers');
  const snapshot = await getDocs(playersCollectionRef);
  const existingIds = snapshot.docs.map(doc => doc.data().playerId).filter(id => id);

  let newId;
  do {
    newId = Math.floor(100000 + Math.random() * 900000);
  } while (existingIds.includes(newId));

  return newId;
};

// AddClubPlayerModal2 Component
const AddClubPlayerModal2 = ({ onClose, team }) => {
  const [formData, setFormData] = useState({
    playerId: '',
    name: '',
    image: '',
    teamName: team?.teamName || '',
    role: 'player',
    age: '',
    battingStyle: '',
    bowlingStyle: '',
    matches: '',
    runs: '',
    highestScore: '',
    average: '',
    strikeRate: '',
    centuries: '',
    fifties: '',
    wickets: '',
    bestBowling: '',
    bio: '',
    recentMatches: '',
    user: 'no',
    audioUrl: '',
    careerStatsBattingMatches: '',
    careerStatsBattingInnings: '',
    careerStatsBattingNotOuts: '',
    careerStatsBattingRuns: '',
    careerStatsBattingHighest: '',
    careerStatsBattingAverage: '',
    careerStatsBattingStrikeRate: '',
    careerStatsBattingCenturies: '',
    careerStatsBattingFifties: '',
    careerStatsBattingFours: '',
    careerStatsBattingSixes: '',
    careerStatsBowlingInnings: '',
    careerStatsBowlingWickets: '',
    careerStatsBowlingBest: '',
    careerStatsBowlingAverage: '',
    careerStatsBowlingEconomy: '',
    careerStatsBowlingStrikeRate: '',
    careerStatsFieldingCatches: '',
    careerStatsFieldingStumpings: '',
    careerStatsFieldingRunOuts: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Handle authentication state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
        setError("You must be logged in to add a player.");
      }
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Generate playerId when the modal mounts
  useEffect(() => {
    const setPlayerId = async () => {
      const newId = await generateUniquePlayerId();
      setFormData(prev => ({ ...prev, playerId: newId.toString() }));
    };
    setPlayerId();
  }, []);

  // Set teamName from team prop
  useEffect(() => {
    if (team?.teamName) {
      setFormData(prev => ({ ...prev, teamName: team.teamName }));
    }
  }, [team]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!currentUserId) {
      setError("You must be logged in to add a player.");
      setLoading(false);
      return;
    }

    const playerName = formData.name.trim();
    if (!playerName) {
      setError("Player name cannot be empty.");
      setLoading(false);
      return;
    }

    if (!formData.teamName) {
      setError("Team name is required.");
      setLoading(false);
      return;
    }

    let uploadedImageUrl = formData.image;
    try {
      if (imageFile) {
        const filePath = `player_photos/${playerName.toLowerCase().replace(/\s+/g, '_')}_${imageFile.name}`;
        uploadedImageUrl = await uploadFile(imageFile, filePath);
        if (!uploadedImageUrl) {
          throw new Error("Failed to upload player image.");
        }
      }

      const recentMatchesParsed = formData.recentMatches
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => {
          const parts = line.split(',').map(p => p.trim());
          if (parts.length === 4) {
            return {
              opponent: parts[0],
              runs: parseInt(parts[1]) || 0,
              wickets: parseInt(parts[2]) || 0,
              result: parts[3]
            };
          }
          console.warn(`Skipping malformed recent match line: ${line}`);
          return null;
        })
        .filter(item => item !== null);

      const playerData = {
        playerId: parseInt(formData.playerId),
        name: playerName,
        image: uploadedImageUrl || '',
        teamName: formData.teamName,
        role: formData.role,
        age: parseInt(formData.age) || 0,
        battingStyle: formData.battingStyle || '',
        bowlingStyle: formData.bowlingStyle || '',
        matches: parseInt(formData.matches) || 0,
        runs: parseInt(formData.runs) || 0,
        highestScore: parseInt(formData.highestScore) || 0,
        average: parseFloat(formData.average) || 0,
        strikeRate: parseFloat(formData.strikeRate) || 0,
        centuries: parseInt(formData.centuries) || 0,
        fifties: parseInt(formData.fifties) || 0,
        wickets: parseInt(formData.wickets) || 0,
        bestBowling: formData.bestBowling || '',
        bio: formData.bio || '',
        recentMatches: recentMatchesParsed,
        userId: currentUserId,
        user: formData.user,
        audioUrl: formData.audioUrl || '',
        careerStats: {
          batting: {
            matches: parseInt(formData.careerStatsBattingMatches) || 0,
            innings: parseInt(formData.careerStatsBattingInnings) || 0,
            notOuts: parseInt(formData.careerStatsBattingNotOuts) || 0,
            runs: parseInt(formData.careerStatsBattingRuns) || 0,
            highest: parseInt(formData.careerStatsBattingHighest) || 0,
            average: parseFloat(formData.careerStatsBattingAverage) || 0,
            strikeRate: parseFloat(formData.careerStatsBattingStrikeRate) || 0,
            centuries: parseInt(formData.careerStatsBattingCenturies) || 0,
            fifties: parseInt(formData.careerStatsBattingFifties) || 0,
            fours: parseInt(formData.careerStatsBattingFours) || 0,
            sixes: parseInt(formData.careerStatsBattingSixes) || 0,
          },
          bowling: {
            innings: parseInt(formData.careerStatsBowlingInnings) || 0,
            wickets: parseInt(formData.careerStatsBowlingWickets) || 0,
            best: formData.careerStatsBowlingBest || '',
            average: parseFloat(formData.careerStatsBowlingAverage) || 0,
            economy: parseFloat(formData.careerStatsBowlingEconomy) || 0,
            strikeRate: parseFloat(formData.careerStatsBowlingStrikeRate) || 0,
          },
          fielding: {
            catches: parseInt(formData.careerStatsFieldingCatches) || 0,
            stumpings: parseInt(formData.careerStatsFieldingStumpings) || 0,
            runOuts: parseInt(formData.careerStatsFieldingRunOuts) || 0,
          }
        }
      };

      const playerId = formData.playerId;
      // Save player to clubPlayers collection
      await setDoc(doc(db, "clubPlayers", playerId), playerData);

      // Add player to clubTeams collection
      const teamQuery = query(
        collection(db, 'clubTeams'),
        where('teamName', '==', formData.teamName),
        where('createdBy', '==', currentUserId)
      );
      const teamSnapshot = await getDocs(teamQuery);

      if (!teamSnapshot.empty) {
        // Team exists, append player to players array
        const teamDoc = teamSnapshot.docs[0];
        await updateDoc(doc(db, 'clubTeams', teamDoc.id), {
          players: arrayUnion(playerData)
        });
      } else {
        // Team doesn't exist, create new team with player
        await setDoc(doc(collection(db, 'clubTeams')), {
          teamName: formData.teamName,
          createdBy: currentUserId,
          createdAt: new Date(),
          players: [playerData],
          captain: '',
          matches: 0,
          wins: 0,
          losses: 0,
          points: 0,
          lastMatch: ''
        });
      }

      setSuccess(true);

      const newId = await generateUniquePlayerId();
      setFormData({
        playerId: newId.toString(),
        name: '',
        image: '',
        teamName: team?.teamName || '',
        role: 'player',
        age: '',
        battingStyle: '',
        bowlingStyle: '',
        matches: '',
        runs: '',
        highestScore: '',
        average: '',
        strikeRate: '',
        centuries: '',
        fifties: '',
        wickets: '',
        bestBowling: '',
        bio: '',
        recentMatches: '',
        user: 'no',
        audioUrl: '',
        careerStatsBattingMatches: '',
        careerStatsBattingInnings: '',
        careerStatsBattingNotOuts: '',
        careerStatsBattingRuns: '',
        careerStatsBattingHighest: '',
        careerStatsBattingAverage: '',
        careerStatsBattingStrikeRate: '',
        careerStatsBattingCenturies: '',
        careerStatsBattingFifties: '',
        careerStatsBattingFours: '',
        careerStatsBattingSixes: '',
        careerStatsBowlingInnings: '',
        careerStatsBowlingWickets: '',
        careerStatsBowlingBest: '',
        careerStatsBowlingAverage: '',
        careerStatsBowlingEconomy: '',
        careerStatsBowlingStrikeRate: '',
        careerStatsFieldingCatches: '',
        careerStatsFieldingStumpings: '',
        careerStatsFieldingRunOuts: '',
      });
      setImageFile(null);

      setTimeout(() => onClose(), 1500);
    } catch (err) {
      console.error("Error adding player:", err);
      setError("Failed to add player: " + err.message);
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl border border-gray-700"
        >
          <p className="text-white text-center">Loading authentication...</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl border border-gray-700 overflow-y-auto max-h-[90vh]"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Add New Player</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">Player added successfully!</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-gray-300">Player ID</label>
                <input
                  type="text"
                  name="playerId"
                  value={formData.playerId}
                  readOnly
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 opacity-75"
                />
                <div className="mt-2 flex items-center gap-4">
                  <label className="text-gray-300">User</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="user"
                        value="yes"
                        checked={formData.user === 'yes'}
                        onChange={handleChange}
                        className="mr-2 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="user"
                        value="no"
                        checked={formData.user === 'no'}
                        onChange={handleChange}
                        className="mr-2 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">No</span>
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Team Name</label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Player Image (Upload)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imageFile && <p className="text-sm mt-1 text-gray-400">Selected: {imageFile.name}</p>}
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Or Paste Player Image URL (Optional fallback)</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/player.png"
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Role (e.g., Top Order Batsman)</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Batting Style (e.g., Right Handed Bat)</label>
                <input
                  type="text"
                  name="battingStyle"
                  value={formData.battingStyle}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Bowling Style (e.g., Right Arm Off Spin)</label>
                <input
                  type="text"
                  name="bowlingStyle"
                  value={formData.bowlingStyle}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Recent Matches (one per line, format: "Opponent, Runs, Wickets, Result")</label>
              <textarea
                name="recentMatches"
                value={formData.recentMatches}
                onChange={handleChange}
                rows="4"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Jaipur Strikers, 98, 1, Won by 28 runs\nLUT Biggieagles XI, 64, 0, Lost by 5 wickets`}
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-300">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <h3 className="text-lg font-bold text-white mt-6 border-t border-gray-700 pt-4">Career Stats - Batting</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-gray-300">Matches</label>
                <input
                  type="number"
                  name="careerStatsBattingMatches"
                  value={formData.careerStatsBattingMatches}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Innings</label>
                <input
                  type="number"
                  name="careerStatsBattingInnings"
                  value={formData.careerStatsBattingInnings}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Not Outs</label>
                <input
                  type="number"
                  name="careerStatsBattingNotOuts"
                  value={formData.careerStatsBattingNotOuts}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Runs</label>
                <input
                  type="number"
                  name="careerStatsBattingRuns"
                  value={formData.careerStatsBattingRuns}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Highest Score</label>
                <input
                  type="number"
                  name="careerStatsBattingHighest"
                  value={formData.careerStatsBattingHighest}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Average</label>
                <input
                  type="number"
                  step="0.01"
                  name="careerStatsBattingAverage"
                  value={formData.careerStatsBattingAverage}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Strike Rate</label>
                <input
                  type="number"
                  step="0.01"
                  name="careerStatsBattingStrikeRate"
                  value={formData.careerStatsBattingStrikeRate}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Centuries</label>
                <input
                  type="number"
                  name="careerStatsBattingCenturies"
                  value={formData.careerStatsBattingCenturies}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Fifties</label>
                <input
                  type="number"
                  name="careerStatsBattingFifties"
                  value={formData.careerStatsBattingFifties}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Fours</label>
                <input
                  type="number"
                  name="careerStatsBattingFours"
                  value={formData.careerStatsBattingFours}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Sixes</label>
                <input
                  type="number"
                  name="careerStatsBattingSixes"
                  value={formData.careerStatsBattingSixes}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mt-6 border-t border-gray-700 pt-4">Career Stats - Bowling</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-gray-300">Innings</label>
                <input
                  type="number"
                  name="careerStatsBowlingInnings"
                  value={formData.careerStatsBowlingInnings}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Wickets</label>
                <input
                  type="number"
                  name="careerStatsBowlingWickets"
                  value={formData.careerStatsBowlingWickets}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Best Bowling</label>
                <input
                  type="text"
                  name="careerStatsBowlingBest"
                  value={formData.careerStatsBowlingBest}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Average</label>
                <input
                  type="number"
                  step="0.01"
                  name="careerStatsBowlingAverage"
                  value={formData.careerStatsBowlingAverage}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Economy</label>
                <input
                  type="number"
                  step="0.01"
                  name="careerStatsBowlingEconomy"
                  value={formData.careerStatsBowlingEconomy}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Strike Rate</label>
                <input
                  type="number"
                  step="0.01"
                  name="careerStatsBowlingStrikeRate"
                  value={formData.careerStatsBowlingStrikeRate}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mt-6 border-t border-gray-700 pt-4">Career Stats - Fielding</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-gray-300">Catches</label>
                <input
                  type="number"
                  name="careerStatsFieldingCatches"
                  value={formData.careerStatsFieldingCatches}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Stumpings</label>
                <input
                  type="number"
                  name="careerStatsFieldingStumpings"
                  value={formData.careerStatsFieldingStumpings}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Run Outs</label>
                <input
                  type="number"
                  name="careerStatsFieldingRunOuts"
                  value={formData.careerStatsFieldingRunOuts}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={loading || !currentUserId}
              >
                {loading ? 'Adding Player...' : 'Add Player'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// PlayerSelector Component
const PlayerSelector = ({ teamA, teamB, overs, origin, scorer, onPlayerAdded }) => {
  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState({ left: [], right: [] });
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [selectedTeamForPlayer, setSelectedTeamForPlayer] = useState(null);
  const navigate = useNavigate();

  const playersTeamAData = teamA?.players || [];
  const playersTeamBData = teamB?.players || [];

  const filteredLeftPlayers = playersTeamAData.filter(player =>
    player.name.toLowerCase().includes(leftSearch.toLowerCase())
  );
  const filteredRightPlayers = playersTeamBData.filter(player =>
    player.name.toLowerCase().includes(rightSearch.toLowerCase())
  );

  const togglePlayerSelection = (side, player) => {
    setSelectedPlayers(prev => {
      const newSelection = { ...prev };
      if (newSelection[side].includes(player)) {
        newSelection[side] = newSelection[side].filter(p => p.playerId !== player.playerId);
      } else {
        if (newSelection[side].length < 11) {
          newSelection[side] = [...newSelection[side], player];
        }
      }
      return newSelection;
    });
  };

  const handleOpenAddPlayer = (team) => {
    setSelectedTeamForPlayer(team);
    setIsAddPlayerModalOpen(true);
  };

  const handleCloseAddPlayer = () => {
    setIsAddPlayerModalOpen(false);
    setSelectedTeamForPlayer(null);
    onPlayerAdded();
  };

  const handleActualStartMatch = () => {
    if (selectedPlayers.left.length !== 11 || selectedPlayers.right.length !== 11) {
      alert("Please select exactly 11 players for each team before starting the match.");
      return;
    }

    console.log("Starting match with players:", selectedPlayers);
    console.log('Origin being passed to StartMatchPlayers:', origin);
    navigate('/StartMatchPlayersSB', {
      state: {
        scorer: scorer,
        overs: overs,
        teamA: teamA,
        teamB: teamB,
        selectedPlayers: selectedPlayers,
        origin: origin
      }
    });
  };

  const getTeamFlag = (team) => {
    if (team?.flagUrl) {
      return <img src={team.flagUrl} alt={`${team.teamName} Flag`} className="w-8 h-6 object-cover rounded-sm" />;
    }
    return (
      <div className="w-8 h-6 flex items-center justify-center bg-blue-500 text-white font-bold rounded-sm">
        {team?.teamName?.charAt(0).toUpperCase() || '?'}
      </div>
    );
  };

  const getPlayerImage = (player) => {
    if (player?.image) {
      return (
        <img
          src={player.image}
          alt={player.name}
          className="w-8 h-8 rounded-full object-cover mr-3 border border-gray-300"
        />
      );
    }
    return (
      <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full mr-3 border border-gray-300">
        {player?.name?.charAt(0).toUpperCase() || '?'}
      </div>
    );
  };

  return (
    <div
      className="w-full relative py-8"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: 'calc(100vh - H - N)',
      }}
    >
      <div className="w-full px-4 md:px-8 pb-8 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }}
          className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl border border-blue-100"
        >
          <h1 className="text-4xl font-bold mb-6 text-black">Select Players</h1>

          <div className="flex flex-col md:flex-row gap-8">
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-semibold text-blue-800">{teamA?.teamName || 'Team A'}</span>
                {getTeamFlag(teamA)}
                <button
                  onClick={() => handleOpenAddPlayer(teamA)}
                  className="text-green-600 hover:text-green-700 ml-2"
                  title="Add Player"
                >
                  <FiPlusCircle size={24} />
                </button>
                <span className="ml-auto text-lg font-bold text-blue-700">
                  Selected: {selectedPlayers.left.length}/11
                </span>
              </div>

              <div className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Players..."
                    className="w-full p-3 pl-10 border-2 border-blue-200 rounded-lg mb-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-black"
                    value={leftSearch}
                    onChange={(e) => setLeftSearch(e.target.value)}
                  />
                  <svg
                    className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <div className="border-2 border-blue-100 rounded-lg max-h-60 overflow-y-auto bg-white">
                  {filteredLeftPlayers.length === 0 ? (
                    <p className="p-3 text-gray-500">No players found. Add players using the + icon.</p>
                  ) : (
                    filteredLeftPlayers.map((player) => {
                      const isSelected = selectedPlayers.left.some(p => p.playerId === player.playerId);
                      const isSelectionDisabled = selectedPlayers.left.length >= 11 && !isSelected;

                      return (
                        <motion.div
                          key={player.playerId}
                          className={`p-3 border-b border-blue-50 last:border-b-0 transition-colors duration-200 flex items-center ${
                            isSelected
                              ? 'bg-blue-100 font-medium'
                              : 'hover:bg-blue-50'
                          } ${isSelectionDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          onClick={isSelectionDisabled ? null : () => togglePlayerSelection('left', player)}
                          whileHover={isSelectionDisabled ? {} : { scale: 1.01 }}
                        >
                          {getPlayerImage(player)}
                          <div className="flex flex-col">
                            <span className="text-blue-800">{player.name}</span>
                            <span className="text-sm text-gray-500">
                              ID: {player.playerId} | User: {player.user} | Role: {player.role || 'N/A'}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="float-right text-blue-600 ml-auto">✓</span>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div className="flex-1" whileHover={{ scale: 1.02 }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-semibold text-indigo-800">{teamB?.teamName || 'Team B'}</span>
                {getTeamFlag(teamB)}
                <button
                  onClick={() => handleOpenAddPlayer(teamB)}
                  className="text-green-600 hover:text-green-700 ml-2"
                  title="Add Player"
                >
                  <FiPlusCircle size={24} />
                </button>
                <span className="ml-auto text-lg font-bold text-indigo-700">
                  Selected: {selectedPlayers.right.length}/11
                </span>
              </div>

              <div className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Players..."
                    className="w-full p-3 pl-10 border-2 border-indigo-200 rounded-lg mb-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-black"
                    value={rightSearch}
                    onChange={(e) => setRightSearch(e.target.value)}
                  />
                  <svg
                    className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <div className="border-2 border-indigo-100 rounded-lg max-h-60 overflow-y-auto bg-white">
                  {filteredRightPlayers.length === 0 ? (
                    <p className="p-3 text-gray-500">No players found. Add players using the + icon.</p>
                  ) : (
                    filteredRightPlayers.map((player) => {
                      const isSelected = selectedPlayers.right.some(p => p.playerId === player.playerId);
                      const isSelectionDisabled = selectedPlayers.right.length >= 11 && !isSelected;

                      return (
                        <motion.div
                          key={player.playerId}
                          className={`p-3 border-b border-indigo-50 last:border-b-0 transition-colors duration-200 flex items-center ${
                            isSelected
                              ? 'bg-indigo-100 font-medium'
                              : 'hover:bg-indigo-50'
                          } ${isSelectionDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          onClick={isSelectionDisabled ? null : () => togglePlayerSelection('right', player)}
                          whileHover={isSelectionDisabled ? {} : { scale: 1.01 }}
                        >
                          {getPlayerImage(player)}
                          <div className="flex flex-col">
                            <span className="text-blue-800">{player.name}</span>
                            <span className="text-sm text-gray-500">
                              ID: {player.playerId} | User: {player.user} | Role: {player.role || 'N/A'}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="float-right text-indigo-600 ml-auto">✓</span>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-8 pt-4 border-t border-blue-200">
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleActualStartMatch}
            >
              Start Match
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isAddPlayerModalOpen && (
            <AddClubPlayerModal2
              onClose={handleCloseAddPlayer}
              team={selectedTeamForPlayer}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Startmatch Component
const Startmatch = ({ initialTeamA = '', initialTeamB = '', origin }) => {
  console.log('Startmatch received origin prop:', origin);

  const [allTeams, setAllTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [teamFetchError, setTeamFetchError] = useState(null);
  const [selectedTeamA, setSelectedTeamA] = useState('');
  const [selectedTeamB, setSelectedTeamB] = useState('');
  const [tossWinner, setTossWinner] = useState('');
  const [tossDecision, setTossDecision] = useState('Batting');
  const [overs, setOvers] = useState('');
  const [scorer, setScorer] = useState('');
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
        setTeamFetchError('You must be logged in to start a match.');
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const fetchAllTeams = async () => {
    if (!currentUserId) {
      setLoadingTeams(false);
      return;
    }
    try {
      setLoadingTeams(true);
      const teamsCollectionRef = collection(db, 'clubTeams');
      const q = query(teamsCollectionRef, where('createdBy', '==', currentUserId));
      const teamSnapshot = await getDocs(q);
      const fetchedTeams = teamSnapshot.docs.map(doc => ({
        id: doc.id,
        teamName: doc.data().teamName,
        flagUrl: doc.data().flagUrl || '',
        players: doc.data().players || [],
        ...doc.data()
      }));
      setAllTeams(fetchedTeams);
    } catch (err) {
      console.error("Error fetching all teams:", err);
      setTeamFetchError("Failed to load teams from database. Please check console.");
    } finally {
      setLoadingTeams(false);
    }
  };

  useEffect(() => {
    fetchAllTeams();
  }, [currentUserId]);

  useEffect(() => {
    if (initialTeamA && allTeams.length > 0) {
      setSelectedTeamA(initialTeamA);
    }
  }, [initialTeamA, allTeams]);

  useEffect(() => {
    if (initialTeamB && allTeams.length > 0) {
      setSelectedTeamB(initialTeamB);
    }
  }, [initialTeamB, allTeams]);

  useEffect(() => {
    if (selectedTeamA && selectedTeamB.toLowerCase() === selectedTeamA.toLowerCase()) {
      setSelectedTeamB('');
    }
  }, [selectedTeamA, selectedTeamB]);

  const handleNext = async () => {
    if (!selectedTeamA || !selectedTeamB || !overs || !scorer) {
      alert('Please select both teams, enter overs, and assign the scorer.');
      return;
    }
    if (selectedTeamA.toLowerCase() === selectedTeamB.toLowerCase()) {
      alert('Teams A and B cannot be the same. Please select different teams.');
      return;
    }

    const teamsCollectionRef = collection(db, 'clubTeams');

    const teamAQuery = query(
      teamsCollectionRef,
      where('teamName', '==', selectedTeamA),
      where('createdBy', '==', currentUserId)
    );
    const teamASnapshot = await getDocs(teamAQuery);
    if (teamASnapshot.empty) {
      await addDoc(teamsCollectionRef, {
        teamName: selectedTeamA,
        createdBy: currentUserId,
        createdAt: new Date(),
        players: []
      });
    }

    const teamBQuery = query(
      teamsCollectionRef,
      where('teamName', '==', selectedTeamB),
      where('createdBy', '==', currentUserId)
    );
    const teamBSnapshot = await getDocs(teamBQuery);
    if (teamBSnapshot.empty) {
      await addDoc(teamsCollectionRef, {
        teamName: selectedTeamB,
        createdBy: currentUserId,
        createdAt: new Date(),
        players: []
      });
    }

    await fetchAllTeams();

    setShowPlayerSelector(true);
  };

  if (showPlayerSelector) {
    const teamAObject = allTeams.find(team => team.teamName.toLowerCase() === selectedTeamA.toLowerCase());
    const teamBObject = allTeams.find(team => team.teamName.toLowerCase() === selectedTeamB.toLowerCase());

    return (
      <PlayerSelector
        teamA={teamAObject}
        teamB={teamBObject}
        overs={overs}
        origin={origin}
        scorer={scorer}
        onPlayerAdded={fetchAllTeams}
      />
    );
  }

  const hasValue = (value) => value !== '' && value !== null && value !== undefined;

  if (loadingTeams) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl">Loading Teams...</p>
      </div>
    );
  }

  if (teamFetchError) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-500 flex items-center justify-center">
        <p className="text-xl">Error: {teamFetchError}</p>
      </div>
    );
  }

  if (allTeams.length < 2) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl text-center">
          Not enough teams registered. Please add at least two teams via the Admin Panel.
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full relative"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: 'calc(100vh - H - N)',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="w-full px-4 md:px-8 pb-8 py-1 mx-auto max-w-7xl">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center text-white mb-4 drop-shadow-lg"
          >
            Start a Match
          </motion.h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            <motion.div
              className="flex flex-col space-y-6 w-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                className="min-h-[300px] bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl p-6 w-full border border-blue-100 flex flex-col"
                whileHover={{ scale: 1.01 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Select Teams</h2>
                <div className="space-y-4 w-full flex-1">
                  <div className="w-full">
                    <label className="block text-gray-700 mb-2 font-medium">Team A</label>
                    <input
                      type="text"
                      placeholder="Enter Team A name"
                      className={`w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${hasValue(selectedTeamA) ? 'bg-gray-200 text-gray-700' : 'bg-white'}`}
                      value={selectedTeamA}
                      onChange={(e) => setSelectedTeamA(e.target.value)}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-gray-700 mb-2 font-medium">Team B</label>
                    <input
                      type="text"
                      placeholder="Enter Team B name"
                      className={`w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${hasValue(selectedTeamB) ? 'bg-gray-200 text-gray-700' : 'bg-white'}`}
                      value={selectedTeamB}
                      onChange={(e) => setSelectedTeamB(e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="min-h-[200px] bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl p-6 w-full border border-blue-100 flex flex-col justify-center"
                whileHover={{ scale: 1.01 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Choose your Overs</h2>
                <div className="w-full">
                  <input
                    type="number"
                    placeholder="Enter overs (e.g. 20)"
                    className={`w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${hasValue(overs) ? 'bg-gray-200 text-gray-700' : 'bg-white'}`}
                    value={overs}
                    onChange={(e) => setOvers(e.target.value)}
                    min="1"
                    max="50"
                  />
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex flex-col space-y-6 w-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                className="min-h-[300px] bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl p-6 w-full border border-blue-100 flex flex-col"
                whileHover={{ scale: 1.01 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Toss Details</h2>
                <div className="space-y-4 w-full flex-1">
                  <div className="w-full">
                    <label className="block text-gray-700 mb-2 font-medium">Record Toss & Decision</label>
                    <select
                      className={`w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 mb-4 ${hasValue(tossWinner) ? 'bg-gray-200 text-gray-700' : 'bg-white'}`}
                      value={tossWinner}
                      onChange={(e) => setTossWinner(e.target.value)}
                    >
                      <option value="">Select Team</option>
                      {selectedTeamA && <option value={selectedTeamA}>{selectedTeamA}</option>}
                      {selectedTeamB && <option value={selectedTeamB}>{selectedTeamB}</option>}
                    </select>
                  </div>
                  <div className="w-full">
                    <label className="block text-gray-700 mb-2 font-medium">Elected to:</label>
                    <div className="flex space-x-8 items-center">
                      <label className="inline-flex items-center space-x-2">
                        <input
                          type="radio"
                          name="tossDecision"
                          value="Batting"
                          checked={tossDecision === 'Batting'}
                          onChange={() => setTossDecision('Batting')}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-black font-medium">Batting</span>
                      </label>
                      <label className="inline-flex items-center space-x-2">
                        <input
                          type="radio"
                          name="tossDecision"
                          value="Bowling"
                          checked={tossDecision === 'Bowling'}
                          onChange={() => setTossDecision('Bowling')}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-black font-medium">Bowling</span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="min-h-[200px] bg-gradient-to-br from-blue-50 to-indigo-50 bg-opacity-90 rounded-xl shadow-xl p-6 w-full border border-blue-100 flex flex-col justify-center"
                whileHover={{ scale: 1.01 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Assign Scorer</h2>
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Enter scorer name"
                    className={`w-full p-3 border-2 border-blue-200 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${hasValue(scorer) ? 'bg-gray-200 text-gray-700' : 'bg-white'}`}
                    value={scorer}
                    onChange={(e) => setScorer(e.target.value)}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="mt-8 text-center w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.button
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl text-xl transition-all duration-300"
              onClick={handleNext}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              Next
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Startmatch;