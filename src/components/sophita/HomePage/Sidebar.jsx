import React, { useState, useEffect, useRef  } from "react";
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

// Helper function for RGB conversion (defined outside for clarity or can be in a utils file)
const hexToRgb = (hex) => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

// Reusable Account Settings Content Component
const AccountSettingsContent = ({
  selectedColor,
  accountType,
  handleAccountTypeChange,
  showDropdown, // This was for leaderboard, maybe a typo from original code for Hide Stories icon
  setShowTagsDropdown,
  showTagsDropdown,
  setShowCommentsDropdown,
  showCommentsDropdown,
  colors,
  handleColorChange,
  isMobileView, // Receive mobile view state

  accountSettingsBg // Pass this for potential use if items need specific background
}) => {

  // Determine icon style based on view
    // In mobile, icons should be black. In desktop, theme color or inherit (from parent text-white).
    const getIconStyle = () => (isMobileView ? { color: 'black' } : { color: selectedColor });

    // Determine text style for items based on view
    // In mobile, text should be black. In desktop, text inherits parent (white).
    const getTextStyleClass = () => (isMobileView ? 'text-black' : ''); // Apply text-black only in mobile

  return (
    <div className={`space-y-3 p-2 ${getTextStyleClass()}`}> {/* Added padding for dropdown view */}
      {/* Public/Private Radio Buttons */}
      <div className="p-2">
        <div className="flex items-center gap-3 mb-2">
          <FaUserCog style={getIconStyle()} />
          <span>Account Type</span>
        </div>
        <div className="space-y-2 pl-8">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="radio"
              name="accountType"
              checked={accountType === "public"}
              onChange={() => handleAccountTypeChange("public")}
              className="appearance-none w-4 h-4 rounded-full border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 relative"
              // For custom checkmark, you might need a pseudo-element or an inner div
            />
            <span>Public</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="radio"
              name="accountType"
              checked={accountType === "private"}
              onChange={() => handleAccountTypeChange("private")}
              className="appearance-none w-4 h-4 rounded-full border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 relative"
            />
            <span>Private</span>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm">
        <FaLock style={getIconStyle()}  />
        <span>Password and Security</span>
      </div>
      <div className="flex items-center gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm">
        <FaUserCog style={getIconStyle()}  />
        <span>Personal Details</span>
      </div>
      <div className="flex items-center gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm">
        <FaShieldAlt style={getIconStyle()}  />
        <span>Permissions</span>
      </div>
      <div className="flex items-center gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm">
        <FaCreditCard style={getIconStyle()}  />
        <span>Subscriptions</span>
      </div>
      <div className="flex items-center gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm">
        {/* Assuming 'showDropdown' here was for the Leaderboard, not related to Hide Stories icon directly */}
        {/* For simplicity, using a generic state for the icon, or pass a specific one if needed */}
        {false ? <FaEyeSlash style={getIconStyle()}  /> : <FaEye style={getIconStyle()}  />}
        <span>Hide Stories</span>
      </div>
      <div className="flex items-center gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm">
        <FaShieldAlt style={getIconStyle()}  />
        <span>Restrict</span>
      </div>

      <div
        className="flex items-center justify-between gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm"
        onClick={() => setShowTagsDropdown(!showTagsDropdown)}
      >
        <div className="flex items-center gap-3">
          <FaTag style={getIconStyle()}  />
          <span>Tags and Mentions</span>
        </div>
        {showTagsDropdown ? <FaChevronUp style={getIconStyle()}  /> : <FaChevronDown style={getIconStyle()} />}
      </div>
      {showTagsDropdown && (
        <div className="pl-8 space-y-2 text-xs">
          <div className="flex items-center justify-between p-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            <span>Allow Tags</span>
          </div>
          <div className="pl-4">
            <div className="p-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
              Don't allow tags
            </div>
          </div>
          <div className="flex items-center justify-between p-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            <span>Allow Mentions</span>
          </div>
          <div className="pl-4">
            <div className="p-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
              Don't allow mentions
            </div>
          </div>
        </div>
      )}

      <div
        className="flex items-center justify-between gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm"
        onClick={() => setShowCommentsDropdown(!showCommentsDropdown)}
      >
        <div className="flex items-center gap-3">
          <FaComment style={getIconStyle()}  />
          <span>Comments</span>
        </div>
        {showCommentsDropdown ? <FaChevronUp style={getIconStyle()}  /> : <FaChevronDown style={getIconStyle()}  />}
      </div>
      {showCommentsDropdown && (
        <div className="pl-8 space-y-2 text-xs">
          <div className="flex items-center justify-between p-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            <span>Allow Followers to Comment</span>
          </div>
          <div className="pl-4">
            <div className="p-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
              Don't allow comments
            </div>
          </div>
        </div>
      )}

      <div className="p-2">
        <div className="flex items-center gap-3 mb-2">
          <FaPalette style={getIconStyle()}  />
          <span>Theme Color</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <div
              key={color}
              className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-all duration-200 ${
                selectedColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

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
  const [accountSettingsBg, setAccountSettingsBg] = useState("rgb(93, 224, 230, 0.5)");

  const accountSettingsPanelRef = useRef(null); // Ref for the DESKTOP account settings panel
  const [isMobileView, setIsMobileView] = useState(false);

  const MD_BREAKPOINT = 768; // Tailwind's default md breakpoint


  const colors = [
    "#5DE0E6", "#FF6B6B", "#48BB78", "#F6AD55", 
    "#667EEA", "#9F7AEA", "#ED64A6", "#38B2AC"
  ];
  useEffect(() => {
    const checkMobileView = () => setIsMobileView(window.innerWidth < MD_BREAKPOINT);
    checkMobileView(); // Initial check
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

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

    // Effect to handle clicks outside the Account Settings panel
    useEffect(() => {
      const handleClickOutside = (event) => {
        // Only apply click outside for desktop panel view
        if (!isMobileView && showAccountSettings && accountSettingsPanelRef.current && !accountSettingsPanelRef.current.contains(event.target)) {
          // Check if the click target is the button that opens the account settings to avoid immediate close
          // This requires ensuring the "Account Settings" LI item is not part of the ref, which it isn't.
          setShowAccountSettings(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showAccountSettings, isMobileView]); // Add isMobileView to dependencies
  

      // Effect to close account settings if main sidebar is closed
  useEffect(() => {
    if (!isOpen && showAccountSettings) {
      setShowAccountSettings(false);
    }
  }, [isOpen, showAccountSettings]);


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
    // Centralized function to handle closing the main sidebar and account settings
    const handleCloseAllMenus = () => {
      setShowAccountSettings(false); // Ensure account settings is closed
      closeMenu(); // Close the main sidebar
    };

  const sidebarStyle = isMobileView ? { backgroundColor: selectedColor } : {};


  return (
    <>
      <div
        className={`fixed top-0 left-0 w-[220px] md:w-[300px] h-screen shadow-lg 
                   transition-transform duration-300 ease-in-out z-[1100] overflow-y-auto select-none
                   ${isMobileView ? '' : 'bg-gradient-to-b from-[#B5FFE3] via-[#5DE0E6] to-[#B5FFE3]'}
                   ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={sidebarStyle} // Apply dynamic background for mobile
      >
        <div className="h-full relative">
          <button 
            className="absolute top-4 right-4 text-xl md:text-2xl text-black cursor-pointer"
            onClick={handleCloseAllMenus}
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
              onClick={() => navigate('/match-start', { state: { targetTab: 'Fixture Generator' } })}>
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
              className={`px-4 py-2 md:px-6 md:py-3 flex items-center justify-between cursor-pointer ${isMobileView ? 'hover:bg-white/10' : 'hover:bg-[rgba(0,0,0,0.1)]'} transition-all duration-300`}
              onClick={(e) => {
                e.stopPropagation();
                setShowAccountSettings(!showAccountSettings); // Toggle visibility
              }}
            >
              <span className="flex items-center gap-2 md:gap-3">
                <FaUserCog className="min-w-[16px] md:min-w-[20px]" /> Account Settings
              </span>
              {isMobileView && (showAccountSettings ? <FaChevronUp /> : <FaChevronDown />)}
            </li>
             {/* Mobile Dropdown for Account Settings */}
             {showAccountSettings && isMobileView && (
              <div 
                className="text-black" // Ensures text is white if not inheriting properly
                style={{ backgroundColor: accountSettingsBg }} // Use themed semi-transparent bg
              >
                <div className={`pl-6 border-l-2 ${isMobileView ? 'border-white/50' : 'border-[#5DE0E6]'}`}>
                     <AccountSettingsContent
                        selectedColor={selectedColor} 
                        accountType={accountType}
                        handleAccountTypeChange={handleAccountTypeChange}
                        showTagsDropdown={showTagsDropdown}
                        setShowTagsDropdown={setShowTagsDropdown}
                        showCommentsDropdown={showCommentsDropdown}
                        setShowCommentsDropdown={setShowCommentsDropdown}
                        colors={colors}
                        handleColorChange={handleColorChange}
                        isMobileView={isMobileView} // Pass mobile view state
                        // accountSettingsBg={accountSettingsBg}
                    />
                </div>
              </div>
            )}
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
      {showAccountSettings && !isMobileView && (
          <div
          ref={accountSettingsPanelRef} // Ref for desktop panel only
          className="fixed top-0 left-[220px] md:left-[300px] w-[280px] h-full shadow-xl rounded-lg p-0 text-white z-[1200] overflow-y-auto" // Removed main padding, content will have it
          style={{
              borderTop: `4px solid ${selectedColor}`,
              backgroundColor: accountSettingsBg,
              boxShadow: `0 0 10px ${selectedColor}20`
            }}
          >
            <div className="flex justify-between items-center p-4"> {/* Padding for header */}
              <h3 className="font-bold text-lg" style={{ color: selectedColor }}>
                Account Settings
              </h3>
              <FaTimes
                className="cursor-pointer"
                onClick={() => setShowAccountSettings(false)}
                style={{ color: selectedColor }}
              />
            </div>
            <AccountSettingsContent
                selectedColor={selectedColor}
                accountType={accountType}
                handleAccountTypeChange={handleAccountTypeChange}
                showTagsDropdown={showTagsDropdown}
                setShowTagsDropdown={setShowTagsDropdown}
                showCommentsDropdown={showCommentsDropdown}
                setShowCommentsDropdown={setShowCommentsDropdown}
                colors={colors}
                handleColorChange={handleColorChange}
                accountSettingsBg={accountSettingsBg}
            />
          </div>
      )}

      {/* Background Overlay */}
      {isOpen && (
        <div
        className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.5)] backdrop-blur-sm transition-opacity duration-300 ease-in-out z-[1050]"
        onClick={handleCloseAllMenus} // MODIFIED: Close both sidebar and account settings
      />
      )}
    </>
  );
};

export default Sidebar;