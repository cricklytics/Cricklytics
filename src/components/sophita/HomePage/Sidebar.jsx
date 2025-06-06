import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTimes, FaTrophy, FaUsers, FaTv, FaStar, FaSignOutAlt,
  FaChevronDown, FaChevronUp, FaLock, FaPencilAlt, 
  FaEye, FaEyeSlash, FaShieldAlt, FaUserCog, FaCreditCard,
  FaTag, FaAt, FaComment, FaPalette, FaCheck, FaEnvelope,
  FaMobile, FaCalendarAlt, FaIdCard, FaKey, FaBell,
  FaFacebook, FaWhatsapp, FaInstagram, FaTwitter
} from "react-icons/fa";
import { LockKeyholeIcon } from "lucide-react";
import { auth, db } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaPlus } from "react-icons/fa";

const hexToRgb = (hex) => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

const PasswordSecurityContent = ({ selectedColor, isMobileView }) => {
  const [showPasswordOptions, setShowPasswordOptions] = useState(false);
  const [showSecurityChecks, setShowSecurityChecks] = useState(false);
  
  const getIconStyle = () => (isMobileView ? { color: 'black' } : { color: selectedColor });
  const getTextStyleClass = () => (isMobileView ? 'text-black' : '');

  return (
    <div className={`space-y-3 p-2 ${getTextStyleClass()}`}>
      <div 
        className="flex items-center justify-between gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm"
        onClick={() => setShowPasswordOptions(!showPasswordOptions)}
      >
        <div className="flex items-center gap-3">
          <FaKey style={getIconStyle()} />
          <span>Change Password</span>
        </div>
        {showPasswordOptions ? <FaChevronUp style={getIconStyle()} /> : <FaChevronDown style={getIconStyle()} />}
      </div>
      
      {showPasswordOptions && (
        <div className="pl-8 space-y-2 text-xs">
          <div className="p-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            Update password
          </div>
          <div className="p-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            Two-factor authentication
          </div>
          <div className="p-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            Saved login information
          </div>
        </div>
      )}

      <div 
        className="flex items-center justify-between gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm"
        onClick={() => setShowSecurityChecks(!showSecurityChecks)}
      >
        <div className="flex items-center gap-3">
          <FaShieldAlt style={getIconStyle()} />
          <span>Security checks</span>
        </div>
        {showSecurityChecks ? <FaChevronUp style={getIconStyle()} /> : <FaChevronDown style={getIconStyle()} />}
      </div>
      
      {showSecurityChecks && (
        <div className="pl-8 space-y-2 text-xs">
          <div className="p-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            Where you're logged in
          </div>
          <div className="p-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            Login alerts
          </div>
          <div className="p-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            Recent emails
          </div>
          <div className="p-1 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
            Security checkup
          </div>
        </div>
      )}
    </div>
  );
};

