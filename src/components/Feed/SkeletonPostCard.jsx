import React from "react";
import "./SkeletonPostCard.css";

const SkeletonPostCard = () => {
  return (
    <div className="post-card skeleton">
      <div className="post-header">
        <div className="post-user">
          <div className="avatar skeleton-box"></div>
          <div className="user-info">
            <div className="skeleton-box skeleton-text"></div>
            <div className="skeleton-box skeleton-text"></div>
          </div>
        </div>
        <div className="skeleton-box skeleton-text small"></div>
      </div>

      <div className="post-text">
        <div className="skeleton-box skeleton-title"></div>
        <div className="skeleton-box skeleton-caption"></div>
      </div>

      <div className="skeleton-box skeleton-image"></div>

      <div className="post-actions">
        <div className="skeleton-box skeleton-icon"></div>
        <div className="skeleton-box skeleton-icon"></div>
        <div className="skeleton-box skeleton-icon"></div>
      </div>
    </div>
  );
};

export default SkeletonPostCard;
