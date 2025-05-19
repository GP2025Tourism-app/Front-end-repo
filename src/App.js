import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import QuestionnairePage from './pages/Questionnaire/QuestionnairePage';
import ProtectedRoute from './ProtectedRoute'; 
import HomePage from './pages/Homepage/HomePage';
import ActivityPage from './pages/ActivityPage/ActivityPage';
import DiscoverCityDetails from './pages/DiscoverCity/DiscoverCityPage';
import FeedPage from './pages/Feed/FeedPage';
import Favourites from './pages/Favourites/FavouritesPage';
import ViewTouristProfile from './pages/TouristProfile/ViewTouristProfile';
import EditTouristProfile from './pages/TouristProfile/EditTouristProfile';
import TouristChat from './pages/TouristMessages/TouristChat';
import AIChat from './pages/AI-Assistant/AIChat';
import LgHomepage from './pages/LG-HomePage/LG-Homepage';
import Notification from './pages/LG-Notification/Notification';
import LGPlanNewTrip from './pages/LG-PlanTrip/LG-PlanNewTrip';
import LGViewTrips from './pages/LG-PlanTrip/LG-ViewTrips';
import MyBookings from './pages/MyBookings/Mybookings';


function App() {
  return (
    <Router basename="/Front-end-repo">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected routes */}
        <Route
          path="/questionnaire"
          element={<ProtectedRoute element={<QuestionnairePage />} />}
        />
         <Route
          path="/homepage"
          element={<ProtectedRoute element={<HomePage />} />}
        />
        <Route
          path="/activity/:activityId/city/:cityId"
          element={<ProtectedRoute element={<ActivityPage/>} />}
        />
        <Route
          path="/discover-city/:id"
          element={<ProtectedRoute element={<DiscoverCityDetails/>} />}
        />
        <Route
          path="/feed"
          element={<ProtectedRoute element={<FeedPage/>} />}
        />
         <Route
          path="/my-bookings"
          element={<ProtectedRoute element={<MyBookings/>} />}
        />
        <Route
          path="/favourites"
          element={<ProtectedRoute element={<Favourites/>} />} 
        />
        <Route
          path="/ViewTouristProfile"
          element={<ProtectedRoute element={<ViewTouristProfile/>} />} 
        />
        <Route
          path="/EditTouristProfile"
          element={<ProtectedRoute element={<EditTouristProfile/>} />} 
        />
         <Route
          path="/TouristChat"
          element={<ProtectedRoute element={<TouristChat/>} />} 
        />
         <Route
          path="/ai-assistant"
          element={<ProtectedRoute element={<AIChat/>} />} 
        />
          <Route
          path="/tour-guide-homepage"
          element={<ProtectedRoute element={<LgHomepage/>} />} 
        />
          <Route
          path="/notification"
          element={<ProtectedRoute element={<Notification/>} />} 
        />
          <Route
          path="/plan-new-trip"
          element={<ProtectedRoute element={<LGPlanNewTrip/>} />} 
        />
           <Route
          path="/localGuide-View-trips/:tripId"
          element={<ProtectedRoute element={<LGViewTrips/>} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
