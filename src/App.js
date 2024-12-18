import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import QuestionnairePage from './pages/Questionnaire/QuestionnairePage';
import ProtectedRoute from './ProtectedRoute'; // Import ProtectedRoute
import HomePage from './pages/Homepage/HomePage';

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
      </Routes>
    </Router>
  );
}

export default App;
