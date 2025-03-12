import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import WebsiteNavbar from '../../components/HomePageComponents/WebsiteNavbar';
import Sidebar from '../../components/HomePageComponents/Sidebar';
import CalendarIcon from "../../assets/images/Icons/calendar-event.svg";
import clothesIcon from "../../assets/images/Icons/T-Shirt.svg";
import cameraIcon from "../../assets/images/Icons/camera.svg";
import notesIcon from "../../assets/images/Icons/journal-plus.svg";
import moneyIcon from "../../assets/images/Icons/cash-stack.svg";
import transportationIcon from "../../assets/images/Icons/PublicTransportation.svg";
import { Nav } from 'react-bootstrap';
import './ActivityPage.css';
import ActivityCard from '../../components/Activities/ActivityDetailsCard';
import ReviewCard from '../../components/Activities/ReviewCard';
import L from 'leaflet';  
import 'leaflet/dist/leaflet.css';  
import SearchBar from '../../components/ReusableComp/SearchBar';
import LoadingScreen from '../../components/loadingscreen/loadingScreen';
import ReviewModal from '../../components/Activities/ReviewModal';

function ActivityPage() {
  const { activityId, cityId } = useParams();
  const [activityData, setActivityData] = useState(null);
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState('');
  const [error, setError] = useState(null);
  const [address, setAddress] = useState(""); 
  const token = localStorage.getItem("authToken");
  const [searchQuery, setSearchQuery] = useState("");
  const [reviews, setReviews] = useState([]); 
  const mapRef = useRef(null);  
  const mapInstance = useRef(null); 
  const [showReviewModal, setShowReviewModal] = useState(false);

  
  const nearbyRestaurants = [
    { name: "Branzino Fish", rating: 4.5 },
    { name: "Pasta Palace", rating: 5 },
    { name: "Burger Barn", rating: 3},
  ];

  const nearbyAttractions = [
    { name: "Art Museum", rating: 4 },
    { name: "Botanical Gardens", rating: 4.5 },
    { name: "Historic Castle", rating: 5 },
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleOpenModal = () => {
    console.log("Opening modal"); 
    setIsReviewModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log("Closing modal"); 
    setIsReviewModalOpen(false);
  };

    const entityType = activityId ? "activity" : "unknown";
    const entityId =  activityId;

   const handleSubmitReview = async (review) => {
    console.log("Review submitted:", review);


    // Construct review data
    const reviewData = {
        activityId,         comment: review.comment,
        rating: review.rating,
    };

    try {
        const response = await fetch("http://localhost:8080/api/reviews", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reviewData),
        });

        if (!response.ok) {
            throw new Error("Failed to submit review");
        }

        const responseData = await response.json();
        console.log("Review successfully submitted:", responseData);
        alert("Review submitted successfully!");
    } catch (error) {
        console.error("Error submitting review:", error);
        alert("Error submitting review. Please try again.");
    }
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
    setLoading(true);
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
    return totalScore / reviews.length; 
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
    return <LoadingScreen isLoading={loading} />;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!activityData) {
    return <div className="error-message">Activity data not found</div>;
  }

  return (
    <>
      <LoadingScreen isLoading={loading} />
      <WebsiteNavbar />
      <Sidebar />
      <div className="activity-container">
        <div className='Search-tips-Container'>
         <SearchBar/>

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
                {activityData.additionalTips.transportation && (
                  <div className="tip-item">
                    <img src={transportationIcon} alt="Notes" className="tip-icon" />
                    <span>{activityData.additionalTips.transportation}</span>
                  </div>
                )}
              </div>
            </div>
            <hr className="divider-part" />
            <div className="flex-container-map">
    <div className="address-container">
        <h3 className='area'>Area</h3>
        <p className='address'>{address}</p>
        <h3 className='nearby-title'>Best Nearby</h3>
        <div className="nearby-container">
          
        <div className="nearby-section">
    <h4 className='nearby-restaurant'>Restaurants</h4>
    <p>{nearbyRestaurants.length} within 3 miles</p>
    {nearbyRestaurants.map((restaurant, index) => (
        <div key={index} className="nearby-item">
            <img src={restaurant.image ||'https://via.placeholder.com/150'} alt={restaurant.name} className="nearby-image" />
            <div className="nearby-details">
                <p>{restaurant.name}</p>
                <div className="rating-stars">
                    {Array.from({ length: 5 }, (v, i) => {
                        if (i < Math.floor(restaurant.rating)) {
                            return <span key={i} className="star filled">★</span>; // Filled star
                        } else if (i === Math.floor(restaurant.rating) && restaurant.rating % 1 !== 0) {
                            return <span key={i} className="star half-filled">★</span>; // Half-filled star
                        } else {
                            return <span key={i} className="star">★</span>; // Unfilled star
                        }
                    })}
                </div>
            </div>
        </div>
    ))}
    <a href="#">See all</a>
</div>


          <div className="nearby-section">
              <h4 className='nearby-attractions'>Attractions</h4>
              <p className='nearby-distance'>{nearbyAttractions.length} within 6 miles</p>
              {nearbyAttractions.map((attraction, index) => (
                  <div key={index} className="nearby-item">
                      <img src={attraction.image || 'https://via.placeholder.com/150'} alt={attraction.name} className="nearby-image" />
                      <div className="nearby-details">
                          <p className='nearby-attraction-name'>{attraction.name}</p>
                          <div className="rating-stars">
                    {Array.from({ length: 5 }, (v, i) => {
                        if (i < Math.floor(attraction.rating)) {
                            return <span key={i} className="star filled">★</span>; // Filled star
                        } else if (i === Math.floor(attraction.rating) && attraction.rating % 1 !== 0) {
                            return <span key={i} className="star half-filled">★</span>; // Half-filled star
                        } else {
                            return <span key={i} className="star">★</span>; // Unfilled star
                        }
                    })}
                </div>
                      </div>
                  </div>
              ))}
              <a href="#">See all</a>
          </div>
      </div>
    </div>

    <div ref={mapRef} style={{ height: '500px', width: '35%', borderRadius: '15px' }}></div>
</div>
              <hr className="divider-part" />

            <div className="reviews-section">
              <h3 className='review-title'>Customer Reviews</h3>
              <div className="review-summary">
              <div className="rating">
                <span className="rating-score">{calculateTotalScore().toFixed(1)}</span>
                <span className="reviews">({reviews.length} reviews)</span>
              </div>
              </div>
              <div className='ReviewsButton'>
              <button className="filter-button">Filter</button>
              <button className="write-review-button" onClick={handleOpenModal}>
              Write a Review
              </button>
              </div>
              <ReviewModal 
          isOpen={isReviewModalOpen} 
          closeModal={handleCloseModal} 
          submitReview={handleSubmitReview} 
        />


             
              {reviews.map((review, index) => (
                <ReviewCard key={index} review={{
                  name: `${review.user.firstname} ${review.user.lastname}`,  // Concatenate first and last names
                  image: review.user.image ,
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