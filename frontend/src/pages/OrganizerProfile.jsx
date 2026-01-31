import React, { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import EventCard from "../components/EventCard";
import "../styles/organizer-profile.css";
import "../styles/home-page/home.css"; // For grid styles
import "../styles/home-page/home-controls.css"; // For search bar styles
import "../styles/common/back-button.css";

const OrganizerProfile = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  // Removed unused search param reading if not needed, but keeping for filter consistency just in case
  const search = searchParams.get("search") || "";

  const [organizer, setOrganizer] = useState(null);
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("upcoming"); // 'upcoming' or 'past'
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // Removed isFollowing state
  // const { user } = useAuth(); // Get current user (unused now)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch Organizer Data
        const userRes = await api.get(`/users/organizers/${id}`);
        setOrganizer(userRes.data);
      } catch (error) {
        console.error("Failed to fetch organizer profile", error);
      }
    };

    fetchProfile();
  }, [id]);

  const fetchEvents = async () => {
    try {
      const params = { organizerId: id, type: view };
      if (search) params.search = search;
      if (category) params.category = category;

      console.log("Fetching events for organizer:", params);
      const response = await api.get("/events", { params });
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  };

  // Initial Fetch & View/Search/Category Change
  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, view, search, category]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page org-profile">
      <Link className="back" to="/">
        <span>&#11013;</span> Back
      </Link>

      <div className="profile-in-organizer-page">
        <img
          className="profile-picture"
          src={
            organizer?.profilePicture
              ? organizer.profilePicture.startsWith("http")
                ? organizer.profilePicture
                : `http://localhost:5000/${organizer.profilePicture}`
              : "/Images/EventHub-strikingly-logo-2025-11-29/logo-favicon.png"
          }
          alt="Profile"
        />
        <div className="middle">
          <div className="org-name">{organizer?.name || "Organizer Name"}</div>
          <div className="org-info">
            <div className="info-type">
              <div className="info-title">Events</div>
              <div className="amount">{organizer.eventsCount || 0}</div>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          {/* Added contact or other actions later if needed */}
        </div>
      </div>

      <div className="toggle-buttons">
        <button
          type="button"
          className={`toggle-btn ${view === "upcoming" ? "active" : ""}`}
          onClick={() => setView("upcoming")}
        >
          Upcoming
        </button>
        <button
          type="button"
          className={`toggle-btn ${view === "past" ? "active" : ""}`}
          onClick={() => setView("past")}
        >
          Past Events
        </button>
      </div>

      {/* Filter Bar (Search via Navbar) */}
      <div className="home-controls" style={{ marginTop: "20px" }}>
        <div
          className="search-filter-bar"
          style={{ justifyContent: "flex-start" }}
        >
          <select
            value={category}
            onChange={handleCategoryChange}
            className="category-select"
            style={{ width: "200px" }}
          >
            <option value="">All Categories</option>
            <option value="Music">Music</option>
            <option value="Technology">Technology</option>
            <option value="Art">Art</option>
            <option value="Business">Business</option>
            <option value="Health">Health</option>
          </select>
        </div>
      </div>

      <div className="events-grid">
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event._id} event={event} />)
        ) : (
          <div
            className="no-events"
            style={{ width: "100%", textAlign: "center", marginTop: "30px" }}
          >
            <p style={{ fontSize: "18px", color: "#666" }}>
              No {view} events found {search && `matching "${search}"`}
              {category && ` in category "${category}"`}.
            </p>
            {search && (
              <p style={{ fontSize: "14px", color: "#888" }}>
                Try clearing filters or switching to{" "}
                {view === "upcoming" ? "Past" : "Upcoming"} events.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerProfile;
