import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import Sidebar from "../../components/HomePageComponents/Sidebar";
import CoverPhotoDefault from "../../assets/images/default-cover-photo.png";
import ProfilePicDefault from "../../assets/images/default-profile-pic.jpg";
import { FaCamera } from "react-icons/fa";
import "./EditTouristProfile.css";
import LGSidebar from "../../components/LocalGuide/LG-Sidebar";

const CLOUD_NAME = "da6gcu1n9";
const UPLOAD_PRESET = "graduationproject";

function EditTouristProfile() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        address: "",
        birthday: "",
        bio: "",
        profilePic: ProfilePicDefault, 
        coverPhoto: CoverPhotoDefault, 
        location: "",       
        workingDays: "",    
    });
    
    const [modifiedFields, setModifiedFields] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("authToken");
    const userRoles = JSON.parse(localStorage.getItem("userRole")) || [];

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/user/profile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }

            const data = await response.json();
            setUserData(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleFileUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("Error uploading file:", error);
            return null;
        }
    };

    const handleProfilePicChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const imageUrl = await handleFileUpload(file);
        if (imageUrl) {
            setUserData((prev) => ({ ...prev, profilePic: imageUrl }));
            setModifiedFields((prev) => ({ ...prev, profilePic: imageUrl }));
        }
    };

    const handleCoverPhotoChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const imageUrl = await handleFileUpload(file);
        if (imageUrl) {
            setUserData((prev) => ({ ...prev, coverPhoto: imageUrl }));
            setModifiedFields((prev) => ({ ...prev, coverPhoto: imageUrl }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
        setModifiedFields({ ...modifiedFields, [name]: value });
    };

    const handleSave = async () => {
        if (Object.keys(modifiedFields).length === 0) {
            alert("No changes made.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/user/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(modifiedFields),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            alert("Profile updated successfully!");
            setModifiedFields({});
            navigate("/ViewTouristProfile");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <WebsiteNavbar />
            <div className="editprofile-page-container">
                <div className="editprofile-sidebar-container">
                    {userRoles.includes("ROLE_LocalGuide") ? <LGSidebar /> : <Sidebar />}
                </div>
                <div className="Edit-tourist-profile-container">
                    
                       
                        <div className="Edit-tourist-cover-photo">
                            <img src={userData.coverPhoto || CoverPhotoDefault} alt="Cover" />
                            <label className="Edit-tourist-edit-cover">
                                Edit Cover Photo
                                <input type="file" accept="image/*" onChange={handleCoverPhotoChange} style={{ display: "none" }} />
                            </label>
                        </div>

                        <div className="Edit-tourist-profile-picture">
                            <img src={userData.profilePic || ProfilePicDefault} alt="Profile" />
                            <label className="Edit-tourist-camera-icon">
                                <FaCamera className="edit-tourist-FaCamera-icon" />
                                <input type="file" accept="image/*" onChange={handleProfilePicChange} style={{ display: "none" }} />
                            </label>
                        </div>

                        <button className="Edit-tourist-save-button" onClick={handleSave} disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </button>
                        <div className="Edit-tourist-profile-form">
                          
                        {/* Conditional rendering for LocalGuide */}
                        {userRoles.includes("ROLE_LocalGuide") ? (
                            <>
                                <div className="Edit-tourist-form-row-localguide">
                                    {/* Left Side for Bio */}
                                    <div className="Edit-tourist-bio-localguide">
                                        <label>Bio</label>
                                        <textarea
                                            name="bio"
                                            placeholder="Write here..."
                                            value={userData.bio}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Right Side for Location and Working Days */}
                                    <div className="Edit-tourist-form-col-localguide">
                                        <div className="Edit-tourist-form-group-localguide">
                                            <label>Location</label>
                                            <input
                                                type="text"
                                                name="location"
                                                placeholder="Your Location"
                                                value={userData.location}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="Edit-tourist-form-group-localguide">
                                            <label>Working Days</label>
                                            <input
                                                type="text"
                                                name="workingDays"
                                                placeholder="Your Working Days"
                                                value={userData.workingDays}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            // Bio section for clients
                            <div className="Edit-tourist-form-row">
                                <div className="Edit-tourist-bio">
                                    <label>Bio</label>
                                    <textarea
                                        name="bio"
                                        placeholder="Write here..."
                                        value={userData.bio}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                            <div className="Edit-tourist-form-row">
                                <div className="Edit-tourist-form-group">
                                    <label>First Name</label>
                                    <input type="text" name="firstname" placeholder="Your First Name" value={userData.firstname} onChange={handleChange} />
                                </div>
                                <div className="Edit-tourist-form-group">
                                    <label>Address</label>
                                    <input type="text" name="address" placeholder="Your Address" value={userData.address} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="Edit-tourist-form-row">
                                <div className="Edit-tourist-form-group">
                                    <label>Last Name</label>
                                    <input type="text" name="lastname" placeholder="Your Last Name" value={userData.lastname} onChange={handleChange} />
                                </div>
                                <div className="Edit-tourist-form-group">
                                    <label>Birthday</label>
                                    <input type="text" name="birthday" placeholder="YYYY/MM/DD" value={userData.birthday} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="Edit-tourist-form-row">
                                <div className="Edit-tourist-form-group">
                                    <label>Username</label>
                                    <input type="text" name="username" placeholder="Your User Name" value={userData.username} onChange={handleChange} />
                                </div>
                                <div className="Edit-tourist-form-group">
                                    <label>Email</label>
                                    <input type="email" name="email" placeholder="Your Email" value={userData.email} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {error && <p className="error-message">{error}</p>}
                    </div>
                </div>
       
        </>
    );
}

export default EditTouristProfile;
