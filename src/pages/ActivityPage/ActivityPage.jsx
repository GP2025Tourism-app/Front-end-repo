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
  const mapRef = useRef(null);  
  const mapInstance = useRef(null); 

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Fetch all city data
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

  // Fetch activity data
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

      // Get the address using reverse geocoding
      if (data.location) {
        getAddress(data.location.latitude, data.location.longitude);
      }
    } catch (err) {
      setError(`Error fetching activity data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Get city name by cityId
  const getCityName = () => {
    if (cityData.length > 0) {
      const city = cityData.find((city) => city.cityId === cityId);
      return city ? city.city : "City not found";
    }
    return "City data unavailable";
  };

  // Fetch address from latitude and longitude using OpenCage API
  const getAddress = async (latitude, longitude) => {
    const apiKey = '6140c3721b354363bf3b58c5b3e069c7';  
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&language=en`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results[0]) {
        setAddress(data.results[0].formatted); // Set the address state
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
      // Clean up previous map instance if it exists
      if (mapInstance.current) {
        mapInstance.current.remove(); // Remove the existing map instance
      }

      // Initialize a new map instance
      const map = L.map(mapRef.current).setView([activityData.location.latitude, activityData.location.longitude], 13);
      mapInstance.current = map;  // Store the map instance in the ref

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Define a custom icon for the marker
      const customIcon = L.icon({
        iconUrl: 'https://png.pngtree.com/png-vector/20230601/ourmid/pngtree-red-location-icon-vector-design-png-image_7115327.png',  // Use the appropriate icon image
        iconSize: [32, 32],   // Set the size of the icon
        iconAnchor: [16, 32], // Anchor the icon to the bottom center
        popupAnchor: [0, -32], // Set the popup position above the icon
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
        {/* Search Bar */}
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

          {/* Tabs for City and Categories */}
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
    
        {/* Flex Container for Activity Details and Image Gallery */}
        <div className="flex-container">
          {/* Activity Details */}
          <div className="activity-details-Tilte">
            <h2 className="activity-name">{activityData.name}</h2>
            <div className="activity-info-box">
              <div className="rating">
                <span className="rating-score">4.5</span>
                <span className="reviews">(120 reviews)</span>
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
            {/* Additional Tips */}
            <div className="additional-tips">
              <h3 className='additional-tips-title'>Additional Tips</h3>
              <div className="row">
                {/* Best Time to Visit */}
                {activityData.additionalTips.bestTimeToVisit && (
                  <div className="tip-item">
                    <img src={CalendarIcon} alt="Best Time" className="tip-icon" />
                    <span>{activityData.additionalTips.bestTimeToVisit}</span>
                  </div>
                )}

                {/* What to Wear */}
                {activityData.additionalTips.whatToWear && (
                  <div className="tip-item">
                    <img src={clothesIcon} alt="What to Wear" className="tip-icon" />
                    <span>{activityData.additionalTips.whatToWear}</span>
                  </div>
                )}
              </div>

              <div className="row">
                {/* Photography Fees */}
                {activityData.additionalTips.photographyFees && (
                  <div className="tip-item">
                    <img src={cameraIcon} alt="Photography Fees" className="tip-icon" />
                    <span>{activityData.additionalTips.photographyFees}</span>
                  </div>
                )}

                {/* Extra Fees */}
                {activityData.additionalTips.extraFees && (
                  <div className="tip-item">
                    <img src={moneyIcon} alt="Extra Fees" className="tip-icon" />
                    <span>{activityData.additionalTips.extraFees}</span>
                  </div>
                )}
              </div>

              <div className="row">
                {/* Notes */}
                {activityData.additionalTips.notes && (
                  <div className="tip-item">
                    <img src={notesIcon} alt="Notes" className="tip-icon" />
                    <span>{activityData.additionalTips.notes}</span>
                  </div>
                )}
              </div>
            </div>
            <hr className="divider-part" />
            {/* Map Container */}
            <div className="flex-container-map">
                {/* Address on the left side */}
                <div className="address-container" style={{ flex: 1, paddingRight: '20px' }}>
                  <h3 className='area'>Area</h3>
                  <p className='address'>{address}</p>
                </div>

                {/* Map on the right side */}
                <div ref={mapRef} style={{ height: '500px', width: '35%', borderRadius: '15px' }}></div>
              </div>
              <hr className="divider-part" />
              
          </div>
        </div>
      </div>
    </>
  );
}

export default ActivityPage;
