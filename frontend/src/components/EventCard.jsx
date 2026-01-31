import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  ClockIcon,
  LocationIcon,
  WifiIcon,
  TicketIcon,
  PriceIcon,
} from "../assets/icon-svg.jsx";
import "../styles/common/event-card.css";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  // Defensive check: if event is null/undefined or not an object, return null
  if (!event || typeof event !== "object") {
    return null;
  }

  // Determine status class
  const statusClass =
    event.status === "ongoing"
      ? "status ongoing"
      : event.status === "past"
        ? "status past"
        : "status upcoming";

  // Icons (using SVG from original code)

  // Safely format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "TBD";
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  const imageUrl = event.imageUrl
    ? event.imageUrl.startsWith("http")
      ? event.imageUrl
      : `http://localhost:5000/${event.imageUrl}`
    : "/Images/festival.png";



  return (
    <div className="event-card">
      <div className="top-half">
        <img
          className="event-image"
          src={imageUrl}
          alt={event.title || "Event"}
        />
        <div className={statusClass}>{event.status || "Upcoming"}</div>
      </div>

      <div className="event-detail">
        <p className="event-title">{event.title || "Untitled Event"}</p>
        <div className="event-catagory">{event.category || "General"}</div>

        <div className="time-and-location">
          <CalendarIcon />
          <div>{formatDate(event.date)}</div>

          <ClockIcon />
          <div>
            {event.startTime || "TBD"} - {event.endTime || "TBD"}
          </div>

          {event.eventType === "online" ? <WifiIcon /> : <LocationIcon />}
          <div>
            {event.location ||
              (event.eventType === "online" ? "Online" : "TBD")}
          </div>
        </div>
        <div className="description">
          {/* Show shortDescription if available, else truncate description */}
          {event.shortDescription
            ? event.shortDescription
            : event.description
              ? event.description.length > 50
                ? event.description.substring(0, 50) + "..."
                : event.description
              : "No description available."}
        </div>
      </div>

      <Link
        className="view-detail"
        to={event._id ? `/events/${event._id}` : "#"}
      >
        View Details
      </Link>
    </div>
  );
};

export default EventCard;
