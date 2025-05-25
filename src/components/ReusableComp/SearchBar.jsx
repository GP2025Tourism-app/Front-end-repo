import React, { useState } from "react";
import searchIcon from '../../assets/images/Icons/zoom-in.svg';
import './SearchBar.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [loadingResults, setLoadingResults] = useState(false); // New state for loading
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value === "") {
            setShowResults(false);
            setSearchResults([]); // Clear previous results when search query is empty
        } else {
            // Optionally, you might want to trigger a search here with a debounce
            // For now, we'll keep search on submit/enter/icon click
            setShowResults(true); // Show dropdown as soon as user types
        }
    };

    const handleSearchSubmit = async () => {
        if (searchQuery.trim() === "") {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setLoadingResults(true); // Start loading
        setShowResults(true); // Ensure dropdown is visible when loading

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
            } else {
                setSearchResults([]);
                console.warn("Expected an array of activities, but got:", response.data);
            }
        } catch (error) {
            console.error("Error during semantic search:", error);
            setSearchResults([]);
        } finally {
            setLoadingResults(false); // End loading
        }
    };

    const handleResultClick = (activity) => {
        console.log("Navigating to activity:", activity.activityId);
        navigate(`/activity/${activity.activityId}/city/${activity.cityId}`);
        setSearchQuery("");
        setSearchResults([]);
        setShowResults(false); // Hide results after navigation
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

            {showResults && ( // Show dropdown if showResults is true
                <div className="search-results-dropdown">
                    {loadingResults ? (
                        <div className="search-loading-message">Loading results...</div>
                    ) : searchResults.length > 0 ? (
                        searchResults.map((activity) => (
                            <div
                                key={activity.activityId}
                                className="search-result-item"
                                onClick={() => handleResultClick(activity)}
                            >
                                {activity.name || activity.title || `Activity ${activity.activityId}`}
                            </div>
                        ))
                    ) : (
                        searchQuery.trim() !== "" && <div className="search-no-results">No results found.</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBar;