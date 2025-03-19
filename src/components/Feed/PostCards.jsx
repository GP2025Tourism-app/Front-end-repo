import React, { useEffect, useState } from "react";
import { FaRegComment, FaRegHeart, FaHeart, FaRegShareSquare } from "react-icons/fa";
import SkeletonPostCard from "./SkeletonPostCard";
import "./PostCard.css";

const PostCard = ({ selectedCategory }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [likedComments, setLikedComments] = useState({});
  
  useEffect(() => {
    if (selectedCategory && selectedCategory.length > 0) {
      fetchFilteredPosts(selectedCategory);
    } else {
      fetchPosts();
    }
  }, [selectedCategory]);
  useEffect(() => {
    fetchPosts();
  }, []);
  
  const fetchPosts = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    const currentUserId = localStorage.getItem("userId"); 
    try {
      const response = await fetch("http://localhost:8080/api/feed", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
  
      const data = await response.json();
      setPosts(data);
  
      const initialLikedPosts = {};
      data.forEach((post) => {
        initialLikedPosts[post.id] = post.likedUsr?.some(user => user.id === currentUserId) || false;
      });
      setLikedPosts(initialLikedPosts);

      const initialLikedComments = {};
      data.forEach((post) => {
        (post.comments || []).forEach(comment => {
          initialLikedComments[comment.id] = comment.likedUsers?.some(user => user?.id === currentUserId) || false;
        });
      });
      setLikedComments(initialLikedComments);
      setLikedComments(initialLikedComments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchFilteredPosts = async (categories) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("User not authenticated. Please log in.");
        return;
      }

      const categoryParams = categories.join(",");
      const url = `http://localhost:8080/api/feed/filter?categories=${encodeURIComponent(categoryParams)}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch filtered posts");
      }

      const data = await response.json();
      updatePostState(data, localStorage.getItem("userId"));
    } catch (error) {
      console.error("Error fetching filtered posts:", error);
    }finally {
      setLoading(false);
  }
  };

  const updatePostState = (data, currentUserId) => {
    setPosts(data);}
  
  const handleLike = async (postId) => {
    const token = localStorage.getItem("authToken");
    const currentUserId = localStorage.getItem("userId");
    const isLiked = likedPosts[postId]; 
  
    try {
      const response = await fetch(`http://localhost:8080/api/feed/${isLiked ? "unlike" : "like"}/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId }), 
      });
  
      if (!response.ok) {
        throw new Error(`Failed to ${isLiked ? "unlike" : "like"} post`);
      }
  
   
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
  
    
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              likedUsr: isLiked
                ? post.likedUsr.filter((user) => user.id !== currentUserId) 
                : [...post.likedUsr, { id: currentUserId }], 
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error(`Error ${isLiked ? "unliking" : "liking"} post:`, err.message);
    }
  };
  const handleCommentChange = (postId, text) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: text,
    }));
  };
  const handleComment = async (postId) => {
    const token = localStorage.getItem("authToken");
    const caption = commentInputs[postId];
  
    if (!caption) return; 
  
    try {
      const response = await fetch(`http://localhost:8080/api/feed/comment/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, caption }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      setCommentInputs((prev) => ({
        ...prev,
        [postId]: "",
      }));

      fetchPosts();
    } catch (err) {
      console.error("Error adding comment:", err.message);
    }
  };
  
  const handleLikeComment = async (postId, commentId) => {
    const token = localStorage.getItem("authToken");
    const currentUserId = localStorage.getItem("userId");
    const isLiked = likedComments[commentId];
  
    try {
      const response = await fetch(`http://localhost:8080/api/feed/${isLiked ? "unlikeComment" : "likeComment"}/${postId}/${commentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to ${isLiked ? "unlike" : "like"} comment`);
      }
  
      setLikedComments((prev) => ({
        ...prev,
        [commentId]: !isLiked,
      }));

      setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      likedUsers: isLiked
                        ? comment.likedUsers.filter((user) => user.id !== currentUserId)
                        : [...comment.likedUsers, { id: currentUserId }],
                    }
                  : comment
              ),
            }
          : post
      )
    );
    } catch (err) {
      console.error(`Error ${isLiked ? "unliking" : "liking"} comment:`, err.message);
    }
  };
  

  


  return (
    <div className="feed-container">
      <div className="feed-content">
      {loading
      ? [...Array(5)].map((_, index) => <SkeletonPostCard key={index} />)
      : posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-user">
                <img src={post.user.profilePic} alt="User Avatar" className="avatar" />
                <div className="user-info">
                  <h4 className="user-fullname">
                    {post.user?.firstname && post.user?.lastname
                      ? `${post.user.firstname} ${post.user.lastname}`
                      : "Unknown User"}
                  </h4>
                  <h6 className="user-name">@{post.user?.username}</h6>
                </div>
              </div>
              <span className="post-date">
                {post.dateTime ? new Date(post.dateTime).toDateString() : "Unknown Date"}
              </span>
            </div>
            <p className="post-text">
              <strong>{post.title}</strong>
              <br />
              {post.caption}
            </p>

            {post.visualsUrl?.length > 0 && (
              <>
                {post.visualsUrl[0].includes("video") ? (
                  <video src={post.visualsUrl[0]} controls className="post-media" />
                ) : (
                  <img src={post.visualsUrl[0]} alt="Post" className="post-image" />
                )}
              </>
            )}

            <div className="post-actions flex items-center justify-between">
              <div className="action-item-like-comment">
                <div className="action-item flex items-center gap-1">
                  <FaRegComment /> <span>{(post.comments || []).length}</span>
                </div>
                <div
                  className="action-item flex items-center gap-1 cursor-pointer"
                  onClick={() => handleLike(post.id)}
                >
                  {likedPosts[post.id] ? (
                    <FaHeart style={{ color: "red" }} />
                  ) : (
                    <FaRegHeart />
                  )}
                  <span>{post.likedUsr?.length || 0}</span>
                </div>
              </div>
              <div className="action-item flex items-center gap-1 ml-auto">
                <FaRegShareSquare /> <span>{post.shares || 0}</span>
              </div>
            </div>

            <div className="comment-section">
              <p className="comment-title">Replies</p>
              {(post.comments || []).map((comment) => (
                <div key={comment.id} className="comment">
                  <img src={comment.user.profilePic} alt="Commenter Avatar" className="comment-avatar" />
                  <div className="comment-content">
                    <p className="comment-user">
                      {comment.user?.firstname && comment.user?.lastname
                        ? `${comment.user.firstname} ${comment.user.lastname}`
                        : "Unknown User"}
                    </p>
                    <div className="comment-box">
                      {comment.caption}
                      <span className="comment-date">
                        {comment.dateTime ? new Date(comment.dateTime).toLocaleString() : ""}
                      </span>
                    </div>
                    <div className="comment-actions">
                    <div className="comment-likes" onClick={() => handleLikeComment(post.id, comment.id)}>
                        {likedComments[comment.id] ? (
                          <FaHeart style={{ color: "red" }} />
                        ) : (
                          <FaRegHeart />
                        )}
                        <span>{comment.likedUsers?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="comment-input-container">
              <img src={post.user.profilePic} alt="User Avatar" className="comment-avatar" />
              <input
                type="text"
                placeholder="Write a comment..."
                className="comment-input"
                value={commentInputs[post.id] || ""}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
              />
              <button className="comment-submit-btn" onClick={() => handleComment(post.id)}>
                Post
              </button>
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCard;
