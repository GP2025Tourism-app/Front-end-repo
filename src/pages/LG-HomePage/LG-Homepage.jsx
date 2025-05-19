import React, { useState, useEffect } from "react";
import './LG-Homepage.css';
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import LGSidebar from "../../components/LocalGuide/LG-Sidebar";
import { FaPlus } from 'react-icons/fa';
import { IoFilterCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

function LgHomepage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("http://localhost:8080/trip", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
        // Optionally set an error state to display a message to the user
      }
    };

    fetchTrips();
  }, [token]);

  const handleCardClick = (tripId) => {
    navigate(`/localGuide-View-trips/${tripId}`); // Navigate with the trip ID
  };

  const handlePlanNewTripClick = () => {
    navigate('/plan-new-trip');
  };

  return (
    <>
      <WebsiteNavbar />
      <div className="localguide-home-container">
        <div className="localguide-home-sidebar">
          <LGSidebar />
        </div>
        <div className="lg-homepage-container">
          <div className="my-trips-section">
            <div className="my-trips-header">
              <h2>My Trips</h2>
              <div className="lg-homepage-buttons">
                
                <button className="plan-new-trip-button" onClick={handlePlanNewTripClick}>
                  <FaPlus /> Plan New Trip
                </button>
              </div>
            </div>
            <div className="trip-cards place-new-trips-grid">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  onClick={() => handleCardClick(trip.id)}
                  className="trip-card place-new-trip-card"
                >
                  <div
                    className="place-new-trip-image"
                    style={{ backgroundImage: `url(${trip.picture || 'https://via.placeholder.com/150'})` }} // Use trip.picture and a placeholder if null
                  >
                    <div className="place-new-trip-info">
                      <h4>{trip.title}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LgHomepage;