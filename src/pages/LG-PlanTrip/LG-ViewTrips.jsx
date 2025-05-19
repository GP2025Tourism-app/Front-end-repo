import React, { useState, useEffect, useRef } from "react";
import "./LG-ViewTrips.css";
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import LGSidebar from "../../components/LocalGuide/LG-Sidebar";
import "./LG-PlanNewTrip.css";
import CoverPhotoDefault from "../../assets/images/default-cover-photo.png";
import { FaCalendarAlt, FaCoins, FaClock, FaUsers } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LoadingScreen from '../../components/loadingscreen/loadingScreen';

function LGViewTrips() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const token = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8080/trip/${tripId}`, {
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
        setTrip(data);
      } catch (error) {
        console.error("Error fetching trip details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId, token]);

  useEffect(() => {
    if (trip?.city?.latitude && trip?.city?.longitude && mapRef.current) {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }

      const map = L.map(mapRef.current).setView([trip.city.latitude, trip.city.longitude], 13);
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

      L.marker([trip.city.latitude, trip.city.longitude], { icon: customIcon }).addTo(map)
        .bindPopup(trip.city.cityName)
        .openPopup();
    }
  }, [trip]);

  if (loading) {
  
        return <LoadingScreen isLoading={loading} />;
  }

  if (error) {
    return <div>Error loading trip details: {error}</div>;
  }

  if (!trip) {
    return <div>Trip details not found.</div>;
  }

  return (
    <>
      <WebsiteNavbar />
      <div className="localguide-lg-view-trips-container">
        <div className="localguide-lg-view-trips-sidebar">
          <LGSidebar />
        </div>
        <div className="lg-view-trips-content">
          <div className="lg-view-trips-details">
            <div className="view-local-lg-view-trips-cover-photo">
              <img src={trip.picture || CoverPhotoDefault} alt="Cover" className="lg-view-trips-cover-image" />
              <div className="lg-view-trips-image-title-box">
                <h2 className="lg-view-trips-triptitle">{trip.title}</h2>
              </div>
            </div>
            <div className="lg-view-trips-overview-map">
              <div className="lg-view-trips-overview">
                <h2>{trip.city.cityName}</h2>
                <p className="lg-view-trips-description">{trip.description}</p>
                <div className="lg-view-trips-info-grid">
                  <div className="lg-view-trips-info-item-labeled">
                    <span className="lg-view-trips-label">From</span>
                    <div className="lg-view-trips-info-item">
                      <FaCalendarAlt className="lg-view-trips-icon" />
                      <span>{new Date(trip.fromDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="lg-view-trips-info-item-labeled">
                    <span className="lg-view-trips-label">To</span>
                    <div className="lg-view-trips-info-item">
                      <FaCalendarAlt className="lg-view-trips-icon" />
                      <span>{new Date(trip.toDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="grid-separator"></div>
                  <div className="lg-view-trips-info-item">
                    <FaUsers className="lg-view-trips-icon" />
                    <span>{trip.noOfSeatsReserved} Seats <span style={{ color: 'red', fontSize: '0.8em' }}>{trip.noOfSeatsLeft} left</span></span>
                  </div>
                  <div className="lg-view-trips-info-item">
                    <FaCoins className="lg-view-trips-icon" />
                    <span>{trip.pricePerPerson}</span>
                  </div>
                </div>
              </div>
              <div className="lg-view-trips-map-container" ref={mapRef} style={{ height: '300px', borderRadius: '15px' }}>
                {/* The map will be rendered here */}
              </div>
            </div>
          </div>
          <div className="lg-view-trips-days-section">
            <h2>Days</h2>
            {trip.days && trip.days.map((day, index) => (
              <div className="lg-view-trips-day-card" key={day.id}>
                <h3 className="lg-view-trips-Day">Day {index + 1}</h3> {/* Get the index here */}
                <h4>Activities</h4>
                <div className="lg-view-trips-activities-list">
                  {day.activities && day.activities.map((activity, activityIndex) => (
                    <div className="lg-view-trips-activity-item" key={activityIndex}>
                      <img src={activity.images && activity.images.length > 0 ? activity.images[0] : 'https://via.placeholder.com/100'} alt={activity.name} />
                      <div className="activity-name-description">
                        <h3>{activity.name}</h3>
                        <p>{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="lg-view-trips-day-details">
                  <div className="lg-view-trips-detail-item">
                    <FaClock className="lg-view-trips-icon" />
                    <span>Start Time: {day.startTime}</span>
                  </div>
                  <div className="lg-view-trips-detail-item">
                    <FaClock className="lg-view-trips-icon" />
                    <span>Duration: {day.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default LGViewTrips;