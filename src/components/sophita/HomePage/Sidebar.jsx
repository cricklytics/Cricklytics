import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTimes, FaTrophy, FaUsers, FaTv, FaStar, FaSignOutAlt,
  FaChevronDown, FaChevronUp, FaLock,  FaPencilAlt, 
  FaEye, FaEyeSlash, FaShieldAlt, FaUserCog, FaCreditCard,
  FaTag, FaAt, FaComment, FaPalette
} from "react-icons/fa";
import profImg from "../../../assets/sophita/HomePage/profpic.png";
import { LockKeyholeIcon } from "lucide-react";

import { auth, db } from "../../../firebase";
import { doc, getDoc, updateDoc  } from "firebase/firestore";
import { signOut } from "firebase/auth"; // ✅ Sign out import
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaPlus } from "react-icons/fa";


const Sidebar = ({ isOpen, closeMenu }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [showCommentsDropdown, setShowCommentsDropdown] = useState(false);
  const [userName, setUserName] = useState("Loading...");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#5DE0E6");
  const [accountType, setAccountType] = useState("public");
  const [accountSettingsBg, setAccountSettingsBg] = useState("rgba(255, 255, 255, 0.95)");

  const colors = [
    "#5DE0E6", "#FF6B6B", "#48BB78", "#F6AD55", 
    "#667EEA", "#9F7AEA", "#ED64A6", "#38B2AC"
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserName(userData.firstName || "User");
            setUserPhone(userData.whatsapp || "No phone");
            if (userData.profileImageUrl) setProfileImage(userData.profileImageUrl);
            if (userData.themeColor) {
              setSelectedColor(userData.themeColor);
            }
            if (userData.accountType) setAccountType(userData.accountType);
          } else {
            console.log("No such user document!");
            setUserName("User");
            setUserPhone("No phone");
          }
  
          setUserEmail(currentUser.email || "No email");
        } catch (err) {
          console.error("Error fetching user data:", err);
          setUserName("User");
          setUserEmail("No email");
          setUserPhone("No phone");
        }
      }
    };
  
    fetchUserData();
  }, []);

  const hexToRgb = (hex) => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  };

  const handleColorChange = async (color) => {
    setSelectedColor(color);
    setAccountSettingsBg(`rgba(${hexToRgb(color)}, 0.2)`);
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        themeColor: color,
      });
    } catch (err) {
      console.error("Error updating theme color:", err);
    }
  };

  const handleAccountTypeChange = async (type) => {
    setAccountType(type);
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        accountType: type,
      });
    } catch (err) {
      console.error("Error updating account type:", err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const storage = getStorage();
    const storageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
    
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setProfileImage(downloadURL);
  
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        profileImageUrl: downloadURL,
      });
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <>
      <div 
        className={`fixed top-0 left-0 w-[250px] md:w-[300px] h-screen bg-gradient-to-b from-[#B5FFE3] via-[#5DE0E6] to-[#B5FFE3] 
        shadow-lg transition-transform duration-300 ease-in-out z-[1100] overflow-y-auto select-none
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-full relative">
          <button 
            className="absolute top-4 right-4 text-xl md:text-2xl text-black cursor-pointer"
            onClick={closeMenu}
          >
            <FaTimes />
          </button>

          {/* Profile Section */}
          <div className="text-center py-4 px-4 mt-6 text-black">
            <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-4">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-2 border-[#5DE0E6]"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold border-2 border-[#5DE0E6]">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}

              <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer shadow-md">
                <FaPlus className="text-black text-xs" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center justify-center gap-2">
              <h6 className="text-base md:text-lg font-bold">
                {userName}
              </h6>
            </div>
            <p className="text-xs md:text-sm opacity-80 mt-1">{userEmail}</p>
            <p className="text-xs md:text-sm opacity-80">{userPhone}</p>
          </div>

          {/* Menu Items */}
          <ul className="list-none p-0 mt-4 text-black">
            <li className="px-4 py-2 md:px-6 md:py-3 flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-[rgba(0,0,0,0.1)] transition-all duration-300" onClick={() => navigate("/awards")}>
              <FaTrophy className="min-w-[20px]" /> CV Cricket Awards
            </li>
            <li className="px-4 py-2 md:px-6 md:py-3 flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-[rgba(0,0,0,0.1)] transition-all duration-300" onClick={() => navigate("/tournamentseries")}>
              <FaTrophy className="min-w-[20px]" /> Tournament/Series
            </li>
            <li className="px-4 py-2 md:px-6 md:py-3 flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-[rgba(0,0,0,0.1)] transition-all duration-300"
              onClick={() => navigate("/start-match")}>
              <FaUsers className="min-w-[20px]" /> Start a Match
            </li>

            <li 
              className="px-4 py-2 md:px-6 md:py-3 flex items-center justify-between cursor-pointer hover:bg-[rgba(0,0,0,0.1)] transition-all duration-300"
              onClick={() => navigate("/go-live")}>
              <span className="flex items-center gap-2 md:gap-3">
                <FaTv className="min-w-[16px] md:min-w-[20px]" /> Go Live <FaLock className="text-gray-600 ml-1" />
              </span>
            </li>
            
            <li 
              className="px-4 py-2 md:px-6 md:py-3 flex items-center justify-between cursor-pointer hover:bg-[rgba(0,0,0,0.1)] transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
            >
              <span className="flex items-center gap-2 md:gap-3">
                <FaTrophy className="min-w-[16px] md:min-w-[20px]" /> LeaderBoard
              </span>
              {showDropdown ? <FaChevronUp /> : <FaChevronDown />}
            </li>

            {showDropdown && (
              <ul className="pl-6 md:pl-10 border-l-2 border-[#5DE0E6]">
                <li 
                  className="flex items-center px-2 md:px-4 py-1 md:py-2 text-sm cursor-pointer hover:bg-[rgb(68,172,199)] transition-all duration-200"
                  onClick={() => navigate("/playerpages")} 
                >
                  🏏 Batting <FaLock className="text-gray-600 ml-auto" />
                </li>
                <li 
                  className="flex items-center px-2 md:px-4 py-1 md:py-2 text-sm cursor-pointer hover:bg-[rgb(68,172,199)] transition-all duration-200"
                  onClick={() => navigate("/bowling")}
                >
                  🎳 Bowling <FaLock className="text-gray-600 ml-auto" />
                </li>
                <li 
                  className="flex items-center px-2 md:px-4 py-1 md:py-2 text-sm cursor-pointer hover:bg-[rgb(68,172,199)] transition-all duration-200"
                  onClick={() => navigate("/fielding")}
                >
                  🛡️ Fielding <FaLock className="text-gray-600 ml-auto" />
                </li>
                <li 
                  className="flex items-center px-2 md:px-4 py-1 md:py-2 text-sm cursor-pointer hover:bg-[rgb(68,172,199)] transition-all duration-200"
                  onClick={() => navigate("/table-toppers")}
                >
                  🏆 Table Toppers <FaLock className="text-gray-600 ml-auto" />
                </li>
              </ul>
            )}

            <li className="px-4 py-2 md:px-6 md:py-3 flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-[rgba(0,0,0,0.1)] transition-all duration-300"
            onClick={() => navigate("/club")} >
              <FaUsers className="min-w-[16px] md:min-w-[20px]" /> Club <FaLock className="text-gray-600 ml-1" />
            </li>
            
            {/* New Account Settings Menu Item */}
            <li 
              className="px-4 py-2 md:px-6 md:py-3 flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-[rgba(0,0,0,0.1)] transition-all duration-300"
              onClick={() => setShowAccountSettings(true)}
            >
              <FaUserCog className="min-w-[16px] md:min-w-[20px]" /> Account Settings
            </li>
          </ul>

          <button 
            className="w-[calc(100%-32px)] mx-4 my-4 py-2 md:py-3 bg-black text-white flex items-center justify-center gap-2 rounded-lg hover:bg-[#d32f2f] transition-all duration-300"
            onClick={handleSignOut}
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>

      {/* Account Settings Panel */}
      {showAccountSettings && (
        <div 
             className="fixed top-0 left-[250px] md:left-[300px] h-full z-[1200]"
          onClick={() => setShowAccountSettings(false)}
        >
          <div 
            className="w-[280px] shadow-xl rounded-lg p-4 text-white backdrop-blur-sm"
            style={{
              borderTop: `4px solid ${selectedColor}`,
              backgroundColor: accountSettingsBg,
              boxShadow: `0 0 10px ${selectedColor}20`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg" style={{ color: selectedColor }}>
                Account Settings
              </h3>
              <FaTimes 
                className="cursor-pointer" 
                onClick={() => setShowAccountSettings(false)}
                style={{ color: selectedColor }}
              />
            </div>

            <div className="space-y-3">
              {/* Public/Private Radio Buttons */}
              <div className="p-2">
                <div className="flex items-center gap-3 mb-2">
                  <FaUserCog style={{ color: selectedColor }} />
                  <span>Account Type</span>
                </div>
                <div className="space-y-2 pl-8">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="accountType"
                      checked={accountType === "public"}
                      onChange={() => handleAccountTypeChange("public")}
                      className="appearance-none w-4 h-4 rounded-full border-2 border-gray-400 checked:border-blue-500 checked:bg-blue-500 relative"
                    />
                    <span>Public</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="accountType"
                      checked={accountType === "private"}
                      onChange={() => handleAccountTypeChange("private")}
                      className="appearance-none w-4 h-4 rounded-full border-2 border-gray-400 checked:border-blue-500 checked:bg-blue-500 relative"
                    />
                    <span>Private</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                <FaLock style={{ color: selectedColor }} />
                <span>Password and Security</span>
              </div>

              <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                <FaUserCog style={{ color: selectedColor }} />
                <span>Personal Details</span>
              </div>

              <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                <FaShieldAlt style={{ color: selectedColor }} />
                <span>Permissions</span>
              </div>

              <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                <FaCreditCard style={{ color: selectedColor }} />
                <span>Subscriptions</span>
              </div>

              <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                {showDropdown ? <FaEyeSlash style={{ color: selectedColor }} /> : <FaEye style={{ color: selectedColor }} />}
                <span>Hide Stories</span>
              </div>

              <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                <FaShieldAlt style={{ color: selectedColor }} />
                <span>Restrict</span>
              </div>

              {/* Tags and Mentions */}
              <div 
                className="flex items-center justify-between gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => setShowTagsDropdown(!showTagsDropdown)}
              >
                <div className="flex items-center gap-3">
                  <FaTag style={{ color: selectedColor }} />
                  <span>Tags and Mentions</span>
                </div>
                {showTagsDropdown ? <FaChevronUp /> : <FaChevronDown />}
              </div>

              {showTagsDropdown && (
                <div className="pl-8 space-y-2">
                  <div className="flex items-center justify-between p-1 hover:bg-gray-100 rounded cursor-pointer">
                    <span>Allow Tags</span>
                  </div>
                  <div className="pl-4 text-sm">
                    <div className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                      Don't allow tags
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-1 hover:bg-gray-100 rounded cursor-pointer">
                    <span>Allow Mentions</span>
                  </div>
                  <div className="pl-4 text-sm">
                    <div className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                      Don't allow mentions
                    </div>
                  </div>
                </div>
              )}

              {/* Comments */}
              <div 
                className="flex items-center justify-between gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => setShowCommentsDropdown(!showCommentsDropdown)}
              >
                <div className="flex items-center gap-3">
                  <FaComment style={{ color: selectedColor }} />
                  <span>Comments</span>
                </div>
                {showCommentsDropdown ? <FaChevronUp /> : <FaChevronDown />}
              </div>

              {showCommentsDropdown && (
                <div className="pl-8 space-y-2">
                  <div className="flex items-center justify-between p-1 hover:bg-gray-100 rounded cursor-pointer">
                    <span>Allow Followers to Comment</span>
                  </div>
                  <div className="pl-4 text-sm">
                    <div className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                      Don't allow comments
                    </div>
                  </div>
                </div>
              )}

              {/* Color Picker */}
              <div className="p-2">
                <div className="flex items-center gap-3 mb-2">
                  <FaPalette style={{ color: selectedColor }} />
                  <span>Theme Color</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <div
                      key={color}
                      className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-all duration-200 ${
                        selectedColor === color ? 'border-black scale-110' : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background Overlay */}
      {isOpen && (
        <div 
          className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.5)] backdrop-blur-sm transition-opacity duration-300 ease-in-out z-[1050]"
          onClick={closeMenu}
        />
      )}
    </>
  );
};

export default Sidebar;