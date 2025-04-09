import React from "react";
import logo from '../../assets/kumar/logo.png';
class HeaderComponent extends React.Component{
    render(){
        return(
            <>
             <header class=' flex m-[2rem] w-[6rem] h[2rem] mb-0'>
             <img class='w-[2rem] h[1rem]' src={logo} alt="Logo" />
             <div class="flex justify-center items-center w-[5rem] h-[3rem] bg-yellow ml-[1.5rem]">
  <h1 class="text-white text-2xl font-bold select-none">Cricklytics</h1>
</div>

                
            </header>
            </>
        )
    }
}
export default HeaderComponent;