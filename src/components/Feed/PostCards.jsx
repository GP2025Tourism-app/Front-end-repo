import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './PostCard.css';

export default function PostCard() {
  return (
    <div className="Postcard shadow-sm rounded-3 mb-4">
   
      <div className="postcard-body">
        <div className="d-flex align-items-center">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="rounded-circle me-2"
          />
          <div>
            <h6 className="mb-0">Peter</h6>
            <small className="text-muted">Tourist • 30 Nov</small>
          </div>
        </div>

        {/* Post Content */}
        <p className="mt-2 fst-italic text-muted">Let's Explore Egypt</p>
        <p className="mt-1 text-dark">
          Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin...
        </p>

        {/* Post Image */}
        <img
          src="https://via.placeholder.com/600x300"
          alt="Post"
          className="img-fluid rounded mt-3"
        />

        {/* Interaction Buttons */}
        <div className="d-flex justify-content-between align-items-center mt-3 text-muted">
          <div className="d-flex gap-3">
            <button className="btn btn-link p-0 text-decoration-none">
              ❤️ <span>3</span>
            </button>
            <button className="btn btn-link p-0 text-decoration-none">
              💬 <span>3</span>
            </button>
            <button className="btn btn-link p-0 text-decoration-none">
              🔄 <span>3</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-4">
          <h6 className="fw-bold">Replies</h6>
          <div className="mt-2 p-2 bg-light rounded">
            <div className="d-flex align-items-center">
              <img
                src="https://via.placeholder.com/35"
                alt="User"
                className="rounded-circle me-2"
              />
              <div className="d-flex justify-content-between w-100">
                <p className="fw-semibold mb-0">Eloise</p>
                <small className="text-muted">Nov 25</small>
              </div>
            </div>
            <p className="mt-1 text-dark">
              What time next year are you guys keen to go?
            </p>
          </div>
          <button className="btn btn-link text-primary p-0 mt-2">Reply</button>
        </div>

        {/* Comment Input */}
        <div className="mt-3 input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Write a Comment"
          />
        </div>
      </div>
    </div>
  );
}
