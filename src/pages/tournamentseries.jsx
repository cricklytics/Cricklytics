import { useState } from 'react';
import HeaderComponent from '../components/kumar/header';
import { useNavigate } from 'react-router-dom';
import upload from '../assets/kumar/image-regular.svg';
import location from '../assets/kumar/loc.png';
import ball1 from '../assets/kumar/cricket-ball.png';
import ball2 from '../assets/kumar/ball-others.png';
import others from '../assets/kumar/icons8-tennis-ball-96.png';

function Tournamentseries() {
    const navigate = useNavigate();
    const [isRulesVisible, setIsRulesVisible] = useState(false);
    
    const toggleDivVisibility = (e) => {
      e.preventDefault();
      setIsRulesVisible(prevState => !prevState); 
    };
   
     const handleNavigation = () => {
       navigate('/next');
     };
     const [selectedPitch, setSelectedPitch] = useState(null);

  const pitchOptions = ['Rough', 'Cement', 'Matting', 'Turf', 'Astroturf'];

  const handlePitchClick = (pitch) => {
    setSelectedPitch(pitch);
  };

  const [selectedcategory, setSelectedcatagory] = useState(null);

const categoryoption = ['community', 'corporate', 'open', 'school', 'others', 'series', 'college', 'university'];

const handlecategoryclick = (Category) => {
  setSelectedcatagory(Category); // Corrected this line
};

const [selectedmatchtype, setSelectedmatchtype] = useState(null);

const matchtypeoption = ['limited overs', 'Box cricket', 'Pair Cricket', 'Test match', 'the hundered'];
const handlematchtypeclick = (matchtype) => {
  setSelectedmatchtype(matchtype); // Corrected this line
};

const [selectedBall, setSelectedBall] = useState(null);

const handleBallClick = (ball) => {
  setSelectedBall(ball);
};

const [selectedwp, setSelectedwp] = useState(null);

const wpoption = ['Cash', 'Trophies', 'Both'];
const handlewpclick = (wp) => {
  setSelectedwp(wp); // Corrected this line
};
    
    return (
        <section className="h-fit overflow-hidden z-0 bg-gradient-to-b from-[#0D171E] to-[#283F79] relative">
            <HeaderComponent navigate={navigate}/>
            {isRulesVisible && (
            <div 
            id="rules" 
            className="fixed left-0 w-full h-full flex justify-center items-center inset-0 bg-opacity-40 backdrop-blur-md z-[9999]" 
          >
            <div className="absolute z-[9999] bg-gradient-to-b from-[#0D171E] to-[#283F79] p-6 rounded-lg shadow-lg">
            <button 
              className="absolute top-4 right-4 text-2xl text-white cursor-pointer"
              onClick={toggleDivVisibility}
            >
              X
            </button>
              <h2 className="text-3xl font-bold text-white mb-4">Rules & Description</h2>
              <p className="text-lg text-white mb-4">
                Welcome to our platform! Below are some important rules and instructions to ensure a smooth experience:
              </p>
              <ul className="list-disc pl-5 text-white mb-6">
                <li className="mb-2">All users must adhere to our <strong>community guidelines</strong> at all times.</li>
                <li className="mb-2">Respect other participants and avoid any form of harassment.</li>
                <li className="mb-2">Keep your language professional and refrain from offensive content.</li>
                <li className="mb-2">Ensure your profile is accurate and up-to-date.</li>
                <li className="mb-2">Any breach of rules may lead to suspension or ban.</li>
              </ul>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-lg text-white font-bold">Instructions for use:</p>
                <p className="text-white">To get started, please follow these simple steps:</p>
                <ol className="list-decimal pl-6 text-white mb-4">
                  <li className="mb-2">Register an account and verify your email address.</li>
                  <li className="mb-2">Complete your profile by adding relevant details.</li>
                  <li className="mb-2">Explore available features and get involved in the community.</li>
                </ol>
              </div>
              <div className="mt-6">
                <h3 className="text-2xl font-bold text-white mb-3">Additional Guidelines</h3>
                <p className="text-white">Here are a few extra tips to enhance your experience:</p>
                <ul className="list-inside list-circle text-white">
                  <li className="mb-2">Stay active to maintain your reputation.</li>
                  <li className="mb-2">Engage with others through comments and feedback.</li>
                  <li className="mb-2">Feel free to report any inappropriate content.</li>
                </ul>
              </div>
            </div>
          </div>
            )}

            <div className="absolute left-[-25%] top-[30%] w-[80rem] h-[50rem] rounded-full bg-[radial-gradient(circle,rgba(69,218,255,0.5)_40%,rgba(69,218,255,0.1)_60%,rgba(69,218,255,0.1)_100%)] blur-lg -z-10"></div>

            <div className="z-20 flex overflow-hidden justify-center h-[100%] p-[5rem] relative">
                <form className="z-30 gap-10 bg-[#1A2B4C] rounded-[2rem] shadow-[22px_-14px_0px_5px_#253A6E] flex flex-col items-start justify-around h-[100%] w-[90%] pl-[5rem] pr-[5rem] pt-[5rem] pb-[2rem]">
                    <h1 className="text-4xl text-white font-bold text-center">Add Tournament/Series</h1>
                    <div className="w-[60%] relative flex items-center justify-between gap-5">
                        <label className="text-xl text-white">Tournament/ Series Name</label>
                        <input className="w-64 h-12 border-2 border-white text-white p-2 rounded-xl mt-2" type="text" placeholder="Tournament/Series Name" />
                    </div>
                    <div className="w-[60%] relative flex items-center justify-between gap-5">
                        <h2 className="text-xl mb-4 text-start text-white">Upload an Image</h2>
                        <div className="w-[40%] relative flex items-center justify-between gap-5 mb-6">
                        <div className="w-[10rem] h-fit p-2 bg-white rounded-2xl shadow-lg">
                            <div className="flex items-center justify-center w-full">
                                <label for="image-upload" className="flex flex-col items-center justify-center w-full h-[4rem] border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <img className="w-[2rem] h-[2rem]" src={upload} alt="upload" />
                                        <p className="mb-2 text-[10px] text-gray-500"><span className="font-semibold">Click to upload</span> or drag & drop</p>
                                    </div>
                                    <input id="image-upload" type="file" className="hidden" />
                                </label>
                            </div>
                        </div>
                        </div>
                    </div>

                    <div className="w-[60%] relative flex items-center justify-between gap-5">
                        <label for="location" className="flex text-lg font-medium text-white mb-2">Choose your location</label>
                        <select id="location" name="location" className="block w-[16rem] bg-white-900 px-4 py-2 border border-white rounded-md text-gray-200 focus:ring-blue-500 cursor-pointer">
                            <option value="">Select a location</option>
                            <option value="New York" className='bg-blue-400 text-white'>New York</option>
                            <option value="Los Angeles" className='bg-blue-400 text-white'>Los Angeles</option>
                            <option value="Chicago" className='bg-blue-400 text-white'>Chicago</option>
                            <option value="San Francisco" className='bg-blue-400 text-white'>San Francisco</option>
                            <option value="Miami" className='bg-blue-400 text-white'>Miami</option>
                        </select>
                    </div>

                    <div className="w-[60%] relative flex items-center justify-between gap-5">
                        <label className="text-xl text-white">No of Teams</label>
                        <input className="w-64 h-12 border-2 border-white text-white p-2 rounded-xl mt-[.5rem]" type="text" placeholder="Participation Team" />
                    </div>

                    <div className="relative flex justify-between w-[100%]">
                        <label className="text-xl text-white">Dates</label>
                        <div className="absolute left-[35%] flex w-[90%] h-fit">                    
                            <div className="flex items-center w-[30%]">
                                <label className="text-xl text-white">Start Date</label>
                                <input className="w-40 h-12 border-2 border-white text-white p-2 rounded-xl ml-[.5rem]" type="date" />
                            </div>
                            <div className="flex items-center w-[30%]">
                                <label className="text-xl text-white">End Date</label>
                                <input className="w-40 h-12 border-2 border-white text-white p-2 rounded-xl ml-[.5rem]" type="date" />
                            </div>
                        </div>
                    </div>

                    <div className="w-[60%] relative flex items-center justify-between gap-5">
                        <label className="text-xl text-white">Location</label>
                        <input
                            className="w-64 h-12 border-2 border-white text-white p-2 rounded-xl mt-2 bg-no-repeat pl-10 pr-12 py-2 placeholder-white"
                            type="text"
                            placeholder="Location"
                            style={{
                                backgroundImage: `url(${location})`,
                                backgroundPosition: 'right 1rem center',
                                backgroundSize: '1.5rem 1.5rem'
                            }}
                        />
                    </div>

                    <div className="w-[60%] relative flex items-center justify-between gap-5">
                        <label className="text-xl text-white">Schedule</label>
                        <div>
                            <input className="accent-cyan-500 w-[1rem] h-[1rem]" type="radio" name="days" id="weekdays" />
                            <label className="text-xl text-white ml-[1rem]" htmlFor="weekdays">Weekdays</label>

                            <input className="accent-cyan-500 w-[1rem] h-[1rem] ml-[1rem]" type="radio" name="days" id="weekends" />
                            <label className="text-xl text-white ml-[1rem]" htmlFor="weekends">Weekend</label>
                        </div>
                    </div>

                    <div className="w-[60%] relative flex items-center justify-between gap-5">
                        <label for="timing" className="flex text-lg font-medium text-white mb-2">Choose your Timing</label>
                        <select id="timing" name="timing" className="block w-[16rem] bg-white-900 px-4 py-2 border border-white rounded-md text-gray-200 focus:ring-blue-500 cursor-pointer">
                            <option value="" className='bg-blue-400 text-white'>Select a Timing</option>
                            <option value="Mrg" className='bg-blue-400 text-white'>Morning</option>
                            <option value="Noon" className='bg-blue-400 text-white'>Noon</option>
                            <option value="night" className='bg-blue-400 text-white'>Night</option>
                        </select>
                    </div>

                    <div className="w-[60%] relative flex items-center justify-between gap-5">
                        <label className="text-xl text-white">Rules and Descrimination</label>
                        <div className="w-[40%] relative flex items-center justify-between gap-5 mb-6">
                       <button id="view-rules" className="rounded-xl w-24 bg-gradient-to-l from-[#5DE0E6] to-[#004AAD] h-9 text-white mr-6 cursor-pointer" onClick={toggleDivVisibility}>
                       {isRulesVisible ? 'Hide Rules' : 'View Rules'}
                       </button>
                       </div>
                    </div>
                    
                    <div className='relative flex-col items-center w-full'>
      <h1 className='text-xl text-white mb-[1rem]'>Ball Type</h1>
      <div className='relative flex items-center w-full h-fit gap-5'>
        <a
          className={`animate-rotate flex items-center justify-center w-25 h-25 rounded-full ${selectedBall === 'ball1' ? 'bg-[#73DDD8]' : 'bg-blue-100'} hover:bg-transparent hover:text-white mt-4 cursor-pointer`}
          onClick={() => handleBallClick('ball1')}
        >
          <img src={ball1} alt="" className='w-20 h-20' />
        </a>
        <a
          className={`animate-rotate flex items-center justify-center w-25 h-25 rounded-full ${selectedBall === 'others' ? 'bg-[#73DDD8]' : 'bg-blue-100'} hover:bg-transparent hover:text-white mt-4 cursor-pointer`}
          onClick={() => handleBallClick('others')}
        >
          <img src={others} alt="" className='w-20 h-20' />
        </a>
        <a
          className={`animate-rotate flex items-center justify-center w-25 h-25 rounded-full ${selectedBall === 'ball2' ? 'bg-[#73DDD8]' : 'bg-blue-100'} hover:bg-transparent hover:text-white mt-4 cursor-pointer`}
          onClick={() => handleBallClick('ball2')}
        >
          <img src={ball2} alt="" className='w-18 h-18' />
        </a>
      </div>
    </div>



                    
                    <div id='pitch' className="w-full relative flex-col items-center justify-between gap-5">
      <label className="text-xl text-white">Pitch Type</label>
      <div className='w-full relative flex-col items-center justify-center mt-4'>
        {pitchOptions.map((pitch) => (
          <input
            key={pitch}
            type="text"
            className={`rounded-xl w-24 h-9 m-1 cursor-pointer text-center font-bold placeholder-white placeholder-opacity-100 caret-transparent 
              ${selectedPitch === pitch ? 'bg-[#73DDD8]' : 'bg-blue-300'}`} // Change color based on selection
            name='user'
            placeholder={pitch}
            onClick={() => handlePitchClick(pitch)} // Handle click to change color
          />
        ))}
      </div>
    </div>
    <div id='Category' className="w-full relative flex-col items-center justify-between gap-5">
  <label className="text-xl text-white">Tournament Category</label>
  <div className='w-[50%] relative flex-col items-center justify-center mt-4'>
    {categoryoption.map((Category) => (
      <input
        key={Category}
        type="text"
        className={`rounded-xl w-24 h-9 m-1 cursor-pointer text-center font-bold placeholder-white placeholder-opacity-100 caret-transparent 
          ${selectedcategory === Category ? 'bg-[#73DDD8]' : 'bg-blue-300'}`} // Change color based on selection
        name='user'
        placeholder={Category} // Changed this line
        onClick={() => handlecategoryclick(Category)} // Handle click to change color
      />
    ))}
  </div>
</div>

<div id='matchtype' className="w-full relative flex-col items-center justify-between gap-5">
  <label className="text-xl text-white">Match Type</label>
  <div className='w-[40%] relative flex-col items-center justify-center mt-4'>
    {matchtypeoption.map((matchtype) => ( // Use matchtypeoption here
      <input
        key={matchtype}
        type="text"
        className={`rounded-xl w-24 h-9 m-1 cursor-pointer text-center font-bold placeholder-white placeholder-opacity-100 caret-transparent 
          ${selectedmatchtype === matchtype ? 'bg-[#73DDD8]' : 'bg-blue-300'}`} // Change color based on selection
        name='user'
        placeholder={matchtype} // Changed this line
        onClick={() => handlematchtypeclick(matchtype)} // Use correct function name
      />
    ))}
  </div>
</div>


<div id='wp' className="w-full relative flex-col items-center justify-between gap-5">
  <label className="text-xl text-white">Winning Prize</label>
  <div className='w-[40%] relative flex-col items-center justify-center mt-4'>
    {wpoption.map((wp) => ( // Use matchtypeoption here
      <input
        key={wp}
        type="text"
        className={`rounded-xl w-24 h-9 m-1 cursor-pointer text-center font-bold placeholder-white placeholder-opacity-100 caret-transparent 
          ${selectedwp === wp ? 'bg-[#73DDD8]' : 'bg-blue-300'}`} // Change color based on selection
        name='user'
        placeholder={wp} // Changed this line
        onClick={() => handlewpclick(wp)} // Use correct function name
      />
    ))}
  </div>
</div>

<div className="w-[60%] relative flex flex-col items-start justify-between gap-5">
                        <div>
                            <input className="accent-cyan-500 w-[1rem] h-[1rem]" type="checkbox" name="opt1" id="weekdays" />
                            <label className="text-xl text-white ml-[1rem]" htmlFor="weekdays">Enable Home/Away Format</label>
                        </div>
                        <div>

                            <input className="accent-cyan-500 w-[1rem] h-[1rem]" type="checkbox" name="opt2" id="weekends" />
                            <label className="text-xl text-white ml-[1rem]" htmlFor="weekends">Enble Last Batter Batting Rule</label>
                        </div>
                    </div>


                    <div className="flex justify-end w-full">
                        
                        <button className="rounded-xl w-22 bg-gradient-to-l from-[#5DE0E6] to-[#004AAD] h-9 text-white cursor-pointer hover:shadow-[0px_0px_13px_0px_#5DE0E6] " onClick={handleNavigation}>Next</button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default Tournamentseries;
