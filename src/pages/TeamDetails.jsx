import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaRegCopyright, FaTrash } from 'react-icons/fa';
import logo from '../assets/sophita/HomePage/picture3_2.png';
import backButton from '../assets/kumar/right-chevron.png';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore';

export default function TeamDetails() {
  const [activeTab, setActiveTab] = useState('myteam');
  const [followedTeams, setFollowedTeams] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    teamType: 'myteam',
    name: '',
    location: '',
    captain: '',
    imageType: 'url',
    imageUrl: '',
    imageFile: null,
  });

  useEffect(() => {
    fetchTeams();
  }, [activeTab]);

  const fetchTeams = async () => {
    const querySnapshot = await getDocs(collection(db, activeTab === 'myteam' ? 'myTeams' : 'opponentTeams'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTeams(data);
  };

  const handleAddTeam = async () => {
    let imageSrc = formData.imageUrl;

    if (formData.imageType === 'file' && formData.imageFile) {
      alert("Local image handling not implemented. Use URL for now.");
      return;
    }

    const teamDoc = {
      name: formData.name,
      location: formData.location,
      captain: formData.captain,
      image: imageSrc,
    };

    const collectionName = formData.teamType === 'myteam' ? 'myTeams' : 'opponentTeams';
    await addDoc(collection(db, collectionName), teamDoc);

    setFormData({
      teamType: 'myteam',
      name: '',
      location: '',
      captain: '',
      imageType: 'url',
      imageUrl: '',
      imageFile: null,
    });

    setShowModal(false);
    fetchTeams();
  };

  const handleDeleteTeam = async (teamId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this team?');
    if (confirmDelete) {
      const collectionName = activeTab === 'myteam' ? 'myTeams' : 'opponentTeams';
      await deleteDoc(doc(db, collectionName, teamId));
      fetchTeams();
    }
  };

  return (
    <div className="min-h-screen p-4" style={{
      backgroundImage: 'linear-gradient(140deg,#080006 15%,#FF0077)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div className="flex flex-col mt-0">
        <div className="flex items-start">
          <img src={logo} alt="Cricklytics Logo" className="h-7 w-7 md:h-10 object-contain block select-none" />
          <span className="p-2 text-2xl font-bold text-white whitespace-nowrap text-shadow-[0_0_8px_rgba(93,224,230,0.4)]">Cricklytics</span>
        </div>
      </div>

      <div className="md:absolute flex items-center gap-4">
        <img
          src={backButton}
          alt="Back"
          className="h-8 w-8 cursor-pointer -scale-x-100"
          onClick={() => window.history.back()}
        />
      </div>

      <div className="flex justify-center space-x-12 text-white text-lg font-semibold border-b-4 border-white pb-2 mb-6">
        {['myteam', 'opponent', 'following'].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer ${activeTab === tab ? 'border-b-2 border-white text-blue-500' : ''}`}
          >
            {tab === 'myteam' ? 'My Team' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>

      {activeTab !== 'following' && (
        <div className="flex justify-center mb-4">
          <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Add Team
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1e1e2f] p-6 rounded-2xl shadow-2xl max-w-md w-full text-white">
            <h2 className="text-xl font-bold mb-4 text-center">Add Team</h2>

            <label className="block mb-1">Team Type</label>
            <select
              className="w-full p-2 border rounded mb-4 bg-[#2c2c3f] text-white placeholder-gray-300"
              value={formData.teamType}
              onChange={(e) => setFormData({ ...formData, teamType: e.target.value })}
            >
              <option value="myteam">My Team</option>
              <option value="opponentTeams">Opponent</option>
            </select>

            <label className="block mb-1">Team Name</label>
            <input type="text" placeholder="Enter team name" className="w-full p-2 border rounded mb-4 bg-[#2c2c3f] text-white placeholder-gray-300"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <label className="block mb-1">Location</label>
            <input type="text" placeholder="Enter location" className="w-full p-2 border rounded mb-4 bg-[#2c2c3f] text-white placeholder-gray-300"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />

            <label className="block mb-1">Captain</label>
            <input type="text" placeholder="Enter captain name" className="w-full p-2 border rounded mb-4 bg-[#2c2c3f] text-white placeholder-gray-300"
              value={formData.captain}
              onChange={(e) => setFormData({ ...formData, captain: e.target.value })}
            />

            <div className="mb-4">
              <label className="mr-4">
                <input
                  type="radio"
                  name="imageType"
                  value="url"
                  checked={formData.imageType === 'url'}
                  onChange={(e) => setFormData({ ...formData, imageType: e.target.value })}
                /> Image URL
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  name="imageType"
                  value="file"
                  checked={formData.imageType === 'file'}
                  onChange={(e) => setFormData({ ...formData, imageType: e.target.value })}
                /> Upload File
              </label>
            </div>

            {formData.imageType === 'url' ? (
              <>
                <label className="block mb-1">Image URL</label>
                <input type="text" placeholder="Enter image URL" className="w-full p-2 border rounded mb-4 bg-[#2c2c3f] text-white placeholder-gray-300"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </>
            ) : (
              <>
                <label className="block mb-1">Upload Image</label>
                <input type="file" className="w-full p-2 border rounded mb-4 bg-[#2c2c3f] text-white"
                  onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })}
                />
              </>
            )}

            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="bg-gray-500 px-4 py-2 rounded">Cancel</button>
              <button onClick={handleAddTeam} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto space-y-4">
        {activeTab === 'following' ? (
          <div>
            <h2 className="text-white text-xl mb-4">Following Teams</h2>
            {followedTeams.length === 0 ? (
              <p className="text-white">You are not following any teams yet.</p>
            ) : (
              followedTeams.map((teamName, idx) => (
                <div key={idx} className="rounded-xl p-4 shadow-md shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                  <span className="text-lg font-semibold text-black">{teamName}</span>
                </div>
              ))
            )}
          </div>
        ) : (
          teams.map((team, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] bg-white/5 backdrop-blur flex justify-between items-center"
            >
              <div className="flex items-center">
                {team.image ? (
                  <img
                    src={team.image}
                    alt="team"
                    className="aspect-square w-14 rounded-full mr-4 border-2 border-gray-300 object-cover"
                  />
                ) : (
                  <div className="aspect-square w-14 rounded-full mr-4 border-2 border-gray-300 bg-gray-700 text-white flex items-center justify-center text-xl font-bold">
                    {team.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-lg font-semibold text-white">{team.name}</span>
              </div>

              <div className="text-right text-sm space-y-1 text-white">
                <div className="flex items-center justify-end gap-2">
                  <FaMapMarkerAlt className="text-white" />
                  <span>{team.location}</span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <FaRegCopyright className="text-white" />
                  <span>{team.captain}</span>
                </div>
              </div>

              <FaTrash className="text-white cursor-pointer ml-4" onClick={() => handleDeleteTeam(team.id)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
