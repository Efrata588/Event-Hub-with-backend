import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/common/header.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="header">
      <div className="left-header">
        <img
          className="logo"
          src="/Images/EventHub-strikingly-logo-2025-11-29/logo-alt-dark-transparent.png"
          alt="Logo"
        />
      </div>

      <div className="right-header">
        <Link className="nav-pages" to="/">
          Home
        </Link>

        {user && user.role === "organizer" && (
          <Link className="nav-pages" to="/create-event">
            Create
          </Link>
        )}

        {user ? (
          <>
            <Link className="nav-pages dashboard" to="/dashboard">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="nav-pages nav-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="nav-pages" to="/login">
              Login
            </Link>
            <Link className="nav-pages" to="/signup">
              Signup
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
