import React, { useState } from "react";
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import LGSidebar from "../../components/LocalGuide/LG-Sidebar";
import "./LG-PlanNewTrip.css";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function LGPlanNewTrip() {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateField, setDateField] = useState('');
  const [tripImage, setTripImage] = useState(null);
  const [tripTitle, setTripTitle] = useState('');

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const formattedDate = date.toLocaleDateString();
    if (dateField === 'from') {
      setFromDate(formattedDate);
    } else if (dateField === 'to') {
      setToDate(formattedDate);
    }
    setCalendarVisible(false);
    setDateField('');
  };

  const handleFromDateClick = () => {
    setCalendarVisible(true);
    setDateField('from');
  };

  const handleToDateClick = () => {
    setCalendarVisible(true);
    setDateField('to');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTripImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTitleChange = (event) => {
    setTripTitle(event.target.value);
  };

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [days, setDays] = useState([{ id: 1, activities: '' }]);

  const handleAddDay = () => {
    setDays([...days, { id: days.length + 1, activities: '' }]);
  };

  const handleDayInputChange = (id, value) => {
    const newDays = days.map(day =>
      day.id === id ? { ...day, activities: value } : day
    );
    setDays(newDays);
  };

  return (
    <>
      <WebsiteNavbar />
      <div className="localguide-plan-new-trip-container">
        <div className="localguide-plan-new-trip-sidebar">
          <LGSidebar />
        </div>
        <div className="plan-new-trip-content">
          <div className="plan-new-trip-details">
            <div className="plan-new-trip-image-upload-container">
              <div className="plan-new-trip-image-preview" style={{ backgroundImage: `url(${tripImage})` }}>
                {tripImage && (
                  <div className="plan-new-trip-image-title-box">
                    <input
                      type="text"
                      placeholder="Trip Title"
                      value={tripTitle}
                      onChange={handleTitleChange}
                    />
                  </div>
                )}
              </div>
              <label htmlFor="imageUpload" className="plan-new-trip-upload-button">
                {tripImage ? 'Change Image' : 'Upload Image'}
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              {!tripImage && <p className="plan-new-trip-image-upload-text">Upload an image for your trip</p>}
            </div>
            <div className="plan-new-trip-guide-info">
              <h3>William Mikhail</h3>
              <p>Brief bio about the guide...</p>
            </div>
            <div className="plan-new-trip-city-input">
              <label htmlFor="plan-new-trip-city">City:</label>
              <input type="text" id="plan-new-trip-city" placeholder="Where is your trip located?" />
            </div>
            <div className="plan-new-trip-date-inputs">
              <div className="plan-new-trip-date-input">
                <label htmlFor="plan-new-trip-fromDate">From:</label>
                <input
                  type="text"
                  id="fromDate"
                  value={fromDate}
                  onClick={handleFromDateClick}
                  readOnly
                />
              </div>
              <div className="plan-new-trip-date-input">
                <label htmlFor="toDate">To:</label>
                <input
                  type="text"
                  id="toDate"
                  value={toDate}
                  onClick={handleToDateClick}
                  readOnly
                />
              </div>
              {isCalendarVisible && (
                <div className="plan-new-trip-calendar-popup">
                  <Calendar onChange={handleDateClick} value={selectedDate} />
                </div>
              )}
            </div>
          </div>
       
          <div className="plan-new-trip-days-section">
            <h2>Days</h2>
            {days.map(day => (
              <div className="plan-new-trip-day-card" key={day.id}>
                <h3>Day {day.id}:</h3>
                <input
                  type="text"
                  placeholder="Select All Activities, e.g., Pyramids, Blue Hole..."
                  value={day.activities}
                  onChange={(e) => handleDayInputChange(day.id, e.target.value)}
                />
              </div>
            ))}
            <button className="plan-new-trip-add-day-button" onClick={handleAddDay}>+ Add Day</button>
          </div>
          <div className="plan-new-trip-other-details">
            <div className="plan-new-trip-seats-input">
              <label htmlFor="noOfSeats">No of Seats:</label>
              <input type="number" id="noOfSeats" />
            </div>
            <div className="plan-new-trip-price-input">
              <label htmlFor="pricePerPerson">Price Per person:</label>
              <input type="number" id="pricePerPerson" />
            </div>
          </div>
          <div className="plan-new-trip-save-button-container">
            <button className="plan-new-trip-save-button">Save</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LGPlanNewTrip;