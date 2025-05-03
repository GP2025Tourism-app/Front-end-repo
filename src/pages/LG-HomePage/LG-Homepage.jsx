import React from "react";
import './LG-Homepage.css';
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import LGSidebar from "../../components/LocalGuide/LG-Sidebar";
import { FaPlus } from 'react-icons/fa';
import { IoFilterCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom'; 

function LgHomepage() {
 const navigate = useNavigate();
  const trips = [
    {
      title: "Beneath the Blue",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIJP3RxPshfQ2L7CwG7giMR0fgCv0BC9H3vA&s",
    },
    {
      title: "Driving New Sinai",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIJP3RxPshfQ2L7CwG7giMR0fgCv0BC9H3vA&s",
    },
    {
      title: "Dahab & Chill",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIJP3RxPshfQ2L7CwG7giMR0fgCv0BC9H3vA&s",
    },
  ];

  const handleCardClick = (title) => {
    
    console.log(`Card clicked: ${title}`);
  }; 
  const handlePlanNewTripClick = () => {
    navigate('/plan-new-trip'); 
  };

  return (
    <>
      <WebsiteNavbar />
      <div className="localguide-home-container">
        <div className="localguide-home-sidebar">
          <LGSidebar />
        </div>
        <div className="lg-homepage-container">
          <div className="my-trips-section">
            <div className="my-trips-header">
              <h2>My Trips</h2>
              <div className="lg-homepage-buttons">
                <button className="filter-button">
                  <IoFilterCircleOutline size={38} />
                </button>
                <button className="plan-new-trip-button"  onClick={handlePlanNewTripClick}>
                  <FaPlus  /> Plan New Trip
                </button>
              </div>
            </div>
            <div className="trip-cards place-new-trips-grid"> 
              {trips.map((trip, index) => (
                <div
                  key={index}
                  onClick={() => handleCardClick(trip.title)}
                  className="trip-card place-new-trip-card" 
                >
                  <div
                    className="place-new-trip-image"
                    style={{ backgroundImage: `url(${trip.imageUrl})` }}
                  >
                    <div className="place-new-trip-info">
                      <h4>{trip.title}</h4>
                     
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LgHomepage;