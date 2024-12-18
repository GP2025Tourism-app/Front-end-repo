import React from "react";
import { FaHome, FaClipboardList, FaPlane, FaEnvelope, FaRobot, FaCog, FaSignOutAlt } from "react-icons/fa"; 
import homeIcon from "../../assets/images/Icons/house-door.svg";
import feedIcon from "../../assets/images/Icons/globe2.svg";
import plansIcon from "../../assets/images/Icons/journal-richtext.svg";
import messageIcon from "../../assets/images/Icons/chat-text.svg";
import AiIcon from "../../assets/images/Icons/person-badge.svg";
import "./sidebar.css"

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li className="active">
        <img src={homeIcon} alt="Home" className="icon" /> Home
        </li>
        <li>
        <img src={feedIcon} alt="feed" className="icon" /> Feed
        </li>
        <li>
        <img src={plansIcon} alt="plans" className="icon" /> My Plans
        </li>
        <li>
        <img src={messageIcon} alt="messages" className="icon" /> Messages
        </li>
        <li>
        <img src={AiIcon} alt="AI Assistant" className="icon" /> AI Assistant
        </li>
      </ul>
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
