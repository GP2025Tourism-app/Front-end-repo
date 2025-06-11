import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import Sidebar from "../../components/HomePageComponents/Sidebar";
import "./favourites.css";

function Favourites() {
  const [favorites, setFavorites] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await fetch("http://localhost:8080/api/user/clients/favorites", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const data = await response.json();
        setFavorites(data.favoriteActivities || []);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveClick = (activity, e) => {
    e.stopPropagation();
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedActivity) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/user/clients/favorites/activities/${selectedActivity.activityId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove favorite");
      }

      setFavorites((prev) => prev.filter((item) => item.activityId !== selectedActivity.activityId));
      setShowModal(false);
      setSelectedActivity(null);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const handleCardClick = (activity) => {
    navigate(`/activity/${activity.activityId}/city/${activity.cityId}`);
  };

  return (
    <>
      <WebsiteNavbar />
      <div className="favs-main-conatiner">
        <div className="favssidebar">
          <Sidebar />
        </div>
        <div className="fav-content-container">
          <div className="favourites-content">
            <h1 className="fav-title">Wishlist</h1>
            <div className="fav-activity-list">
              {favorites.length === 0 ? (
                <p>No favorites added yet.</p>
              ) : (
                favorites.map((activity) => (
                  <div
                    key={activity.activityId}
                    className="fav-activity-card"
                    onClick={() => handleCardClick(activity)}
                  >
                    <button className="fav-remove-btn" onClick={(e) => handleRemoveClick(activity, e)}>
                      <FaTimes className="fav-remove-icon" />
                    </button>
                    <img
                      src={activity.images && activity.images.length > 0 ? activity.images[0] : "default-image.jpg"}
                      alt={activity.name}
                      className="fav-activity-image"
                    />
                    <div className="fav-activity-info">
                      <h3>{activity.name}</h3>
                      <p>{activity.category}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {showModal && selectedActivity && (
          <div className="fav-modal-overlay">
            <div className="fav-modal-content">
              <h2 className="fav-modal-title">Delete this wishlist?</h2>
              <p className="fav-modal-message">
                "{selectedActivity.name}" will be permanently deleted from your wishlist.
              </p>
              <div className="fav-modal-actions">
                <button className="fav-cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="fav-delete-btn" onClick={handleConfirmRemove}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Favourites;
