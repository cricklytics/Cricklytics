import React from "react";
import logo from '../../assets/kumar/logo.png';

class HeaderComponent extends React.Component {
  handleClick = () => {
    this.props.navigate('/landingpage');
  };

  render() {
    return (
      <>
     <div className="flex justify-between items-center p-4 rounded-lg mb-5">
        <div className="flex items-center gap-4 cursor-pointer select-none" onClick={this.handleClick}>
          <img 
            src= {logo}
            alt="Cricklytics Logo"
            className="h-10 object-contain block"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = {logo};
            }}
            onClick={this.handleClick}
          />
          <span className="text-2xl font-bold text-white whitespace-nowrap text-shadow-[0_0_8px_rgba(93,224,230,0.4)] " >
            Cricklytics
          </span>
        </div>
      </div>
      </>
    );
  }
}

export default HeaderComponent;
