
// src/components/Dashboard.tsx
import React from "react";
import { Link } from "react-router";
import { Users, Calendar, Image as GalleryIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Art Platform Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage artists, events, and galleries</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add New Artist Card */}
          <Card asChild>
            <Link to="/admin/add-artist" className="group">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4 group-hover:bg-gray-200 transition-colors">
                  <Users className="w-12 h-12 text-gray-700" />
                </div>
                <CardTitle>Add New Artist</CardTitle>
                <CardDescription>Create a profile for a new artist and upload their details.</CardDescription>
              </CardHeader>
              <CardContent />
            </Link>
          </Card>

          {/* Add New Event Card */}
          <Card asChild>
            <Link to="/admin/add-event" className="group">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4 group-hover:bg-gray-200 transition-colors">
                  <Calendar className="w-12 h-12 text-gray-700" />
                </div>
                <CardTitle>Add New Event</CardTitle>
                <CardDescription>Schedule and manage upcoming art events and exhibitions.</CardDescription>
              </CardHeader>
              <CardContent />
            </Link>
          </Card>

          {/* Artist Gallery Card */}
          <Card asChild>
            <Link to="/artist-gallery" className="group">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4 group-hover:bg-gray-200 transition-colors">
                  <GalleryIcon className="w-12 h-12 text-gray-700" />
                </div>
                <CardTitle>Artist Gallery</CardTitle>
                <CardDescription>View and manage galleries for specific artists.</CardDescription>
              </CardHeader>
              <CardContent />
            </Link>
          </Card>
        </div>

        {/* Quick Actions */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Quick Actions</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/manage-artists">
              <Button variant="default">Manage Artists</Button>
            </Link>
            <Link to="/manage-events">
              <Button variant="default">Manage Events</Button>
            </Link>
            <Link to="/view-galleries">
              <Button variant="default">View All Galleries</Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          &copy; 2024 Art Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
