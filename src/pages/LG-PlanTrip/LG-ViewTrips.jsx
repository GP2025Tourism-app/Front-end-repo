import React from "react";
import "./LG-ViewTrips.css";
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import LGSidebar from "../../components/LocalGuide/LG-Sidebar";
import "./LG-PlanNewTrip.css";
import CoverPhotoDefault from "../../assets/images/default-cover-photo.png";
import { FaCalendarAlt, FaCoins, FaClock, FaUsers } from 'react-icons/fa';

function LGViewTrips (){
    const trip = {
        title: "Beneath the blue",
        location: "Dahab",
        description:
          "Dahab, nestled along the stunning Red Sea coastline of Egypt’s Sinai Peninsula, is a paradise of golden beaches, crystal-clear waters, and breathtaking mountain backdrops. Renowned for its serene vibe, Dahab offers world-class diving spots like the Blue Hole and vibrant coral reefs teeming with marine life. Beyond the water, picturesque landscapes are perfect for hiking, windsurfing, and camel treks into the desert. With its laid-back charm, colorful Bedouin culture, and unforgettable sunsets, Dahab is a haven for adventurers and those seeking tranquility alike.",
        from: "15 August 2025",
        to: "17 August 2025",
        seats: 35,
        price: "700 EGP",
        startTime: "10:00 AM",
        duration: "6-7 Hours",
        coverPhoto: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        mapImage: "https://images.dailynewsegypt.com/2018/09/momtazmap-pic.png",
        days: [
            {
                id: 1,
                date: "August 15, 2025",
                activities: [
                    {
                        image:
                            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
                        description:
                            "The Blue Hole is a world-famous underwater sinkhole located on the coast of Dahab in the Sinai Peninsula, Egypt. It is a stunning natural wonder and a destination for free divers. It features marine wildlife and dramatic drop-offs into the deep sea.The Blue Hole is a world-famous underwater sinkhole located on the coast of Dahab in the Sinai Peninsula, Egypt. It is a stunning natural wonder and a destination for free divers. It features marine wildlife and dramatic drop-offs into the deep sea.",
                    },
                    {
                        image:
                            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
                        description:
                            "The Blue Hole is a world-famous underwater sinkhole located on the coast of Dahab in the Sinai Peninsula, Egypt. Known for its marine richness and depth, it’s a must-see destination for divers.",
                    },
                ],
            },
        ],
    };
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
                        <img src={trip.coverPhoto || CoverPhotoDefault} alt="Cover" className="lg-view-trips-cover-image" />
                        <div className="lg-view-trips-image-title-box">
                            <h2 className="lg-view-trips-triptitle">{trip.title}</h2>
                        </div>
                    </div>
                    <div className="lg-view-trips-overview-map">
                        <div className="lg-view-trips-overview">
                            <h2>{trip.location}</h2>
                            <p className="lg-view-trips-description">{trip.description}</p>
                            <div className="lg-view-trips-info-grid">
                        <div className="lg-view-trips-info-item-labeled">
                            <span className="lg-view-trips-label">From</span>
                            <div className="lg-view-trips-info-item">
                            <FaCalendarAlt className="lg-view-trips-icon" />
                            <span>15 August 2025</span>
                            </div>
                        </div>
                        <div className="lg-view-trips-info-item-labeled">
                            <span className="lg-view-trips-label">To</span>
                            <div className="lg-view-trips-info-item">
                            <FaCalendarAlt className="lg-view-trips-icon" />
                            <span>17 August 2025</span>
                            </div>
                        </div>
                        <div className="grid-separator"></div>
                        <div className="lg-view-trips-info-item">
                            <FaUsers className="lg-view-trips-icon" />
                            <span>35 Seats <span style={{ color: 'red', fontSize: '0.8em' }}>15 left</span></span>
                        </div>
                        <div className="lg-view-trips-info-item">
                            <FaCoins className="lg-view-trips-icon" />
                            <span>700 EGP</span>
                        </div>
                        </div>
                        </div>
                        <div className="lg-view-trips-map-container">
                            <img src={trip.mapImage} alt="Trip Map" className="map-placeholder-image" />
                        </div>
                    </div>
                </div>
                <div className="lg-view-trips-days-section">
                    <h2>Days</h2>
                    {trip.days.map(day => (
                        <div className="lg-view-trips-day-card" key={day.id}>
                            <h3 className="lg-view-trips-Day">Day {day.id}</h3>
                            <h3 className="lg-view-trips-Date">{day.date}</h3>
                            <h4>Activities</h4>
                            <div className="lg-view-trips-activities-list">
                                {day.activities.map((activity, index) => (
                                    <div className="lg-view-trips-activity-item" key={index}>
                                    <img src={activity.image} alt={activity.description.split(' ')[0]} />
                                    <p>{activity.description}</p>
                                  </div>
                                ))}
                            </div>
                            <div className="lg-view-trips-day-details">
                                <div className="lg-view-trips-detail-item">
                                    <FaClock className="lg-view-trips-icon" />
                                    <span>Start Time: {trip.startTime}</span>
                                </div>
                                <div className="lg-view-trips-detail-item">
                                    <FaClock className="lg-view-trips-icon" />
                                    <span>Duration: {trip.duration}</span>
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