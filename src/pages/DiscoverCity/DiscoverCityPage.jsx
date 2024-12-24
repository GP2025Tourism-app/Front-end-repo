import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import Sidebar from "../../components/HomePageComponents/Sidebar";
import { Nav, Carousel } from "react-bootstrap";
import "../ActivityPage/ActivityPage.css";
import "./DiscoverCity.css";
import SearchBar from "../../components/ReusableComp/SearchBar";
import WeatherWidget from "../../components/ReusableComp/Weather";
import areoplaneIcon from "../../assets/images/Icons/Airplane Take Off.svg";
import { useNavigate } from "react-router-dom";


function DiscoverCityDetails() {
  const [reviews, setReviews] = useState([]);
  const { id } = useParams(); // Extract city ID from the route
  const [city, setCity] = useState(null);
  const [weather, setWeather] = useState(null); // State for dynamic weather
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDescription, setShowDescription] = useState(false); // State to toggle description
  const [showBestTime, setShowBestTime] = useState(false); // State to toggle Best Time to Visit
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  // Fetch reviews for the city
  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/reviews/city/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.statusText}`);
      }

      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError(`Error fetching reviews: ${err.message}`);
    }
  };

  // Calculate average rating score
  const calculateTotalScore = () => {
    if (reviews.length === 0) return 0;
    const totalScore = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalScore / reviews.length; // Average score
  };

  // Fetch dynamic weather details
  const fetchWeather = async () => {
    if (city) {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.city}&appid=854e8c361934d0ec37dc83491a024a84&units=metric`);
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        console.error("Error fetching weather details:", err);
      }
    }
  };

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/cities/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCity(response.data);
        setLoading(false);
        fetchReviews();
      } catch (err) {
        console.error("Error fetching city details:", err);
        setError("Failed to load city details.");
        setLoading(false);
      }
    };

    fetchCity();
  }, [id]);

  useEffect(() => {
    fetchWeather();
  }, [city]);

  if (loading) {
    return <p>Loading city details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <WebsiteNavbar />
      <Sidebar />
      <div className="City-details">
        <div className="Search-tips-Container">
          <SearchBar />

          <Nav variant="underline" defaultActiveKey="City" className="activity-tabs">
            <Nav.Item>
              <Nav.Link eventKey="City">{city.city}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="places">Places</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="things-to-do">Things to Do</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="hidden-gems">Hidden Gems</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="restaurants">Restaurants</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="tour-guides">Tour Guides</Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        <div className="City-container">
          {/* City Title */}
          <div className="city-details-Tilte">
            <h2 className="city-name">{city.city}</h2>
          </div>
          <div className="rating">
            <span className="rating-score">{calculateTotalScore().toFixed(1)}</span>
            <span className="reviews">({reviews.length} reviews)</span>
          </div>
          {/* Full-width Carousel */}
          <Carousel className="city-carousel">
            {city.images.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={image}
                  alt={`Slide ${index + 1}`}
                />
              </Carousel.Item>
            ))}
          </Carousel>

          {/* City Details Section */}
          <div className="city-description-container">
            <div className="city-info-flex">
              {/* Description and Best Time to Visit under each other */}
              <div className="city-description-section">
                <p className="city-description">
                  {showDescription ? city.description : `${city.description.slice(0, 150)}...`}
                </p>
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="see-more-btn"
                >
                  {showDescription ? "See Less" : "See More"}
                </button>
              </div>
              <hr className="divider-city" />

              {/* Best Time to Visit */}
              <div className="best-time-section">
                <h3 className="best-time-to-visit">Best Time to Visit</h3>
                <div className="best-time-text">
                  <img className="aero-icon" src={areoplaneIcon} alt="calendar-icon" />
                  <p>
                    {showBestTime ? city.bestTimeToVisit : `${city.bestTimeToVisit?.slice(0, 100)}...`}
                  </p>
                </div>
                <button
                  onClick={() => setShowBestTime(!showBestTime)}
                  className="see-more-btn"
                >
                  {showBestTime ? "See Less" : "See More"}
                </button>
              </div>
            </div>
            {/* Weather Widget on the side */}
            <div className="weather-widget-container">
              <WeatherWidget weather={weather} />
            </div>
          </div>

          {/* Activities Section */}
          <div className="activities-section">
            <h3>Top Activities in {city.city}</h3>
            <div className="activities-grid">
              {city.topActivities.map((activity, index) => (
                <div key={index} className="activity-card-discover"
                onClick={() => navigate(`/activity/${activity.activityId}/city/${city.cityId}`)} >
                  <img src={activity.images[0]} alt={activity.name} className="activity-image" />
                  <div className="activity-info">
                  <h4>{activity.name}</h4>
                  <p>{activity.category}</p>
                </div>
                </div>
              ))}
            </div>
            
            <button className="see-more-activities-btn">See More</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DiscoverCityDetails;