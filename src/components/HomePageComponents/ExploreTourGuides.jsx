import React from "react";
import "./ExploreTourGuides.css";
import { useState , useEffect } from "react";


function ExploreTourGuides() {
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
      }
    };

    fetchTrips();
  }, [token]);
  return (
    <section className="ExploreTourGuides">
      <h3 className="ExploreTourGuides-title">Explore Tour Guides</h3>
      <div className="ExploreTourGuides-grid">
        {trips.map((trip) => (
          <div key={trip.id} className="ExploreTourGuides-card">
            <div className="ExploreTourGuides-image" style={{ backgroundImage: `url(${trip.picture})` }}>
              <div className="ExploreTourGuides-info">
                <h4>{trip.title}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ExploreTourGuides;
