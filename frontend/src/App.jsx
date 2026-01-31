import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";

import EventDetail from "./pages/EventDetail";
import OrganizerProfile from "./pages/OrganizerProfile";

import "./index.css";
import "./styles/layout.css";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/" />;
  return children;
};

// Wrapper for Home to handle redirection logic if needed, strictly speaking Home is public/protected hybrid
const ProtectedWrapper = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes without Layout (Login/Signup have their own internal structure) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Routes with Main Layout (Navbar + Footer) */}
          <Route element={<Layout />}>
            <Route
              path="/"
              element={
                <ProtectedWrapper>
                  <Home />
                </ProtectedWrapper>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id"
              element={
                <ProtectedRoute>
                  <EventDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizers/:id"
              element={
                <ProtectedRoute>
                  <OrganizerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-event"
              element={
                <ProtectedRoute allowedRoles={["organizer"]}>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />

          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
