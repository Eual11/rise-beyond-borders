import React from 'react';
import { Mail, Briefcase, Link, Phone } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from './Header';
import Footer from './Footer';
const boardMembers = [
  {
    id: 1,
    name: "Faduma Abukar Awes",
    role: "President and Founder of Rise Beyond",
    bio: "a self-taught artist whose work is fueled by resilience.",
    imageUrl: "https://egkuykxelvjlnaivwfvw.supabase.co/storage/v1/object/public/rise/gallery/1760867140966-fatumapfp.jpg",
    email: "Fawe0358@gmail.com",
    phone: "+251945427611"
  },
];

const BoardMemberCards: React.FC = () => {
  return (
    <>
      <Header/>
    <div className="p-4 mt-8 md:p-8">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
        Meet Our Board Members
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {boardMembers.map((member) => (
          <Card key={member.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="p-0">
              <div className="h-64 bg-gray-200 flex items-center justify-center relative">
                <img
                  src={member.imageUrl}
                  alt={`Portrait of ${member.name}`}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black opacity-30"></div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="text-2xl font-bold mb-1 text-purple-700">{member.name}</CardTitle>
              <CardDescription className="flex items-center text-sm font-semibold text-gray-600 mb-3">
                <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                {member.role}
              </CardDescription>
              
              <p className="text-gray-700 text-sm mt-4 mb-5 leading-relaxed">{member.bio}</p>

              <div className="flex space-x-2 border-t pt-4">
                {/* Email Link */}
                {member.email && (
                  <Button asChild variant="outline" size="icon" title={`Email ${member.name}`}>
                    <a href={`mailto:${member.email}`} target="_blank" rel="noopener noreferrer">
                      <Mail className="w-5 h-5" />
                    </a>
                  </Button>
                )}

                {/* Phone Link (Mock) */}
                {member.phone && (
                    <Button asChild variant="outline" size="icon" title={`Call ${member.name}`}>
                    <a href={`tel:${member.phone}`} target="_blank" rel="noopener noreferrer">
                      <Phone className="w-5 h-5" />
                    </a>
                  </Button>
                )}
                
                {/* Website Link (Mock) */}
                {member.website && (
                  <Button asChild variant="outline" size="icon" title={`Visit ${member.name}'s Website`}>
                    <a href={member.website} target="_blank" rel="noopener noreferrer">
                      <Link className="w-5 h-5" />
                    </a>
                  </Button>
                )}

                {/* LinkedIn Link (Mock) */}
                {member.linkedin && (
                  <Button asChild variant="outline" size="icon" title={`Connect with ${member.name} on LinkedIn`}>
                    {/* Using a generic globe icon for LinkedIn/external link */}
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                      <Link className="w-5 h-5" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  <Footer/>
  </>
  );
};

export default BoardMemberCards;
