import React from 'react';
import { Palette, Users, Rocket, Video, Megaphone, Leaf } from 'lucide-react';

const Programs = () => {
  const programs = [
    {
      icon: Palette,
      title: "Creative Expression & Cultural Engagement",
      description: "Mobile art, mural-making, and design workshops. Theater, storytelling, and performance for behavior change.",
      features: ["Art Workshops", "Theater Programs", "Cultural Exhibitions", "Mural Projects"],
      color: "from-pink-500 to-red-500",
      bgColor: "from-pink-50 to-red-50",
      borderColor: "border-pink-200"
    },
    {
      icon: Users,
      title: "Skills Development & Capacity Building",
      description: "Confidence-building and leadership training for out-of-school youth. Support for young mothers and peer mentors.",
      features: ["Leadership Training", "Peer Mentorship", "Language Learning", "Confidence Building"],
      color: "from-blue-500 to-teal-500",
      bgColor: "from-blue-50 to-teal-50",
      borderColor: "border-blue-200"
    },
    {
      icon: Rocket,
      title: "Livelihoods & Job Access",
      description: "Entrepreneurship training and startup kits. Creative industry skill-building and job-readiness programs.",
      features: ["Entrepreneurship Training", "Startup Support", "Job Readiness", "Soft Skills"],
      color: "from-orange-500 to-yellow-500",
      bgColor: "from-orange-50 to-yellow-50",
      borderColor: "border-orange-200"
    },
    {
      icon: Video,
      title: "Storytelling & Youth Media",
      description: "Youth-led photography, film, and podcast projects. Visual storytelling to shift harmful norms.",
      features: ["Photography Projects", "Film Making", "Podcast Creation", "Digital Storytelling"],
      color: "from-purple-500 to-indigo-500",
      bgColor: "from-purple-50 to-indigo-50",
      borderColor: "border-purple-200"
    },
    {
      icon: Megaphone,
      title: "Advocacy Through Dialogue",
      description: "Murals and media campaigns against early marriage and trafficking. Youth-led forums with partners.",
      features: ["Media Campaigns", "Youth Forums", "Partnership Building", "Policy Advocacy"],
      color: "from-teal-500 to-green-500",
      bgColor: "from-teal-50 to-green-50",
      borderColor: "border-teal-200"
    },
    {
      icon: Leaf,
      title: "Climate Resilience & Green Skills",
      description: "Environmental education and climate-smart skills training. Youth-led green initiatives and sustainability projects.",
      features: ["Climate Education", "Green Skills Training", "Environmental Action", "Sustainability Projects"],
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-200"
    }
  ];

  return (
    <section id="programs" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Core Programs
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Comprehensive programs designed to empower youth through creativity, skills development, 
            and sustainable opportunity creation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => {
            const IconComponent = program.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${program.bgColor} rounded-3xl p-8 border ${program.borderColor} hover:shadow-xl transition-all duration-300 transform hover:scale-105 group`}
              >
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${program.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-8 w-8" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                  {program.title}
                </h3>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {program.description}
                </p>
                
                <div className="space-y-2">
                  {program.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${program.color} mr-3`}></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Make an Impact?
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Join us in empowering refugee and displaced youth through innovative, creative programs 
              that build resilience and create sustainable opportunities.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Partner With Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;