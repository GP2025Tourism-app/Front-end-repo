import React, { useState } from "react";
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import LGSidebar from "../../components/LocalGuide/LG-Sidebar";
import "./LG-PlanNewTrip.css";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CoverPhotoDefault from "../../assets/images/default-cover-photo.png"
import { FaCamera, FaPen , FaCalendarAlt} from 'react-icons/fa';

function LGPlanNewTrip() {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateField, setDateField] = useState('');
  const [tripImage, setTripImage] = useState(null);
  const [tripTitle, setTripTitle] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [days, setDays] = useState([{ id: 1, activities: '' }]);
  const [isTitleEditable, setIsTitleEditable] = useState(false);

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

  const handleAddDay = () => {
    setDays([...days, { id: days.length + 1, activities: '' }]);
  };

  const handleDayInputChange = (id, value) => {
    const newDays = days.map(day =>
      day.id === id ? { ...day, activities: value } : day
    );
    setDays(newDays);
  };

  const handleTitleBlur = () => {
    setIsTitleEditable(false);
  };

  const handleTitleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setIsTitleEditable(false);
    }
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
            <div className="edit-local-plan-new-trip-cover-photo">
              <img src={tripImage || CoverPhotoDefault} alt="Cover" className="plan-new-trip-cover-image" />
              <label className="edit-local-plan-new-trip-edit-cover">
                <FaCamera size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </label>
              <div className="plan-new-trip-image-title-box">
                <input
                  type="text"
                  placeholder="Trip Title"
                  value={tripTitle}
                  onChange={handleTitleChange}
                  className="trip-title-input"
                  readOnly={!isTitleEditable}
                  onBlur={handleTitleBlur}
                  onKeyDown={handleTitleKeyDown}
                />
                <FaPen
                  className="pen-icon"
                  size={14}
                  onClick={() => setIsTitleEditable(true)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>
            <div className="plan-new-trip-main-container">
            <div className="plan-new-trip-form">
            <div className="plan-new-trip-guide-info">
              <h3>William Mikhail</h3>
              <textarea className="plan-new-trip-description" placeholder="Brief bio about the guide..."></textarea>
            </div>
            <div className="plan-new-trip-city-input">
              <label htmlFor="plan-new-trip-city">City:</label>
              <input type="text" id="plan-new-trip-city" placeholder="Where is your trip located?" />
            </div>
            <div className="plan-new-trip-date-inputs">
  <div className="plan-new-trip-date-input">
    <label htmlFor="fromDate">From:</label>
    <div className="input-with-icon">
      <FaCalendarAlt className="calendar-icon" />
      <input
        type="text"
        id="fromDate"
        value={fromDate}
        onClick={handleFromDateClick}
        placeholder="Select date"
        readOnly
      />
    </div>
  </div>
  <div className="plan-new-trip-date-input">
    <label htmlFor="toDate">To:</label>
    <div className="input-with-icon">
      <FaCalendarAlt className="calendar-icon" />
      <input
        type="text"
        id="toDate"
        value={toDate}
        onClick={handleToDateClick}
        placeholder="Select date"
        readOnly
      />
    </div>
  </div>
  {isCalendarVisible && (
    <div className="plan-new-trip-calendar-popup">
      <Calendar onChange={handleDateClick} value={selectedDate} />
    </div>
  )}
</div>
          </div>
          
          <div className="plan-new-trip-map">
            {/* Placeholder for the map */}
            <div className="map-placeholder">Map will be here</div>
          </div>
          </div>
          </div>
          <div className="plan-new-trip-days-section">
  <div className="plan-new-trip-days-header">
    <h2>Days</h2>
    <button className="plan-new-trip-add-day-button" onClick={handleAddDay}>+ Add Days</button>
  </div>

  {days.map(day => (
    <div className="plan-new-trip-day-card" key={day.id}>
      <h3><em>Day {day.id}:</em></h3>
      <input
        type="text"
        placeholder="Select All Activities , e.g Pyramids , Blue Hole..."
        value={day.activities}
        onChange={(e) => handleDayInputChange(day.id, e.target.value)}
        className="plan-new-trip-activity-search"
      />
      <h3><em>Activities</em></h3>
      <div className="plan-new-trip-activities-section">
        
        <div className="plan-new-trip-activity-card">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIJP3RxPshfQ2L7CwG7giMR0fgCv0BC9H3vA&s" alt="Blue Hole" />
          <div className="plan-new-trip-activity-description">
            <h4>Blue Hole</h4>
            <p>Beaches & Entertainment</p>
            <p>The Blue Hole is a world-famous underwater sinkhole...</p>
          </div>
        </div>
        <button className="plan-new-trip-add-activity-button">+ Add Activity</button>
      </div>

      <div className="plan-new-trip-time-duration">
        <div>
          <label>Start Time</label>
          <input type="time" placeholder="10:00" className="plan-new-trip-time" />
        </div>
        <div >
          <label>Duration</label>
          <input type="text" placeholder="4-5 Hrs" className="plan-new-trip-duration" />
        </div>
      </div>

     
    </div>
  ))}
    <div className="plan-new-trip-seats-price">
        <div>
          <label>No Of Seats</label>
          <input type="number" placeholder="e.g 50" className="plan-new-trip-seats"/>
        </div>
        <div>
          <label>Price Per person</label>
          <input type="number" placeholder="e.g 70 $" className="plan-new-trip-price" />
        </div>
      </div>
  <div className="plan-new-trip-save-button-container">
    <button className="plan-new-trip-save-button">Save</button>
  </div>
</div>
        </div>
      </div>
    </>
  );
}

export default LGPlanNewTrip;
