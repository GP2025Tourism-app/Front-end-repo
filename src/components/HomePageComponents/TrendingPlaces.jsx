import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./trendingplaces.css";

function TrendingPlaces() {
  const [trendingData, setTrendingData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const cityId = "6769dcffd8210d27733d4d12"; 
  const token = localStorage.getItem("authToken"); 
  const navigate = useNavigate();

  useEffect(() => {
   
    const fetchTrendingPlaces = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch(`http://localhost:8080/api/cities/${cityId}/activities`, {
          method: "GET", 
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`); 
        }
        
        const data = await response.json(); 
        setTrendingData(data); 
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };

    if (token) { 
      fetchTrendingPlaces();
    } else {
      setError("No token found in localStorage.");
    }
  }, [cityId, token]); 

 
  if (loading) {
    return <div className="loading">Loading Trending Places...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  const handleCardClick = (activityId) => {
    navigate(`/activity/${activityId}`); 
  };
  return (
    <section className="trending-places">
      <h3 className="trending-places-title">Trending Places</h3>
      <div className="places-grid">
        {trendingData.map((place, index) => (
          <div key={index} 
          onClick={() => handleCardClick(place.activityId)}
          className="place-card">
            <div
              className="place-image"
              style={{ backgroundImage: `url(${place.images[0]})` }}
            >
              <div className="place-info">
                <h4>{place.name}</h4>
                <p>{place.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrendingPlaces;
