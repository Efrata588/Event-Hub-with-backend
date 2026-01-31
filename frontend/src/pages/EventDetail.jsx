import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import {
  CalendarIcon,
  ClockIcon,
  LocationIcon,
  WifiIcon,
  TicketIcon,
  PriceIcon,
} from "../assets/icon-svg.jsx";
import "../styles/view-detail.css";
import "../styles/common/back-button.css";

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [organizerStats, setOrganizerStats] = useState({
    events: 0,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isParticipating, setIsParticipating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventRes = await api.get(`/events/${id}`);
        setEvent(eventRes.data);

        const orgId = eventRes.data.organizer._id;

        // Fetch Organizer Full Profile for Stats & Picture
        const orgRes = await api.get(`/users/organizers/${orgId}`);
        setOrganizer(orgRes.data);

        // Fetch Events Count
        const eventsRes = await api.get(`/events`, {
          params: { organizerId: orgId },
        });
        setOrganizerStats({
          events: eventsRes.data.length,
        });

        if (user) {
          const profileRes = await api.get("/users/profile");
          // ... rest of logic
          const saved = profileRes.data.savedEvents || [];
          setIsSaved(saved.some((e) => e._id === id || e === id));

          const participated = profileRes.data.participatedEvents || [];
          setIsParticipating(
            participated.some((e) => e._id === id || e === id),
          );
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id, user]);

  const handleSave = async () => {
    if (!user) return;
    try {
      await api.put(`/users/save/${id}`);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  const handleParticipate = async () => {
    if (!user) return;
    try {
      await api.put(`/users/participate/${id}`);
      setIsParticipating(!isParticipating);
    } catch (error) {
      console.error("Participate failed", error);
    }
  };

  if (!event) return <div>Loading...</div>;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="view-detail-page">
      <Link className="back" to="/">
        <span>&#11013;</span> Back
      </Link>

      <div className="container">
        <img
          src={
            event.imageUrl
              ? event.imageUrl.startsWith("http")
                ? event.imageUrl
                : `http://localhost:5000/${event.imageUrl}`
              : "../Images/festival.png"
          }
          alt={event.title}
        />
      </div>

      <div className="bottom-half">
        <div className="bottom-half-left">
          <div className="descrption-container">
            <div className="short-description">
              <h3>{event.title}</h3>
              <p>{event.shortDescription}</p>
            </div>
            <div className="about">
              <h2>About this event</h2>
              <p>{event.description}</p>
            </div>
          </div>

          <h2>Organized By</h2>

          <div className="profile">
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
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div className="middle">
              <Link className="org-name" to={`/organizers/${organizer?._id}`}>
                {organizer?.name || "Organizer Name"}
              </Link>
              <div className="org-info">
                <div className="info-type">
                  <div className="info-title">Events</div>
                  <div className="amount">{organizerStats.events}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="event-details">
          <h3>Event Details</h3>
          <div className="time-and-location">
            <div className="icon-wraper" style={{ width: "24px" }}>
              <CalendarIcon />
            </div>

            <div className="detail">
              <div>Date</div>
              <div className="more-detail">{formatDate(event.date)}</div>
            </div>

            <div className="icon-wraper" style={{ width: "24px" }}>
              <ClockIcon />
            </div>
            <div className="detail">
              <div>Time</div>
              <div className="more-detail">
                {event.startTime} - {event.endTime}
              </div>
            </div>

            <div className="icon location" style={{ width: "24px" }}>
              {event.eventType === "online" ? <WifiIcon /> : <LocationIcon />}
            </div>
            <div className="detail">
              {event.eventType == "online" ? (
                <>
                  <div>Online</div>
                  <a className="more-detail">{event.link}</a>
                </>
              ) : (
                <>
                  <div>Location</div>
                  <div className="more-detail">{event.location}</div>
                </>
              )}
            </div>
          </div>

          <hr />
          <hr />

          {event.eventType !== "online" && (
            <div className="ticket-and-price">
              <div className="icon-wraper" style={{ width: "24px" }}>
                <TicketIcon />
              </div>
              <div className="detail">
                <div>Available Tickets</div>
                <div className="more-detail">
                  {event.availableTickets !== undefined &&
                    event.availableTickets !== null &&
                    event.availableTickets !== ""
                    ? `${event.availableTickets} tickets left`
                    : "Not mentioned"}
                </div>
              </div>

              <div className="icon-wraper" style={{ width: "24px" }}>
                <PriceIcon />
              </div>
              <div className="detail">
                <div>Price</div>
                <div className="more-detail">
                  {event.availablePrice !== undefined &&
                    event.availablePrice !== null &&
                    event.availablePrice !== ""
                    ? `$${event.availablePrice}`
                    : "Not mentioned"}
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {user && user.role === "attendee" && (
            <>
              {/* Logic for Save/Participate can be added here if needed, keeping UI minimal per HTML which only showed links to dashboard */}
              <button
                className="quick-actions"
                onClick={handleSave}
                style={{ width: "100%", marginBottom: "10px" }}
              >
                {isSaved ? "Saved" : "Save Event"}
              </button>
              <button
                className="quick-actions"
                onClick={handleParticipate}
                style={{ width: "100%" }}
              >
                {isParticipating ? "Participated" : "Mark as Participated"}
              </button>
            </>
          )}
        </div>
      </div>
      {/* <div className="copy-right">EventHub &copy; 2025 - All Rights Reserved</div> */}
    </div>
  );
};

export default EventDetail;
