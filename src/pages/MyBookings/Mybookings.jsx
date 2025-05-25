import React, { useEffect, useState } from "react";
import "./MyBookings.css";
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import Sidebar from "../../components/HomePageComponents/Sidebar";
import { FaComments, FaUserCircle, FaCalendarCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function MyBookings() {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const [bookingsRes, tourBookingsRes] = await Promise.all([
          fetch("http://localhost:8080/api/bookings/my-bookings", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch("http://localhost:8080/api/tour-bookings/my-bookings", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (!bookingsRes.ok || !tourBookingsRes.ok) {
          throw new Error("Failed to fetch one or both booking types.");
        }

        const bookingsData = await bookingsRes.json();
        const tourBookingsData = await tourBookingsRes.json();

        // Normalize both data types to a common format
        const normalizedBookings = bookingsData.map((b) => ({
          type: "trip",
          id: b.bookingId,
          title: b.tripResponseDto.title,
          date: new Date(b.tripResponseDto.fromDate),
          people: b.numOfPeople,
          status: b.status,
          totalPrice: b.totalPrice,
          guide: b.tripResponseDto.localGuide,
        }));

        const normalizedTourBookings = tourBookingsData.map((t) => ({
          type: "tour",
          id: t.tourBookingId,
          title: t.activity?.name || "Tour Activity",
          date: new Date(t.date),
          people: (t.adults || 0) + (t.children || 0),
          status: t.confirmed ? "Confirmed" : "Pending",
          totalPrice: t.totalPrice,
          guide: t.guide,
        }));

        const combined = [...normalizedBookings, ...normalizedTourBookings];

        // Sort by date
        combined.sort((a, b) => a.date - b.date);

        setAllBookings(combined);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  const handleCancel = (id) => {
    const updated = allBookings.filter((b) => b.id !== id);
    setAllBookings(updated);
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
          {allBookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <ul className="booking-list">
              {allBookings.map((booking) => (
                <li key={booking.id} className="booking-ticket">
                  <div className="ticket-left">
                    <FaCalendarCheck />
                  </div>
                  <div className="ticket-content">
                    <div className="ticket-title">
                      <h3>{booking.title}</h3>
                      <div className="status-and-id">
                        <span
                          style={{
                            color: "#A0A0A0",
                            marginLeft: "10px",
                            fontSize: "0.9em",
                            marginRight: "10px",
                          }}
                        >
                          Booking Number: {booking.id}
                        </span>
                        <span className={`status-badge ${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    <p>
                      <strong>Date:</strong> {booking.date.toLocaleDateString()}
                    </p>
                    {booking.time && <p><strong>Time:</strong> {booking.time}</p>}
                    <p>
                      <strong>People:</strong> {booking.people}
                    </p>
                    {booking.adults !== undefined && (
                      <p>
                        <strong>Adults:</strong> {booking.adults},{" "}
                        <strong>Children:</strong> {booking.children}
                      </p>
                    )}
                    <p className="price">
                      <strong>Total Price:</strong> {booking.totalPrice} EGP
                    </p>

                    <div className="guide-info">
                      <FaUserCircle className="guide-icon" />
                      <div>
                        <p>
                          <strong>Guide:</strong> {booking.guide?.firstname}{" "}
                          {booking.guide?.lastname}
                        </p>
                        <p>
                          <strong>Email:</strong> {booking.guide?.email}
                        </p>
                        {booking.guide?.phoneNumber && (
                          <p>
                            <strong>Phone:</strong> {booking.guide?.phoneNumber}
                          </p>
                        )}
                      </div>
                      {booking.guide?.username && ( // This condition should be met
                          <div
                            className="chat-icon"
                            title="Chat with Guide"
                            onClick={() =>
                              navigate("/TouristChat", {
                                state: {
                                  receiverUsername: booking.guide.username,
                                  receiverRole: "ROLE_LocalGuide",
                                },
                              })
                            }
                          >
                            <FaComments />
                          </div>
                        )}
                    </div>

                    {booking.status !== "Cancelled" && (
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