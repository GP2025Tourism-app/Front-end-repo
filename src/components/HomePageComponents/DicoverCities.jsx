import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DiscoverCities.css";

function DiscoverCities() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/cities");
        const citiesData = response.data.map((city) => ({
          name: city.city,
          image: city.images[0], 
        }));
        setCities(citiesData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setError("Failed to load cities.");
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

 
  if (loading) {
    return <p>Loading cities...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }


  return (
    <section className="Discover-cities">
      <h3 className="Discover-cities-title">Discover Cities</h3>
      <div className="Discover-cities-grid">
        {cities.map((city, index) => (
          <div key={index} className="Discover-cities-card">
            <div
              className="Discover-cities-image"
              style={{ backgroundImage: `url(${city.image})` }}
            >
              <div className="Discover-cities-info">
                <h4>{city.name}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DiscoverCities;
