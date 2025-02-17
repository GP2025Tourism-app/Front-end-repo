import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import "./Recommendations.css";

function Recommendations() {
  // State to hold the recommendations data
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate(); // Hook to navigate to another route
  
  // Fetch recommendations data from backend
  useEffect(() => {
    // Fetch data from the Flask API
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get("http://localhost:8080/ai/recommend", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Assuming the response has a list of recommended activities
        setRecommendations(response.data); 
      } catch (err) {
        setError("Error fetching recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [token]);

  if (loading) {
    return <div>Loading recommendations...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleCardClick = (activityId, cityId) => {
    // Navigate to the activity page with the given activityId and cityId
    navigate(`/activity/${activityId}/city/${cityId}`);
  };

  return (
    <section className="recommendations">
      <h3 className="recommendations-title">Recommendations</h3>
      <div className="recommendation-grid">
        {recommendations.map((item) => (
          <div
            key={item.activityId}
            className="recommendation-card"
            onClick={() => handleCardClick(item.activityId, item.cityId)} // Use cityId if available
          >
            <div
              className="recommendation-image"
              style={{
                backgroundImage: `url(${item.images[0]})`, // Using the first image from the list
              }}
            ></div>
            <div className="recommendation-info">
              <h4>{item.name}</h4>
              <p>{item.category}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Recommendations;
