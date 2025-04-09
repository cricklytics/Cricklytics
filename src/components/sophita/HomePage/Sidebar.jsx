import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTimes, FaTrophy, FaUsers, FaTv, FaStar, FaSignOutAlt,
  FaChevronDown, FaChevronUp
} from "react-icons/fa";
import profImg from "../../../assets/sophita/HomePage/profpic.png";

import { auth, db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth"; // ✅ Sign out import

const Sidebar = ({ isOpen, closeMenu }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("Loading...");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");

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
          } else {
            console.log("No such user document!");
            setUserName("User");
            setUserPhone("No phone");
          }
  
          // Set email directly from auth
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
  

  // Sign out handler
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
        className={`fixed top-0 left-0 w-[300px] h-screen bg-gradient-to-b from-[#B5FFE3] via-[#5DE0E6] to-[#B5FFE3] 
        shadow-lg transition-transform duration-300 ease-in-out z-[1100] overflow-y-auto select-none
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-full relative">
          <button 
            className="absolute top-[25px] right-[15px] text-[20px] cursor-pointer text-black z-[1] bg-transparent p-0 border-none outline-none"
            onClick={closeMenu}
          >
            <FaTimes />
          </button>

          {/* ✅ Dynamic Profile Section */}
          <div className="text-center py-6 px-5 mt-6 text-black">
          <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold mb-4 border-2 border-[#5DE0E6] mx-auto">
  {userName.charAt(0).toUpperCase()}
</div>

            <h6 className="text-lg font-bold text-black">
              {userName}
            </h6>
            <p className="text-sm text-black opacity-80 mt-1">{userEmail}</p>
            <p className="text-sm text-black opacity-80">{userPhone}</p>
          </div>

          {/* Menu Items */}
          <ul className="list-none p-0 mt-4 text-black">
            <li className="px-6 py-3 flex items-center gap-3 cursor-pointer hover:bg-[rgba(0,0,0,0.1)] transition-all duration-300">
              <FaTrophy className="min-w-[20px]" /> CV Cricket Awards
            </li>
            <li className="px-6 py-3 flex items-center gap-3 cursor-pointer hover:bg-[rgba(0,0,0,0.1)] transition-all duration-300" onClick={() => navigate("/tournamentseries")}>
              <FaTrophy className="min-w-[20px]" /> Tournament/Series
            </li>
            <li className="px-6 py-3 flex items-center gap-3 cursor-pointer hover:bg-[rgba(0,0,0,0.1)] transition-all duration-300"
              onClick={() => navigate("/start-match")}>
              <FaUsers className="min-w-[20px]" /> Start a Match
            </li>

            <li 
              className="px-6 py-3 flex items-center gap-3 cursor-pointer hover:bg-[rgba(0,0,0,0.1)] transition-all duration-300"
              onClick={() => navigate("/go-live")}
            >
              <FaTv className="min-w-[20px]" /> Go Live <FaStar className="ml-auto text-yellow-400" />
            </li>

            <li 
              className="px-6 py-3 flex items-center justify-between cursor-pointer hover:bg-[rgba(0,0,0,0.1)] transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
            >
              <span className="flex items-center gap-3">
                <FaTrophy className="min-w-[20px]" /> LeaderBoard
              </span>
              {showDropdown ? <FaChevronUp /> : <FaChevronDown />}
            </li>

            {showDropdown && (
              <ul className="pl-10 border-l-2 border-[#5DE0E6] transition-all duration-300">
                <li 
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-[rgb(68,172,199)] transition-all duration-200"
                  onClick={() => navigate("/batting")}
                >
                  🏏 Batting <FaStar className="ml-auto text-yellow-400" />
                </li>
                <li 
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-[rgb(68,172,199)] transition-all duration-200"
                  onClick={() => navigate("/bowling")}
                >
                  🎳 Bowling <FaStar className="ml-auto text-yellow-400" />
                </li>
                <li 
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-[rgb(68,172,199)] transition-all duration-200"
                  onClick={() => navigate("/fielding")}
                >
                  🛡️ Fielding <FaStar className="ml-auto text-yellow-400" />
                </li>
                <li 
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-[rgb(68,172,199)] transition-all duration-200"
                  onClick={() => navigate("/table-toppers")}
                >
                  🏆 Table Toppers <FaStar className="ml-auto text-yellow-400" />
                </li>
              </ul>
            )}

            <li className="px-6 py-3 flex items-center gap-3 cursor-pointer hover:bg-[rgba(0,0,0,0.1)] transition-all duration-300" onClick={() => navigate("/playerpages")} >
              <FaUsers className="min-w-[20px]" /> Club <FaStar className="ml-auto text-yellow-400" />
            </li>
          </ul>

          {/* ✅ Sign Out Button */}
          <button 
  className="w-[calc(100%-40px)] py-3 mx-[20px] my-[20px] bg-black text-white flex items-center justify-center gap-3 rounded-lg hover:bg-[#d32f2f] transition-all duration-300"
  onClick={async () => {
    try {
      await auth.signOut(); // ✅ Sign out the user
      navigate("/login");   // ✅ Redirect to login page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }}
>
  <FaSignOutAlt /> Sign Out
</button>

        </div>
      </div>

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
