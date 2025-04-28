import React from "react";
// import './index.css';
import logo from '../../assets/kumar/plyr1.png';
class HeaderComponent extends React.Component{
    render(){
        return(
             <header class='flex w-full fixed top-0 z-10 h-[2rem] p-[2rem]'>
             <img class='w-[2rem] h[1rem]' src={logo} alt="Logo" />
             <div class="flex justify-center items-center w-[5rem] h-[3rem] bg-yellow ml-[1.5rem]">
  <h1 class="text-white text-2xl font-bold">Cricklytics</h1>
</div>

                
            </header>
        )
    }
}
export default HeaderComponent;