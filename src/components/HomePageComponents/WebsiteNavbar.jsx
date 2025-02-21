import React from "react";
import "./WebsiteNavbar.css";
import logo from '../../assets/images/RoamRightLogo.svg';
import avatar from "../../assets/images/Ellipse 10.png";
function WebsiteNavbar() {
  return (
    <div className="Webnavbar">
      
      <img className="logo"
      src={logo}
      width='100'
      height='50'
      />

      
      <div className="user-profile">
        <img
          src={avatar} /* Replace with actual image URL */
          alt="User"
          className="user-avatar"
        />
      </div>
    </div>
  );
}

export default WebsiteNavbar;
