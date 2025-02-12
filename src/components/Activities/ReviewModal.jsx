import React, { useState } from "react";
import "./ReviewModal.css"; 

const ReviewModal = ({ isOpen, closeModal, submitReview }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="review-modal-content">
        <button className="close-review-button" onClick={closeModal}> &times;</button>
        <h2 className="review-modal-title">Add Review</h2>
        
        <p className="review-modal-subtitle">How would you rate your experience?</p>
        <div className="addreview-star-rating">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <span
                key={index}
                className={`addreview-star ${starValue <= (hover || rating) ? "selected" : ""}`}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(starValue)}
              >
                &#9733;
              </span>
            );
          })}
        </div>

        <p className="review-modal-subtitle">Write your review</p>
        <textarea
          className="review-textarea"
          placeholder="Tell us about your experience..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        <div className="modal-actions">
          <button className="cancel-button" onClick={closeModal}>Cancel</button>
          <button 
            className="save-button" 
            onClick={() => {
              if (rating === 0 || reviewText.trim() === "") {
                alert("Please provide a rating and a review.");
                return;
              }
              submitReview({ rating, comment: reviewText });
              closeModal();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
