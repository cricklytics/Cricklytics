import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Adjust path based on your file structure
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';

const storage = getStorage();

const uploadFile = async (file, filePath) => {
    if (!file) return null;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
};

// Function to generate a unique 6-digit numerical player ID
const generateUniquePlayerId = async () => {
    const playersCollectionRef = collection(db, 'clubPlayers');
    const snapshot = await getDocs(playersCollectionRef);
    const existingIds = snapshot.docs.map(doc => doc.data().playerId).filter(id => id);

    let newId;
    do {
        newId = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit number
    } while (existingIds.includes(newId));

    return newId;
};

const AddPlayerModal = ({ onClose, onPlayerAdded }) => {
    const [clubPlayerFormData, setClubPlayerFormData] = useState({
        playerId: '', // Add playerId to form data
        name: '',
        image: '',
        team: '',
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
    const [clubPlayerImageFile, setClubPlayerImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Generate playerId when the modal mounts
    useEffect(() => {
        const setPlayerId = async () => {
            const newId = await generateUniquePlayerId();
            setClubPlayerFormData(prev => ({ ...prev, playerId: newId.toString() }));
        };
        setPlayerId();
    }, []);

    const handleClubPlayerChange = (e) => {
        const { name, value } = e.target;
        setClubPlayerFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleClubPlayerImageFileChange = (e) => {
        if (e.target.files[0]) {
            setClubPlayerImageFile(e.target.files[0]);
        } else {
            setClubPlayerImageFile(null);
        }
    };

    const handleClubPlayerSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const playerName = clubPlayerFormData.name.trim();
        if (!playerName) {
            setError("Player name cannot be empty.");
            setLoading(false);
            return;
        }

        let uploadedImageUrl = clubPlayerFormData.image;
        try {
            if (clubPlayerImageFile) {
                const filePath = `club_player_photos/${playerName.toLowerCase().replace(/\s+/g, '_')}_${clubPlayerImageFile.name}`;
                uploadedImageUrl = await uploadFile(clubPlayerImageFile, filePath);
                if (!uploadedImageUrl) {
                    throw new Error("Failed to upload club player image.");
                }
            }

            const recentMatchesParsed = clubPlayerFormData.recentMatches
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

            const clubPlayerData = {
                playerId: parseInt(clubPlayerFormData.playerId), // Save playerId as number
                name: playerName,
                image: uploadedImageUrl,
                team: clubPlayerFormData.team,
                role: clubPlayerFormData.role,
                age: parseInt(clubPlayerFormData.age) || 0,
                battingStyle: clubPlayerFormData.battingStyle,
                bowlingStyle: clubPlayerFormData.bowlingStyle,
                matches: parseInt(clubPlayerFormData.matches) || 0,
                runs: parseInt(clubPlayerFormData.runs) || 0,
                highestScore: parseInt(clubPlayerFormData.highestScore) || 0,
                average: parseFloat(clubPlayerFormData.average) || 0,
                strikeRate: parseFloat(clubPlayerFormData.strikeRate) || 0,
                centuries: parseInt(clubPlayerFormData.centuries) || 0,
                fifties: parseInt(clubPlayerFormData.fifties) || 0,
                wickets: parseInt(clubPlayerFormData.wickets) || 0,
                bestBowling: clubPlayerFormData.bestBowling || '',
                bio: clubPlayerFormData.bio || '',
                recentMatches: recentMatchesParsed,
                careerStats: {
                    batting: {
                        matches: parseInt(clubPlayerFormData.careerStatsBattingMatches) || 0,
                        innings: parseInt(clubPlayerFormData.careerStatsBattingInnings) || 0,
                        notOuts: parseInt(clubPlayerFormData.careerStatsBattingNotOuts) || 0,
                        runs: parseInt(clubPlayerFormData.careerStatsBattingRuns) || 0,
                        highest: parseInt(clubPlayerFormData.careerStatsBattingHighest) || 0,
                        average: parseFloat(clubPlayerFormData.careerStatsBattingAverage) || 0,
                        strikeRate: parseFloat(clubPlayerFormData.careerStatsBattingStrikeRate) || 0,
                        centuries: parseInt(clubPlayerFormData.careerStatsBattingCenturies) || 0,
                        fifties: parseInt(clubPlayerFormData.careerStatsBattingFifties) || 0,
                        fours: parseInt(clubPlayerFormData.careerStatsBattingFours) || 0,
                        sixes: parseInt(clubPlayerFormData.careerStatsBattingSixes) || 0,
                    },
                    bowling: {
                        innings: parseInt(clubPlayerFormData.careerStatsBowlingInnings) || 0,
                        wickets: parseInt(clubPlayerFormData.careerStatsBowlingWickets) || 0,
                        best: clubPlayerFormData.careerStatsBowlingBest || '',
                        average: parseFloat(clubPlayerFormData.careerStatsBowlingAverage) || 0,
                        economy: parseFloat(clubPlayerFormData.careerStatsBowlingEconomy) || 0,
                        strikeRate: parseFloat(clubPlayerFormData.careerStatsBowlingStrikeRate) || 0,
                    },
                    fielding: {
                        catches: parseInt(clubPlayerFormData.careerStatsFieldingCatches) || 0,
                        stumpings: parseInt(clubPlayerFormData.careerStatsFieldingStumpings) || 0,
                        runOuts: parseInt(clubPlayerFormData.careerStatsFieldingRunOuts) || 0,
                    }
                }
            };

            const clubPlayerId = playerName.toLowerCase().replace(/\s+/g, "_");
            await setDoc(doc(db, "clubPlayers", clubPlayerId), clubPlayerData);
            setSuccess(true);
            
            onPlayerAdded();
            
            // Reset form
            const newId = await generateUniquePlayerId(); // Generate new ID for next player
            setClubPlayerFormData({
                playerId: newId.toString(), // Reset with new ID
                name: '',
                image: '',
                team: '',
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
            setClubPlayerImageFile(null);
            
            setTimeout(() => onClose(), 1500);

        } catch (err) {
            console.error("Error adding club player:", err);
            setError("Failed to add club player: " + err.message);
        } finally {
            setLoading(false);
        }
    };

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
                    <h2 className="text-2xl font-bold text-white mb-4">Add New Club Player</h2>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    {success && <p className="text-green-500 text-sm mb-4">Player added successfully!</p>}

                    <form onSubmit={handleClubPlayerSubmit} className="space-y-4">
                        {/* Basic Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 text-gray-300">Player ID</label>
                                <input
                                    type="text"
                                    name="playerId"
                                    value={clubPlayerFormData.playerId}
                                    readOnly
                                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 opacity-75"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Name</label>
                                <input type="text" name="name" value={clubPlayerFormData.name} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Team Name</label>
                                <input type="text" name="team" value={clubPlayerFormData.team} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Player Image (Upload)</label>
                                <input type="file" accept="image/*" onChange={handleClubPlayerImageFileChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                {clubPlayerImageFile && <p className="text-sm mt-1 text-gray-400">Selected: {clubPlayerImageFile.name}</p>}
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Or Paste Player Image URL (Optional fallback)</label>
                                <input type="text" name="image" value={clubPlayerFormData.image} onChange={handleClubPlayerChange} placeholder="https://example.com/player.png" className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Role (e.g., Top Order Batsman)</label>
                                <input type="text" name="role" value={clubPlayerFormData.role} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Age</label>
                                <input type="number" name="age" value={clubPlayerFormData.age} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Batting Style (e.g., Right Handed Bat)</label>
                                <input type="text" name="battingStyle" value={clubPlayerFormData.battingStyle} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Bowling Style (e.g., Right Arm Off Spin)</label>
                                <input type="text" name="bowlingStyle" value={clubPlayerFormData.bowlingStyle} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>

                        {/* Recent Matches */}
                        <div>
                            <label className="block mb-1 text-gray-300">Recent Matches (one per line, format: "Opponent, Runs, Wickets, Result")</label>
                            <textarea name="recentMatches" value={clubPlayerFormData.recentMatches} onChange={handleClubPlayerChange} rows="4" className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder={`Jaipur Strikers, 98, 1, Won by 28 runs\nLUT Biggieagles XI, 64, 0, Lost by 5 wickets`} />
                        </div>
                        <div>
                            <label className="block mb-1 text-gray-300">Bio</label>
                            <textarea name="bio" value={clubPlayerFormData.bio} onChange={handleClubPlayerChange} rows="3" className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                        </div>

                        {/* Career Stats - Batting */}
                        <h3 className="text-lg font-bold text-white mt-6 border-t border-gray-700 pt-4">Career Stats - Batting</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block mb-1 text-gray-300">Matches</label>
                                <input type="number" name="careerStatsBattingMatches" value={clubPlayerFormData.careerStatsBattingMatches} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Innings</label>
                                <input type="number" name="careerStatsBattingInnings" value={clubPlayerFormData.careerStatsBattingInnings} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Not Outs</label>
                                <input type="number" name="careerStatsBattingNotOuts" value={clubPlayerFormData.careerStatsBattingNotOuts} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Runs</label>
                                <input type="number" name="careerStatsBattingRuns" value={clubPlayerFormData.careerStatsBattingRuns} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Highest Score</label>
                                <input type="number" name="careerStatsBattingHighest" value={clubPlayerFormData.careerStatsBattingHighest} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Average</label>
                                <input type="number" step="0.01" name="careerStatsBattingAverage" value={clubPlayerFormData.careerStatsBattingAverage} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Strike Rate</label>
                                <input type="number" step="0.01" name="careerStatsBattingStrikeRate" value={clubPlayerFormData.careerStatsBattingStrikeRate} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Centuries</label>
                                <input type="number" name="careerStatsBattingCenturies" value={clubPlayerFormData.careerStatsBattingCenturies} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Fifties</label>
                                <input type="number" name="careerStatsBattingFifties" value={clubPlayerFormData.careerStatsBattingFifties} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Fours</label>
                                <input type="number" name="careerStatsBattingFours" value={clubPlayerFormData.careerStatsBattingFours} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Sixes</label>
                                <input type="number" name="careerStatsBattingSixes" value={clubPlayerFormData.careerStatsBattingSixes} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>

                        {/* Career Stats - Bowling */}
                        <h3 className="text-lg font-bold text-white mt-6 border-t border-gray-700 pt-4">Career Stats - Bowling</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block mb-1 text-gray-300">Innings</label>
                                <input type="number" name="careerStatsBowlingInnings" value={clubPlayerFormData.careerStatsBowlingInnings} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Wickets</label>
                                <input type="number" name="careerStatsBowlingWickets" value={clubPlayerFormData.careerStatsBowlingWickets} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Best Bowling</label>
                                <input type="text" name="careerStatsBowlingBest" value={clubPlayerFormData.careerStatsBowlingBest} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Average</label>
                                <input type="number" step="0.01" name="careerStatsBowlingAverage" value={clubPlayerFormData.careerStatsBowlingAverage} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Economy</label>
                                <input type="number" step="0.01" name="careerStatsBowlingEconomy" value={clubPlayerFormData.careerStatsBowlingEconomy} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Strike Rate</label>
                                <input type="number" step="0.01" name="careerStatsBowlingStrikeRate" value={clubPlayerFormData.careerStatsBowlingStrikeRate} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>

                        {/* Career Stats - Fielding */}
                        <h3 className="text-lg font-bold text-white mt-6 border-t border-gray-700 pt-4">Career Stats - Fielding</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block mb-1 text-gray-300">Catches</label>
                                <input type="number" name="careerStatsFieldingCatches" value={clubPlayerFormData.careerStatsFieldingCatches} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Stumpings</label>
                                <input type="number" name="careerStatsFieldingStumpings" value={clubPlayerFormData.careerStatsFieldingStumpings} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block mb-1 text-gray-300">Run Outs</label>
                                <input type="number" name="careerStatsFieldingRunOuts" value={clubPlayerFormData.careerStatsFieldingRunOuts} onChange={handleClubPlayerChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
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
                                disabled={loading}
                            >
                                {loading ? 'Adding Player...' : 'Add Club Player'}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AddPlayerModal;