import React, { useState, useEffect } from "react";
import "./Notification.css";
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import LGSidebar from "../../components/LocalGuide/LG-Sidebar";
import LoadingScreen from '../../components/loadingscreen/loadingScreen';

function Notification() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  
  const [notifications, setNotifications] = useState([]);// State to store the fetched tours
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); 
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/notifications", {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`, 
       
          },
        });

        if (!response.ok) {
          // Handle different status codes for better error messages
          if (response.status === 401) {
            throw new Error("Unauthorized: Please log in again.");
          } else if (response.status === 403) {
            throw new Error("Forbidden: You don't have permission to access this resource.");
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError(`Failed to load notifications: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);// The empty dependency array ensures this effect runs only once after the initial render

  if (loading) {
    return (
      <>
        <WebsiteNavbar />
        <div className="notification-page">
          <div className="notification-container-sidebar">
            <LGSidebar />
          </div>
          <main className="notification-content">
            <h2 className="today-date">Today {today}</h2>
            <LoadingScreen isLoading={loading} />
          </main>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <WebsiteNavbar />
        <div className="notification-page">
          <div className="notification-container-sidebar">
            <LGSidebar />
          </div>
          <main className="notification-content">
            <h2 className="today-date">Today {today}</h2>
            <div className="error-message">{error}</div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <WebsiteNavbar />
      <div className="notification-page">
        <div className="notification-container-sidebar">
          <LGSidebar />
        </div>
        <main className="notification-content">
          <h2 className="today-date">Today {today}</h2>
          {notifications.length === 0 ? (
            <div className="no-notifications">No new tours assigned.</div>
          ) : (
            notifications.map((notification, index) => (
              <div key={index} className="notification-card">
                <div className="notification-header">
                  <div className="blue-dot-container">
                    <div className="blue-dot"></div>
                    <div className="vertical-line"></div>
                  </div>
                  <div className="notification-details">
                    <div className="notification-title">
                    <span>{notification.title || 'N/A'}</span>
                    </div>
                    <div className="notification-trip-details">
                      {/* Assuming your backend sends data with these keys. Adjust if necessary. */}
                      <span>{notification.booking?.activity?.name || 'N/A'}</span>
<span>{notification.booking?.date ? new Date(notification.booking.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : 'N/A'}</span>
<span>Starting Time: {'9:00 AM'}</span>
<span>{notification.booking?.adults || 0} Adults {notification.booking?.children || 0} Child</span>

                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </>
  );
}

export default Notification;