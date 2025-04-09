import { useNavigate } from "react-router-dom";
import banner from "../../../assets/yogesh/login/landing_img.png";

const HeroSection1 = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex items-center justify-between px-12 md:px-20 lg:px-32 bg-gradient-to-r from-[red] to-[#123456]">
      <div className="max-w-lg ">
      <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight font-['Alegreya']  mt-24">
          Mesmerizing <br/>Colors of <span className="text-cyan-300">Aurora</span>
        </h2>
        <p className="text-gray-300 mt-4 text-lg leading-relaxed  font-['Alegreya']">
          The time to play or watch the league of matches at your convenience. 
          Get instant score updates without delay and stay informed about the game.
        </p>
        <button 
          onClick={() => navigate("/login")} 
          className="mt-6 bg-gradient-to-r from-[#004AAD]  to-[#5DE0E6] text-white px-8 py-3 rounded-full text-lg shadow-lg transition-all font-['Alegreya']
          cursor-pointer">
          Login
        </button>
      </div>
      <div className="hidden md:block  mt-24">
        <img src={banner} alt="Cricket Theme" className="max-w-md drop-shadow-xl" />
      </div>
    </div>
  );
};

export default HeroSection1;
