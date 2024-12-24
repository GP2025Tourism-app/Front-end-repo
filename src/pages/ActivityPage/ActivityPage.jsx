import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import WebsiteNavbar from '../../components/HomePageComponents/WebsiteNavbar';
import Sidebar from '../../components/HomePageComponents/Sidebar';
import searchIcon from "../../assets/images/Icons/zoom-in.svg";
import CalendarIcon from "../../assets/images/Icons/calendar-event.svg";
import clothesIcon from "../../assets/images/Icons/T-Shirt.svg";
import cameraIcon from "../../assets/images/Icons/camera.svg";
import notesIcon from "../../assets/images/Icons/journal-plus.svg";
import moneyIcon from "../../assets/images/Icons/cash-stack.svg";
import { Nav } from 'react-bootstrap';
import './ActivityPage.css';
import ActivityCard from '../../components/Activities/ActivityDetailsCard';
import ReviewCard from '../../components/Activities/ReviewCard'; // Import the ReviewCard
import L from 'leaflet';  
import 'leaflet/dist/leaflet.css';  

function ActivityPage() {
  const { activityId } = useParams();
  const [activityData, setActivityData] = useState(null);
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState('');
  const [error, setError] = useState(null);
  const [address, setAddress] = useState(""); 
  const cityId = "67684edf75fa800e5517a7c1";
  const token = localStorage.getItem("authToken");
  const [searchQuery, setSearchQuery] = useState("");
  const [reviews, setReviews] = useState([]); // State for reviews
  const mapRef = useRef(null);  
  const mapInstance = useRef(null); 

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const fetchCityList = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/cities", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch cities: ${response.statusText}`);
      }

      const data = await response.json();
      setCityData(data);
    } catch (err) {
      setError(`Error fetching city list: ${err.message}`);
    }
  };

  const fetchActivityData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/cities/${cityId}/activities/${activityId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch activity: ${response.statusText}`);
      }

      const data = await response.json();
      setActivityData(data);
      setImages(data.images);

      if (data.location) {
        getAddress(data.location.latitude, data.location.longitude);
      }

      fetchReviews();
    } catch (err) {
      setError(`Error fetching activity data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/reviews/activity/${activityId}`, {
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
    return totalScore / reviews.length; // Average score
  };

  const getCityName = () => {
    if (cityData.length > 0) {
      const city = cityData.find((city) => city.cityId === cityId);
      return city ? city.city : "City not found";
    }
    return "City data unavailable";
  };

  const getAddress = async (latitude, longitude) => {
    const apiKey = '6140c3721b354363bf3b58c5b3e069c7';  
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&language=en`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results[0]) {
        setAddress(data.results[0].formatted);
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Failed to retrieve address');
    }
  };

  useEffect(() => {
    fetchCityList();
    if (activityId) {
      fetchActivityData();
    } else {
      setError('Activity ID is missing.');
    }
  }, [activityId, cityId]);

  useEffect(() => {
    if (activityData && activityData.location && mapRef.current) {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }

      const map = L.map(mapRef.current).setView([activityData.location.latitude, activityData.location.longitude], 13);
      mapInstance.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const customIcon = L.icon({
        iconUrl: 'https://png.pngtree.com/png-vector/20230601/ourmid/pngtree-red-location-icon-vector-design-png-image_7115327.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      L.marker([activityData.location.latitude, activityData.location.longitude], { icon: customIcon }).addTo(map)
        .bindPopup(activityData.name)
        .openPopup();
    }
  }, [activityData]);

  if (loading) {
    return <div>Loading activity...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!activityData) {
    return <div className="error-message">Activity data not found</div>;
  }

  return (
    <>
      <WebsiteNavbar />
      <Sidebar />
      <div className="activity-container">
        <div className='Search-tips-Container'>
          <div className="sticky-search-bar-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-bar-activity"
            />
            <img src={searchIcon} alt="Search Icon" className="search-bar-activity-icon" />
          </div>

          <Nav variant="underline" defaultActiveKey="City" className="activity-tabs">
            <Nav.Item>
              <Nav.Link eventKey="City">{getCityName()}</Nav.Link>
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
    
        <div className="flex-container">
          <div className="activity-details-Tilte">
            <h2 className="activity-name">{activityData.name}</h2>
            <div className="activity-info-box">
              <div className="rating">
                <span className="rating-score">{calculateTotalScore().toFixed(1)}</span>
                <span className="reviews">({reviews.length} reviews)</span>
              </div>
              <span className="dot">•</span>
              <span className="category">{activityData.category}</span>
            </div>
            <div className="flex-container">
              <div className="activity-details">
                <ActivityCard activity={activityData} />
              </div>
              <div className="image-gallery">
                <img src={currentImage || (images.length > 0 ? images[0] : '')} alt="Large view" className="large-image" />
                <div className="thumbnail-container">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="thumbnail"
                      onMouseEnter={() => setCurrentImage(image)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <hr className="divider-part" />
            <div className="additional-tips">
              <h3 className='additional-tips-title'>Additional Tips</h3>
              <div className="row">
                {activityData.additionalTips.bestTimeToVisit && (
                  <div className="tip-item">
                    <img src={CalendarIcon} alt="Best Time" className="tip-icon" />
                    <span>{activityData.additionalTips.bestTimeToVisit}</span>
                  </div>
                )}

                {activityData.additionalTips.whatToWear && (
                  <div className="tip-item">
                    <img src={clothesIcon} alt="What to Wear" className="tip-icon" />
                    <span>{activityData.additionalTips.whatToWear}</span>
                  </div>
                )}
              </div>

              <div className="row">
                {activityData.additionalTips.photographyFees && (
                  <div className="tip-item">
                    <img src={cameraIcon} alt="Photography Fees" className="tip-icon" />
                    <span>{activityData.additionalTips.photographyFees}</span>
                  </div>
                )}

                {activityData.additionalTips.extraFees && (
                  <div className="tip-item">
                    <img src={moneyIcon} alt="Extra Fees" className="tip-icon" />
                    <span>{activityData.additionalTips.extraFees}</span>
                  </div>
                )}
              </div>

              <div className="row">
                {activityData.additionalTips.notes && (
                  <div className="tip-item">
                    <img src={notesIcon} alt="Notes" className="tip-icon" />
                    <span>{activityData.additionalTips.notes}</span>
                  </div>
                )}
              </div>
            </div>
            <hr className="divider-part" />
            <div className="flex-container-map">
                <div className="address-container" style={{ flex: 1, paddingRight: '20px' }}>
                  <h3 className='area'>Area</h3>
                  <p className='address'>{address}</p>
                </div>

                <div ref={mapRef} style={{ height: '500px', width: '35%', borderRadius: '15px' }}></div>
              </div>
              <hr className="divider-part" />

            <div className="reviews-section">
              <h3>Customer Reviews</h3>
              <div className="review-summary">
              <div className="rating">
                <span className="rating-score">{calculateTotalScore().toFixed(1)}</span>
                <span className="reviews">({reviews.length} reviews)</span>
              </div>
              </div>
              <div className='ReviewsButton'>
              <button className="filter-button">Filter</button>
              <button className="write-review-button">Write a review</button>
              </div>
              {reviews.map((review, index) => (
                <ReviewCard key={index} review={{
                  username: review.userId, 
                  rating: review.rating,
                  date: new Date(review.reviewDate).toLocaleDateString(),
                  text: review.comment,
                }} />
              ))}
              <div className="view-more-reviews">
                <a href="#">View more Reviews</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ActivityPage;