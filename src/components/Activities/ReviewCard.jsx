// ReviewCard.js
import React from 'react';
import './ReviewCard.css'; // Create a CSS file for styles

const ReviewCard = ({ review }) => {
  return (
    <div className="review-card">
      <div className="review-header">
        
      <span className="review-username">{review.userId}</span>
        <span className="review-score">{review.rating}</span>
        <span className="review-date">{review.date}</span>
      </div>
      <p className="review-text">{review.text}</p>
    </div>
  );
};

export default ReviewCard;