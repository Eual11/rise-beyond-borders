
import React, { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import EventCards, { Event } from "./EventCards";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router"; 
const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate()
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // Set isAuthenticated to true if a session exists
      setIsAuthenticated(!!session);
    };

    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("events")
        .select(`
            id,
            name,
            start_date,
            end_date,
            tags,
            img_src,
            attendees,
            description
        `)
        .order("start_date", { ascending: true });

      if (error) {
        console.error("Error fetching events:", error.message);
        setError("Failed to load events. Please try again.");
      } else if (data) {
        const formattedEvents: Event[] = data.map((item: any) => {
          let parsedTags: string[] = [];
          const rawTags = item.tags;

          if (Array.isArray(rawTags)) {
            parsedTags = rawTags;
          } else if (typeof rawTags === 'string') {
            try {
              const jsonParsed = JSON.parse(rawTags);
              if (Array.isArray(jsonParsed)) {
                parsedTags = jsonParsed;
              } else {
                parsedTags = rawTags.split(",").map(t => t.trim());
              }
            } catch (e) {
              parsedTags = rawTags.split(",").map(t => t.trim());
            }
          }

          return {
            id: item.id.toString(),
            name: item.name,
            startDate: item.start_date,
            endDate: item.end_date,
            tags: parsedTags.filter(t => typeof t === 'string' && t.trim() !== ''),
            image: item.img_src || "",
            attendees: item.attendees,
            description: item.description,
          };
        });
        setEvents(formattedEvents);
      }

      setLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <>
      <Header />
      <section id="events" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {loading ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-600">Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-xl text-red-600 font-semibold">{error}</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl text-gray-600">No upcoming events found.</p>
              <p className="text-sm text-gray-500 mt-2">Check back soon for new opportunities!</p>
            </div>
          ) : (
            <div className="space-y-12">
              <EventCards isAuthenticated={isAuthenticated} events={events} onEditClick={(id)=>navigate(`/admin/events/edit/${id}`)} />
            </div>
          )}

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
      <Footer />
    </>
  );
};

export default EventsPage;
