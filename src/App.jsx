import React, { useState, useEffect  } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/yogesh/LoginPage/login';
import Signup from './components/yogesh/LoginPage/signup';
import Landingpage1 from './pages/Landingpage1';
import SearchBarAft from './components/yogesh/LandingPage/SearchBar';
import CommunitySection from './pages/CommunitySection';
import AcademicsPage from './pages/Community/AcademicsPage';
import BatManufacturesPage from './pages/Community/BatManufacturesPage';
import CommentatorsPage from './pages/Community/CommentatorsPage';
import GroundsPage from './pages/Community/GroundsPage';
import OrganisersPage from './pages/Community/OrganisersPage';
import PersonalCoachingPage from './pages/Community/PersonalCoachingPage';
import ScoresPage from './pages/Community/ScoresPage';
import ShopsPage from './pages/Community/ShopsPage';
import StreamersPage from './pages/Community/StreamersPage';
import TrophyVendorsPage from './pages/Community/TrophyVendorsPage';
import TshirtVendorsPage from './pages/Community/TshirtVendorsPage';
import UmpiresPage from './pages/Community/UmpiresPage';

import Landingpage from './pages/Landingpage';
import Sidebar from './components/sophita/HomePage/Sidebar';
import Golive from './pages/Golive';
import Club from './pages/Club';
import Message from "./pages/Message";
import Contact from './pages/contacts';
import FieldingStatsPage from './components/sophita/HomePage/Fielding';
import Tabletoppers from './pages/Tabletoppers';


import Startmatch from './pages/Startmatch';
import Tournaments from './pages/Tournaments';
import TeamDetails from './pages/TeamDetails';
import Highlights from './pages/Highlights'
import MatchStart from './pages/MatchStart';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminPanel from './pages/AdminPanel';

import PlayerPages from './pages/PlayerPages';
import Awards from './components/pawan/Awards';
import Winner from './components/pawan/Winner';
import Winner25 from './components/pawan/Winner25';
import Winner24 from './components/pawan/Winner24';
import Winner23 from './components/pawan/Winner23';
import SelectionCriteria from './components/pawan/SelectionCriteria';
import National from './components/pawan/National';
import International from './components/pawan/International';
import Stats from './pages/Stats';
import Match from './pages/Match';
import Insights from './components/yogesh/LandingPage/Insights';


import TournamentSeries from './pages/tournamentseries';
import share from './components/kumar/share';
import TournamentPage from './components/kumar/share';
import TeamProfile from './components/kumar/team_profile';
import Tournament_nextpg from './components/kumar/tournament_nextpg';
import Greeting from './pages/greeting';
import StartMatchPlayers from './pages/StartMatchPlayers';



