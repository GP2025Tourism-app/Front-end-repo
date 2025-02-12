import React from 'react';
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
  // Function to generate star icons based on rating
  const renderStars = (rating) => {
    const maxStars = 5;
    return [...Array(maxStars)].map((_, index) => (
      <span key={index} className={index < rating ? 'star filled' : 'star'}>&#9733;</span>
    ));
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <img 
          className="review-image" 
          src={review.image || 'https://via.placeholder.com/150'}  
          alt={review.name}
        />
        <div>
          <span className="review-username">{review.name}</span>
          <div className="review-stars">{renderStars(review.rating)}</div>
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
