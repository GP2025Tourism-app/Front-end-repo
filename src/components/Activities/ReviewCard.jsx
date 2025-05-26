import React, { useState } from 'react';
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
  const [showModal, setShowModal] = useState(false);

  const renderStars = (rating) => {
    const maxStars = 5;
    return [...Array(maxStars)].map((_, index) => (
      <span key={index} className={index < rating ? 'star filled' : 'star'}>&#9733;</span>
    ));
  };

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <img 
          className="review-image" 
          src={review.image || 'https://via.placeholder.com/150'}  
          alt={review.name || 'User'}
        />
        <div>
          <span className="review-username">
            {review.name}
            {review.approved && <span className="verified-icon" title="Verified"></span>}
          </span>
          <div className="review-stars">{renderStars(review.rating)}</div>
          <p className="review-text">{review.text}</p>
        </div>
        <div className="review-info">
          <span className="review-date">{review.date}</span>
        </div>
      </div>

      {review.visualsUrl && review.visualsUrl.length > 0 && (
        <div className="visual-card">
          <img 
            src={review.visualsUrl[0]} 
            alt="Review Visual" 
            onClick={handleImageClick}
            className="review-visual-preview"
          />
        </div>
      )}

      {showModal && (
        <div className="review-modal-overlay" onClick={handleCloseModal}>
          <img 
            src={review.visualsUrl[0]} 
            alt="Full View" 
            className="review-modal-image" 
          />
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
