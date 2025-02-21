import React from "react";
import { FaRegComment, FaRegHeart ,FaRegShareSquare} from "react-icons/fa";
import avatar from "../../assets/images/Ellipse 10.png";
import post from "../../assets/images/image 2.png";
import "./PostCard.css";

const posts = [
  {
    id: 1,
    user: "Peter",
    role: "Tourist",
    date: "30 Nov",
    text: "Lets Explore Egypt. Cras sit amet nibh libero, in gravida nulla.",
    image: post,
    comments: [
      {
        id: 1,
        user: "Eloise",
        text: "What time next year are you guys keen to go?",
        date: "Nov 25",
      },
    ],
  },
  {
    id: 1,
    user: "Peter",
    role: "Tourist",
    date: "30 Nov",
    text: "Lets Explore Egypt. Cras sit amet nibh libero, in gravida nulla.",
    image: post,
    comments: [
      {
        id: 1,
        user: "Eloise",
        text: "What time next year are you guys keen to go?",
        date: "Nov 25",
      },
      {
        id: 2,
        user: "Eloise",
        text: "What time next year are you guys keen to go?",
        date: "Nov 25",
      },
      {
        id: 3,
        user: "Eloise",
        text: "What time next year are you guys keen to go?",
        date: "Nov 25",
      },
    ],
  },
];

const PostCard = () => {
  return (
    <div className="feed-container">
      <div className="feed-content">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-user">
                <img src={avatar} alt="User Avatar" className="avatar" />
                <div className="user-info">
                  <h4 className="user-name">{post.user}</h4>
                  <p className="user-role">{post.role}</p>
                </div>
              </div>
              <span className="post-date">{post.date}</span>
            </div>
            <p className="post-text"><em>{post.text}</em></p>
            <img src={post.image} alt="Post" className="post-image" />
            <div className="post-actions flex items-center justify-between">
            
              <div className="action-item-like-comment">
                <div className="action-item flex items-center gap-1">
                  <FaRegComment /> <span>3</span>
                </div>
                <div className="action-item flex items-center gap-1">
                  <FaRegHeart /> <span>3</span>
                </div>
            </div>
            <div className="action-item flex items-center gap-1 ml-auto">
                <FaRegShareSquare /> <span>3</span>
            </div>
          </div>
            <div className="comment-section">
              <p className="comment-title">Replies</p>
              {post.comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <img
                    src={avatar}
                    alt="Commenter Avatar"
                    className="comment-avatar"
                  />
                  <div className="comment-content">
                    <p className="comment-user">{comment.user}</p>                
                    <div className="comment-box">
                      {comment.text}
                      <span className="comment-date">{comment.date}</span>
                    </div>
                    <div className="comment-actions">
                      <span className="comment-reply">Reply</span>
                      <div className="comment-likes">
                        <FaRegHeart /> <span>3</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          <div className="comment-input-container">
          <img src={avatar} alt="User Avatar" className="comment-avatar" />
          <input
            type="text"
            placeholder="Write a comment..."
            className="comment-input"
          />
        </div>
        </div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default PostCard;
