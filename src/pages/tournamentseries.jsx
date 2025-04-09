import React from 'react';
import HeaderComponent from '../components/kumar/header';
import { useState } from 'react';


function Tournamentseries() {
    return (
      <html class='bg-gradient-to-b from-[#0D171E] to-[#283F79] m-0'>
        {/* <div className="overflow-y-auto max-h-screen no-scrollbar"> */}
        <section className="h-[100%] overflow-hidden bg-gradient-to-b from-[#0D171E] to-[#283F79] relative">
            <HeaderComponent />
            <div className="absolute left-[-25%] top-[30%] w-[80rem] h-[50rem] rounded-full bg-[radial-gradient(circle,rgba(69,218,255,0.5)_40%,rgba(69,218,255,0.1)_60%,rgba(69,218,255,0.1)_100%)] blur-lg -z-10"></div>

            <div className="z-20 flex h-[42rem]  overflow-hidden  justify-center aling-start p-[5rem] pt-[1rem] relative">
                <form className="z-30 bg-[#1A2B4C] rounded-[2rem] shadow-[22px_-14px_0px_5px_#253A6E] flex flex-col items-start justify-around h-[100%] w-[90%] pl-[5rem] pr-[5rem]">
                    <h1 className="text-4xl text-white font-bold">Add Tournament/Series</h1>

                    <div className="relative flex flex-col">
                        <label className="text-xl text-white">Tournament/ Series Name</label>
                        <input className="w-64 h-12 border-2 border-white text-white p-2 rounded-xl mt-2" type="text" placeholder="Tournament/Series Name" />
                    </div>

                    <div className="relative flex justify-between w-[70%]">
                        <div className="block w-[40%]">
                            <label className="text-xl text-white">Start Date</label>
                            <input className="w-40 h-12 border-2 border-white text-white p-2 rounded-xl ml-[1rem]" type="date" />
                        </div>
                        <div className="block w-[40%]">
                            <label className="text-xl text-white">End Date</label>
                            <input className="w-40 h-12 border-2 border-white text-white p-2 rounded-xl ml-[1rem]" type="date" />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xl text-white">Location</label>
                        <input className="w-64 h-12 border-2 border-white text-white p-2 rounded-xl  mt-[.5rem]" type="text" placeholder="Location" />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xl text-white">Participating Team</label>
                        <input className="w-64 h-12 border-2 border-white text-white p-2 rounded-xl mt-[.5rem]" type="text" placeholder="Participation Team" />
                    </div>

                    <div>
                        <input className="accent-cyan-500 w-[1rem] h-[1rem]" type="checkbox" name="international" />
                        <label className="text-xl text-white ml-[1rem]">International</label>

                        <input className="accent-cyan-500 w-[1rem] h-[1rem] ml-[1rem]" type="checkbox" name="domestic" />
                        <label className="text-xl text-white ml-[1rem]">Domestic</label>
                    </div>

                    <div className="flex justify-end w-full">
                        <button className="rounded-xl w-24 bg-[#65558F] h-9 text-white mr-6 cursor-pointer">Cancel</button>
                        <button className="rounded-xl w-44 bg-gradient-to-l from-[#5DE0E6] to-[#004AAD] h-9 text-white cursor-pointer hover:shadow-[0px_0px_13px_0px_#5DE0E6]">Create Tournament</button>
                    </div>
                </form>
            </div>
        </section>
        {/* </div> */}
        </html>
    );
}


export default Tournamentseries;