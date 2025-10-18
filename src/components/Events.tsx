import React from "react";
import EventCards, { Event } from "./EventCards";
import Footer from "./Footer";
import Header from "./Header";

// Sample events with images

const sampleEvents: Event[] = [
  {
    id: "1",
    name: "Youth Leadership Workshop",
    startDate: "2025-10-10T09:00:00Z",
    endDate: "2025-10-10T16:00:00Z",
    description:
      "A full-day interactive workshop empowering refugee youth to develop leadership, teamwork, and community-building skills.",
    tags: ["leadership", "workshop", "empowerment"],
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "2",
    name: "Creative Arts Festival",
    startDate: "2025-10-15T12:00:00Z",
    endDate: "2025-10-17T22:00:00Z",
    description:
      "An inspiring arts festival showcasing music, theater, painting, and performance by refugee youth from across the region.",
    tags: ["arts", "festival", "music", "theater"],
    image:
      "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "3",
    name: "Climate Change Webinar",
    startDate: "2025-10-18T14:00:00Z",
    endDate: "2025-10-18T16:00:00Z",
    description:
      "Online panel discussing climate resilience and sustainable solutions led by youth environmental activists.",
    tags: ["environment", "webinar", "climate", "resilience"],
    image:
      "https://images.unsplash.com/photo-1505739773434-cb6f3e1d2e41?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "4",
    name: "Entrepreneurship Bootcamp",
    startDate: "2025-10-20T10:00:00Z",
    endDate: "2025-10-22T17:00:00Z",
    description:
      "Empowering refugee youth to launch small businesses and social enterprises with mentorship and practical skills.",
    tags: ["entrepreneurship", "bootcamp", "business", "skills"],
    image:
      "https://images.unsplash.com/photo-1581093588401-22c0b3c23a1d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "5",
    name: "Storytelling & Expression Workshop",
    startDate: "2025-10-25T11:00:00Z",
    endDate: "2025-10-25T15:00:00Z",
    description:
      "A workshop encouraging youth to share their stories and express themselves through writing, photography, and spoken word.",
    tags: ["storytelling", "creative", "expression", "workshop"],
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "6",
    name: "Digital Skills Hackathon",
    startDate: "2025-11-01T09:00:00Z",
    endDate: "2025-11-02T21:00:00Z",
    description:
      "48-hour hackathon equipping refugee youth with coding, design, and digital problem-solving skills for real-world challenges.",
    tags: ["coding", "hackathon", "digital skills", "tech"],
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
  },
];

const EventsPage: React.FC = () => {
  return (
    <>
      <Header/>
    <section id="events" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Our Events
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            RiseBeyond Borders organizes events that empower, inspire, and connect refugee youth. 
            From workshops and webinars to festivals, explore upcoming opportunities to participate.
          </p>
        </div>

        {/* Event Cards */}
        <div className="space-y-12">
          <EventCards events={sampleEvents} />
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Join the Movement
            </span>
          </h3>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
            Participate in our events, workshops, and initiatives to empower refugee youth and build lasting solutions.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-full shadow-lg hover:from-emerald-600 hover:to-teal-600 transition transform active:scale-95">
            Get Involved
          </button>
        </div>
      </div>
    </section>
  <Footer/>
</>
  );
};

export default EventsPage;
