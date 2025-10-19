
import React from 'react';
import { NavLink } from 'react-router';
import { LogOut, User, LayoutDashboard, Users, Calendar, Image as ImageIcon, Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext.jsx';

const navLinks = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
  { name: "Add Artist", path: "/admin/add-artist", icon: Users },
  { name: "Add Event", path: "/admin/add-event", icon: Calendar },
  { name: "Add Gallery", path: "/admin/add-gallery", icon: ImageIcon },
];
const AdminHeader: React.FC = () => {
  const { user, signOut } = useAuth(); // Using the actual signOut function from context

  return (
    <header className="bg-white px-4 py-3 rounded-xl shadow-md mb-6 flex justify-between items-center sticky top-0 z-10">

      <div className="flex items-center space-x-6">

        <h1 className="text-xl font-bold text-gray-800 flex-shrink-0">
          Admin Console
        </h1>
        <nav className="hidden sm:block">
          <div className="flex space-x-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `py-1 px-1 text-sm flex items-center space-x-1 border-b-2 border-transparent transition-colors duration-200 ${isActive
                    ? 'text-purple-700 font-semibold border-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:border-purple-300'
                  }`
                }
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <Button variant="outline" size="icon" className="sm:hidden p-0 h-8 w-8">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center space-x-3">

        <div className="hidden lg:flex items-center space-x-1 text-xs text-gray-500 border border-gray-200 p-1 rounded-full pr-3">
          <User className="h-4 w-4 text-purple-600" />
          <span className="font-medium truncate">{user?.email || "Guest"}</span>
        </div>

        <Button
          onClick={signOut}
          variant="destructive"
          className="flex items-center space-x-1"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
