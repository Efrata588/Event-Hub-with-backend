import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/signup.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("attendee");
  const [profilePicture, setProfilePicture] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      await register(formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="signup-body">
      <img
        className="auth-logo"
        src="/Images/EventHub-strikingly-logo-2025-11-29/logo-dark-transparent.png"
        alt="Logo"
      />
      <p className="slogan">Your gateway to amazing events</p>
      <form onSubmit={handleSubmit}>
        <div className="button-toggle">
          <Link to="/login" className="toggle-btn">
            Login
          </Link>

          <button type="button" className="toggle-btn active">
            Sign Up
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            placeholder="john@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>I am an</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="attendee">Attendee (Looking for events)</option>
            <option value="organizer">Organizer (Creating Events)</option>
          </select>
        </div>

        <div>
          <label>Profile Picture</label>
          <input
            type="file"
            onChange={(e) => setProfilePicture(e.target.files[0])}
          />
        </div>

        <button type="submit" className="sign-up">
          Sign Up
        </button>
        <hr />
      </form>
      <div className="copy-right">
        EventHub &copy; 2025 - All Rights Reserved
      </div>
    </div>
  );
};

export default Signup;
