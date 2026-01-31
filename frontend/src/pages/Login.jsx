import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-body">
      {/* special wrapper for bg */}
      <img
        className="auth-logo"
        src="/Images/EventHub-strikingly-logo-2025-11-29/logo-dark-transparent.png"
        alt="Logo"
      />
      <p className="slogan">Your gateway to amazing events</p>
      <form onSubmit={handleSubmit}>
        <div className="button-toggle">
          <button type="button" className="toggle-btn active">
            Login
          </button>

          <Link to="/signup" className="toggle-btn">
            Sign Up
          </Link>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div>
          <label>Email</label>
          <input
            type="text"
            placeholder="anna@email.com"
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
        {/* Role selection is not needed for Login, usually, but UI might show it. Backend handles it. */}

        <button type="submit" className="log-in">
          Log in
        </button>
        <hr />
      </form>
      <div className="copy-right">
        EventHub &copy; 2025 - All Rights Reserved
      </div>
    </div>
  );
};

export default Login;
