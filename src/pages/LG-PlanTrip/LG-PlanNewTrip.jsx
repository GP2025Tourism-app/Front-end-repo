import React, { useState, useEffect } from "react";
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import LGSidebar from "../../components/LocalGuide/LG-Sidebar";
import "./LG-PlanNewTrip.css";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CoverPhotoDefault from "../../assets/images/default-cover-photo.png";
import { FaCamera, FaPen, FaCalendarAlt, FaTimes } from 'react-icons/fa'; // Import FaTimes for remove icon

function LGPlanNewTrip() {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateField, setDateField] = useState('');
  const [tripImage, setTripImage] = useState(null);
  const [tripTitle, setTripTitle] = useState('');
  const [tripCity, setTripCity] = useState('');
  const [guideDescription, setGuideDescription] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [days, setDays] = useState([{ id: 1, activities: [], time: '', duration: '' }]); // Initialize activities as an array
  const [isTitleEditable, setIsTitleEditable] = useState(false);
  const [seats, setSeats] = useState('');
  const [price, setPrice] = useState('');
  const token = localStorage.getItem("authToken");
  const [allActivities, setAllActivities] = useState([]);
  const [suggestions, setSuggestions] = useState({});
  const [activityInput, setActivityInput] = useState({});

  const CLOUD_NAME = "da6gcu1n9";
  const UPLOAD_PRESET = "graduationproject";

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const formattedDate = date.toLocaleDateString();
    if (dateField === 'from') setFromDate(formattedDate);
    else if (dateField === 'to') setToDate(formattedDate);
    setCalendarVisible(false);
    setDateField('');
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:8080/api/activities", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch activities");
        const data = await response.json();
        setAllActivities(data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = await handleFileUpload(file);
      if (imageUrl) {
        setTripImage(imageUrl);
      } else {
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  const updateSuggestions = (dayId, inputValue) => {
    if (!inputValue) {
      setSuggestions(prev => ({ ...prev, [dayId]: [] }));
      return;
    }

    const matches = allActivities.filter(activity =>
      activity.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    setSuggestions(prev => ({ ...prev, [dayId]: matches }));
  };

  const handleAddDay = () => {
    setDays([...days, { id: days.length + 1, activities: [], time: '', duration: '' }]);
  };

  const handleActivityInputChange = (dayId, value) => {
    setActivityInput(prev => ({ ...prev, [dayId]: value }));
    updateSuggestions(dayId, value);
  };

  const handleActivitySelect = (dayId, activityName) => {
    setDays(prev =>
      prev.map(day =>
        day.id === dayId
          ? { ...day, activities: [...day.activities, activityName] }
          : day
      )
    );
    setActivityInput(prev => ({ ...prev, [dayId]: '' }));
    setSuggestions(prev => ({ ...prev, [dayId]: [] }));
  };

  const handleRemoveActivity = (dayId, activityToRemove) => {
    setDays(prev =>
      prev.map(day =>
        day.id === dayId
          ? { ...day, activities: day.activities.filter(activity => activity !== activityToRemove) }
          : day
      )
    );
  };

  const handleDayInputChange = (dayId, field, value) => {
    setDays(prev =>
      prev.map(day =>
        day.id === dayId ? { ...day, [field]: value } : day
      )
    );
  };

  const handleSaveTrip = async () => {
    const postData = {
      title: tripTitle,
      image: tripImage,
      city: tripCity,
      description: guideDescription,
      fromDate,
      toDate,
      days,
      seats: Number(seats),
      price: Number(price),
    };

    try {
      const response = await fetch("http://localhost:8080/trip", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        alert("Trip saved successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        alert(`Failed to save trip: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving trip:", error);
      alert("Error connecting to server.");
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
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
              </label>
              <div className="plan-new-trip-image-title-box">
                <input
                  type="text"
                  placeholder="Trip Title"
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  className="trip-title-input"
                  readOnly={!isTitleEditable}
                  onBlur={() => setIsTitleEditable(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsTitleEditable(false)}
                />
                <FaPen className="pen-icon" size={14} onClick={() => setIsTitleEditable(true)} style={{ cursor: 'pointer' }} />
              </div>
            </div>

            <div className="plan-new-trip-main-container">
              <div className="plan-new-trip-form">
                <div className="plan-new-trip-guide-info">
                  <h3>Trip Description</h3>
                  <textarea className="plan-new-trip-description" placeholder="Brief bio about the guide..." value={guideDescription} onChange={(e) => setGuideDescription(e.target.value)}></textarea>
                </div>
                <div className="plan-new-trip-city-input">
                  <label htmlFor="plan-new-trip-city">City</label>
                  <input type="text" id="plan-new-trip-city" placeholder="Where is your trip located?" value={tripCity} onChange={(e) => setTripCity(e.target.value)} />
                </div>

                <div className="plan-new-trip-date-inputs">
                  <div className="plan-new-trip-date-input">
                    <label htmlFor="fromDate">From</label>
                    <div className="input-with-icon">
                      <FaCalendarAlt className="calendar-icon" />
                      <input type="text" id="fromDate" value={fromDate} onClick={() => { setCalendarVisible(true); setDateField('from'); }} placeholder="Select date" readOnly />
                    </div>
                  </div>
                  <div className="plan-new-trip-date-input">
                    <label htmlFor="toDate">To</label>
                    <div className="input-with-icon">
                      <FaCalendarAlt className="calendar-icon" />
                      <input type="text" id="toDate" value={toDate} onClick={() => { setCalendarVisible(true); setDateField('to'); }} placeholder="Select date" readOnly />
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
                <div className="map-placeholder">Map will be here</div>
              </div>
            </div>
          </div>

          <div className="plan-new-trip-days-section">
            <div className="plan-new-trip-days-header">
              <h2>Days</h2>
              <button className="plan-new-trip-add-day-button" onClick={handleAddDay}>+ Add Days</button>
            </div>

            {days.map((day) => (
              <div className="plan-new-trip-day-card" key={day.id}>
                <h3><em>Day {day.id}</em></h3>

                <div className="plan-new-trip-activity-wrapper">
                  <input
                    type="text"
                    placeholder="Tell us the name of the place or activity"
                    className="plan-new-trip-activity-search"
                    value={activityInput[day.id] || ''}
                    onChange={(e) => handleActivityInputChange(day.id, e.target.value)}
                  />

                  {suggestions[day.id]?.length > 0 && (
                    <ul className="suggestions-list">
                      {suggestions[day.id].map((activity, idx) => (
                        <li
                          key={idx}
                          onClick={() => handleActivitySelect(day.id, activity.name)}
                          className="suggestion-item"
                        >
                          {activity.name}
                        </li>
                      ))}
                    </ul>
                  )}

                  {day.activities && day.activities.length > 0 && (
                    <div className="selected-activities">
                      <strong>Selected Activities:</strong>
                      {day.activities.map((activity, idx) => (
                        <span key={idx} className="selected-activity-tag">
                          {activity}
                          <button
                            type="button"
                            className="remove-activity-button"
                            onClick={() => handleRemoveActivity(day.id, activity)}
                          >
                            <FaTimes size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="plan-new-trip-time-duration">
                  <input
                    type="text"
                    placeholder="Time (e.g., 10:00 AM)"
                    value={day.time}
                    onChange={(e) => handleDayInputChange(day.id, 'time', e.target.value)}
                    className="plan-new-trip-time "
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 2 hours)"
                    value={day.duration}
                    className="plan-new-trip-duration"
                    onChange={(e) => handleDayInputChange(day.id, 'duration', e.target.value)}
                  />
                </div>
              </div>
            ))}

            <div className="plan-new-trip-seats-price">
              <div>
                <label>No Of Seats</label>
                <input type="number" placeholder="e.g 50" value={seats} onChange={(e) => setSeats(e.target.value)} className="plan-new-trip-seats" />
              </div>
              <div>
                <label>Price Per Person</label>
                <input type="number" placeholder="e.g 70 $" value={price} onChange={(e) => setPrice(e.target.value)} className="plan-new-trip-price" />
              </div>
            </div>

            <div className="plan-new-trip-save-button-container">
              <button className="plan-new-trip-save-button" onClick={handleSaveTrip}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LGPlanNewTrip;