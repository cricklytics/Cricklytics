import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/yogesh/LoginPage/login';
import Signup from './components/yogesh/LoginPage/signup';
import Landingpage1 from './pages/Landingpage1';
import SearchBarAft from './components/yogesh/LandingPage/SearchBar';

import Landingpage from './pages/Landingpage';
import Sidebar from './components/sophita/HomePage/Sidebar';
import Golive from './pages/Golive';
import Startmatch from './pages/Startmatch';
import Tournaments from './pages/Tournaments';
import TeamDetails from './pages/TeamDetails';

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



// import HeroSection2 from './component/HeroSection2';
// import HeroSection3 from './component/HeroSection3';
// import HeroSection4 from './component/HeroSection4';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  return (
    <Router>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="relative h-screen w-screen overflow-y-auto">
        {/* Sidebar (Shown only for Homepage & GoLive page) */}
        <Routes>
          <Route
            path="/landingpage"
            element={<Sidebar isOpen={isSidebarOpen} closeMenu={() => setIsSidebarOpen(false)} />}
          />
          <Route
            path="/go-live"
            element={<Sidebar isOpen={isSidebarOpen} closeMenu={() => setIsSidebarOpen(false)} />}
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
          <Route path="/landingpage" element={<Landingpage menuOpen={isSidebarOpen} setMenuOpen={setIsSidebarOpen} />} />
          <Route path="/go-live" element={<Golive />} />
          <Route path="/start-match" element={<Startmatch />} />
          <Route path="/tournament" element={<Tournaments/>} />
          <Route path="/team" element={<TeamDetails/>} />

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

          <Route path="/tournamentseries" element={<TournamentSeries />} />
           {/* Newly Added Routes */}
           <Route path="/next" element={<Tournament_nextpg />} />
          <Route path="/TeamProfile" element={<TeamProfile />} />
          <Route path="/TournamentPage" element={<TournamentPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;