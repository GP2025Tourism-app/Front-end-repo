import React, { useEffect, useState } from "react";
import "./MyBookings.css";
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import Sidebar from "../../components/HomePageComponents/Sidebar";
import { FaComments, FaUserCircle } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const dummyBookings = [
        {
          id: 1,
          packageName: "Giza Pyramids Adventure",
          date: "2025-06-10",
          people: 2,
          status: "Confirmed",
          totalPrice: 120,
          guide: {
            name: "Ahmed Youssef",
            phone: "+20 100 123 4567",
            email: "ahmed.youssef@example.com",
          },
        },
        {
          id: 2,
          packageName: "Luxor Temple Discovery",
          date: "2025-06-20",
          people: 4,
          status: "Pending",
          totalPrice: 240,
          guide: {
            name: "Mona Khaled",
            phone: "+20 112 789 1234",
            email: "mona.khaled@example.com",
          },
        },
      ];
      setBookings(dummyBookings);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCancel = (id) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    alert("Booking cancelled!");
  };

  if (loading) return <p className="loading">Loading bookings...</p>;

  return (
    <>
      <WebsiteNavbar />
      <div className="mybooking-page-container">
        <div className="mybookings-sidebar">
          <Sidebar />
        </div>
        <div className="mybookings-page">
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="booking-list">
          {bookings.map((booking) => (
            <li key={booking.id} className="booking-ticket">
              <div className="ticket-left"><FaCalendarCheck /></div>
              <div className="ticket-content">
                <div className="ticket-title">
                  <h3>{booking.packageName}</h3>
                  <span className={`status-badge ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>
                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                <p><strong>People:</strong> {booking.people}</p>
                <p><strong>Booking ID:</strong> {booking.id}</p>
                <p className="price"><strong>Total Price:</strong> ${booking.totalPrice}</p>

                <div className="guide-info">
                  <FaUserCircle className="guide-icon" />
                  <div>
                    <p><strong>Guide:</strong> {booking.guide.name}</p>
                    <p><strong>Email:</strong> {booking.guide.email}</p>
                    <p><strong>Phone:</strong> {booking.guide.phone}</p>
                  </div>
                  <a href={`mailto:${booking.guide.email}`} className="chat-icon" title="Chat with Guide">
                    <FaComments />
                  </a>
                </div>

                {booking.status !== 'Cancelled' && (
                  <button
                    className="mybookings-cancel-button"
                    onClick={() => handleCancel(booking.id)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
    </>
  );
}

export default MyBookings;
