import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaRegCopyright, FaTrashAlt } from 'react-icons/fa';
import logo from '../assets/sophita/HomePage/picture3_2.png';
import backButton from '../assets/kumar/right-chevron.png';
import { db, auth } from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default function TournamentList() {
  const [activeTab, setActiveTab] = useState('myTournament');
  const [tournamentList, setTournamentList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    tournamentName: '',
    organiserName: '',
    location: '',
    imageUrl: '',
    tabCategory: 'myTournament',
  });
  const [imageSource, setImageSource] = useState('url'); // 'url' or 'local'

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = onSnapshot(collection(db, 'Tournaments'), (snapshot) => {
      const tournaments = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(tournament => tournament.userId === auth.currentUser.uid);
      setTournamentList(tournaments);
    }, (error) => {
      console.error("Error fetching tournaments:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTournament = async () => {
    if (
      formData.tournamentName &&
      formData.organiserName &&
      formData.location &&
      formData.tabCategory
    ) {
      await addDoc(collection(db, 'Tournaments'), {
        ...formData,
        userId: auth.currentUser.uid,
      });
      setFormData({
        tournamentName: '',
        organiserName: '',
        location: '',
        imageUrl: '',
        tabCategory: 'myTournament',
      });
      setImageSource('url');
      setIsModalOpen(false);
    } else {
      alert('Please fill all fields except image (optional)!');
    }
  };

  const handleDeleteTournament = async (id) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      await deleteDoc(doc(db, 'Tournaments', id));
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtering tournaments based on active tab
  let tournamentsToShow = [];
  if (activeTab === 'myTournament') {
    tournamentsToShow = tournamentList.filter(t => t.tabCategory === 'myTournament');
  } else if (activeTab === 'all') {
    tournamentsToShow = tournamentList;
  } else if (activeTab === 'following') {
    tournamentsToShow = [];
  }

  // Helper to render the tournament image or fallback first letter circle
  const renderTournamentImage = (tournament) => {
    if (tournament.imageUrl && tournament.imageUrl.trim() !== '') {
      return (
        <img
          src={tournament.imageUrl}
          alt={tournament.tournamentName}
          className="aspect-square w-14 rounded-full mr-4 border-2 border-gray-300 object-cover"
        />
      );
    } else {
      const firstLetter = tournament.tournamentName.charAt(0).toUpperCase();
      return (
        <div className="w-14 h-14 mr-4 rounded-full border-2 border-gray-300 flex items-center justify-center bg-pink-600 text-white font-bold text-xl select-none">
          {firstLetter}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen p-4" style={{
      backgroundImage: 'linear-gradient(140deg,#080006 15%,#FF0077)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      {/* Top Navbar */}
      <div className="flex flex-col mt-0">
        <div className="flex items-start">
          <img
            src={logo}
            alt="Cricklytics Logo"
            className="h-7 w-7 md:h-10 object-contain block select-none"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/Picture3 2.png";
            }}
          />
          <span className="p-2 text-2xl font-bold text-white whitespace-nowrap text-shadow-[0_0_8px_rgba(93,224,230,0.4)]">
            Cricklytics
          </span>
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

      {/* Tabs */}
      <div className="flex justify-center space-x-12 text-white text-lg font-semibold border-b-4 border-white pb-2 mb-4">
        <div
          onClick={() => setActiveTab('myTournament')}
          className={`cursor-pointer ${activeTab === 'myTournament' ? 'border-b-2 border-white text-blue-500' : ''}`}
        >
          My Tournament
        </div>
        <div
          onClick={() => setActiveTab('following')}
          className={`cursor-pointer ${activeTab === 'following' ? 'border-b-2 border-white text-blue-500' : ''}`}
        >
          Following
        </div>
        <div
          onClick={() => setActiveTab('all')}
          className={`cursor-pointer ${activeTab === 'all' ? 'border-b-2 border-white text-blue-500' : ''}`}
        >
          All
        </div>
      </div>

      {/* Add Tournament Button Below Tabs */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Tournament
        </button>
      </div>

      {/* Tournament Cards */}
      <div className="max-w-xl mx-auto space-y-4">
        {activeTab === 'following' ? (
          <div className="text-white text-center py-10">
            <p className="text-2xl font-semibold">You haven’t followed any tournaments yet! 😔</p>
          </div>
        ) : tournamentsToShow.length === 0 ? (
          <div className="text-white text-center py-10">
            <p className="text-xl font-semibold">No tournaments to show here.</p>
          </div>
        ) : (
          tournamentsToShow.map((tournament) => (
            <div
              key={tournament.id}
              className="rounded-xl bg-white/5 border border-white/20 shadow-lg shadow-black/50 p-4 backdrop-blur relative overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {renderTournamentImage(tournament)}
                  <span className="text-lg font-semibold text-white">{tournament.tournamentName}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-sm space-y-1 text-white">
                    <div className="flex items-center justify-end gap-2">
                      <FaMapMarkerAlt className="text-white" />
                      <span>{tournament.location}</span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <FaRegCopyright className="text-white" />
                      <span>{tournament.organiserName}</span>
                    </div>
                  </div>
                  {/* Delete Icon */}
                  <button
                    onClick={() => handleDeleteTournament(tournament.id)}
                    className="text-red-500 hover:text-red-700 transition ml-4"
                    aria-label="Delete Tournament"
                    title="Delete Tournament"
                  >
                    <FaTrashAlt size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Tournament Modal */}
      {isModalOpen && (
        <div className="border-2 border-white fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
          <div
            className="w-96 rounded-lg p-6 shadow-lg"
            style={{
              background: 'rgba(66, 21, 21, 0.85)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.75)',
            }}
          >
            <h2 className="text-xl font-bold mb-4 text-white text-center">Add Tournament</h2>

            {/* Tournament Name */}
            <label className="block mb-1 text-white font-semibold" htmlFor="tournamentName">Tournament Name</label>
            <input
              id="tournamentName"
              type="text"
              placeholder="Enter tournament name"
              value={formData.tournamentName}
              onChange={(e) => setFormData({ ...formData, tournamentName: e.target.value })}
              className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />

            {/* Organiser Name */}
            <label className="block mb-1 text-white font-semibold" htmlFor="organiserName">Organiser Name</label>
            <input
              id="organiserName"
              type="text"
              placeholder="Enter organiser name"
              value={formData.organiserName}
              onChange={(e) => setFormData({ ...formData, organiserName: e.target.value })}
              className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />

            {/* Location */}
            <label className="block mb-1 text-white font-semibold" htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              placeholder="Enter location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />

            {/* Image Source Selection */}
            <div className="mb-4">
              <label className="block mb-1 text-white font-semibold">Image Source</label>
              <div className="flex gap-4">
                <label className="flex items-center text-white">
                  <input
                    type="radio"
                    name="imageSource"
                    value="url"
                    checked={imageSource === 'url'}
                    onChange={() => setImageSource('url')}
                    className="mr-2"
                  />
                  URL
                </label>
                <label className="flex items-center text-white">
                  <input
                    type="radio"
                    name="imageSource"
                    value="local"
                    checked={imageSource === 'local'}
                    onChange={() => setImageSource('local')}
                    className="mr-2"
                  />
                  Local File
                </label>
              </div>
            </div>

            {/* Image Input */}
            {imageSource === 'url' ? (
              <>
                <label className="block mb-1 text-white font-semibold" htmlFor="imageUrl">Image URL (optional)</label>
                <input
                  id="imageUrl"
                  type="text"
                  placeholder="Enter image URL or leave blank"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </>
            ) : (
              <>
                <label className="block mb-1 text-white font-semibold" htmlFor="imageFile">Upload Image (optional)</label>
                <input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </>
            )}

            {/* Category Selector */}
            <label className="block mb-1 text-white font-semibold" htmlFor="tabCategory">Category</label>
            <select
              id="tabCategory"
              value={formData.tabCategory}
              onChange={(e) => setFormData({ ...formData, tabCategory: e.target.value })}
              className="w-full mb-6 p-2 rounded border border-gray-600 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option className='text-black' value="myTournament">My Tournament</option>
              <option className='text-black' value="following">Following</option>
              <option className='text-black' value="all">All</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTournament}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}