// Import auth and db
import { auth, db } from './firebase'; // Assuming your firebase config is here
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// import HeroSection2 from './component/HeroSection2';
// import HeroSection3 from './component/HeroSection3';
// import HeroSection4 from './component/HeroSection4';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [userProfile, setUserProfile] = useState(null); // State to hold user profile data
  const [loadingUser, setLoadingUser] = useState(true); // State to track user loading

   // Effect to listen for auth state changes and fetch user data
   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, fetch their profile data
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserProfile({
              uid: user.uid,
              email: user.email,
              userName: userData.firstName || "User", // Use firstName from firestore
              profileImageUrl: userData.profileImageUrl || null, // Get profile image URL
              whatsapp: userData.whatsapp || "No phone",
              themeColor: userData.themeColor || "#5DE0E6", // Default color
              accountType: userData.accountType || "public", // Default type
              // Add other fields as needed
            });
          } else {
            // User doc doesn't exist, use basic auth data
             setUserProfile({
              uid: user.uid,
              email: user.email,
              userName: "User",
              profileImageUrl: null,
              whatsapp: "No phone",
              themeColor: "#5DE0E6",
              accountType: "public",
             });
            console.log("No such user document!");
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
           setUserProfile({
              uid: user.uid,
              email: user.email,
              userName: "User",
              profileImageUrl: null,
              whatsapp: "No phone",
              themeColor: "#5DE0E6",
              accountType: "public",
           });
        } finally {
           setLoadingUser(false); // Set loading to false after fetch
        }
      } else {
        // User is signed out
        setUserProfile(null);
        setLoadingUser(false); // Set loading to false
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs once on mount


  // You might want to show a loading spinner or similar while fetching user data
   if (loadingUser) {
     return <div>Loading user...</div>; // Or a proper loading component
   }


  return (
    <Router>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="relative h-screen w-screen overflow-y-auto">
        {/* Sidebar (Shown only for Homepage & GoLive page) */}
        <Routes>
          <Route
            path="/landingpage"
            element={userProfile && <Sidebar isOpen={isSidebarOpen} closeMenu={() => setIsSidebarOpen(false)} userProfile={userProfile} />}
          />
          <Route
            path="/go-live"
            element={userProfile && <Sidebar isOpen={isSidebarOpen} closeMenu={() => setIsSidebarOpen(false)} userProfile={userProfile} />}
          />
        </Routes>

        {/* Main Content */}
        <Routes>
          {/* Authentication Routes */}
          <Route path="/" element={<Landingpage1 />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search-aft" element={<SearchBarAft />} />

          {/* Dashboard Routes */}
          <Route path="/landingpage" element={userProfile ? <Landingpage menuOpen={isSidebarOpen} setMenuOpen={setIsSidebarOpen} userProfile={userProfile} /> : <Login />} /> {/* Protect route */}
          <Route path="/go-live" element={<Golive />} />
          <Route path="/start-match" element={<Startmatch />} />
          <Route path="/club" element={<Club />} />
          <Route path="/message" element={<Message/>} />

          <Route path="/community" element={<CommunitySection/>} />
          <Route path="/academics" element={<AcademicsPage/>} />
          <Route path="/bat-manufactures" element={<BatManufacturesPage/>} />
          <Route path="/commentators" element={<CommentatorsPage/>} />
          <Route path="/grounds" element={<GroundsPage/>} />
          <Route path="/organisers" element={<OrganisersPage/>} />
          <Route path="/personal-coaching" element={<PersonalCoachingPage/>} />
          <Route path="/scores" element={<ScoresPage/>} />
          <Route path="/shops" element={<ShopsPage/>} />
          <Route path="/streamers" element={<StreamersPage/>} />
          <Route path="/trophy-vendors" element={<TrophyVendorsPage/>} />
          <Route path="/tshirt-vendors" element={<TshirtVendorsPage/>} />
          <Route path="/umpires" element={<UmpiresPage/>} />

          <Route path="/fielding" element={<FieldingStatsPage/>} />
          <Route path="/table-toppers" element={<Tabletoppers/>} />

          <Route path="/tournament" element={<Tournaments/>} />
          <Route path="/team" element={<TeamDetails/>} />
          <Route path="/highlights" element={<Highlights/>} />
          <Route path="/match-start" element={<MatchStart/>} />

          <Route path="/playerpages" element={<PlayerPages />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/winner25" element={<Winner25 />} />
          <Route path="/winner24" element={<Winner24 />} />
          <Route path="/winner23" element={<Winner23 />} />
          <Route path="/winner" element={<Winner />} />
          <Route path="/national" element={<National />} />
          <Route path="/international" element={<International />} />
          <Route path="/selectionCriteria" element={<SelectionCriteria />} />
          <Route path="/stats" element={< Stats/>} />
          <Route path="/match" element={< Match/>} />
          <Route path="/insights" element={< Insights/>} />
          <Route path="/contacts" element={<Contact/>} />

          <Route path="/tournamentseries" element={<TournamentSeries />} />
           {/* Newly Added Routes */}
           <Route path="/next" element={<Tournament_nextpg />} />
          <Route path="/TeamProfile" element={<TeamProfile />} />
          <Route path="/TournamentPage" element={<TournamentPage />} />
          <Route path="/welcome" element={<Greeting/>} />
          <Route path="/StartMatchPlayers" element={<StartMatchPlayers />} />





          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;