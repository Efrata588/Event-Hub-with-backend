import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";
import EventCard from "../components/EventCard";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import "../styles/home-page/home.css";
import "../styles/home-page/home-controls.css";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("upcoming");
  const [category, setCategory] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const { user } = useAuth();

  // Fetch events with current filters
  const fetchEvents = async () => {
    try {
      const response = await api.get("/events", {
        params: {
          type: view,
          search: searchTerm,
          category,
        },
      });
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Fetch on initial render and whenever filters change
  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, searchTerm, category]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);

    // Remove search param from URL if input cleared
    if (e.target.value === "") {
      const params = new URLSearchParams();
      navigate(`/?${params.toString()}`);
    }
  };

  // Trigger search on Enter key
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") submitSearch();
  };

  // Trigger search on button click
  const submitSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    navigate(`/?${params.toString()}`);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
  };

  return (
    <div className="home-container">
      <div className="home-controls">
        <h1>Discover Events</h1>

        <div className="search-filter-bar">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for Events"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
            />
            <button
              type="button"
              className="search-btn"
              onClick={submitSearch}
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 30 30"
                strokeWidth="3"
                stroke="currentColor"
                className="search-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>

          <select
            value={category}
            onChange={handleCategoryChange}
            className="category-select"
          >
            <option value="">All Categories</option>
            <option value="Music">Music</option>
            <option value="Technology">Technology</option>
            <option value="Art">Art</option>
            <option value="Business">Business</option>
            <option value="Health">Health</option>
          </select>
        </div>

        {/* {user?.role === "organizer" && ( */}
        <div className="toggle-buttons">
          <button
            className={`toggle-btn ${view === "upcoming" ? "active" : ""}`}
            onClick={() => setView("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`toggle-btn ${view === "past" ? "active" : ""}`}
            onClick={() => setView("past")}
          >
            Past
          </button>
        </div>
        {/* )} */}
      </div>

      <div className="events-grid">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>

      {events.length === 0 && (
        <div className="no-events">
          <p>
            No {view} events found
            {searchTerm && ` matching "${searchTerm}"`}
            {category && ` in category "${category}"`}.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
