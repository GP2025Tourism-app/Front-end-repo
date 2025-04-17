import React, { useState , useEffect } from "react";
import Sidebar from "../../components/HomePageComponents/Sidebar";
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import searchIcon from "../../assets/images/Icons/zoom-in.svg";
import "./homePage.css";
import TrendingPlaces from "../../components/HomePageComponents/TrendingPlaces";
import Recommendations from "../../components/HomePageComponents/Recommendation";
import DiscoverCities from "../../components/HomePageComponents/DicoverCities";
import ExploreTourGuides from "../../components/HomePageComponents/ExploreTourGuides";
import ProfilePicDefault from "../../assets/images/default-profile-pic.jpg";

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    fetch("http://localhost:8080/api/user/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProfile(data);
    
        const profilePic = data.profilePic ? data.profilePic : ProfilePicDefault;
        localStorage.setItem("profilePic", profilePic);
      })
      .catch((error) => console.error("Error fetching profile:", error));
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="page-container">
      <WebsiteNavbar />
      <Sidebar />

      {/* Main content area */}
      <div className="main-content">
        {/* Search Bar */}
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-bar"
          />
           <img src={searchIcon} alt="Search Icon" className="search-bar-icon" />
        </div>

      <TrendingPlaces/>
      <Recommendations/>
      <DiscoverCities/>
      <ExploreTourGuides/>
      </div>
    </div>
  );
}

export default HomePage;
