import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import OwnerDashboard from "./pages/OwnerDashboard";

import "./App.css";

// ==========================================
// PROTECTED ROUTE
// ==========================================

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// ==========================================
// ROLE ROUTE
// ==========================================

function OwnerRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (user?.role !== "owner") {
    return <Navigate to="/home" replace />;
  }

  return children;
}

// ==========================================
// APP
// ==========================================

function App() {
  return (
    <Routes>

      {/* =========================
          LOGIN
      ========================= */}

      <Route
        path="/"
        element={<Login />}
      />

      {/* =========================
          REGISTER
      ========================= */}

      <Route
        path="/register"
        element={<Register />}
      />

      {/* =========================
          HOME
      ========================= */}

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* =========================
          BOOKING
      ========================= */}

      <Route
        path="/booking/:propertyId"
        element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        }
      />

      {/* =========================
          MY BOOKINGS
      ========================= */}

      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />

      {/* =========================
          OWNER DASHBOARD
      ========================= */}

      <Route
        path="/owner"
        element={
          <OwnerRoute>
            <OwnerDashboard />
          </OwnerRoute>
        }
      />

      {/* =========================
          FALLBACK
      ========================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;