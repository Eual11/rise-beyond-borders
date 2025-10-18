
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";
import { AuthProvider, useAuth } from "./context/AuthContext"; // your provider
import App from "./App";
import Login from "./components/Login"; 
import Dashboard from "./components/Dashboard"; 
import "./index.css"; 
import AddArtistForm from "./components/AddArtist";
import AddEventForm from "./components/AddEventFrom";
// Wrapper for protected routes using the provider
const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth(); // from provider

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="add-artist" element={<AddArtistForm />} /> 
          <Route path="add-event" element={<AddEventForm />} />
        </Route>
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
