import React, { useState, useEffect, useRef } from "react";
import "./LG-ViewTrips.css";
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import LGSidebar from "../../components/LocalGuide/LG-Sidebar";
import Sidebar from "../../components/HomePageComponents/Sidebar";
import "./LG-PlanNewTrip.css";
import CoverPhotoDefault from "../../assets/images/default-cover-photo.png";
import { FaCalendarAlt, FaCoins, FaClock, FaUsers } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LoadingScreen from '../../components/loadingscreen/loadingScreen';



const BookingCard = ({ trip, onBookClick }) => {
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [numericPricePerPerson, setNumericPricePerPerson] = useState(0);

  // Use useEffect to parse the price once when the trip prop changes
  useEffect(() => {
    if (trip && trip.pricePerPerson) {
      // Remove all non-numeric characters (except the decimal point)
      const cleanedPriceString = trip.pricePerPerson.replace(/[^0-9.]/g, '');
      setNumericPricePerPerson(parseFloat(cleanedPriceString) || 0);
    }
  }, [trip]); // Re-run this effect if the trip object changes

  const totalPrice = (numericPricePerPerson * numberOfPeople).toFixed(2);

  const handleBookNow = () => {
    onBookClick(trip.id, numberOfPeople);
  };

  return (
    <div className="booking-card">
      <div className="booking-header">
        <h4>Number of People</h4>
      </div>
      <div className="booking-details">
        <div className="detail-item">
          <select
            id="numPeople"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
          >
            {[...Array(trip.noOfSeatsLeft > 0 ? trip.noOfSeatsLeft : 0).keys()].map(i => (
              <option key={i + 1} value={i + 1}>Person ({i + 1})</option>
            ))}
            {/* If no seats are left, ensure the option for 0 adults is displayed and disabled */}
            {trip.noOfSeatsLeft === 0 && <option value={0} disabled>Adult (0)</option>}
          </select>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />

        <div className="detail-item">
          <span>Price Per Person</span>
          {/* Display the original string value for the user */}
          <span className="price-with-icon">{trip.pricePerPerson || 'N/A'} </span>
        </div>
        <div className="detail-item total-price">
          <span>Total Price</span>
          <span className="price-with-icon">{totalPrice} EGP</span>
        </div>
        {trip.noOfSeatsLeft !== null && trip.noOfSeatsLeft <= 5 && trip.noOfSeatsLeft > 0 && (
          <p className="seats-left-warning">Only {trip.noOfSeatsLeft} seat{trip.noOfSeatsLeft > 1 ? 's' : ''} left!</p>
        )}
        {trip.noOfSeatsLeft === 0 && (
            <p className="seats-left-warning no-seats">No seats available!</p>
        )}
      </div>
      <button
        className="book-now-button-LG-tour"
        onClick={handleBookNow}
        disabled={trip.noOfSeatsLeft === 0 || numberOfPeople === 0 || numericPricePerPerson === 0} // Disable if price is 0
      >
        Book Now
      </button>
    </div>
  );
};



