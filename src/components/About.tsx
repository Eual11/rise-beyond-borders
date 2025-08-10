import React from 'react';
import { Target, Eye, Heart, Users, Lightbulb, Shield } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Why We Exist
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Refugee youth are too often seen only through the lens of their needs not their strengths. 
            We exist to change that narrative and create sustainable, youth-led solutions.
          </p>
        </div>

        {/* Problem Statement */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 mb-16 border border-red-100">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">The Challenge We Address</h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>Many refugee youth feel excluded from education, economic opportunity, and spaces where they can express themselves freely. Girls face early marriage, exploitation, and emotional isolation.</p>
                <p>With severe funding cuts across refugee services, schools, food, and protection programs are shrinking while risks are rising.</p>
                <p>We urgently need more enterprise-driven, refugee-led organizations that create sustainable solutions and build resilience.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <Shield className="h-8 w-8 text-red-500 mb-3" />
                <div className="font-semibold text-gray-900">Protection Gaps</div>
                <div className="text-sm text-gray-600 mt-2">Vulnerable youth face increasing risks</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <Users className="h-8 w-8 text-orange-500 mb-3" />
                <div className="font-semibold text-gray-900">Education Access</div>
                <div className="text-sm text-gray-600 mt-2">Many remain out of school</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <Lightbulb className="h-8 w-8 text-yellow-500 mb-3" />
                <div className="font-semibold text-gray-900">Economic Opportunity</div>
                <div className="text-sm text-gray-600 mt-2">Limited pathways to employment</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <Heart className="h-8 w-8 text-pink-500 mb-3" />
                <div className="font-semibold text-gray-900">Expression Spaces</div>
                <div className="text-sm text-gray-600 mt-2">Few safe creative outlets</div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Vision */}
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-3xl p-8 border border-blue-100">
            <div className="flex items-center mb-6">
              <Eye className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              A world where displaced youth are recognized not by what they've lost, but by the 
              <span className="font-semibold text-blue-600"> creativity, skills, and innovation</span> they offer 
              with their contributions benefiting both refugee and host communities.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-3xl p-8 border border-teal-100">
            <div className="flex items-center mb-6">
              <Target className="h-8 w-8 text-teal-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              To empower refugee and internally displaced youth — especially young women through 
              creative expression, emotional healing, education, and inclusive economic opportunity.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center text-teal-700">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                Art & Theater Programs
              </div>
              <div className="flex items-center text-teal-700">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                Anti-Trafficking Advocacy
              </div>
              <div className="flex items-center text-teal-700">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                Scholarship Access
              </div>
              <div className="flex items-center text-teal-700">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                Climate Resilience
              </div>
            </div>
          </div>
        </div>

        {/* Our Approach */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold mb-8">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Built by Refugees, For Refugees
            </span>
          </h3>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            We are not outsiders offering charity. We are a collective of refugees, educators, artists, 
            and survivors designing the solutions we once needed ourselves.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
