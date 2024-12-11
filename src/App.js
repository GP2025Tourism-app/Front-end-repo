import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import QuestionnairePage from './pages/Questionnaire/QuestionnairePage';
import React from 'react';

function App() {
  return (
    <Router basename="/Front-end-repo">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/questionnaire" element={<QuestionnairePage />} />
      </Routes>
    </Router>
  );
}

export default App;
