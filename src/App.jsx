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

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



import PlayerPages from './pages/PlayerPages';

import TournamentSeries from './pages/tournamentseries';

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

          <Route path="/playerpages" element={<PlayerPages />} />

          <Route path="/tournamentseries" element={<TournamentSeries />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;