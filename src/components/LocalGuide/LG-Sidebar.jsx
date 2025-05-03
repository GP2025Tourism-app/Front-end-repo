import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCog, FaSignOutAlt } from "react-icons/fa"; 
import { IoHomeOutline } from "react-icons/io5";
import { BsJournalRichtext,BsChatText ,BsGlobe2 , BsPersonBadge  } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import "./LG-Sidebar.css";

function LGSidebar() {
  const location = useLocation(); // Get current route

  return (
    <div className="LG-sidebar">
      <ul>
        <li className={location.pathname === "/tour-guide-homepage" ? "active" : ""}>
          <Link to="/tour-guide-homepage" className="d-flex align-items-center">
          <BsJournalRichtext  className="LG-icon" /> My Trips
          </Link>
        </li>
        <li className={location.pathname === "/feed" ? "active" : ""}>
          <Link to="/feed" className="d-flex align-items-center">
            <BsGlobe2 className="LG-icon" /> Feed
          </Link>
        </li>

        <li className={location.pathname === "/TouristChat" ? "active" : ""}>
          <Link to="/TouristChat" className="d-flex align-items-center">
            <BsChatText className="LG-icon" /> Messages
          </Link>
        </li>
        <li className={location.pathname === "/notification" ? "active" : ""}>
          <Link to="/notification" className="d-flex align-items-center">
          <IoMdNotificationsOutline className="LG-icon" /> Notifications
          </Link>
        </li>
      </ul>

      {/* Sidebar Footer */}
      <div className="LG-sidebar-footer">
        <p>
          <FaCog className="LG-icon" /> Policy
        </p>
        <p>
          <FaCog className="LG-icon" /> Settings
        </p>
        <p style={{ color: "red" }}>
          <FaSignOutAlt className="LG-icon" /> Logout
        </p>
      </div>
    </div>
  );
}

export default LGSidebar;
