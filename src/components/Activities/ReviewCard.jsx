import React from 'react';
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
  return (
    <div className="review-card">
      <div className="review-header">
        <img 
          className="review-image" 
          src={review.image || 'https://via.placeholder.com/150'}  
        />
        <div>
          <span className="review-username">{review.name}</span>
          <p className="review-text">{review.text}</p>
        </div>
        <div className="review-info">
          <span className="review-date">{review.date}</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
