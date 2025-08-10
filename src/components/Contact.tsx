import React from 'react';
import { Mail, MapPin, Phone, Send, Globe, Heart } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg mb-6">
            <Send className="h-5 w-5 text-white mr-2" />
            <span className="text-white font-medium">Get in Touch</span>
          </div>
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Join Our Movement
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Ready to empower refugee and displaced youth? Let's work together to create sustainable, 
            creative solutions that build resilient communities.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full text-white mr-4">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Rise Beyond Borders</h3>
                  <p className="text-gray-600">Refugee & Youth-Led Initiative</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                  <span>Ethiopia</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Mail className="h-5 w-5 text-blue-600 mr-3" />
                  <a href="mailto:risebeyondborders.org@gmail.com" className="hover:text-blue-600 transition-colors">
                    risebeyondborders.org@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Leadership */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white mr-4">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Leadership</h3>
                  <p className="text-gray-600">Meet our founder</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <h4 className="font-bold text-gray-900 mb-2">Faduma Abukar</h4>
                <p className="text-purple-700 font-medium mb-3">Founder & Executive Director</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  A refugee leader and advocate dedicated to empowering displaced youth through 
                  creative expression and sustainable opportunity creation.
                </p>
              </div>
            </div>

            {/* Ways to Help */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8 border border-orange-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Ways to Get Involved</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 text-center hover:shadow-md transition-all duration-300">
                  <div className="text-2xl mb-2">🤝</div>
                  <div className="font-semibold text-gray-900 text-sm">Partner</div>
                </div>
                <div className="bg-white rounded-2xl p-4 text-center hover:shadow-md transition-all duration-300">
                  <div className="text-2xl mb-2">💝</div>
                  <div className="font-semibold text-gray-900 text-sm">Donate</div>
                </div>
                <div className="bg-white rounded-2xl p-4 text-center hover:shadow-md transition-all duration-300">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-semibold text-gray-900 text-sm">Volunteer</div>
                </div>
                <div className="bg-white rounded-2xl p-4 text-center hover:shadow-md transition-all duration-300">
                  <div className="text-2xl mb-2">📢</div>
                  <div className="font-semibold text-gray-900 text-sm">Advocate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Your last name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Your organization (optional)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300">
                  <option>Partnership Opportunities</option>
                  <option>Volunteer Programs</option>
                  <option>Funding Support</option>
                  <option>Media & Press</option>
                  <option>General Inquiry</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Tell us about your interest in working with Rise Beyond Borders..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;