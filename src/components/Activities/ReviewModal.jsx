import React, { useState } from "react";
import "./ReviewModal.css"; 
const CLOUD_NAME = "da6gcu1n9";
const UPLOAD_PRESET = "graduationproject";
const ReviewModal = ({ isOpen, closeModal, submitReview }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  
const [mediaFiles, setMediaFiles] = useState([]);
const [previewUrls, setPreviewUrls] = useState([]);
  
const handleFileUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

const handleFileChange = async (event) => {
  const files = Array.from(event.target.files);
  const urls = await Promise.all(files.map((file) => handleFileUpload(file)));
  setMediaFiles((prev) => [...prev, ...urls.filter((url) => url)]);
  setPreviewUrls((prev) => [...prev, ...urls.filter((url) => url)]);
};

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

        <p className="review-modal-subtitle">Add visuals (optional)</p>
<input 
  type="file" 
  accept="image/*" 
  multiple 
  onChange={handleFileChange}
  className="review-modal-file-upload-input"
/>

<div className="review-modal-preview-images">
  {previewUrls.map((url, index) => (
    <img key={index} src={url} alt={`Preview ${index}`} className="review-modal-preview-thumbnail" />
  ))}
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
              submitReview({
                rating,
                comment: reviewText,
                visualsUrl:mediaFiles, 
              });
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
