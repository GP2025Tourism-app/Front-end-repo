import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCog, FaSignOutAlt } from "react-icons/fa"; 
import homeIcon from "../../assets/images/Icons/house-door.svg";
import feedIcon from "../../assets/images/Icons/globe2.svg";
import plansIcon from "../../assets/images/Icons/journal-richtext.svg";
import messageIcon from "../../assets/images/Icons/chat-text.svg";
import AiIcon from "../../assets/images/Icons/person-badge.svg";
import "./sidebar.css";

function Sidebar() {
  const location = useLocation(); // Get current route

  return (
    <div className="sidebar">
      <ul>
        <li className={location.pathname === "/homepage" ? "active" : ""}>
          <Link to="/homepage" className="d-flex align-items-center">
            <img src={homeIcon} alt="Home" className="icon" /> Home
          </Link>
        </li>
        <li className={location.pathname === "/feed" ? "active" : ""}>
          <Link to="/feed" className="d-flex align-items-center">
            <img src={feedIcon} alt="Feed" className="icon" /> Feed
          </Link>
        </li>
        <li className={location.pathname === "/plans" ? "active" : ""}>
          <Link to="/plans" className="d-flex align-items-center">
            <img src={plansIcon} alt="Plans" className="icon" /> My Plans
          </Link>
        </li>
        <li className={location.pathname === "/messages" ? "active" : ""}>
          <Link to="/messages" className="d-flex align-items-center">
            <img src={messageIcon} alt="Messages" className="icon" /> Messages
          </Link>
        </li>
        <li className={location.pathname === "/ai-assistant" ? "active" : ""}>
          <Link to="/ai-assistant" className="d-flex align-items-center">
            <img src={AiIcon} alt="AI Assistant" className="icon" /> AI Assistant
          </Link>
        </li>
      </ul>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <p>
          <FaCog className="icon" /> Policy
        </p>
        <p>
          <FaCog className="icon" /> Settings
        </p>
        <p style={{ color: "red" }}>
          <FaSignOutAlt className="icon" /> Logout
        </p>
      </div>
    </div>
  );
}

export default Sidebar;
