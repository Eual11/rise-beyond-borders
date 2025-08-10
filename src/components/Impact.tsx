import React from 'react';
import { MapPin, Users, Calendar, TrendingUp } from 'lucide-react';

const Impact = () => {
  const locations = [
    {
      name: "Dolo Camps",
      type: "Refugee Camp",
      focus: "Art therapy and skills training",
      participants: "120+ youth"
    },
    {
      name: "Gambila",
      type: "Community Center",
      focus: "Cultural exchange programs",
      participants: "80+ youth"
    },
    {
      name: "Urban Addis Ababa",
      type: "Hub Location",
      focus: "Full program suite",
      participants: "100+ youth"
    }
  ];

  const goals = [
    {
      title: "Trauma-Informed Programming",
      description: "Deliver creative programming with mental health support",
      icon: "❤️"
    },
    {
      title: "Behavior Change & Resilience",
      description: "Strengthen resilience through artistic expression",
      icon: "🎨"
    },
    {
      title: "Community Integration",
      description: "Increase trust between refugee and host communities",
      icon: "🤝"
    },
    {
      title: "Public Storytelling",
      description: "Raise awareness through advocacy and media",
      icon: "📢"
    },
    {
      title: "Scalable Model",
      description: "Create foundation for regional expansion",
      icon: "🚀"
    },
    {
      title: "Climate Action",
      description: "Empower youth with environmental literacy and green skills",
      icon: "🌱"
    }
  ];

  return (
    <section id="impact" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-400 to-teal-400 rounded-full shadow-lg mb-6">
            <TrendingUp className="h-5 w-5 text-white mr-2" />
            <span className="text-white font-medium">2025-2026 Pilot Program</span>
          </div>
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Our Impact Goals
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Through our pilot program, we're reaching 300+ refugee and host youth across three key locations in Ethiopia.
          </p>
        </div>

        {/* Locations */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Program Locations</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {locations.map((location, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  <MapPin className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-bold text-gray-900">{location.name}</h4>
                    <p className="text-sm text-gray-600">{location.type}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{location.focus}</p>
                <div className="flex items-center text-green-600 font-semibold">
                  <Users className="h-4 w-4 mr-2" />
                  {location.participants}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Goals */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Key Program Goals</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {goal.icon}
                </div>
                <h4 className="font-bold text-gray-900 mb-3">{goal.title}</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{goal.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Program Impact by Numbers</h3>
            <p className="text-gray-700">Our commitment to measurable, sustainable change</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">300+</div>
              <div className="text-gray-700 font-medium">Youth Reached</div>
              <div className="text-sm text-gray-500 mt-1">Refugee & Host Communities</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">3</div>
              <div className="text-gray-700 font-medium">Locations</div>
              <div className="text-sm text-gray-500 mt-1">Camps & Urban Areas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">12</div>
              <div className="text-gray-700 font-medium">Months</div>
              <div className="text-sm text-gray-500 mt-1">Program Duration</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">6</div>
              <div className="text-gray-700 font-medium">Core Programs</div>
              <div className="text-sm text-gray-500 mt-1">Integrated Approach</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;