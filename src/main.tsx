
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
import AddGalleryForm from "./components/AddGalleryForm";
import ArtGallery from "./components/ArtGallery";
import EventsPage from "./components/Events";
import ArtistsPage from "./components/ArtistsPage";
import ArtistPage from "./components/Artist";
import ComingSoon from "./components/ComingSoon";
import EditArtistForm from "./components/EditArtistForm";
import EditEventForm from "./components/EditEventForm";
import EditGalleryItemForm from "./components/EditGalleryItemForm";
import BoardMemberCards from "./components/BoardsPage";
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

          <Route path="/gallery" element={<ArtGallery />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/members" element={<BoardMemberCards />} />
          <Route path="/login" element={<Login />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/hub" element={<ComingSoon />} />

        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="add-artist" element={<AddArtistForm />} /> 
          <Route path="add-event" element={<AddEventForm />} />
          <Route path="add-gallery" element={<AddGalleryForm />} />

          
          <Route path="artists/edit/:id" element={<EditArtistForm />} />
          <Route path="events/edit/:id" element={<EditEventForm />} />
          <Route path="gallery/edit/:id" element={<EditGalleryItemForm />} />

        </Route>
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