function LGViewTrips() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const token = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const [isTouristView, setIsTouristView] = useState(false);

  // State to manage showing full description for activities
  const [showFullDescriptions, setShowFullDescriptions] = useState({});
  

  useEffect(() => {
    const storedRolesString = localStorage.getItem("userRole");
    if (storedRolesString) {
      try {
        const roles = JSON.parse(storedRolesString);

        if (roles.includes("ROLE_CLIENT")) {
          setIsTouristView(true);
        } else {
          setIsTouristView(false);
        }
      } catch (e) {
        console.error("Error parsing user roles from localStorage:", e);
        setIsTouristView(false);
      }
    } else {
      setIsTouristView(false);
    }
  }, []);

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
            const contentType = response.headers.get("content-type");
            let errorData = `HTTP error! status: ${response.status}`;
            if (contentType && contentType.includes("application/json")) {
                try {
                    const jsonError = await response.json();
                    errorData = jsonError.message || JSON.stringify(jsonError);
                } catch (jsonParseError) {
                    errorData = await response.text();
                }
            } else {
                errorData = await response.text();
            }
            throw new Error(errorData);
        }

        const data = await response.json();

        const tripDataToSet = { ...data };
        if (tripDataToSet.totalnoOfSeats !== undefined && tripDataToSet.noOfSeatsReserved !== undefined) {
            tripDataToSet.noOfSeatsLeft = tripDataToSet.totalnoOfSeats - tripDataToSet.noOfSeatsReserved;
        }
        setTrip(tripDataToSet);

      } catch (error) {
        console.error("Error fetching trip details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTripDetails();
    } else {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
    }
  }, [tripId, token]);

  useEffect(() => {
    if (trip && trip.city && trip.city.latitude && trip.city.longitude && mapRef.current) {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }

      const map = L.map(mapRef.current).setView([trip.city.latitude, trip.city.longitude], 13);
      mapInstance.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const customIcon = L.icon({
        iconUrl: 'https://img.icons8.com/?size=100&id=13808&format=png&color=000000', // Changed to a different marker URL for better stability
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      L.marker([trip.city.latitude, trip.city.longitude], { icon: customIcon }).addTo(map)
        .bindPopup(trip.city.cityName || 'Location')
        .openPopup();
    }
  }, [trip]);

  const handleBookTrip = async (bookedTripId, numOfPeople) => {
    console.log(`Attempting to book trip ${bookedTripId} for ${numOfPeople} people `);
    try {
      const response = await fetch(`http://localhost:8080/api/bookings/create?tripId=${bookedTripId}&numOfPeople=${numOfPeople}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorData = `Booking failed! Status: ${response.status}`;
        if (contentType && contentType.includes("application/json")) {
            try {
                const jsonError = await response.json();
                errorData = jsonError.message || JSON.stringify(jsonError);
            } catch (jsonParseError) {
                errorData = await response.text();
            }
        } else {
            errorData = await response.text();
        }
        throw new Error(errorData);
      }

      const bookingData = await response.json();
      console.log("Booking successful:", bookingData);
      alert("Trip booked successfully!");


    } catch (err) {
      console.error("Error booking trip:", err);
      alert(`Error booking trip: ${err.message}`);
    }
  };

  // Function to toggle the full description for a specific activity
  const toggleDescription = (dayIndex, activityIndex) => {
    setShowFullDescriptions(prevState => ({
      ...prevState,
      [`${dayIndex}-${activityIndex}`]: !prevState[`${dayIndex}-${activityIndex}`]
    }));
  };

  if (loading) {
    return <LoadingScreen isLoading={loading} />;
  }

  if (error) {
    return <div className="error-message">Error loading trip details: {error}</div>;
  }

  if (!trip) {
    return <div className="no-trip-found">Trip details not found.</div>;
  }

  return (
    <>
      <WebsiteNavbar />
      <div className="localguide-lg-view-trips-container">
        <div className="localguide-lg-view-trips-sidebar">
          {isTouristView ?  <Sidebar /> : <LGSidebar />}
        </div>
        <div className="lg-view-trips-content">
          <div className="lg-view-trips-details">
            <div className="view-local-lg-view-trips-cover-photo">
              <img src={trip.picture || CoverPhotoDefault} alt="Cover" className="lg-view-trips-cover-image" />
              <div className="lg-view-trips-image-title-box">
                <h2 className="lg-view-trips-triptitle">{trip.title}</h2>
              </div>
            </div>

            {/* Tourist View Layout */}
            {isTouristView && (
              <div className="tourist-main-content">
                <div className="tourist-overview-and-booking">
                  <div className="lg-view-trips-overview">
                    {trip.city && <h2>{trip.city.cityName}</h2>}
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
                        <span>{trip.totalnoOfSeats - (trip.noOfSeatsLeft || 0)} Reserved <span style={{ color: 'red', fontSize: '0.8em' }}>{trip.noOfSeatsLeft} left</span></span>
                      </div>
                      <div className="lg-view-trips-info-item">
                        <FaCoins className="lg-view-trips-icon" />
                        {/* Display the original string value */}
                        <span>{trip.pricePerPerson || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <BookingCard trip={trip} onBookClick={handleBookTrip} />
                </div>
                {trip.city && trip.city.latitude && trip.city.longitude ? (
                  <div className="lg-view-trips-map-container tourist-map-position" ref={mapRef} >
                  </div>
                ) : (
                  <div className="lg-view-trips-map-placeholder">
                    Map not available for this trip (city coordinates missing).
                  </div>
                )}
              </div>
            )}

            {/* Local Guide View Layout (original layout) */}
            {!isTouristView && (
              <div className="lg-view-trips-overview-map">
                <div className="lg-view-trips-overview">
                  {trip.city && <h2>{trip.city.cityName}</h2>}
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
                      <span>{trip.totalnoOfSeats - (trip.noOfSeatsLeft || 0)} Reserved <span style={{ color: 'red', fontSize: '0.8em' }}>{trip.noOfSeatsLeft} left</span></span>
                    </div>
                    <div className="lg-view-trips-info-item">
                      <FaCoins className="lg-view-trips-icon" />
                      {/* Display the original string value */}
                      <span>{trip.pricePerPerson || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                {trip.city && trip.city.latitude && trip.city.longitude ? (
                  <div className="lg-view-trips-map-container" ref={mapRef} style={{ height: '300px', borderRadius: '15px' }}>
                  </div>
                ) : (
                  <div className="lg-view-trips-map-placeholder">
                    Map not available for this trip (city coordinates missing).
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg-view-trips-days-section"
          style={{ marginTop: isTouristView ? '10px' : '0' }}>
            <h2>Days</h2>
            {trip.days && trip.days.length > 0 ? (
              trip.days.map((day, dayIndex) => ( // Changed index to dayIndex
                <div className="lg-view-trips-day-card" key={dayIndex}>
                  <h3 className="lg-view-trips-Day">Day {dayIndex + 1}</h3>
                  <h4>Activities</h4>
                  <div className="lg-view-trips-activities-list">
                    {day.activities && day.activities.length > 0 ? (
                      day.activities.map((activity, activityIndex) => { // Changed index to activityIndex
                        const fullDescription = activity.description;
                        // Split the description into words
                        const words = fullDescription ? fullDescription.split(' ') : [];
                        const TRUNCATE_WORD_LIMIT = 40;
                        const shouldTruncate = words.length > TRUNCATE_WORD_LIMIT;

                        const isFullDescriptionShown = showFullDescriptions[`${dayIndex}-${activityIndex}`];

                        return (
                          <div className="lg-view-trips-activity-item" key={activityIndex}>
                            <img
                              src={activity.images && activity.images.length > 0 ? activity.images[0] : 'https://via.placeholder.com/100'}
                              alt={activity.name}
                            />
                            <div className="activity-name-description">
                              <h3>{activity.name}</h3>
                              {shouldTruncate ? (
                                <>
                                  <p className="activity-description-truncated">
                                    {isFullDescriptionShown
                                      ? fullDescription
                                      : words.slice(0, TRUNCATE_WORD_LIMIT).join(' ') + '...'
                                    }
                                  </p>
                                  <button
                                    onClick={() => toggleDescription(dayIndex, activityIndex)}
                                    className="see-more-button"
                                  >
                                    {isFullDescriptionShown ? "See Less" : "See More"}
                                  </button>
                                </>
                              ) : (
                                <p>{fullDescription}</p>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p>No activities planned for this day.</p>
                    )}
                  </div>
                  <div className="lg-view-trips-day-details">
                    <div className="lg-view-trips-detail-item">
                      <FaClock className="lg-view-trips-icon" />
                      <span>Start Time: {day.startTime || 'N/A'}</span>
                    </div>
                    <div className="lg-view-trips-detail-item">
                      <FaClock className="lg-view-trips-icon" />
                      <span>Duration: {day.duration || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No daily plan available for this trip.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default LGViewTrips;