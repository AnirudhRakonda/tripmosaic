import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";

import Grouphome from "./pages/group/GroupHome";
import PreferencesForm from "./pages/group/PreferencesForm";
import AIPlan from "./pages/group/AIPlan";
import MapsView from "./pages/group/MapsView";
import Expenses from "./pages/group/Expenses";

import TripMap from "./components/TripMap";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Group Home */}
      <Route
        path="/group/:groupId"
        element={
          <ProtectedRoute>
            <Grouphome />
          </ProtectedRoute>
        }
      />

      {/* Preferences Form */}
      <Route
        path="/group/:groupId/form"
        element={
          <ProtectedRoute>
            <PreferencesForm />
          </ProtectedRoute>
        }
      />

      {/* AI Trip Planning */}
      <Route
        path="/group/:groupId/plan"
        element={
          <ProtectedRoute>
            <AIPlan />
          </ProtectedRoute>
        }
      />

      {/* Final Itinerary View */}
      <Route
        path="/group/:groupId/map"
        element={
          <ProtectedRoute>
            <MapsView />
          </ProtectedRoute>
        }
      />

      {/* Expenses Tracker */}
      <Route
        path="/group/:groupId/expenses"
        element={
          <ProtectedRoute>
            <Expenses />
          </ProtectedRoute>
        }
      />

      {/* Standalone Trip Map (Safe Route) */}
      <Route
        path="/trip-map"
        element={
          <ProtectedRoute>
            <TripMap />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
