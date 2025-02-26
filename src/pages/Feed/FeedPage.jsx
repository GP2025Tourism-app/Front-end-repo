import React, { useState, useRef, useEffect } from "react";
import './FeedPage.css';
import { FaFilter, FaPlus } from "react-icons/fa";
import PostCard from "../../components/Feed/PostCards";
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import Sidebar from "../../components/HomePageComponents/Sidebar";
import SearchBar from "../../components/ReusableComp/SearchBar";
import filterIcon from "../../assets/images/Vector.png";
import avatar from '../../assets/images/Ellipse 10.png';


const CLOUD_NAME = "da6gcu1n9";
const UPLOAD_PRESET = "graduationproject";

function FeedPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [title, setTitle] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activities, setActivities] = useState([]); 
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [caption, setCaption] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const userData = JSON.parse(localStorage.getItem("userData")) || {}; 

  const firstName = userData.firstname || "";
  const lastName = userData.lastname || "";
  const username = userData.username || "";

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("authToken"); 
  
        const response = await fetch("http://localhost:8080/api/activities", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json", 
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }
  
        const data = await response.json();
        setActivities(data); 
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
  
    fetchActivities();
  }, []);
  

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category)
        : [...prevSelected, category]
    );
  };

  const togglePostForm = () => {
    setShowPostForm(!showPostForm);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTitle(value);
  
    if (value.length > 1) {
      const filtered = activities.filter((activity) =>
        activity.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };
  
  const handleSelect = (activity) => {
    setTitle(activity.name);
    setSelectedActivity(activity.name); 
    setSuggestions([]); 

  };
  
  

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    const urls = await Promise.all(files.map((file) => handleFileUpload(file)));
    setMediaFiles((prevFiles) => [...prevFiles, ...urls.filter((url) => url)]);
    setPreviewUrls((prevUrls) => [...prevUrls, ...urls.filter((url) => url)]);
  };

  const handleSubmit = async () => {
  
    if (!selectedActivity) {
      alert("Please select a valid activity or place.");
      return;
    }
  
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("User not authenticated. Please log in.");
      return;
    }
  
    const postData = {
      title: selectedActivity, 
      caption: caption,
      visualsUrl: mediaFiles, 
    };
  
  
    try {
    
      const response = await fetch("http://localhost:8080/api/feed", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      if (response.ok) {
        alert("Post created successfully!");
        window.location.reload();
        setShowPostForm(false);
        setCaption("");
        setMediaFiles([]);
        setPreviewUrls([]);
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        alert(`Failed to create post: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error connecting to server.");
    }
  };
  


  return (
    <>
      <WebsiteNavbar />
      <Sidebar />
      <div className="Feed-details">
        <div className="Search-Feed-Container">
          <div className="search-actions">
            <div className="search-container">
              <SearchBar />
            </div>

            <div className="buttons-group">
              <button className="filter-btn" onClick={toggleFilters}>
                <img src={filterIcon} alt="Create Post" className="custom-icon" />
              </button>
              <button className="create-post-btn" onClick={togglePostForm}>
                <FaPlus className="icon" /> Create
              </button>
            </div>
          </div>
          {showFilters && (
            <div className="filter-categories">
              {[
                "Historical Sites",
                "Food & Culinary Tours",
                "Nightlife",
                "Adventure Activities",
                "Cultural Experiences",
                "Shopping",
                "Relaxation & Wellness",
                "Beaches & Water Sports"
              ].map((category) => (
                <button
                  key={category}
                  className={`filter-category ${selectedCategory.includes(category) ? "selected" : ""}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {showPostForm && (
            <>
              <div className="feed-overlay" onClick={togglePostForm}></div>
              <div className="feed-post-creation-form">
                <div className="feed-post-header">
                <div className="feed-user-info">
                    <img src={avatar} alt="User" className="feed-user-avatar" />
                    <div className="user-info">
                    <h3 className="user-fullname">
                      {firstName && lastName ? `${firstName} ${lastName}` : "Unknown User"}
                    </h3>
                    <h5 className="user-name">@{username?`${username}`: "UnknownUser"}</h5>
                  </div>
                  </div>
                  <button
                      className="feed-post-btn"
                      onClick={() => {
                        handleSubmit();
                      }}
                      disabled={!selectedActivity}
                    >
                      Post
                    </button>

                </div>

                <div className="autocomplete">
                <input
                  type="text"
                  placeholder="Tell us the name of the place or activity"
                  className="feed-post-title"
                  value={title}
                  onChange={handleInputChange}
                  required
                />
                {suggestions.length > 0 && (
                  <ul className="autocomplete-list">
                    {suggestions.map((activity , index) => (
                      <li key={activity.activityid || index} onClick={() => handleSelect(activity)}>
                        {activity.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
                <textarea
                  placeholder="Share a travel tip or ask a question..."
                  className="feed-post-description"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                ></textarea>
                  <div className="preview-container">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="preview-item">
                      {url.includes("video") ? <video src={url} controls className="preview-media" /> : <img src={url} alt="Preview" className="preview-media" />}
                    </div>
                  ))}
                </div>
                <div className="feed-post-footer">
                  <button className="feed-add-media-btn" onClick={() => photoInputRef.current.click()}>+ Photo</button>
                  <button className="feed-add-media-btn" onClick={() => videoInputRef.current.click()}>+ Video</button>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={photoInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  ref={videoInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
            </>
          )}
        </div>
        <PostCard />
      </div>
    </>
  );
}

export default FeedPage;