const PersonalDetailsContent = ({ selectedColor, isMobileView, userProfile }) => {
  const [showDOBInput, setShowDOBInput] = useState(false);
  const [dob, setDob] = useState(userProfile?.dob || "");
  const [showIdentityConfirmation, setShowIdentityConfirmation] = useState(false);
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    facebook: userProfile?.socialMedia?.facebook || "",
    whatsapp: userProfile?.socialMedia?.whatsapp || "",
    instagram: userProfile?.socialMedia?.instagram || "",
    twitter: userProfile?.socialMedia?.twitter || ""
  });
  const [isEditing, setIsEditing] = useState(false);

  const getIconStyle = () => (isMobileView ? { color: 'black' } : { color: selectedColor });
  const getTextStyleClass = () => (isMobileView ? 'text-black' : '');

  const handleSaveDOB = async () => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        dob: dob
      });
      setShowDOBInput(false);
    } catch (err) {
      console.error("Error updating date of birth:", err);
    }
  };

  const handleSaveSocialMedia = async () => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        socialMedia: socialMediaLinks
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating social media links:", err);
    }
  };

  return (
    <div className={`space-y-3 p-2 ${getTextStyleClass()}`}>
      <div className="flex items-center gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm">
        <FaEnvelope style={getIconStyle()} />
        <span>Email: {userProfile?.email || "No email"}</span>
      </div>
      <div className="flex items-center gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm">
        <FaMobile style={getIconStyle()} />
        <span>Phone: {userProfile?.whatsapp || "No phone"}</span>
      </div>
      
      {/* Date of Birth Section */}
      <div 
        className="flex items-center justify-between gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm"
        onClick={() => setShowDOBInput(!showDOBInput)}
      >
        <div className="flex items-center gap-3">
          <FaCalendarAlt style={getIconStyle()} />
          <span>Date of Birth: {dob || "Not set"}</span>
        </div>
        {showDOBInput ? <FaChevronUp style={getIconStyle()} /> : <FaChevronDown style={getIconStyle()} />}
      </div>
      
      {showDOBInput && (
        <div className="pl-8 space-y-2">
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full p-2 rounded bg-white/10 border border-white/20 text-sm"
            max={new Date().toISOString().split('T')[0]}
          />
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setShowDOBInput(false)}
              className="px-3 py-1 text-xs rounded bg-gray-500 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveDOB}
              className="px-3 py-1 text-xs rounded"
              style={{ backgroundColor: selectedColor }}
            >
              Save
            </button>
          </div>
        </div>
      )}
      
      {/* Identity Confirmation Section */}
      <div 
        className="flex items-center justify-between gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm"
        onClick={() => setShowIdentityConfirmation(!showIdentityConfirmation)}
      >
        <div className="flex items-center gap-3">
          <FaIdCard style={getIconStyle()} />
          <span>Identity confirmation</span>
        </div>
        {showIdentityConfirmation ? <FaChevronUp style={getIconStyle()} /> : <FaChevronDown style={getIconStyle()} />}
      </div>
      
      {showIdentityConfirmation && (
        <div className="pl-8 space-y-3">
          <p className="text-xs">Link your social media profiles to verify your identity:</p>
          
          {isEditing ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FaFacebook style={{ color: '#1877F2' }} />
                <input
                  type="text"
                  placeholder="Facebook profile URL"
                  value={socialMediaLinks.facebook}
                  onChange={(e) => setSocialMediaLinks({...socialMediaLinks, facebook: e.target.value})}
                  className="flex-1 p-2 rounded bg-white/10 border border-white/20 text-sm"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <FaWhatsapp style={{ color: '#25D366' }} />
                <input
                  type="text"
                  placeholder="WhatsApp number"
                  value={socialMediaLinks.whatsapp}
                  onChange={(e) => setSocialMediaLinks({...socialMediaLinks, whatsapp: e.target.value})}
                  className="flex-1 p-2 rounded bg-white/10 border border-white/20 text-sm"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <FaInstagram style={{ color: '#E4405F' }} />
                <input
                  type="text"
                  placeholder="Instagram username"
                  value={socialMediaLinks.instagram}
                  onChange={(e) => setSocialMediaLinks({...socialMediaLinks, instagram: e.target.value})}
                  className="flex-1 p-2 rounded bg-white/10 border border-white/20 text-sm"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <FaTwitter style={{ color: '#1DA1F2' }} />
                <input
                  type="text"
                  placeholder="Twitter handle"
                  value={socialMediaLinks.twitter}
                  onChange={(e) => setSocialMediaLinks({...socialMediaLinks, twitter: e.target.value})}
                  className="flex-1 p-2 rounded bg-white/10 border border-white/20 text-sm"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-xs rounded bg-gray-500 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveSocialMedia}
                  className="px-3 py-1 text-xs rounded"
                  style={{ backgroundColor: selectedColor }}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {socialMediaLinks.facebook && (
                <div className="flex items-center gap-2 text-sm">
                  <FaFacebook style={{ color: '#1877F2' }} />
                  <span>{socialMediaLinks.facebook}</span>
                </div>
              )}
              
              {socialMediaLinks.whatsapp && (
                <div className="flex items-center gap-2 text-sm">
                  <FaWhatsapp style={{ color: '#25D366' }} />
                  <span>{socialMediaLinks.whatsapp}</span>
                </div>
              )}
              
              {socialMediaLinks.instagram && (
                <div className="flex items-center gap-2 text-sm">
                  <FaInstagram style={{ color: '#E4405F' }} />
                  <span>@{socialMediaLinks.instagram}</span>
                </div>
              )}
              
              {socialMediaLinks.twitter && (
                <div className="flex items-center gap-2 text-sm">
                  <FaTwitter style={{ color: '#1DA1F2' }} />
                  <span>@{socialMediaLinks.twitter}</span>
                </div>
              )}
              
              {!socialMediaLinks.facebook && !socialMediaLinks.whatsapp && 
               !socialMediaLinks.instagram && !socialMediaLinks.twitter && (
                <p className="text-xs italic">No social media links added</p>
              )}
              
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-xs mt-2"
                style={{ color: selectedColor }}
              >
                <FaPencilAlt size={10} /> {socialMediaLinks.facebook ? 'Edit' : 'Add'} links
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm">
        <FaCheck style={getIconStyle()} />
        <span>Allow ownership and control</span>
      </div>
    </div>
  );
};

