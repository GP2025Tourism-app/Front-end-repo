// LoadingScreen.js
import React from 'react';
import './LoadingScreen.css'; // Adjust the path as necessary

const LoadingScreen = ({ isLoading }) => {
    if (!isLoading) return null; // Don't render if not loading

    return (
        <div className="loading-screen">
            <div className="loader"></div>
            <p className="loading-text">Exploring the wonders...</p>
            <p className="loading-subtext">Hang tight while we gather the best for you!</p>
        </div>
    );
};

export default LoadingScreen;