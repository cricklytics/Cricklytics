import {useNavigate } from "react-router-dom";

import logo from "../../../assets/yogesh/login/navlogo.png"; 


const Navbar = () => {
  const navigate = useNavigate(); // React Router navigation

  return (
    <div className="absolute top-0 left-0 w-full flex justify-between items-center px-8 py-4 z-989 ">
      <h1 className="text-white text-2xl font-bold flex items-center">
        <img src={logo} alt="Cricklytics Logo" className="h-8 mr-2" />
        Cricklytics
      </h1>
      <div>
        <button className="text-white mr-4">Contact</button>
        
        {/* Sign Up Button with Navigation */}
        <button 
          onClick={() => navigate("/signup")}
          className="mt-6 bg-gradient-to-r from-[#004AAD]  to-[#5DE0E6] text-white px-8 py-3 rounded-full text-lg shadow-lg transition-all font-['Alegreya']
          cursor-pointer">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Navbar;