const TagsMentionsContent = ({ selectedColor, isMobileView }) => {
  const [showTagsOptions, setShowTagsOptions] = useState(false);
  const [showMentionsOptions, setShowMentionsOptions] = useState(false);
  const [tagsPermission, setTagsPermission] = useState("peopleYouFollow");
  const [mentionsPermission, setMentionsPermission] = useState("everyone");
  const [manualApproveTags, setManualApproveTags] = useState(false);
  
  const getIconStyle = () => (isMobileView ? { color: 'black' } : { color: selectedColor });
  const getTextStyleClass = () => (isMobileView ? 'text-black' : '');

  const handleTagsPermissionChange = (value) => {
    setTagsPermission(value);
    // Here you would also update the setting in your database
  };

  const handleMentionsPermissionChange = (value) => {
    setMentionsPermission(value);
    // Here you would also update the setting in your database
  };

  const toggleManualApproveTags = () => {
    setManualApproveTags(!manualApproveTags);
    // Here you would also update the setting in your database
  };

  return (
    <div className={`space-y-3 p-2 ${getTextStyleClass()}`}>
      <div 
        className="flex items-center justify-between gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm"
        onClick={() => setShowTagsOptions(!showTagsOptions)}
      >
        <div className="flex items-center gap-3">
          <FaTag style={getIconStyle()} />
          <span>Tags and Mentions</span>
        </div>
        {showTagsOptions ? <FaChevronUp style={getIconStyle()} /> : <FaChevronDown style={getIconStyle()} />}
      </div>
      
      {showTagsOptions && (
        <div className="pl-8 space-y-4 text-xs">
          <div className="space-y-2">
            <h4 className="font-medium">Who can tag you</h4>
            <div className="space-y-2 pl-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tagsPermission"
                  checked={tagsPermission === "everyone"}
                  onChange={() => handleTagsPermissionChange("everyone")}
                  className="appearance-none w-4 h-4 rounded-full border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 relative"
                />
                <span>Everyone</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tagsPermission"
                  checked={tagsPermission === "peopleYouFollow"}
                  onChange={() => handleTagsPermissionChange("peopleYouFollow")}
                  className="appearance-none w-4 h-4 rounded-full border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 relative"
                />
                <span>People you follow</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tagsPermission"
                  checked={tagsPermission === "noOne"}
                  onChange={() => handleTagsPermissionChange("noOne")}
                  className="appearance-none w-4 h-4 rounded-full border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 relative"
                />
                <span>Don't allow tags</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">How you manage tags</h4>
            <div className="flex items-center justify-between pl-2">
              <span>Manually approve tags</span>
              <button
                onClick={toggleManualApproveTags}
                className={`w-10 h-5 rounded-full p-1 transition-colors duration-200 ${manualApproveTags ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <div className={`w-3 h-3 rounded-full bg-white transform transition-transform duration-200 ${manualApproveTags ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <div className="pl-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer">
              Review tags
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Who can @mention you</h4>
            <div className="space-y-2 pl-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mentionsPermission"
                  checked={mentionsPermission === "everyone"}
                  onChange={() => handleMentionsPermissionChange("everyone")}
                  className="appearance-none w-4 h-4 rounded-full border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 relative"
                />
                <span>Everyone</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mentionsPermission"
                  checked={mentionsPermission === "peopleYouFollow"}
                  onChange={() => handleMentionsPermissionChange("peopleYouFollow")}
                  className="appearance-none w-4 h-4 rounded-full border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 relative"
                />
                <span>People you follow</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mentionsPermission"
                  checked={mentionsPermission === "noOne"}
                  onChange={() => handleMentionsPermissionChange("noOne")}
                  className="appearance-none w-4 h-4 rounded-full border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 relative"
                />
                <span>Don't allow mentions</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AccountSettingsContent = ({
  selectedColor,
  accountType,
  handleAccountTypeChange,
  showDropdown,
  setShowTagsDropdown,
  showTagsDropdown,
  setShowCommentsDropdown,
  showCommentsDropdown,
  colors,
  handleColorChange,
  isMobileView,
  accountSettingsBg,
  userProfile
}) => {
  const [activeSection, setActiveSection] = useState("accountType");
  
  const getIconStyle = () => (isMobileView ? { color: 'black' } : { color: selectedColor });
  const getTextStyleClass = () => (isMobileView ? 'text-black' : '');

  return (
    <div className={`space-y-3 p-2 ${getTextStyleClass()}`}>
      {/* Public/Private Radio Buttons */}
      {activeSection === "accountType" && (
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
      )}

      <div 
        className="flex items-center gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm"
        onClick={() => setActiveSection("passwordSecurity")}
      >
        <FaLock style={getIconStyle()} />
        <span>Password and Security</span>
      </div>
      {activeSection === "passwordSecurity" && (
        <PasswordSecurityContent selectedColor={selectedColor} isMobileView={isMobileView} />
      )}

      <div 
        className="flex items-center gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm"
        onClick={() => setActiveSection("personalDetails")}
      >
        <FaUserCog style={getIconStyle()} />
        <span>Personal Details</span>
      </div>
      {activeSection === "personalDetails" && (
        <PersonalDetailsContent selectedColor={selectedColor} isMobileView={isMobileView} userProfile={userProfile} />
      )}

      <div className="flex items-center gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm">
        <FaShieldAlt style={getIconStyle()} />
        <span>Permissions</span>
      </div>

      <div className="flex items-center gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm">
        <FaCreditCard style={getIconStyle()} />
        <span>Subscriptions</span>
      </div>

      <div className="flex items-center gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm">
        {false ? <FaEyeSlash style={getIconStyle()} /> : <FaEye style={getIconStyle()} />}
        <span>Hide Stories</span>
      </div>

      <div className="flex items-center gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm">
        <FaShieldAlt style={getIconStyle()} />
        <span>Restrict</span>
      </div>

      <div 
        className="flex items-center gap-3 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded cursor-pointer text-sm"
        onClick={() => setActiveSection("tagsMentions")}
      >
        <FaTag style={getIconStyle()} />
        <span>Tags and Mentions</span>
      </div>
      {activeSection === "tagsMentions" && (
        <TagsMentionsContent selectedColor={selectedColor} isMobileView={isMobileView} />
      )}

      <div className="p-2">
        <div className="flex items-center gap-3 mb-2">
          <FaPalette style={getIconStyle()} />
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

const Sidebar = ({ isOpen, closeMenu, userProfile }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [showCommentsDropdown, setShowCommentsDropdown] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#5DE0E6");
  const [accountType, setAccountType] = useState("public");
  const [accountSettingsBg, setAccountSettingsBg] = useState("rgb(93, 224, 230, 0.5)");

  const accountSettingsPanelRef = useRef(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const MD_BREAKPOINT = 768;

  const colors = [
    "#5DE0E6", "#FF6B6B", "#48BB78", "#F6AD55", 
    "#667EEA", "#9F7AEA", "#ED64A6", "#38B2AC"
  ];

  useEffect(() => {
    const checkMobileView = () => setIsMobileView(window.innerWidth < MD_BREAKPOINT);
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isMobileView && showAccountSettings && accountSettingsPanelRef.current && !accountSettingsPanelRef.current.contains(event.target)) {
        setShowAccountSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAccountSettings, isMobileView]);

  useEffect(() => {
    if (!isOpen && showAccountSettings) {
      setShowAccountSettings(false);
    }
  }, [isOpen, showAccountSettings]);

  useEffect(() => {
    if (userProfile) {
      setSelectedColor(userProfile.themeColor || "#5DE0E6");
      setAccountType(userProfile.accountType || "public");
      setAccountSettingsBg(`rgba(${hexToRgb(userProfile.themeColor || "#5DE0E6")}, 0.2)`);
    }
  }, [userProfile]);

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
    if (!file || !userProfile?.uid) return;
  
    const storage = getStorage();
    const storageRef = ref(storage, `profileImages/${userProfile.uid}`);
    
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      await updateDoc(doc(db, "users", userProfile.uid), {
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

  const handleCloseAllMenus = () => {
    setShowAccountSettings(false);
    closeMenu();
  };

  const sidebarStyle = { backgroundColor: selectedColor };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-[220px] md:w-[300px] h-screen shadow-lg
                    transition-transform duration-300 ease-in-out z-[1100] overflow-y-auto select-none
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={sidebarStyle}
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
              {userProfile?.profileImageUrl ? (
                <img
                  src={userProfile.profileImageUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-2 border-black"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold border-2 border-[#5DE0E6]">
                  {userProfile?.userName ? userProfile.userName.charAt(0).toUpperCase() : 'U'}
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
                {userProfile?.userName || "User"}
              </h6>
            </div>
            <p className="text-xs md:text-sm opacity-80 mt-1">{userProfile?.email || "No email"}</p>
            <p className="text-xs md:text-sm opacity-80">{userProfile?.whatsapp || "No phone"}</p>
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
              onClick={() => navigate('/match-start-sb', { state: { initialTab: 'Start Match', fromSidebar: true } })}>
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
                  onClick={() => navigate("/playerpages")} 
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
            onClick={() => navigate("/Clubsmain")} >
              <FaUsers className="min-w-[16px] md:min-w-[20px]" /> Club <FaLock className="text-gray-600 ml-1" />
            </li>
            <li className="px-4 py-2 md:px-6 md:py-3 flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-[rgba(0,0,0,0.1)] transition-all duration-300"
              onClick={() => navigate('/community')}>
              <FaUsers className="min-w-[20px]" /> Community
            </li>
            
            <li
              className={`px-4 py-2 md:px-6 md:py-3 flex items-center justify-between cursor-pointer ${isMobileView ? 'hover:bg-white/10' : 'hover:bg-[rgba(0,0,0,0.1)]'} transition-all duration-300`}
              onClick={(e) => {
                e.stopPropagation();
                setShowAccountSettings(!showAccountSettings);
              }}
            >
              <span className="flex items-center gap-2 md:gap-3">
                <FaUserCog className="min-w-[16px] md:min-w-[20px]" /> Account Settings
              </span>
              {isMobileView && (showAccountSettings ? <FaChevronUp /> : <FaChevronDown />)}
            </li>
            
            {showAccountSettings && isMobileView && (
              <div 
                className="text-black"
                style={{ backgroundColor: accountSettingsBg }}
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
                    isMobileView={isMobileView}
                    userProfile={userProfile}
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
          ref={accountSettingsPanelRef}
          className="fixed top-0 left-[220px] md:left-[300px] w-[280px] h-full shadow-xl rounded-lg p-0 text-white z-[1200] overflow-y-auto"
          style={{
            borderTop: `4px solid ${selectedColor}`,
            backgroundColor: accountSettingsBg,
            boxShadow: `0 0 10px ${selectedColor}20`
          }}
        >
          <div className="flex justify-between items-center p-4">
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
            isMobileView={isMobileView}
            userProfile={userProfile}
          />
        </div>
      )}

      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.5)] backdrop-blur-sm transition-opacity duration-300 ease-in-out z-[1050]"
          onClick={handleCloseAllMenus}
        />
      )}
    </>
  );
};

export default Sidebar;