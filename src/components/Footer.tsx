import React from 'react';
import { Globe, Heart, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <Globe className="h-8 w-8 text-blue-400" />
                <Heart className="h-4 w-4 text-orange-400 absolute -top-1 -right-1" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                  Rise Beyond Borders
                </h3>
                <p className="text-sm text-gray-400">Youth-Led • Ethiopia</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Empowering refugee and displaced youth through creative expression, 
              education, and sustainable opportunity creation.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-white mb-4">Contact Information</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-blue-400 mr-3" />
                <span>Ethiopia</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-blue-400 mr-3" />
                <a href="mailto:risebeyondborders.org@gmail.com" className="hover:text-blue-400 transition-colors">
                  risebeyondborders.org@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div>
            <h4 className="font-bold text-white mb-4">Our Mission</h4>
            <p className="text-gray-300 leading-relaxed text-sm">
              To create a world where displaced youth are recognized not by what they've lost, 
              but by the creativity, skills, and innovation they offer to both refugee and host communities.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 sm:mb-0">
            © 2025 Rise Beyond Borders. All rights reserved.
          </div>
          <div className="text-gray-400 text-sm">
            Built with <Heart className="h-4 w-4 text-red-400 inline mx-1" /> for refugee youth empowerment
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;