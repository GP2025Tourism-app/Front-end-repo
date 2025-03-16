import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaMapMarkerAlt, FaBirthdayCake } from "react-icons/fa";
import { BsFillPersonFill } from "react-icons/bs";
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import Sidebar from "../../components/HomePageComponents/Sidebar";
import "./ViewTouristProfile.css";
import profilePic from "../../assets/images/Ellipse 10.png";
import coverpic from "../../assets/images/coverphoto.svg";
import egyptImage from "../../assets/images/image 2.png";
import PostCard from "../../components/Feed/PostCards";

function ViewTouristProfile() {
  const navigate = useNavigate(); 
  return (
    <>
      <WebsiteNavbar />
      <Sidebar />
      <div className="view_tourist_profile_container">
        <div className="view-tourist-profile-header">
          <img src={coverpic} alt="Cover" className="view-tourist-cover-image" />
          <div className="view-tourist-profile-picture">
            <img src={profilePic} alt="Profile" />
          </div>
        </div>
        <div className="view-tourist-profile-body">
          <div className="view-tourist-profile-info">
            <div className="view-tourist-info-name-bio">
            <h2 className="view-tourist-profile-name">Charles Deo</h2>
            <p className="view-tourist-profile-role">UI/UX Designer</p>
            </div>
            <button className="view-tourist-edit-profile" onClick={() => navigate("/EditTouristProfile")}>
              <FaEdit /> Edit Profile
            </button>
          </div>
          <div className="view-tourist-profile-details">
          <div className="view-tourist-about">
            <h5>About</h5>
            <p><BsFillPersonFill className="view-profile-about-icon"/>CharlesDeo</p>
            <p><FaMapMarkerAlt className="view-profile-about-icon"/> 2239 Hog Camp Road, Schaumburg</p>
            <p className="view-tourist-profile-birthday"><FaBirthdayCake className="view-profile-about-icon" /> Born June 26, 1980</p>
          </div>
          <div className="view-tourist-posts">
            <h5>My Posts</h5>
           <PostCard/>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewTouristProfile;