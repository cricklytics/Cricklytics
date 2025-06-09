import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Picture3 from '../../../assets/sophita/HomePage/Picture3.png';
import { motion } from 'framer-motion';
import { FaCrown, FaArrowLeft, FaPlus, FaStar } from 'react-icons/fa';
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from '../../../firebase';

const FieldingStatsPage = () => {
  const [stats, setStats] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    matches: '',
    dismissals: '',
    catches: '',
    overs: '',
    rank: '',
    stars: '',
    isPro: false,
    avatarInputType: 'url', // 'url' or 'file'
    avatarUrl: '',
    avatarFile: null,
    avatarBase64: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, "fieldingStats"));
      setStats(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    })();
  }, [showAddModal]);

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;

    if (name === "avatarFile" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatarFile: file,
          avatarBase64: reader.result,
          avatarUrl: ''
        }));
      };
      reader.readAsDataURL(file);
    } else if (name === "avatarInputType") {
      setFormData(prev => ({
        ...prev,
        avatarInputType: value,
        avatarUrl: '',
        avatarFile: null,
        avatarBase64: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const id = formData.name.toLowerCase().replace(/\s+/g, '_');
    const avatarToSave = formData.avatarBase64 || formData.avatarUrl || '';

    await setDoc(doc(db, "fieldingStats", id), {
      name: formData.name,
      matches: formData.matches,
      dismissals: formData.dismissals,
      catches: formData.catches,
      overs: formData.overs,
      rank: formData.rank,
      stars: Number(formData.stars),
      isPro: Boolean(formData.isPro),
      avatar: avatarToSave,
    });

    setFormData({
      name: '',
      matches: '',
      dismissals: '',
      catches: '',
      overs: '',
      rank: '',
      stars: '',
      isPro: false,
      avatarInputType: 'url',
      avatarUrl: '',
      avatarFile: null,
      avatarBase64: ''
    });
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#03001e] via-[#7303c0] to-[#ec38bc] text-white">
      <nav className="fixed top-0 w-full bg-gradient-to-r from-[#03001e] to-[#7303c0] p-4 shadow-lg z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/landingpage")}
              className="flex items-center bg-[#7303c0] hover:bg-[#8a05e6] px-3 py-2 rounded-full"
            >
              <FaArrowLeft />
            </button>
            <img src={Picture3} alt="Logo" className="h-8 w-8" />
            <span className="text-xl font-bold">Cricklytics</span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full"
          >
            <FaPlus /> Add Fielding Stats
          </button>
        </div>
      </nav>

      <main className="pt-24 px-4 md:px-8 pb-8">
        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, staggerChildren: 0.1 } }}
          initial="hidden"
          animate="visible"
          className="overflow-x-auto"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="text-left p-2">Player</th>
                <th className="text-center p-2">Mat</th>
                <th className="text-center p-2">Dismissal</th>
                <th className="text-center p-2">Catches</th>
                <th className="text-center p-2">Overs</th>
                <th className="text-center p-2">Rank</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((p) => (
                <motion.tr
                  key={p.id}
                  className="border-b border-gray-700 hover:bg-gray-800/50"
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                >
                  <td className="p-2 flex items-center gap-3">
                    <div className="relative">
                      {p.avatar ? (
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-10 h-10 rounded-full object-cover bg-gray-700 flex items-center justify-center text-white uppercase"
                          onError={(e) => { e.currentTarget.src = ""; }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white uppercase font-bold text-lg">
                          {p.name?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                      {p.isPro && (
                        <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                          <FaCrown className="text-xs text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="flex items-center">
                        {Array.from({ length: p.stars }).map((_, i) => (
                          <FaStar key={i} className="text-yellow-400 text-xs" />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 text-center">{p.matches}</td>
                  <td className="p-2 text-center">{p.dismissals}</td>
                  <td className="p-2 text-center">{p.catches}</td>
                  <td className="p-2 text-center">{p.overs}</td>
                  <td className="p-2 text-center font-bold text-yellow-400">{p.rank}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center sticky top-0 bg-gray-800 py-2 z-20">
              <h3 className="text-xl font-bold">Add Fielding Stats</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              {["name", "matches", "dismissals", "catches", "overs", "rank"].map((key) => (
                <div key={key}>
                  <label className="block text-white mb-1 capitalize">{key}</label>
                  <input
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                  />
                </div>
              ))}

              <div>
                <label className="block text-white mb-1">Stars (1–5)</label>
                <input
                  name="stars"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.stars}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                />
              </div>

              <div className="text-white mb-2">Select Avatar Input Type:</div>
              <div className="flex gap-4 mb-4 text-white">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="avatarInputType"
                    value="url"
                    checked={formData.avatarInputType === 'url'}
                    onChange={handleChange}
                  />
                  URL
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="avatarInputType"
                    value="file"
                    checked={formData.avatarInputType === 'file'}
                    onChange={handleChange}
                  />
                  Upload
                </label>
              </div>

              {formData.avatarInputType === 'url' ? (
                <div>
                  <label className="block text-white mb-1">Avatar URL (optional)</label>
                  <input
                    name="avatarUrl"
                    type="text"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    placeholder="Enter image URL"
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-white mb-1">Upload Avatar Image (optional)</label>
                  <input
                    name="avatarFile"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                  />
                  {formData.avatarBase64 && (
                    <img src={formData.avatarBase64} alt="Preview" className="mt-2 w-20 h-20 rounded-full object-cover" />
                  )}
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isPro"
                  checked={formData.isPro}
                  onChange={handleChange}
                  id="isPro"
                />
                <label htmlFor="isPro" className="text-white">Pro (show crown?)</label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-600 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 px-4 py-2 rounded text-white">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 }}
        className="fixed bottom-4 right-4 text-yellow-400 text-4xl"
      >
        <FaCrown />
      </motion.div>
    </div>
  );
};

export default FieldingStatsPage;
