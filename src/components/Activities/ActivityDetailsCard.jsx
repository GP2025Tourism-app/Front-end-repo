import React, { useState } from "react";
import clockIcon from "../../assets/images/Icons/clock.svg";
import moneyIcon from "../../assets/images/Icons/cash-stack.svg";
import durationIcon from "../../assets/images/Icons/hourglass-split.svg";
import "./ActivityCard.css"; // Custom CSS for the card

const ActivityCard = ({ activity }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showHours, setShowHours] = useState(false);
  const [showPricing, setShowPricing] = useState(false); // State for toggling pricing

  // Get current time and day
  const currentTime = new Date();
  const currentDay = currentTime.toLocaleString("en-US", { weekday: "long" }); // e.g., "Monday"
  const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60; // Decimal format of the current time

  // Function to toggle description view
  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  // Function to toggle opening hours view
  const toggleShowHours = () => {
    setShowHours(!showHours);
  };

  // Function to toggle pricing view
  const toggleShowPricing = () => {
    setShowPricing(!showPricing);
  };

  // Adjust opening hours for Castle Zaman
  const { from, to, days, general } = activity.openingHours || {};
  const isOpen = (() => {
    if (!from || !to) return false;
    const [fromHour] = from.split(/[: ]/);
    const [toHour] = to.split(/[: ]/);

    const fromTime = parseInt(fromHour) + (from.includes("PM") && fromHour !== "12" ? 12 : 0);
    const toTime = parseInt(toHour) + (to.includes("PM") && toHour !== "12" ? 12 : 0);

    return currentHour >= fromTime && currentHour <= toTime;
  })();

  // Determine the message for the opening hours
  const openingMessage = (() => {
    if (from && to) {
      return isOpen ? (
        "Open Now"
      ) : (
        <>
          <span className="closed-text">Closed</span> - Opens at {from || "N/A"} ({days || "N/A"})
        </>
      );
    } else if (general) {
      return general; // Use general message if `from` and `to` are not provided
    } else {
      return "Opening hours not available";
    }
  })();

  return (
    <div className="activity-card">
      {/* About Section */}
      <div className="card-section about">
        <h3 className="about-title">About</h3>
        <p>
          {isDescriptionExpanded
            ? activity.description
            : `${activity.description.slice(0, 200)}...`}{" "}
          <span className="read-more-toggle" onClick={toggleDescription}>
            {isDescriptionExpanded ? "Read less ▲" : "Read more ▼"}
          </span>
        </p>
      </div>

      <hr className="divider" />

      {/* Details Section */}
      <div className="card-section details">
        <h3 className="details-title">Details</h3>

        {/* Opening Hours */}
        <div className="detail-item">
          <img src={clockIcon} alt="feed" className="icon" />
          <span>{openingMessage}</span>
          <span
            className="arrow-toggle"
            onClick={toggleShowHours}
            style={{ cursor: "pointer", marginLeft: "8px" }}
          >
            {showHours ? "▲" : "▼"}
          </span>
        </div>

        {/* Full Opening Hours */}
        {showHours && (
          <div className="opening-hours">
            <ul>
              {from && to ? (
                <li>
                  <span>{days || "Daily"}:</span> {from} - {to}
                </li>
              ) : general ? (
                <li>
                  <span>Opening Hours:</span> {general}
                </li>
              ) : (
                <li>Opening hours not available</li>
              )}
            </ul>
          </div>
        )}

        {/* Pricing */}
        <div className="detail-item">
          <img src={moneyIcon} alt="feed" className="icon" />
          <span>{activity.prices?.general || "Price varies"}</span>
          {activity.prices?.egyptians || activity.prices?.foreigners || activity.prices?.students ? (
            <span
              className="arrow-toggle"
              onClick={toggleShowPricing}
              style={{ cursor: "pointer", marginLeft: "8px" }}
            >
              {showPricing ? "▲" : "▼"}
            </span>
          ) : null}
        </div>

        {/* Detailed Pricing */}
        {showPricing && (
          <div className="pricing-details">
            <ul>
              {activity.prices?.egyptians && (
                <li>
                  <span>Egyptians:</span> {activity.prices.egyptians}
                </li>
              )}
              {activity.prices?.foreigners && (
                <li>
                  <span>Foreigners:</span> {activity.prices.foreigners}
                </li>
              )}
              {activity.prices?.students && (
                <li>
                  <span>Students:</span> {activity.prices.students}
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Duration */}
        <div className="detail-item">
          <img src={durationIcon} alt="feed" className="icon" />
          <span>{activity.duration || "N/A"} hours</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
