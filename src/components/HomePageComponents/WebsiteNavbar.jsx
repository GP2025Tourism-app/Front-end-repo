import React from "react";
import "./WebsiteNavbar.css";

function WebsiteNavbar() {
  return (
    <div className="Webnavbar">
      
      <div className="logo">Logo</div>

      
      <div className="user-profile">
        <img
          src="https://via.placeholder.com/150" /* Replace with actual image URL */
          alt="User"
          className="user-avatar"
        />
      </div>
    </div>
  );
}

export default WebsiteNavbar;
