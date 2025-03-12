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
          path="/favourites"
          element={<ProtectedRoute element={<Favourites/>} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
