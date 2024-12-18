import React, { useState, useEffect } from "react";
import "./trendingplaces.css";

function TrendingPlaces() {
  const [trendingData, setTrendingData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const cityId = "6761b725f094131ce8b66c38"; 
  const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage

  useEffect(() => {
    // Fetch data from API when the component loads
    const fetchTrendingPlaces = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch(`http://localhost:8080/api/cities/${cityId}/activities`, {
          method: "GET", 
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`); // Handle non-200 responses
        }
        
        const data = await response.json(); // Parse JSON data
        setTrendingData(data); // Set the fetched data
      } catch (err) {
        setError(err.message); // Capture error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (token) { // Ensure there's a token in localStorage
      fetchTrendingPlaces();
    } else {
      setError("No token found in localStorage."); // Handle case when there's no token
    }
  }, [cityId, token]); // Refetch if cityId or token changes

  // Render loading or error state if necessary
  if (loading) {
    return <div className="loading">Loading Trending Places...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <section className="trending-places">
      <h3 className="trending-places-title">Trending Places</h3>
      <div className="places-grid">
        {trendingData.map((place, index) => (
          <div key={index} className="place-card">
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