import React from "react";
import "./Notification.css";
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import LGSidebar from "../../components/LocalGuide/LG-Sidebar";

function Notification() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Example data (you can later fetch this from your backend)
  const tours = [
    {
      title: "Giza Pyramids",
      date: "Thursday, 1 May 2025",
      time: "10:00 AM",
      adults: 2,
      children: 1
    },
    {
      title: "Giza Pyramids",
      date: "Thursday, 1 May 2025",
      time: "10:00 AM",
      adults: 2,
      children: 1
    }
  ];

  return (
    <>
      <WebsiteNavbar />
      <div className="notification-page">
      <div className="notification-container-sidebar">
        <LGSidebar />
       </div>
        <main className="notification-content">
          <h2 className="today-date">Today {today}</h2>
          {tours.map((tour, index) => (
            <div key={index} className="notification-card">
           <div class="notification-header">
                <div class="blue-dot-container">
                    <div class="blue-dot"></div>
                    <div class="vertical-line"></div>
                </div>
                <div className="notification-details">
                <div class="notification-title">
                    New Tour is Assigned for you
                </div>
                
                <div className="notification-trip-details">
                <span>{tour.title}</span>
                <span>{tour.date}</span>
                <span>Starting Time: {tour.time}</span>
                <span>{tour.adults} Adults {tour.children} Child</span>
               </div>
              </div>
              </div>
            </div>
          ))}
        </main>
      </div>

    </>
  );
}

export default Notification;
