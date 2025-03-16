import React, { useState, useEffect, useRef } from "react";
import "./WebsiteNavbar.css";
import { useNavigate } from "react-router-dom"; 
import logo from "../../assets/images/RoamRightLogo.svg";
import avatar from "../../assets/images/Ellipse 10.png";
import { FaRegHeart, FaRegPenToSquare, FaRegClipboard } from "react-icons/fa6";

function WebsiteNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); 
  const userData = JSON.parse(localStorage.getItem("userData")) || {}; 
  
  const firstName = userData.firstname || "";
  const lastName = userData.lastname || "";

  const toggleDropdown = () => {
    console.log("Avatar clicked!"); 
    setIsDropdownOpen((prev) => {
      console.log("Dropdown state:", !prev); 
      return !prev;
    });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        console.log("Clicked outside, closing dropdown");
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="Webnavbar">
      
      <img className="logo" src={logo} width="100" height="50" alt="Logo" />

     
      <div className="user-profile" ref={dropdownRef}>
        <img
          src={avatar}
          alt="User"
          className="user-avatar"
          onClick={toggleDropdown}
        />

        
        {isDropdownOpen && (
          <div className="navbar-dropdown-menu" >
            <div className="navbar-dropdown-header">
              <img src={avatar} alt="User" className="dropdown-avatar" />
              <div className="user-info">
                <span className="user-name">{firstName && lastName ? `${firstName} ${lastName}` : "Unknown User"}</span>
              </div>
            </div>
            <div className="navbar-dropdown-buttons">
              <button className="profile-btn" onClick={() => navigate("/ViewTouristProfile")}>View Profile</button>
              <button className="profile-btn" onClick={() => navigate("/EditTouristProfile")}>Edit Profile</button>
            </div>
            <ul className="navbar-dropdown-options">
            <li onClick={() => navigate("/favourites")}>
              <div className="icon-container heart">
                <FaRegHeart className="icon heart-icon" />
              </div>
              <span>Favourites</span>
            </li>
            <li>
              <div className="icon-container pen">
                <FaRegPenToSquare className="icon pen-icon" />
              </div>
              <span>Posts</span>
            </li>
            <li>
              <div className="icon-container list">
                <FaRegClipboard className="icon list-icon" />
              </div>
              <span>My Plan</span>
            </li>
          </ul>
          </div>
         
        )}
      </div>
    </div>
  );
}

export default WebsiteNavbar;
