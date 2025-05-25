import React from "react";
import "./ExploreTourGuides.css";
import { useState , useEffect } from "react";
import { useNavigate } from 'react-router-dom';


function ExploreTourGuides() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("http://localhost:8080/trip/all", {
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
      }
    };

    fetchTrips();
  }, [token]);

  const handleCardClick = (tripId) => {
    navigate(`/localGuide-View-trips/${tripId}`);
  };
  return (
    <section className="ExploreTourGuides">
      <h3 className="ExploreTourGuides-title">Explore Tour Guide Trips</h3>
      <div className="ExploreTourGuides-grid">
        {trips.map((trip) => (
          <div key={trip.id}
          onClick={() => handleCardClick(trip.id)}
           className="ExploreTourGuides-card">
            <div className="ExploreTourGuides-image" style={{ backgroundImage: `url(${trip.picture})` }}>
              <div className="ExploreTourGuides-info">
              <h4>{trip.city.cityName ||""}</h4>
                <p>{trip.title}</p>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ExploreTourGuides;
