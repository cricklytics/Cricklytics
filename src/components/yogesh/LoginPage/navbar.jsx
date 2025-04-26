import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/yogesh/login/navlogo.png";
 
const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for toggling mobile menu
 
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
 
  return (
<div className="absolute top-0 left-0 w-full flex justify-between items-center px-4 sm:px-8 py-4 z-50">
      {/* Logo */}
<h1 className="text-white text-xl sm:text-2xl font-bold flex items-center">
<img src={logo} alt="Cricklytics Logo" className="h-8 mr-2" />
        Cricklytics
</h1>
 
      {/* Hamburger Menu Icon (Visible on Mobile) */}
<div className="sm:hidden">
<button onClick={toggleMenu} className="text-white focus:outline-none">
<svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
>
<path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
></path>
</svg>
</button>
</div>
 
      {/* Navbar Links */}
<div
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } sm:flex flex-col sm:flex-row absolute sm:static top-16 left-0 w-full sm:w-auto bg-gray-900 sm:bg-transparent items-center sm:items-center px-4 sm:px-0 py-4 sm:py-0 transition-all duration-300 ease-in-out z-40`}
>
<button className="text-white mb-4 sm:mb-0 sm:mr-4 hover:text-gray-300 transition-colors">
          Contact
</button>
<button
          onClick={() => navigate("/signup")}
          className="bg-gradient-to-r from-[#004AAD] to-[#5DE0E6] text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full text-base sm:text-lg shadow-lg transition-all font-['Alegreya'] cursor-pointer"
>
          Sign Up
</button>
</div>
</div>
  );
};
 
export default Navbar;