import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaRegImage, FaEdit, FaTrash } from 'react-icons/fa';
import logo from '../assets/sophita/HomePage/picture3_2.png';
import backButton from '../assets/kumar/right-chevron.png';
import { useNavigate } from "react-router-dom";
import { db, auth, storage } from "../firebase"; // Adjust path as needed
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export default function Highlights() {
  const [activeTab, setActiveTab] = useState('myteam');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaData, setMediaData] = useState({ videos: [], photos: [] });
  const [formData, setFormData] = useState({
    type: 'video', // 'video' or 'photo'
    file: null,
    url: '',
    title: '',
    description: '',
  });
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const tabContentVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  // Fetch media data from Firestore
  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = onSnapshot(collection(db, 'Media'), (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(entry => entry.userId === auth.currentUser.uid)
        .reduce((acc, entry) => {
          const type = entry.type === 'video' ? 'videos' : 'photos';
          acc[type].push(entry);
          return acc;
        }, { videos: [], photos: [] });
      setMediaData(data);
    }, (error) => {
      console.error("Error fetching media:", error);
    });

    return () => unsubscribe();
  }, []);

  // Handle modal open
  const handleOpenModal = (type) => {
    setFormData({
      type,
      file: null,
      url: '',
      title: '',
      description: '',
    });
    setEditingEntryId(null);
    setIsModalOpen(true);
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0], url: '' });
  };

  // Handle saving or updating media
  const handleSaveMedia = async () => {
    if (!formData.file && !formData.url.trim()) {
      alert("Please provide a file or URL!");
      return;
    }
    if (formData.type === 'photo' && (!formData.title.trim() || !formData.description.trim())) {
      alert("Please provide a title and description for photos!");
      return;
    }

    setIsLoading(true);
    try {
      let mediaUrl = formData.url;
      let storagePath = null;

      // Upload file to Firebase Storage if provided
      if (formData.file) {
        const fileExt = formData.file.name.split('.').pop();
        storagePath = `media/${auth.currentUser.uid}/${formData.type}s/${Date.now()}.${fileExt}`;
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, formData.file);
        mediaUrl = await getDownloadURL(storageRef);
      }

      const entryData = {
        type: formData.type,
        url: mediaUrl,
        title: formData.title,
        description: formData.description,
        userId: auth.currentUser.uid,
        timestamp: new Date().toISOString(),
      };

      let docRef;
      if (editingEntryId) {
        // Update existing entry
        const existingEntry = mediaData[formData.type + 's'].find(entry => entry.id === editingEntryId);
        if (formData.file && existingEntry.storagePath) {
          // Delete old file if new file uploaded
          await deleteObject(ref(storage, existingEntry.storagePath));
        }
        docRef = doc(db, 'Media', editingEntryId);
        await updateDoc(docRef, { ...entryData, storagePath: formData.file ? storagePath : existingEntry.storagePath });
      } else {
        // Add new entry
        docRef = await addDoc(collection(db, 'Media'), { ...entryData, storagePath });
      }

      setFormData({ type: formData.type, file: null, url: '', title: '', description: '' });
      setEditingEntryId(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving media:", err);
      alert("Failed to save media. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting media
  const handleDeleteMedia = async (entry) => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;

    try {
      if (entry.storagePath) {
        await deleteObject(ref(storage, entry.storagePath));
      }
      await deleteDoc(doc(db, 'Media', entry.id));
    } catch (err) {
      console.error("Error deleting media:", err);
      alert("Failed to delete media. Please try again.");
    }
  };

  // Handle editing media
  const handleEditMedia = (entry) => {
    setFormData({
      type: entry.type,
      file: null,
      url: entry.url,
      title: entry.title || '',
      description: entry.description || '',
    });
    setEditingEntryId(entry.id);
    setIsModalOpen(true);
  };

  return (
    <div
      className="min-h-screen p-4 flex flex-col"
      style={{
        backgroundImage: 'linear-gradient(140deg,#080006 15%,#FF0077)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
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
        <div className="md:absolute flex items-center gap-4 md:mt-12">
          <img
            src={backButton}
            alt="Back"
            className="h-8 w-8 cursor-pointer -scale-x-100"
            onClick={() => navigate("/search-aft")}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-12 text-white text-lg font-semibold border-b-4 border-white pb-2">
        <div
          onClick={() => setActiveTab('myteam')}
          className={`cursor-pointer ${activeTab === 'myteam' ? 'border-b-2 border-white text-blue-500' : ''}`}
        >
          Highlights
        </div>
        <div
          onClick={() => setActiveTab('following')}
          className={`cursor-pointer ${activeTab === 'following' ? 'border-b-2 border-white text-blue-500' : ''}`}
        >
          Photos
        </div>
        <div
          onClick={() => setActiveTab('all')}
          className={`cursor-pointer ${activeTab === 'all' ? 'border-b-2 border-white text-blue-500' : ''}`}
        >
          Videos
        </div>
      </div>

      {/* Animated Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'myteam' && (
          <motion.div
            key="myteam"
            variants={tabContentVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center justify-center text-center mt-24"
          >
            <motion.div
              className="w-40 h-40 flex items-center justify-center bg-white rounded-full mb-6 shadow-lg cursor-pointer hover:scale-105 transition-transform"
              whileHover={{ scale: 1.1 }}
            >
              <FaPlay className="text-black text-6xl" />
            </motion.div>
            <p className="text-lg font-medium mb-4 text-center text-black">
              We don’t have Highlights of this player yet but you can have yours!
            </p>
            <button
              className="bg-[#70005A] text-white px-10 py-4 text-xl font-semibold rounded-md shadow-md shadow-black transition duration-300 hover:bg-[blue] hover:-translate-y-1"
              onClick={() => navigate("/go-live-upcomming")}
            >
              Go Live
            </button>
          </motion.div>
        )}

        {activeTab === 'following' && (
          <motion.div
            key="following"
            variants={tabContentVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-h-[700px] overflow-y-auto px-4"
          >
            <div className="flex justify-center mb-6 mt-4">
              <button
                onClick={() => handleOpenModal('photo')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add Photo
              </button>
            </div>
            {mediaData.photos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                {mediaData.photos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center relative"
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                      onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                    />
                    <p className="text-black font-medium">{photo.title}</p>
                    <p className="text-gray-600 text-sm">{photo.description}</p>
                    <div className="absolute top-2 right-2 flex gap-2">
                      <FaEdit
                        className="text-yellow-500 cursor-pointer hover:text-yellow-600"
                        onClick={() => handleEditMedia(photo)}
                      />
                      <FaTrash
                        className="text-red-500 cursor-pointer hover:text-red-600"
                        onClick={() => handleDeleteMedia(photo)}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center mt-24">
                <FaRegImage className="text-black text-[100px] mb-6" />
                <p className="text-lg font-medium text-black">Player match media not found</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'all' && (
          <motion.div
            key="all"
            variants={tabContentVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-h-[700px] overflow-y-auto px-4"
          >
            <div className="flex justify-center mb-6 mt-4">
              <button
                onClick={() => handleOpenModal('video')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add Video
              </button>
            </div>
            {mediaData.videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                {mediaData.videos.map((video) => (
                  <motion.div
                    key={video.id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center relative"
                  >
                    <video
                      controls
                      className="w-full h-48 object-cover rounded-md mb-4"
                    >
                      <source src={video.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <p className="text-black font-medium">{video.title || 'Video'}</p>
                    <div className="absolute top-2 right-2 flex gap-2">
                      <FaEdit
                        className="text-yellow-500 cursor-pointer hover:text-yellow-600"
                        onClick={() => handleEditMedia(video)}
                      />
                      <FaTrash
                        className="text-red-500 cursor-pointer hover:text-red-600"
                        onClick={() => handleDeleteMedia(video)}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center mt-24">
                <FaRegImage className="text-black text-[100px] mb-6" />
                <p className="text-lg font-medium text-black">No videos found</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for Adding/Editing Media */}
      {isModalOpen && (
        <div className="border-2 border-white fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
          <div
            className="w-96 rounded-lg p-6 shadow-lg max-h-[80vh] overflow-y-auto"
            style={{
              background: 'linear-gradient(140deg, rgba(8,0,6,0.85) 15%, rgba(255,0,119,0.85))',
              boxShadow: '0 4px 12px rgba(0,0,0,0.75)',
            }}
          >
            <h2 className="text-xl font-bold mb-4 text-white text-center">
              {editingEntryId ? `Edit ${formData.type === 'video' ? 'Video' : 'Photo'}` : `Add ${formData.type === 'video' ? 'Video' : 'Photo'}`}
            </h2>
            <label className="block mb-1 text-white font-semibold" htmlFor="file">
              Upload {formData.type === 'video' ? 'Video' : 'Photo'}
            </label>
            <input
              id="file"
              type="file"
              accept={formData.type === 'video' ? 'video/*' : 'image/*'}
              onChange={handleFileChange}
              className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white"
              disabled={isLoading}
            />
            <label className="block mb-1 text-white font-semibold" htmlFor="url">
              Or Enter URL
            </label>
            <input
              id="url"
              type="text"
              placeholder={`Enter ${formData.type} URL`}
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value, file: null })}
              className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              disabled={isLoading}
            />
            {formData.type === 'photo' && (
              <>
                <label className="block mb-1 text-white font-semibold" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter photo title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  disabled={isLoading}
                />
                <label className="block mb-1 text-white font-semibold" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter photo description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full mb-4 p-2 rounded border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={3}
                  disabled={isLoading}
                />
              </>
            )}
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingEntryId(null);
                  setFormData({ type: formData.type, file: null, url: '', title: '', description: '' });
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMedia}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded transition"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}