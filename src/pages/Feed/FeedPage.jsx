import React from "react";
import './FeedPage.css';
import PostCard from "../../components/Feed/PostCards";
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import Sidebar from "../../components/HomePageComponents/Sidebar";
import SearchBar from "../../components/ReusableComp/SearchBar";


function FeedPage (){


    return (
     <>
     <WebsiteNavbar />
      <Sidebar />
      <div className="Feed-details">
        <div className="Search-Feed-Container">
          <SearchBar />
        </div>
        <PostCard/>
      </div>
     </>
    );
}
export default FeedPage;