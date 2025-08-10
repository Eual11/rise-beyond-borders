import React from 'react';
import { Handshake, Building, Globe, GraduationCap, Leaf, Users } from 'lucide-react';

const Partnerships = () => {
  const partnerTypes = [
    {
      icon: Building,
      title: "Government Partners",
      description: "Ethiopian government offices and RRS for policy alignment and local coordination",
      examples: ["Refugee and Returnee Service", "Local Government Bodies", "Ministry Offices"],
      color: "from-blue-600 to-blue-800"
    },
    {
      icon: Globe,
      title: "UN Agencies",
      description: "International organizations supporting refugee protection and youth development",
      examples: ["UNHCR", "UNICEF", "IOM", "World Food Programme"],
      color: "from-teal-600 to-teal-800"
    },
    {
      icon: Users,
      title: "International NGOs",
      description: "Established organizations with refugee and youth programming expertise",
      examples: ["DRC", "NRC", "JRS", "FRC", "GIZ"],
      color: "from-purple-600 to-purple-800"
    },
    {
      icon: GraduationCap,
      title: "Educational Partners",
      description: "Universities, embassies, and scholarship programs expanding access to education",
      examples: ["Universities", "Embassies", "Scholarship Programs", "Educational Foundations"],
      color: "from-orange-600 to-orange-800"
    },
    {
      icon: Handshake,
      title: "Community Partners",
      description: "Cultural centers, social enterprises, and grassroots civil society organizations",
      examples: ["Cultural Centers", "Social Enterprises", "Grassroots CSOs", "Community Groups"],
      color: "from-pink-600 to-pink-800"
    },
    {
      icon: Leaf,
      title: "Climate Partners",
      description: "Environmental organizations and climate funds supporting youth climate action",
      examples: ["Climate Funds", "Environmental NGOs", "Green Innovation Hubs", "Youth Climate Networks"],
      color: "from-green-600 to-green-800"
    }
  ];

  return (
    <section id="partnerships" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6">
            <Handshake className="h-5 w-5 text-purple-600 mr-2" />
            <span className="text-purple-800 font-medium">Partnership Opportunities</span>
          </div>
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Partnerships We Seek
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            We welcome collaboration with organizations that share our vision of empowering refugee 
            and displaced youth through sustainable, community-driven solutions.
          </p>
        </div>

        {/* Partnership Types */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {partnerTypes.map((partner, index) => {
            const IconComponent = partner.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
              >
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${partner.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-8 w-8" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {partner.title}
                </h3>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {partner.description}
                </p>
                
                <div className="space-y-2">
                  {partner.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="flex items-center text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${partner.color} mr-3`}></div>
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Partnership Benefits */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-200 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Partner With Us?
            </h3>
            <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
              As a refugee-led organization, we bring authentic understanding, innovative approaches, 
              and sustainable solutions to the challenges facing displaced youth.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-bold text-gray-900 mb-2">Targeted Impact</h4>
              <p className="text-sm text-gray-600">Direct reach to vulnerable youth populations</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-6 text-center border border-yellow-300">
              <div className="text-3xl mb-3">💡</div>
              <h4 className="font-bold text-gray-900 mb-2">Innovation</h4>
              <p className="text-sm text-gray-600">Creative solutions designed by those who lived the experience</p>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-6 text-center border border-green-300">
              <div className="text-3xl mb-3">🌍</div>
              <h4 className="font-bold text-gray-900 mb-2">Sustainability</h4>
              <p className="text-sm text-gray-600">Social enterprise model ensures long-term viability</p>
            </div>
            <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl p-6 text-center border border-pink-300">
              <div className="text-3xl mb-3">🤝</div>
              <h4 className="font-bold text-gray-900 mb-2">Community</h4>
              <p className="text-sm text-gray-600">Bridge-building between refugee and host communities</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Create Change Together?
          </h3>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Together, we can create a future where refugee and host youth rise — stronger, 
            more resilient, and ready to lead positive change in their communities.
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Start a Partnership
          </button>
        </div>
      </div>
    </section>
  );
};

export default Partnerships;