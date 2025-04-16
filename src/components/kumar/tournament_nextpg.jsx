import React from 'react';
import HeaderComponent from '../kumar/header';
import { useNavigate } from 'react-router-dom';
import scanner from '../../assets/kumar/icons8-qr-code-52.png';
import nav from '../../assets/kumar/right-chevron.png';
import Scanner from '../../assets/kumar/scanner.png';
import { useState } from 'react';

function Tournament_nextpg() {
  const navigate = useNavigate();
    const [isRulesVisible, setIsRulesVisible] = useState(false);
    
    const toggleDivVisibility = (e) => {
      e.preventDefault();
      setIsRulesVisible(prevState => !prevState); 
    };
    const [ispriceVisible, setIspriceVisible] = useState(false);
    
    const togglepriceVisibility = (e) => {
      e.preventDefault();
      setIspriceVisible(prevState => !prevState); 
    };

  const Teamprofile = () => {
    navigate('/TeamProfile');
  };
  const Tournament = () => {
    navigate('/TournamentPage');
  };
   

  const [value, setValue] = useState('');
  const home = () => {
    navigate('/');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form Submitted");
  };

  const [selectedhmd, setSelectedhmd] = useState(null);
  
  const hmdoptions = ['1', '2', '3','4','5+'];

  const handlehmdClick = (hmd) => {
    setSelectedhmd(hmd);
  };

  const [selectedmpd, setSelectedmpd] = useState(null);
  
  const mpdoptions = ['1', '2', '3','4','5+'];

  const handlempdClick = (mpd) => {
    setSelectedmpd(mpd);
  };


const [selectedbpr, setSelectedbpr] = useState(null);

const bproptions = ['500-1000', '1100-1500','1600-2000','2000+','Not Dedcided'];
const handlebprClick = (bpr) => {
  setSelectedbpr(bpr); 
};

const [selectedpm, setSelectedpm] = useState(null);
const pmoptions = ['100-5000', '600-1000','1100-1500','Not decided'];
const handlepmClick = (pm) => {
  setSelectedpm(pm); 
};

const [selectedof, setSelectedof] = useState(null);
const ofoptions = ['Cricklytics','Whatsapp','Call'];
const handleofClick = (of) => {
  setSelectedof(of); 
};

const [selectedpay, setSelectedpay] = useState(null);
const payoptions = ['UPI:QR Scan', 'Add Debit Card or Credit Card', 'Add Net Banking'];
const handlepayclick = (pay) => {
  setSelectedpay(pay); 
};


  return (
    <section className="min-h-screen overflow-hidden relative bg-gradient-to-b from-[#0D171E] to-[#283F79]">
      <HeaderComponent />
      <div className="absolute left-[-25%] top-[30%] w-[80rem] min-h-screenrounded-full bg-[radial-gradient(circle,rgba(69,218,255,0.5)_40%,rgba(69,218,255,0.1)_60%,rgba(69,218,255,0.1)_100%)] blur-lg -z-10"></div>
      {ispriceVisible && (
            <div 
            id="price" 
            className="fixed left-0 w-full h-full flex justify-center items-center inset-0 bg-opacity-40 backdrop-blur-md z-[9999]" 
          >
            <div className="absolute z-[9999] bg-gradient-to-b from-[#0D171E] to-[#283F79] p-6 rounded-lg shadow-lg">
            <button 
              className="absolute top-4 right-4 text-2xl text-white cursor-pointer"
              onClick={togglepriceVisibility}
            >
              X
            </button>
            <h2 className="text-3xl font-bold text-white mb-4">Price Details for Players</h2>
<p className="text-lg text-white mb-4">
  Welcome to the pricing section! Below are the details about pricing for players on our platform:
</p>
<ul className="list-disc pl-5 text-white mb-6">
  <li className="mb-2">Pricing is tiered based on performance, participation, and engagement.</li>
  <li className="mb-2">There are different price levels based on the player's rank and experience.</li>
  <li className="mb-2">Discounts and special offers are available for top-tier players and long-term members.</li>
  <li className="mb-2">Payment can be made monthly, quarterly, or annually, with different benefits for each plan.</li>
  <li className="mb-2">Refunds and cancellations are subject to terms outlined in the player agreement.</li>
</ul>
<div className="bg-gray-800 p-4 rounded-lg">
  <p className="text-lg text-white font-bold">Instructions for Subscription:</p>
  <p className="text-white">To start your subscription, follow these simple steps:</p>
  <ol className="list-decimal pl-6 text-white mb-4">
    <li className="mb-2">Create an account or log in if you already have one.</li>
    <li className="mb-2">Choose your subscription plan based on your preference and budget.</li>
    <li className="mb-2">Enter payment details and confirm the subscription.</li>
  </ol>
</div>
<div className="mt-6">
  <h3 className="text-2xl font-bold text-white mb-3">Additional Pricing Information</h3>
  <p className="text-white">Here are a few additional details to help you understand the pricing better:</p>
  <ul className="list-inside list-circle text-white">
    <li className="mb-2">Higher-tier players may qualify for additional perks and bonuses.</li>
    <li className="mb-2">Players with significant achievements will be offered custom pricing packages.</li>
    <li className="mb-2">For special cases, please reach out to our support team for personalized offers.</li>
  </ul>
</div>
</div>
          </div>
            )}
      
      
      
      {isRulesVisible && (
            <div  id="rules"  className="fixed left-0 w-full h-full flex justify-center items-center inset-0 bg-opacity-40 backdrop-blur-md z-[9999]" >
            <div className="absolute z-[9999] w-fit bg-gradient-to-b from-[#0D171E] to-[#283F79] p-6 rounded-lg shadow-lg ">
            <button 
              className="absolute top-4 right-4 text-2xl text-white cursor-pointer"
              onClick={toggleDivVisibility}
            >
              X
            </button>
            <div className="flex flex-1 px-[1.5rem]">
      <div className="w-fit h-[50%] flex flex-col items-start px-[1.5rem]">
        <h1 className="text-white text-start mt-10 font-bold text-3xl">Choose Payment Method</h1>
        <p className="text-white text-sm my-[2rem] mt-10">
          Available payment methods are based on your currency (INR) and payment setting.
        </p>
        {payoptions.map((pay) => (
          <div
            key={pay}
            className={`flex items-center w-full gap-5 mb-5 p-3 cursor-pointer text-white text-lg rounded-md
              ${selectedpay === pay ? 'bg-[#9370DB] shadow-md' : 'bg-transparent'}
              transition duration-200 ease-in-out`}
            onClick={() => handlepayclick(pay)}
          >
            <button className="text-3xl border-dotted border border-white w-15 h-fit pt-0 text-white hover:bg-white">+</button>
            <div className='caret-transparent'>{pay}</div>
          </div>
        ))}
      </div>

      {selectedpay === 'UPI:QR Scan' && (
        <div id='pay1' className='w-[50%] h-fit bg-blue-900 mt-[1rem] py-10 flex flex-col items-start px-[1rem]'>
          <h1 className='text-white font-bold text-3xl'>{selectedpay}</h1>
          <p className='text-white text-sm my-[2rem]'>
            Approve UPI Autopay in the app.
          </p>
          <div className='w-full h-[fit] mt-5 p-5 text-black flex justify-center border-dotted border border-white'>
            <img className='w-30 h-30' src={scanner} alt="QR Scanner" />
          </div>
          <h1 className='text-white font-bold text-lg mt-5'>Instruction</h1>
          <p className='text-white text-sm w-[60%] m-0'>Approve UPI Autopay in the app.Approve UPI Autopay in the app. This isn't a charge.</p>
          <div className="flex justify-end w-full">
            <button className="rounded-xl w-22 bg-gradient-to-l from-[#5DE0E6] to-[#004AAD] h-9 text-white cursor-pointer hover:shadow-[0px_0px_13px_0px_#5DE0E6]">
              Next
            </button>
          </div>
        </div>
      )}

      {selectedpay === 'Add Debit Card or Credit Card' && (
        <div id='pay2' className='w-[50%] h-fit bg-blue-900 mt-[1rem] py-10 flex flex-col items-start px-[1rem]'>
          <h1 className='text-white font-bold text-3xl'>{selectedpay}</h1>
          <p className='text-white text-sm my-[2rem]'>All fields required</p>

          <div className="relative w-[60%] flex flex-col mb-6">
            <input
              id="card-number"
              className="peer w-64 h-12 border-2 border-white text-white p-2 rounded-xl mt-2 pl-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              type="text"
              placeholder=" "
            />
            <label
              htmlFor="card-number"
              className="absolute left-4 top-11 text-white transition-all bg-blue-900 duration-200 transform scale-100 origin-top-left pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:px-[10px] peer-focus:text-xs"
            >
              Card Number
            </label>
          </div>

          <div className="flex w-full">
            <div className="relative w-[60%] flex flex-col mb-6">
              <input
                id="expiry-date"
                className="peer w-50 h-12 border-2 border-white text-white p-2 rounded-xl mt-2 pl-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                type="text"
                placeholder=" "
              />
              <label
                htmlFor="expiry-date"
                className="absolute left-4 top-11 text-white transition-all bg-blue-900 duration-200 transform scale-100 origin-top-left pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:px-[10px] peer-focus:text-xs"
              >
                MM/YY
              </label>
            </div>

            <div className="relative w-[60%] flex flex-col mb-6">
              <input
                id="cvv"
                className="peer w-50 ml-[1rem] h-12 border-2 border-white text-white p-2 rounded-xl mt-2 pl-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                type="text"
                placeholder=" "
              />
              <label
                htmlFor="cvv"
                className="absolute left-8 top-11 text-white transition-all bg-blue-900 duration-200 transform scale-100 origin-top-left pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:px-[10px] peer-focus:text-xs"
              >
                CVV
              </label>
            </div>
          </div>

          <div className="relative w-[60%] flex flex-col mb-6">
            <input
              id="cardholder-name"
              className="peer w-64 h-12 border-2 border-white text-white p-2 rounded-xl mt-2 pl-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              type="text"
              placeholder=" "
            />
            <label
              htmlFor="cardholder-name"
              className="absolute left-4 top-11 text-white transition-all bg-blue-900 duration-200 transform scale-100 origin-top-left pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:px-[10px] peer-focus:text-xs"
            >
              Cardholder Name
            </label>
          </div>

          <div className="flex justify-end w-full">
            <button className="rounded-xl w-22 bg-gradient-to-l from-[#5DE0E6] to-[#004AAD] h-9 text-white cursor-pointer hover:shadow-[0px_0px_13px_0px_#5DE0E6]">
              Next
            </button>
          </div>
        </div>
      )}

      {selectedpay === 'Add Net Banking' && (
        <div id='pay3' className='w-[50%] h-fit bg-blue-900 mt-[1rem] py-10 flex flex-col items-start px-[1rem]'>
          <h1 className='text-white font-bold text-3xl'>{selectedpay}</h1>
          <p className='text-white text-sm my-[2rem]'>All fields required</p>
          <button className="rounded-xl w-22 bg-gradient-to-l from-[#5DE0E6] to-[#004AAD] h-9 text-white cursor-pointer hover:shadow-[0px_0px_13px_0px_#5DE0E6]">
            Next
          </button>
        </div>
      )}
    </div>
            </div>
          </div>
            )}
      <div className="z-20 flex overflow-hidden justify-center min-h-screen p-[5rem] pt-[2rem] relative">
        <form
          onSubmit={handleSubmit}
          className="relative z-20 bg-[#1A2B4C] rounded-[2rem] shadow-[22px_-14px_0px_5px_#253A6E] flex flex-col items-start justify-around h-fit w-[90%] p-[5rem]"
        >
          <button onClick={home} className='hover:cursor-pointer'><img src={nav} className='absolute w-10 h-10 -scale-x-100 top-8 left-5'></img></button>
          <h1 className="text-4xl text-white font-bold ">Add Tournament/Series</h1>

         
          


      
          <div className="w-[50%] relative flex flex-col items-start justify-between gap-5  mt-[3rem]">
                        <label className="text-xl text-white">What You need?</label>
                        <div>
                            <input className="accent-cyan-500 w-[1rem] h-[1rem]" type="checkbox" name="umpire" id="weekdays" />
                            <label className="text-xl text-white ml-[1rem]" htmlFor="weekdays">Umpire</label>

                            <input className="accent-cyan-500 w-[1rem] h-[1rem] ml-[1rem]" type="checkbox" name="live" id="weekends" />
                            <label className="text-xl text-white ml-[1rem]" htmlFor="weekends">Live streamer</label>
                            <input className="accent-cyan-500 w-[1rem] h-[1rem] ml-[1rem]" type="checkbox" name="score" id="weekends" />
                            <label className="text-xl text-white ml-[1rem]" htmlFor="weekends">Scorer</label>
                            <input className="accent-cyan-500 w-[1rem] h-[1rem] ml-[1rem]" type="checkbox" name="commen" id="weekends" />
                            <label className="text-xl text-white ml-[1rem]" htmlFor="weekends">Comentator</label>
                        </div>
                    </div>


  <div id='hdm' className="w-full relative flex-col items-center justify-between gap-5 mt-[2rem]">
  <label className="text-xl text-white">Match Type</label>
  <div className='w-[50%] relative flex-col items-center justify-center mt-4'>
    {hmdoptions.map((hdm) => ( 
      <input
        key={hdm}
        type="text"
        className={`rounded-xl w-10 h-10  rounded-full m-1 cursor-pointer text-center font-bold placeholder-white placeholder-opacity-100 caret-transparent 
          ${selectedhmd === hdm ? 'bg-[#73DDD8]' : 'bg-blue-300'}`} 
        name='user'
        placeholder={hdm} 
        onClick={() => handlehmdClick(hdm)} 
      />
    ))}
  </div>
</div>

<div id='mpd' className="w-full relative flex-col items-center justify-between gap-5 mt-[2rem]">
  <label className="text-xl text-white">How Many Days</label>
  <div className='w-[50%] relative flex-col items-center justify-center mt-4'>
    {mpdoptions.map((mpd) => ( 
      <input
        key={mpd}
        type="text"
        className={`rounded-xl w-10 h-10  rounded-full m-1 cursor-pointer text-center font-bold placeholder-white placeholder-opacity-100 caret-transparent 
          ${selectedmpd === mpd ? 'bg-[#73DDD8]' : 'bg-blue-300'}`}
        name='user'
        placeholder={mpd} // Changed this line
        onClick={() => handlempdClick(mpd)}
      />
    ))}
  </div>
</div>




<div className='w-full flex flex-col'>
  <div className='flex justify-between text-3xl font-bold text-white mt-[2rem]'><h2>Budget Range</h2> 
  <div className='w-[50%] h-10 flex items-center  justify-start'><input className="accent-cyan-500 w-[1rem] h-[1rem]" type="checkbox" name="range" id="budgetrange" /><label htmlFor="" className='ml-[1rem] text-xl text-white'>Same Budget For All</label></div></div>
  <div id='bpr' className="w-full relative flex-col items-center justify-between mt-[2rem]">
  <label className="text-xl text-white ">Per Day</label>
  <div className='w-[50%] relative flex-col items-center justify-center mt-4'>
    {bproptions.map((bpr) => ( 
      <input
        key={bpr}
        type="text"
        className={`rounded-xl w-24 h-10 m-1 cursor-pointer text-center font-bold placeholder-white placeholder-opacity-100 caret-transparent 
          ${selectedbpr === bpr ? 'bg-[#73DDD8]' : 'bg-blue-300'}`}
        name='user'
        placeholder={bpr} // Changed this line
        onClick={() => handlebprClick(bpr)} 
      />
    ))}
  </div>
</div>
<div id='pm' className="w-full relative flex-col items-center justify-between gap-5 mt-[2rem]">
  <label className=" flex gap-5 text-xl text-white">Per Match 
  <select
              id="location"
              name="location"
              className="block w-20 mt-.5 h-7 bg-white-900 border text-sm border-white rounded-md text-gray-200 focus:ring-blue-500 cursor-pointer"
            >
              <option value="" className='bg-blue-400 text-white'>INR</option>
              <option value="t2" className='bg-blue-400 text-white'>DOLLAR</option>
              <option value="t3" className='bg-blue-400 text-white'>EURO</option>
            </select>
    
     </label>
  <div className='w-[50%] relative flex-col items-center justify-center mt-4'>
    {pmoptions.map((pm) => ( 
      <input
        key={pm}
        type="text"
        className={`rounded-xl w-24 h-10 m-1 cursor-pointer text-center font-bold placeholder-white placeholder-opacity-100 caret-transparent 
          ${selectedpm === pm ? 'bg-[#73DDD8]' : 'bg-blue-300'}`} 
        name='user'
        placeholder={pm} 
        onClick={() => handlepmClick(pm)} 
      />
    ))}
  </div>
</div>

<div id='of' className="w-full relative flex-col items-center justify-between gap-5 mt-[2rem]">
  <label className="text-xl text-white">How Can Official Handle You</label>
  <div className='w-[50%] relative flex-col items-center justify-center mt-4'>
    {ofoptions.map((of) => ( 
      <input
        key={of}
        type="text"
        className={`rounded-xl w-24 h-10 m-1 cursor-pointer text-center font-bold placeholder-white placeholder-opacity-100 caret-transparent 
          ${selectedof === of ? 'bg-[#73DDD8]' : 'bg-blue-300'}`} 
        name='user'
        placeholder={of} 
        onClick={() => handleofClick(of)} 
      />
    ))}
  </div>
  
    <input className="w-70 h-12 border-2 border-white text-white p-2 rounded-xl ml-[.5rem] mt-[2rem] placeholder-white placeholder-opacity-100" type="number" placeholder='Contact Number'/>

</div>
</div>

                <div className="w-[61%] relative flex items-center justify-between gap-5 mt-[2rem] mb-6">
                        <label className="text-xl text-white">Entry Fees</label>
                        <div className="w-[51%] relative flex items-center justify-end gap-2 ">
                        <button id="view-rules" className="rounded-xl w-24 bg-gradient-to-l bg-blue-300 h-9 text-white mr-6 cursor-pointer px=100 placeholder-black" onClick={toggleDivVisibility}>optional
                       </button>
                       <button id="view-rules" className="rounded-xl w-29 bg-gradient-to-l from-[#5DE0E6] to-[#004AAD] h-9 text-white mr-6 cursor-pointer" onClick={toggleDivVisibility}>
                       {isRulesVisible ? 'Hide Rules' : 'Make Payment'}
                       </button>
                       </div>
                    </div>

                    <div className="w-[60%] relative flex items-center justify-between gap-5">
                        <label className="text-xl text-white">Prize details</label>
                        <div className="w-[40%] relative flex items-center justify-between gap-5 mb-6">
                       <button id="view-rules" className="rounded-xl w-24 bg-gradient-to-l from-[#5DE0E6] to-[#004AAD] h-9 text-white mr-6 cursor-pointer" onClick={togglepriceVisibility}>
                       {ispriceVisible ? 'Hide price' : 'View price'}
                       </button>
                       </div>
                    </div>

          <div className="w-[60%] relative flex items-center justify-between gap-5 mb-6">
            <label htmlFor="location" className="text-xl text-white mb-9">Active Tournaments</label>
            <select
              id="location"
              name="location"
              className="block w-64 bg-white-900 px-4 py-2 border border-white rounded-md text-gray-200 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Select a Tournament</option>
              <option value="t1" className='bg-blue-400 text-white'>Tournament1</option>
              <option value="t2" className='bg-blue-400 text-white'>Tournament2</option>
              <option value="t3" className='bg-blue-400 text-white'>Tournament3</option>
            </select>
          </div>

          <div className="w-[60%] relative flex items-center justify-between gap-5 mb-6">
            <label className="text-xl text-white">Add rounds</label>
            <input
              className="w-64 h-12 border-2 border-white text-white p-2 rounded-xl mt-[.5rem]"
              type="text"
              placeholder="Participation Team"
            />
          </div>

          <div className="w-[60%] relative flex items-center justify-between gap-5 mb-6">
            <label className="text-xl text-white">Team Profiles</label>
            <div className="w-[40%] relative flex items-center justify-between gap-5 mb-6">
            <button
              className="rounded-xl w-24 bg-gradient-to-l from-[#5DE0E6] to-[#004AAD] h-9 text-white mr-6 cursor-pointer"
              onClick={Teamprofile}
            >
              Add Details
            </button>
            </div>
          </div>


          <div className="relative w-[60%] flex items-center justify-between gap-5 mb-6">
            <label className="text-xl text-white">Link Share via</label>
            <div>
              <label className="flex text-xl text-white">
                <a href="#" className="flex items-center text-blue-400">
                  https://cricklytics-asdihgity99/friends-?-eruwi/..
                </a>
                <a>
                  <img className="w-5 h-5 ml-[1rem]" src={scanner} alt="QR Code" />
                </a>
              </label>
            </div>
          </div>

          <div className="flex items-center mb-6">
            <input className="accent-cyan-500 w-[1rem] h-[1rem]" type="checkbox" name="terms" id="conditions" />
            <label className="text-lg text-white ml-[1rem]">
              Accept all the Terms and condition{' '}
              <a className="text-lg text-yellow-200" href="#">
                Click here
              </a>
            </label>
          </div>

          <div className="flex justify-end w-full">
            <button
              type="submit"
              className="rounded-xl w-44 bg-gradient-to-l from-[#5DE0E6] to-[#004AAD] h-9 text-white cursor-pointer hover:shadow-[0px_0px_13px_0px_#5DE0E6]"
              onClick={Tournament} >
              Create Tournament
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Tournament_nextpg;
