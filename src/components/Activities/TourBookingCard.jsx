import React, { useState, useEffect, useRef } from 'react';
import './TourBookingCard.css'; // Ensure this path is correct relative to TourBookingCard.js

function TourBookingCard({activityId}) {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [numberOfAdults, setNumberOfAdults] = useState(1);
    const [numberOfChildren, setNumberOfChildren] = useState(0);
    const [showPeopleDropdown, setShowPeopleDropdown] = useState(false);
    const peopleDropdownRef = useRef(null);
    const [messageBox, setMessageBox] = useState({ visible: false, message: '', type: '' });
    const [loading, setLoading] = useState(false); // State for loading
    const token = localStorage.getItem("authToken");

    const startingTime = "09:00 AM"; 
    const pricePerAdult = 500;
    const pricePerChild = 250;

    const totalPrice = (numberOfAdults * pricePerAdult) + (numberOfChildren * pricePerChild);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleAdultsChange = (delta) => {
        setNumberOfAdults(prev => Math.max(0, prev + delta));
    };

    const handleChildrenChange = (delta) => {
        setNumberOfChildren(prev => Math.max(0, prev + delta));
    };

    const togglePeopleDropdown = () => {
        setShowPeopleDropdown(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close dropdown if click is outside, but not if it's the message box itself
            // This prevents the dropdown from closing if clicking on the message box or its content
            if (peopleDropdownRef.current && !peopleDropdownRef.current.contains(event.target) &&
                !event.target.closest('.message-box')) {
                setShowPeopleDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const showMessage = (message, type = 'info') => {
        setMessageBox({ visible: true, message, type });
    };

    const hideMessageBox = () => {
        setMessageBox({ visible: false, message: '', type: '' });
    };

    const handleBookNow = async () => {
        if (numberOfAdults === 0 && numberOfChildren === 0) {
            showMessage('Please select at least one adult or child to book.', 'error');
            return;
        }

        setLoading(true); 
        hideMessageBox(); 

        try {
            const response = await fetch('http://localhost:8080/api/tour-bookings/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    activityId: activityId, 
                    date: selectedDate,
                    startingTime: startingTime,
                    adults: numberOfAdults,
                    children: numberOfChildren
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to book the tour.');
            }

            const data = await response.json();
            showMessage(`Booking successful! Total Price: ${totalPrice} EGP.`, 'success');
            // Optionally, clear the form or redirect the user
        } catch (error) {
            console.error('Booking error:', error);
            showMessage(`Booking failed: ${error.message}`, 'error');
        } finally {
            setLoading(false); // Set loading to false after booking attempt
        }
    };

    return (
        <div className="tour-booking-card-container">
            <h3 className="tour-booking-card-title">BOOK A TOUR WITH A LOCAL TOUR GUIDE NOW</h3>
            <div className="tour-booking-inputs">
                <div className="tour-booking-input-group">
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        id="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div className="tour-booking-input-group" ref={peopleDropdownRef}>
                    <label htmlFor="people-dropdown">Number of People</label>
                    <div className="custom-dropdown-trigger" onClick={togglePeopleDropdown}>
                        {`Adults: ${numberOfAdults}, Children: ${numberOfChildren}`}
                        <span className="dropdown-arrow">▼</span>
                    </div>

                    {showPeopleDropdown && (
                        <div className="custom-dropdown-content">
                            <div className="counter-item">
                                <span>Adults:</span>
                                <div className="counter-controls">
                                    <button onClick={() => handleAdultsChange(-1)} disabled={numberOfAdults === 0}>-</button>
                                    <span>{numberOfAdults}</span>
                                    <button onClick={() => handleAdultsChange(1)}>+</button>
                                </div>
                            </div>
                            <div className="counter-item">
                                <span>Children:</span>
                                <div className="counter-controls">
                                    <button onClick={() => handleChildrenChange(-1)} disabled={numberOfChildren === 0}>-</button>
                                    <span>{numberOfChildren}</span>
                                    <button onClick={() => handleChildrenChange(1)}>+</button>
                                </div>
                            </div>
                            <button className="dropdown-done-button" onClick={() => setShowPeopleDropdown(false)}>Done</button>
                        </div>
                    )}
                </div>
            </div>

            <hr className="booking-divider" />

            <div className="booking-summary">
                <p>Starting Time of the tour : {startingTime}</p>
                <p>Price Per Adult: {pricePerAdult} EGP</p>
                <p>Price Per Child: {pricePerChild} EGP</p>
                <p>Total Price : {totalPrice} EGP</p>
                <button
                    className="book-now-button"
                    onClick={handleBookNow}
                    disabled={loading} // Disable button while loading
                >
                    {loading ? 'Booking...' : 'Book Now'}
                </button>
            </div>

            {/* Overlay and Message Box */}
            {messageBox.visible && (
                <div className="overlay">
                    <div className={`message-box ${messageBox.type}`}>
                        <p>{messageBox.message}</p>
                        <button onClick={hideMessageBox}>Done</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TourBookingCard;
