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
import LoadingScreen from "../../components/loadingscreen/loadingScreen"; 
import heartIcon from "../../assets/images/Icons/heart.svg"; 
import heartFilledIcon from "../../assets/images/Icons/heart-fill.svg"; 

function DiscoverCityDetails() {
  const [reviews, setReviews] = useState([]);
  const { id } = useParams(); 
  const [city, setCity] = useState(null);
  const [weather, setWeather] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDescription, setShowDescription] = useState(false); 
  const [showBestTime, setShowBestTime] = useState(false); 
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
 
  const [selectedCategory, setSelectedCategory] = useState("City"); 
  const [isCategoryFullScreen, setIsCategoryFullScreen] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const handleSelect = (eventKey) => {
    setSelectedCategory(eventKey);
    setIsCategoryFullScreen(eventKey !== "City");
  };

  const filteredActivities =
  city && city.topActivities
    ? selectedCategory === "City"
      ? city.topActivities
      : city.topActivities.filter((activity) => activity.type === selectedCategory)
    : [];


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

 
  const calculateTotalScore = () => {
    if (reviews.length === 0) return 0;
    const totalScore = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalScore / reviews.length; 
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/user/clients/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch favorites");
        const data = await response.json();
        const activityIds = data.favoriteActivities.map(act => act.activityId);
        setFavorites(activityIds);
        localStorage.setItem("favorites", JSON.stringify(activityIds));
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };
  
    fetchFavorites();
  }, []);
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
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/cities/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCity(response.data);
        await fetchReviews();
      } catch (err) {
        console.error("Error fetching city details:", err);
        setError("Failed to load city details.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCity();
    
   
    window.scrollTo(0, 0);
  }, [id]); 
  
  useEffect(() => {
    fetchWeather();
  }, [city]);
  useEffect(() => {
    console.log("City data loaded:", city);
  }, [city]);
  // Render the loading screen
  if (loading) {
    return <LoadingScreen isLoading={loading} />;
  }

  // Render error message if there is an error
  if (error) {
    return <p>{error}</p>;
  }
  
  const toggleFavorite = async (activityId) => {
    try {
  
      const isFavorite = favorites.includes(activityId);
      const method = isFavorite ? "DELETE" : "POST";
  
      const response = await fetch(`http://localhost:8080/api/user/clients/favorites/activities/${activityId}`, {
        method: method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to update favorite status");
      }
  
      setFavorites((prevFavorites) => {
        let updatedFavorites;
        if (isFavorite) {
          updatedFavorites = prevFavorites.filter((id) => id !== activityId);
        } else {
          updatedFavorites = [...prevFavorites, activityId];
        }
  
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        return updatedFavorites;
      });
  
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
  

  return (
    <>
      <WebsiteNavbar />
      <div className="Dicovercity-main-conatiner">
      <div className="Dicovercity-sidebar">
      <Sidebar />
      </div>
      <div className="City-details">
        <div className="discover-city-Search-tips-Container">
          <SearchBar />

          <Nav variant="underline" activeKey={selectedCategory} className="activity-tabs" onSelect={handleSelect} defaultActiveKey="City">
            <Nav.Item>
              <Nav.Link eventKey="City">{city.city}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Places">Places</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="ThingsToDo">Things to Do</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="HiddenGems">Hidden Gems</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Restaurants">Restaurants</Nav.Link>
            </Nav.Item>
            
          </Nav>
          </div>
          {isCategoryFullScreen ? (
          // Fullscreen category view
          <div className="activities-fullscreen">
            <h3 className="activtype">{selectedCategory.replace("-", " ")}</h3>
            <div className="activity-grid">
              {filteredActivities.map((activity, index) => (
                <div
                  key={index}
                  className="activity-card-discover"
                  onClick={() => navigate(`/activity/${activity.activityId}/city/${city.cityId}`)}
                >
                  <img src={activity.images[0]} alt={activity.name} className="activity-image" />
                  <div className="activity-info">
                  <button className="favorite-button" onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(activity.activityId);
                      }}>
                        <img 
                          src={favorites.includes(activity.activityId) ? heartFilledIcon : heartIcon} 
                          alt="Favorite" 
                        />
                      </button>

                    <h4>{activity.name}</h4>
                    <p>{activity.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ):(
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

            {["Places", "HiddenGems", "ThingsToDo", "Restaurants"].map((category) => (
              <div className="activities-section" key={category}>
                <h3>{category.replace("-", " ")}</h3>
                <div className="activities-grid">
                  {city.topActivities
                    .filter((activity) => activity.type === category)
                    .map((activity, index) => (
                      <div
                        key={index}
                        className="activity-card-discover"
                        onClick={() => navigate(`/activity/${activity.activityId}/city/${city.cityId}`)}
                      >
                        <img src={activity.images[0]} alt={activity.name} className="activity-image" />
                        <div className="activity-info">
                        <button className="favorite-button" onClick={(e) => {
                            e.stopPropagation(); 
                            toggleFavorite(activity.activityId);
                          }}>
                            <img src={favorites.includes(activity.activityId) ? heartFilledIcon : heartIcon} alt="Favorite" />
                          </button>
                          <h4>{activity.name}</h4>
                          <p>{activity.category}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
       
      </div>
      </div>
    </>
  );
}

export default DiscoverCityDetails;