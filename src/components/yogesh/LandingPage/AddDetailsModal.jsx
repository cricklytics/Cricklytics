import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../../firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useClub } from './ClubContext';

const AddDetailsModal = ({ onClose, onDetailsAdded, currentDetails, currentUserId, clubId, clubName: propClubName }) => {
  const { clubName } = useClub(); // Get clubName from ClubContext
  const effectiveClubName = clubName || propClubName || ''; // Fallback to prop if context is empty

  const [details, setDetails] = useState({
    heroTitle: currentDetails?.heroTitle || effectiveClubName || '',
    heroSubtitle: currentDetails?.heroSubtitle || '',
    storyText1: currentDetails?.storyText1 || '',
    storyText2: currentDetails?.storyText2 || '',
    storyImage: currentDetails?.storyImage || '',
    storyImageFile: null,
    missionValue1: currentDetails?.missionValue1 || '',
    missionValue2: currentDetails?.missionValue2 || '',
    missionValue3: currentDetails?.missionValue3 || '',
    missionIcon1: currentDetails?.missionIcon1 || '🏆',
    missionIcon2: currentDetails?.missionIcon2 || '🤝',
    missionIcon3: currentDetails?.missionIcon3 || '🌱',
    missionTitle1: currentDetails?.missionTitle1 || 'Promoting Sportsmanship',
    missionTitle2: currentDetails?.missionTitle2 || 'Corporate Networking',
    missionTitle3: currentDetails?.missionTitle3 || 'Community Development',
    tournamentGrowth: currentDetails?.tournamentGrowth || ['', '', '', '', ''],
    matchesPlayed: currentDetails?.matchesPlayed || '',
    corporatePlayers: currentDetails?.corporatePlayers || '',
    seasonsCompleted: currentDetails?.seasonsCompleted || '',
    trophyImage: currentDetails?.trophyImage || '',
    trophyImageFile: null,
    teamMembers: currentDetails?.teamMembers || [],
    newTeamMember: { name: '', role: '', bio: '', img: '', imgFile: null },
    clubId: currentDetails?.clubId || clubId || '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e, field = null, arrayField = null, index = null) => {
    const { name, value, files } = e.target;
    if (field === 'newTeamMember') {
      setDetails({
        ...details,
        newTeamMember: { ...details.newTeamMember, [name]: files ? files[0] : value },
      });
    } else if (arrayField === 'tournamentGrowth') {
      const updatedGrowth = [...details.tournamentGrowth];
      updatedGrowth[index] = value;
      setDetails({ ...details, tournamentGrowth: updatedGrowth });
    } else if (files) {
      setDetails({ ...details, [name]: files[0] });
    } else {
      setDetails({ ...details, [name]: value });
    }
  };

  const handleAddTeamMember = () => {
    const { name, role, bio } = details.newTeamMember;
    if (!name || !role || !bio) {
      setError('Please fill in all team member fields (Name, Role, Bio).');
      return;
    }
    setDetails({
      ...details,
      teamMembers: [...details.teamMembers, { ...details.newTeamMember }],
      newTeamMember: { name: '', role: '', bio: '', img: '', imgFile: null },
    });
    setError(null);
  };

  const uploadImage = async (imageFile) => {
    if (!imageFile) return null;
    console.log('Uploading image:', imageFile.name); // Debug
    const storage = getStorage();
    const storageRef = ref(storage, `pageDetails/${imageFile.name}_${Date.now()}`);
    await uploadBytes(storageRef, imageFile);
    const url = await getDownloadURL(storageRef);
    console.log('Image uploaded, URL:', url); // Debug
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Submitting form with effectiveClubName:', effectiveClubName); // Debug
    console.log('Current details:', currentDetails); // Debug
    console.log('Form details:', details); // Debug

    if (!effectiveClubName) {
      setError('No club selected. Please select a club first.');
      setLoading(false);
      return;
    }

    if (!details.heroTitle || !details.heroSubtitle || !details.storyText1 || !details.storyText2) {
      setError('Please fill in all required fields (Hero Title, Subtitle, Story Paragraphs).');
      setLoading(false);
      return;
    }

    try {
      const storyImageUrl = details.storyImageFile 
        ? await uploadImage(details.storyImageFile) 
        : details.storyImage;
      
      const trophyImageUrl = details.trophyImageFile
        ? await uploadImage(details.trophyImageFile)
        : details.trophyImage;

      const updatedTeamMembers = await Promise.all(
        details.teamMembers.map(async (member) => {
          const imgUrl = member.imgFile 
            ? await uploadImage(member.imgFile) 
            : member.img;
          return {
            name: member.name,
            role: member.role,
            bio: member.bio,
            img: imgUrl,
          };
        })
      );

      const detailsData = {
        name: effectiveClubName,
        userId: currentUserId,
        heroTitle: details.heroTitle,
        heroSubtitle: details.heroSubtitle,
        storyText1: details.storyText1,
        storyText2: details.storyText2,
        storyImage: storyImageUrl,
        missionValue1: details.missionValue1,
        missionValue2: details.missionValue2,
        missionValue3: details.missionValue3,
        missionIcon1: details.missionIcon1,
        missionIcon2: details.missionIcon2,
        missionIcon3: details.missionIcon3,
        missionTitle1: details.missionTitle1,
        missionTitle2: details.missionTitle2,
        missionTitle3: details.missionTitle3,
        tournamentGrowth: details.tournamentGrowth.filter(g => g.trim() !== ''),
        matchesPlayed: details.matchesPlayed,
        corporatePlayers: details.corporatePlayers,
        seasonsCompleted: details.seasonsCompleted,
        trophyImage: trophyImageUrl,
        teamMembers: updatedTeamMembers.filter(m => m.name.trim() !== ''),
        clubId: details.clubId,
        updatedAt: serverTimestamp(),
        updatedBy: currentUserId,
      };

      console.log('Saving detailsData:', detailsData); // Debug

      let docId;
      if (currentDetails?.id) {
        console.log('Updating document with ID:', currentDetails.id); // Debug
        const docRef = doc(db, 'aboutPage', currentDetails.id);
        await updateDoc(docRef, detailsData);
        docId = currentDetails.id;
      } else {
        console.log('Creating new document in aboutPage'); // Debug
        const docRef = await addDoc(collection(db, 'aboutPage'), {
          ...detailsData,
          createdAt: serverTimestamp(),
          createdBy: currentUserId,
        });
        docId = docRef.id;
        console.log('New document created with ID:', docId); // Debug
      }

      console.log('Calling onDetailsAdded with:', { ...detailsData, id: docId }); // Debug
      onDetailsAdded({ ...detailsData, id: docId });
    } catch (err) {
      console.error('Error saving details:', err); // Debug
      setError('Failed to save details: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
    >
      <motion.div
        className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl border border-gray-700 overflow-y-auto max-h-[90vh]"
        initial={{ y: '-100vh' }}
        animate={{ y: '0' }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      >
        <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">
          {currentDetails?.id ? 'Edit Page Details' : 'Add Page Details'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Club Name Label */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Club Name</label>
            <p className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2">
              {effectiveClubName || 'No club selected'}
            </p>
          </div>
          {/* Club ID */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Club ID</label>
            <input
              type="text"
              name="clubId"
              value={details.clubId}
              readOnly
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
            />
          </div>
          {/* Hero Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Hero Title</label>
            <input
              type="text"
              name="heroTitle"
              value={details.heroTitle}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Hero Subtitle</label>
            <textarea
              name="heroSubtitle"
              value={details.heroSubtitle}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
              required
            />
          </div>
          {/* Story Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Story Paragraph 1</label>
            <textarea
              name="storyText1"
              value={details.storyText1}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Story Paragraph 2</label>
            <textarea
              name="storyText2"
              value={details.storyText2}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Story Image</label>
            <input
              type="file"
              name="storyImageFile"
              onChange={handleChange}
              accept="image/*"
              className="mt-1 block w-full text-gray-300"
            />
            {details.storyImage && (
              <img src={details.storyImage} alt="Story preview" className="mt-2 w-32 h-32 object-cover rounded" />
            )}
          </div>
          {/* Mission and Values */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Mission 1 Icon (Emoji)</label>
            <input
              type="text"
              name="missionIcon1"
              value={details.missionIcon1}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
              placeholder="e.g., 🏆"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Mission 1 Title</label>
            <input
              type="text"
              name="missionTitle1"
              value={details.missionTitle1}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Mission 1 Description</label>
            <textarea
              name="missionValue1"
              value={details.missionValue1}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Mission 2 Icon (Emoji)</label>
            <input
              type="text"
              name="missionIcon2"
              value={details.missionIcon2}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
              placeholder="e.g., 🤝"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Mission 2 Title</label>
            <input
              type="text"
              name="missionTitle2"
              value={details.missionTitle2}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Mission 2 Description</label>
            <textarea
              name="missionValue2"
              value={details.missionValue2}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Mission 3 Icon (Emoji)</label>
            <input
              type="text"
              name="missionIcon3"
              value={details.missionIcon3}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
              placeholder="e.g., 🌱"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Mission 3 Title</label>
            <input
              type="text"
              name="missionTitle3"
              value={details.missionTitle3}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Mission 3 Description</label>
            <textarea
              name="missionValue3"
              value={details.missionValue3}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
            />
          </div>
          {/* Tournament Highlights */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Tournament Growth Milestones</label>
            {details.tournamentGrowth.map((growth, index) => (
              <input
                key={index}
                type="text"
                value={growth}
                onChange={(e) => handleChange(e, null, 'tournamentGrowth', index)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2 mb-2"
                placeholder={`Milestone ${index + 1}`}
              />
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Matches Played</label>
            <input
              type="text"
              name="matchesPlayed"
              value={details.matchesPlayed}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Corporate Players</label>
            <input
              type="text"
              name="corporatePlayers"
              value={details.corporatePlayers}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Seasons Completed</label>
            <input
              type="text"
              name="seasonsCompleted"
              value={details.seasonsCompleted}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Trophy Image</label>
            <input
              type="file"
              name="trophyImageFile"
              onChange={handleChange}
              accept="image/*"
              className="mt-1 block w-full text-gray-300"
            />
            {details.trophyImage && (
              <img src={details.trophyImage} alt="Trophy preview" className="mt-2 w-32 h-32 object-cover rounded" />
            )}
          </div>
          {/* Team Members */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Add Team Member</label>
            <div className="border border-gray-600 p-4 rounded-md mb-4">
              <input
                type="text"
                name="name"
                value={details.newTeamMember.name}
                onChange={(e) => handleChange(e, 'newTeamMember')}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2 mb-2"
                placeholder="Name"
              />
              <input
                type="text"
                name="role"
                value={details.newTeamMember.role}
                onChange={(e) => handleChange(e, 'newTeamMember')}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2 mb-2"
                placeholder="Role"
              />
              <textarea
                name="bio"
                value={details.newTeamMember.bio}
                onChange={(e) => handleChange(e, 'newTeamMember')}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-2 mb-2"
                placeholder="Bio"
              />
              <input
                type="file"
                name="imgFile"
                onChange={(e) => handleChange(e, 'newTeamMember')}
                accept="image/*"
                className="mt-1 block w-full text-gray-300"
              />
              {details.newTeamMember.img && (
                <img src={details.newTeamMember.img} alt="Member preview" className="mt-2 w-32 h-32 object-cover rounded" />
              )}
              <button
                type="button"
                onClick={handleAddTeamMember}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Add Team Member
              </button>
            </div>
            {details.teamMembers.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-300">Added Team Members:</p>
                <ul className="list-disc pl-5 text-gray-300">
                  {details.teamMembers.map((member, index) => (
                    <li key={index}>{member.name} - {member.role}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Details'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddDetailsModal;