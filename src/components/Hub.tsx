import React from 'react';
import { Building2, Palette, GraduationCap, Laptop, Heart, MessageCircle, DollarSign, Leaf } from 'lucide-react';

const Hub = () => {
  const features = [
    {
      icon: Palette,
      title: "Cultural Exchange & Art Gallery",
      description: "Vibrant spaces for artistic expression and cultural celebration"
    },
    {
      icon: GraduationCap,
      title: "Workshops, Mentorship & Training",
      description: "Skill-building programs and personalized mentorship opportunities"
    },
    {
      icon: Laptop,
      title: "Technology Access & Co-Working",
      description: "Modern workspace with technology resources and collaboration areas"
    },
    {
      icon: Heart,
      title: "Mental Health & Healing Support",
      description: "Safe spaces for emotional healing and trauma-informed care"
    },
    {
      icon: MessageCircle,
      title: "Women & Girls Empowerment",
      description: "Dedicated programs focusing on young women's leadership and safety"
    },
    {
      icon: DollarSign,
      title: "Revenue-Generating Events",
      description: "Sustainable business model through exhibitions and performances"
    },
    {
      icon: Leaf,
      title: "Green Innovation Hub",
      description: "Climate resilience activities and environmental sustainability projects"
    }
  ];

  return (
    <section id="hub" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full mb-6">
            <Building2 className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium">Our Community Hub</span>
          </div>
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Refugee-Host Community Hub
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            At the heart of our work is a vibrant, inclusive, and multipurpose space in Addis Ababa 
            where creativity meets opportunity, and where displaced and host youth grow together.
          </p>
        </div>

        {/* Hub Visual */}
        <div className="relative mb-16">
          <div className="bg-gradient-to-br from-blue-50 via-teal-50 to-purple-50 rounded-3xl p-8 border border-gray-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full mb-4">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Addis Ababa Community Hub</h3>
              <p className="text-gray-600 mt-2">A shared space for refugee and host youth collaboration</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group hover:border-blue-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg text-white mr-3 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                        {feature.title}
                      </h4>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Impact Statement */}
        <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-3xl p-8 border border-orange-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              More Than Just a Space
            </h3>
            <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto leading-relaxed">
              Our hub operates on a social enterprise model, creating sustainable income streams 
              while providing vital services. Every event, exhibition, and program contributes to 
              our mission of empowerment and community building.
            </p>
            <div className="grid sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-2xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-gray-700 font-medium">Safe Space Access</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-teal-600 mb-2">100+</div>
                <div className="text-gray-700 font-medium">Monthly Visitors</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-gray-700 font-medium">Programs per Month</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hub;