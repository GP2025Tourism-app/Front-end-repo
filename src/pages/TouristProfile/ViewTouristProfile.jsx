import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaMapMarkerAlt, FaBirthdayCake, FaRegHeart, FaRegComment } from "react-icons/fa";
import { BsFillPersonFill } from "react-icons/bs";
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import Sidebar from "../../components/HomePageComponents/Sidebar";
import CoverPhotoDefault from "../../assets/images/default-cover-photo.png";
import ProfilePicDefault from "../../assets/images/default-profile-pic.jpg";
import "./ViewTouristProfile.css";
import LGSidebar from "../../components/LocalGuide/LG-Sidebar";

function ViewTouristProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const avatar = localStorage.getItem("profilePic");
  const userRoles = JSON.parse(localStorage.getItem("userRole")) || [];
  const [visibleComments, setVisibleComments] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    // Fetch user profile
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
        setLoadingProfile(false);
        if (data.profilePic) {
          localStorage.setItem("profilePic", data.profilePic);
        } else {
          localStorage.setItem("profilePic", ProfilePicDefault);
        }
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setLoadingProfile(false);
      });

    // Fetch user posts
    fetch("http://localhost:8080/api/user/posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setLoadingPosts(false);
     
   
    })

      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoadingPosts(false);
      });
  }, []);

  if (loadingProfile || loadingPosts) {
    return <p>Loading profile and posts...</p>;
  }

  if (!profile) {
    return <p>Failed to load profile.</p>;
  }
  const toggleComments = (postId) => {
    setVisibleComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };
  
  return (
    <>
      <WebsiteNavbar />
      <div className="viewprofile-page-container">
      <div className="viewprofile-sidebar-container">
        {userRoles.includes("ROLE_LocalGuide") ? <LGSidebar /> : <Sidebar />}
      </div>
      <div className="view_tourist_profile_container">
        <div className="view-tourist-profile-header">
          <img src={profile.coverPhoto || CoverPhotoDefault} alt="Cover" className="view-tourist-cover-image" />
          <div className="view-tourist-profile-picture">
            <img src={profile.profilePic || ProfilePicDefault} alt="Profile" />
          </div>
        </div>
        <div className="view-tourist-profile-body">
          <div className="view-tourist-profile-info">
            <div className="view-tourist-info-name-bio">
              <h2 className="view-tourist-profile-name">
                {profile.firstname && profile.lastname
                  ? `${profile.firstname} ${profile.lastname}`
                  : profile.username}
              </h2>
              <p className="view-tourist-profile-role">{profile.bio || "Traveler"}</p>
            </div>
            <button className="view-tourist-edit-profile" onClick={() => navigate("/EditTouristProfile")}>
              <FaEdit /> Edit Profile
            </button>
          </div>
          <div className="view-tourist-profile-details">
            <div className="view-tourist-about">
              <h5>About</h5>
              <p><BsFillPersonFill className="view-profile-about-icon" /> {profile.username}</p>
              <p><FaMapMarkerAlt className="view-profile-about-icon" /> {profile.address || "Location not specified"}</p>
              <p className="view-tourist-profile-birthday">
                <FaBirthdayCake className="view-profile-about-icon" /> {profile.birthday ? `Born ${profile.birthday}` : "Birthdate not available"}
              </p>
            </div>
            <div className="view-tourist-posts">
              <h5>My Posts</h5>
              {posts.length === 0 ? (
                <p>No posts available.</p>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="user-profile-post-card">
                    <div className="user-profile-post-header">
                      <img src={avatar || ProfilePicDefault} alt="User" className="user-profile-post-profile-pic" />
                      <div>
                        <h6>{`${post.user.firstname} ${post.user.lastname}`}</h6>
                        <p>@{post.user.username}</p>
                        <p>{new Date(post.dateTime).toLocaleString()}</p>
                      </div>
                    </div>
                    <h6 className="user-profile-post-title">{post.title}</h6>
                    <p className="user-profile-post-text">{post.caption}</p>
                    {post.visualsUrl && post.visualsUrl.length > 0 && (
                      <div className="user-profile-post-media">
                        {post.visualsUrl.map((url, index) => (
                          url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg") ? (
                            <video key={index} controls className="user-profile-post-video">
                              <source src={url} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <img key={index} src={url} alt="Post" className="user-profile-post-image" />
                          )
                        ))}
                      </div>
                    )}
                    <div className="user-profile-post-actions">
                      <button><FaRegHeart /> {post.likedUsr ? post.likedUsr.length : 0} Likes</button>
                      <button onClick={() => toggleComments(post.id)}>
  <FaRegComment /> {post.comments ? post.comments.length : 0} Comments
</button>

                    </div>
                    {visibleComments[post.id] && post.comments && post.comments.length > 0 && (
  <div className="user-profile-post-comments">
    <h6>Comments</h6>
    {post.comments.map((comment, index) => (
      <div key={index} className="comment-container">
       <div className="comment-header">
        <img src={comment.user.profilePic} alt="Commenter Avatar" className="comment-avatar" />
        <p className="comment-user">
          {comment.user?.firstname && comment.user?.lastname
            ? `${comment.user.firstname} ${comment.user.lastname}`
            : "Unknown User"}
        </p>
</div>
        <div className="comment-box">
          {comment.caption}
          <span className="comment-date">
            {comment.dateTime ? new Date(comment.dateTime).toLocaleString() : ""}
          </span>
        </div>
      </div>
    ))}
  </div>
)}


                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default ViewTouristProfile;
