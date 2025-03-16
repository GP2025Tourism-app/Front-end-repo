import React from "react";
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import Sidebar from "../../components/HomePageComponents/Sidebar";
import profilePic from "../../assets/images/Ellipse 10.png";
import coverpic from "../../assets/images/coverphoto.svg";
import { FaCamera } from "react-icons/fa";
import "./EditTouristProfile.css";

function EditTouristProfile() {
    return (
        <>
            <WebsiteNavbar />
            
            <Sidebar />
                <div className="Edit-tourist-profile-container">
                <div className="Edit-tourist-profile-content">
                    <div className="Edit-tourist-cover-photo">
                        <img src={coverpic} alt="Cover" />
                        <button className="Edit-tourist-edit-cover">Edit Cover Photo</button>
                    </div>
                    <div className="Edit-tourist-profile-picture">
                        <img src={profilePic} alt="Profile" />
                        <div className="Edit-tourist-camera-icon"><FaCamera className="edit-tourist-FaCamera-icon"/></div>
                    </div>
                    <button className="Edit-tourist-save-button">Save</button>
                    <div className="Edit-tourist-profile-form">
                    
    <div className="Edit-tourist-bio">
        <label>Bio</label>
        <textarea placeholder="Write here..." />
    </div>

    <div className="Edit-tourist-form-row">
        <div className="Edit-tourist-form-group">
            <label>First Name</label>
            <input type="text" placeholder="Your First Name" />
        </div>
        <div className="Edit-tourist-form-group">
            <label>Address</label>
            <input type="text" placeholder="Your Address" />
        </div>
    </div>

    <div className="Edit-tourist-form-row">
        <div className="Edit-tourist-form-group">
            <label>Last Name</label>
            <input type="text" placeholder="Your Last Name" />
        </div>
        <div className="Edit-tourist-form-group">
            <label>Birthday</label>
            <input type="text" placeholder="DD/MM/YYYY" />
        </div>
    </div>

    <div className="Edit-tourist-form-row">
        <div className="Edit-tourist-form-group">
            <label>Username</label>
            <input type="text" placeholder="Your User Name" />
        </div>
        <div className="Edit-tourist-form-group">
            <label>Email</label>
            <input type="email" placeholder="Your Email" />
        </div>
    </div>

   
</div>

                </div>
            </div>
        </>
    );
}

export default EditTouristProfile;
