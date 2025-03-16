import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCog, FaSignOutAlt } from "react-icons/fa"; 
import { IoHomeOutline } from "react-icons/io5";
import { BsJournalRichtext,BsChatText ,BsGlobe2 , BsPersonBadge  } from "react-icons/bs";
import AiIcon from "../../assets/images/Icons/person-badge.svg";
import "./sidebar.css";

function Sidebar() {
  const location = useLocation(); // Get current route

  return (
    <div className="sidebar">
      <ul>
        <li className={location.pathname === "/homepage" ? "active" : ""}>
          <Link to="/homepage" className="d-flex align-items-center">
            <IoHomeOutline className="icon"/> Home
          </Link>
        </li>
        <li className={location.pathname === "/feed" ? "active" : ""}>
          <Link to="/feed" className="d-flex align-items-center">
            <BsGlobe2 className="icon" /> Feed
          </Link>
        </li>
        <li className={location.pathname === "/plans" ? "active" : ""}>
          <Link to="/plans" className="d-flex align-items-center">
            <BsJournalRichtext  className="icon" /> My Plans
          </Link>
        </li>
        <li className={location.pathname === "/messages" ? "active" : ""}>
          <Link to="/messages" className="d-flex align-items-center">
            <BsChatText className="icon" /> Messages
          </Link>
        </li>
        <li className={location.pathname === "/ai-assistant" ? "active" : ""}>
          <Link to="/ai-assistant" className="d-flex align-items-center">
            < BsPersonBadge  className="icon" /> AI Assistant
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
