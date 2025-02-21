import React , {useState} from "react";
import './FeedPage.css';
import { FaFilter, FaPlus } from "react-icons/fa";
import PostCard from "../../components/Feed/PostCards";
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import Sidebar from "../../components/HomePageComponents/Sidebar";
import SearchBar from "../../components/ReusableComp/SearchBar";
import filterIcon from "../../assets/images/Vector.png";
import avatar from '../../assets/images/Ellipse 10.png'

function FeedPage (){
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);


  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  const handleCategoryClick = (category) => {
    setSelectedCategory((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category) 
        : [...prevSelected, category] 
    );
  };
  const togglePostForm = () => {
    setShowPostForm(!showPostForm);
  };

    return (
     <>
      <WebsiteNavbar />
      <Sidebar />
      <div className="Feed-details">
        <div className="Search-Feed-Container">
        <div className="search-actions">
  <div className="search-container">
    <SearchBar />
  </div>

  <div className="buttons-group">
    <button className="filter-btn" onClick={toggleFilters}>
    <img src={filterIcon} alt="Create Post" className="custom-icon" />
    </button>
    <button className="create-post-btn" onClick={togglePostForm}>
      <FaPlus className="icon" /> Create
    </button>
  </div>
</div>
{showFilters && (
            <div className="filter-categories">
              {[
                "Historical Sites",
                "Food & Culinary Tours",
                "Nightlife",
                "Adventure Activities",
                "Cultural Experiences",
                "Shopping",
                "Relaxation & Wellness",
                "Beaches & Water Sports"
              ].map((category) => (
                <button
                  key={category}
                  className={`filter-category ${selectedCategory .includes(category) ? "selected" : ""}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

{showPostForm && (
            <>
              <div className="feed-overlay" onClick={togglePostForm}></div>
              <div className="feed-post-creation-form">
                <div className="feed-post-header">
                  <div className="feed-user-info">
                    <img src={avatar} alt="User" className="feed-user-avatar" />
                    <span className="feed-user-name">Peter</span>
                  </div>
                  <button className="feed-post-btn">Post</button>
                </div>
                <input type="text" placeholder="Add title" className="feed-post-title" />
                <textarea placeholder="Share a travel tip or ask a question..." className="feed-post-description"></textarea>
                <div className="feed-post-footer">
                  <button className="feed-add-media-btn">+ Video</button>
                  <button className="feed-add-media-btn">+ Photo</button>
                </div>
              </div>
            </>
          )}
        </div>
        <PostCard />
      </div>
    </>
  );
}
export default FeedPage;