import React, { useState } from "react";
import searchIcon from '../../assets/images/Icons/zoom-in.svg';
import './SearchBar.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value === "") {
            setShowResults(false);
        }
    };

    const handleSearchSubmit = async () => {
        if (searchQuery.trim() === "") {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/ai/search",
                { query: searchQuery },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log("Search API Response:", response.data);

            if (Array.isArray(response.data)) {
                setSearchResults(response.data);
                setShowResults(true);
            } else {
                setSearchResults([]);
                setShowResults(false);
                console.warn("Expected an array of activities, but got:", response.data);
            }
        } catch (error) {
            console.error("Error during semantic search:", error);
            setSearchResults([]);
            setShowResults(false);
        }
    };

    const handleResultClick = (activity) => {
        console.log("Navigating to activity:", activity.activityId);
        navigate(`/activity/${activity.activityId}/city/${activity.cityId}`);
        setSearchQuery("");
        setSearchResults([]);
        setShowResults(false);
    };

    const handleIconClick = () => {
        handleSearchSubmit();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    return (
        <div className="sticky-search-bar-container">
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                className="search-bar-activity"
            />
            <img
                src={searchIcon}
                alt="Search Icon"
                className="search-bar-activity-icon"
                onClick={handleIconClick}
            />

            {showResults && searchResults.length > 0 && (
                <div className="search-results-dropdown">
                    {searchResults.map((activity) => (
                        <div
                            key={activity.activityId}
                            className="search-result-item"
                            onClick={() => handleResultClick(activity)}
                        >
                            {activity.name || activity.title || `Activity ${activity.activityId}`}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchBar;
