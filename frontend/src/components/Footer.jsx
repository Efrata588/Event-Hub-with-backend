import React from "react";
import "../styles/common/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <img
            src="/Images/EventHub-strikingly-logo-2025-11-29/logo-alt-light-transparent.png"
            alt="EventHub Logo"
            className="footer-logo"
          />
          <p>Your gateway to amazing events and unforgettable experiences.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/login">Log In</a>
            </li>
            <li>
              <a href="/signup">Sign Up</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li>
              <a href="#hero">Welcome</a>
            </li>
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#events">Events</a>
            </li>
            <li>
              <a href="#user-statistics">User Statistics</a>
            </li>
            <li>
              <a href="#contact">Contact Us</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Social Media</h4>
          <div className="social-links">
            <ul>
              <li>
                <a
                  href="https://web.facebook.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 EventHub. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
