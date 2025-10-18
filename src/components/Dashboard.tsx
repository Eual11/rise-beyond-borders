
import React from "react";
import { Link } from "react-router"; 
import { Users, Calendar, Image as GalleryIcon } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-indigo-900">Art Platform Dashboard</h1>
          <p className="text-lg text-gray-600 mt-2">Manage artists, events, and galleries</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Add New Artist Card */}
          <Link
            to="/add-artist"
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group"
          >
            <div className="p-8 flex flex-col items-center text-center">
              <div className="bg-indigo-100 p-4 rounded-full mb-4 group-hover:bg-indigo-200 transition-colors">
                <Users className="w-12 h-12 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Add New Artist</h2>
              <p className="text-gray-600">Create a profile for a new artist and upload their details.</p>
            </div>
          </Link>

          {/* Add New Event Card */}
          <Link
            to="/add-event"
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group"
          >
            <div className="p-8 flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                <Calendar className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Add New Event</h2>
              <p className="text-gray-600">Schedule and manage upcoming art events and exhibitions.</p>
            </div>
          </Link>

          {/* Artist Gallery Card */}
          <Link
            to="/artist-gallery"
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group"
          >
            <div className="p-8 flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                <GalleryIcon className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Artist Gallery</h2>
              <p className="text-gray-600">View and manage galleries for specific artists.</p>
            </div>
          </Link>
        </div>

        {/* Additional Navigation or Quick Actions */}
        <section className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Actions</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/manage-artists"
              className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors font-medium"
            >
              Manage Artists
            </Link>
            <Link
              to="/manage-events"
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors font-medium"
            >
              Manage Events
            </Link>
            <Link
              to="/view-galleries"
              className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors font-medium"
            >
              View All Galleries
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600">
          &copy; 2024 Art Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
