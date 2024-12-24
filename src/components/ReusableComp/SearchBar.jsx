import React from "react";
import searchIcon from '../../assets/images/Icons/zoom-in.svg';
import './SearchBar.css';
import  { useState } from 'react';

function SearchBar(){
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
      };
    return(
        <div className="sticky-search-bar-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-bar-activity"
        />
        <img src={searchIcon} alt="Search Icon" className="search-bar-activity-icon" />
      </div>

    );
}
export default SearchBar;