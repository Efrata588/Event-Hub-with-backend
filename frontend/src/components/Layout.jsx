import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ErrorBoundary from "./ErrorBoundary";
import "../styles/layout.css";

const Layout = () => {
  return (
    <div className="layout-container">
      <Navbar />
      <div className="main-content">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
