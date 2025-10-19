
import React, { useState, useEffect } from "react";
import { CalendarDays, Clock3, CircleDot, Users, Trash2, X, Edit, MapPin,Link as Link2 } from "lucide-react";
import { Link } from "react-router"; 
import { useNavigate } from "react-router"; 

import supabase from "@/utils/supabase";

export interface Event {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  link:string;
  location:string;
  description: string;
  tags: string[];
  image?: string;
  attendees?: number;
}

type Status = "upcoming" | "live" | "past";
type FilterType = "all" | "upcoming" | "past";


const getSafeLink = (url: string | undefined): string => {
  if (!url) return "#";
    let formattedUrl = url.trim();
    // If it exists and doesn't start with http or https, prepend https://
  if (formattedUrl && !/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = `https://${formattedUrl}`;
  }
  return formattedUrl;
};

function getStatus(event: Event, now: number): Status {
  const start = new Date(event.startDate).getTime();
  const end = event.endDate ? new Date(event.endDate).getTime() : start;
  if (end < now) return "past";
  if (start > now) return "upcoming";
  return "live";
}

function getTimeString(event: Event, status: Status, now: number): string {
  if (status === "upcoming") {
    const diff = new Date(event.startDate).getTime() - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days > 0 ? `${days}d ` : ""}${hours}h left`;
  } else if (status === "past") {
    const diff =
      now -
      (event.endDate
        ? new Date(event.endDate).getTime()
        : new Date(event.startDate).getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days > 0 ? `${days}d ago` : "Ended recently"}`;
  } else {
    return "Happening now";
  }
}

interface EventCardsProps {
    events: Event[];
    isAuthenticated: boolean;
    onEditClick: (id: string) => void;
}

const EventCards: React.FC<EventCardsProps> = ({ events: initialEvents, isAuthenticated, onEditClick }) => {
  const [events, setEvents] = useState(initialEvents);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [clicked, setClicked] = useState<string | null>(null);

  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const ADMIN_EDIT_ROUTE = "/admin/events/edit";

  const [attendingCounts, setAttendingCounts] = useState<Record<string, number>>(
    () => Object.fromEntries(initialEvents.map((e) => [e.id, e.attendees ?? Math.floor(Math.random() * 100 + 5)]))
  );

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const filteredEvents = events
    .filter((event) => {
      const status = getStatus(event, currentTime);
      if (filter !== "all" && status !== filter) return false;
      const searchLower = search.toLowerCase();
      return (
        event.name.toLowerCase().includes(searchLower) ||
        event.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    })
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  const statusColor = {
    upcoming: "text-emerald-500",
    live: "text-rose-500",
    past: "text-red-400",
  };

  const handleCountMeIn = async (id: string) => {
    setClicked(id);
    setAttendingCounts((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));

    try {
       const { error } = await supabase.from('events').update({attendees: 88}).eq("id", id)
       if(error) {
         throw error
       }
    } catch (err) {
      console.error(err)
    }
  };
  
  const handleDelete = (event: Event) => {
    setEventToDelete(event);
  };

  const handleEdit = (eventId: string) => {
    navigate(`${ADMIN_EDIT_ROUTE}/${eventId}`);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    
    setIsDeleting(true);
    
    try {
         const { error } = await supabase
             .from('events')
             .delete()
             .eq('id', eventToDelete.id);
            
         if (error) {
             console.error("Supabase Deletion Error:", error);
             alert(`Failed to delete event: ${error.message}`);
         } else {
             setEvents(prevEvents => prevEvents.filter(e => e.id !== eventToDelete.id));
             setAttendingCounts(prevCounts => {
                 const newCounts = { ...prevCounts };
                 delete newCounts[eventToDelete.id];
                 return newCounts;
             });
         }
    } catch (e) {
        console.error("Supabase API call failed:", e);
        alert("An unexpected error occurred during deletion.");
    } finally {
        setIsDeleting(false);
        setEventToDelete(null);
    }
  };


  const DeleteModal = () => {
    if (!eventToDelete) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl p-8 max-w-lg w-full shadow-2xl relative">
                <button 
                    onClick={() => setEventToDelete(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                    disabled={isDeleting}
                >
                    <X className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                    <Trash2 className="w-6 h-6" /> Confirm Deletion
                </h3>
                <p className="text-gray-700 mb-6">
                    Are you sure you want to delete the event: 
                    <strong className="block mt-1 p-2 bg-red-50 rounded-lg">"{eventToDelete.name}"</strong>
                    This action <strong>cannot be undone</strong>.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setEventToDelete(null)}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-full hover:bg-gray-100 transition"
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmDelete}
                        className={`px-4 py-2 font-semibold text-white rounded-full transition ${
                            isDeleting ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 active:scale-98"
                        }`}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete Permanently"}
                    </button>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="mx-auto p-6 max-w-7xl space-y-8">
      <DeleteModal />
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 p-3 bg-white/60 backdrop-blur-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none shadow-sm transition"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          className="p-3 bg-white/60 backdrop-blur-lg border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-400 outline-none"
        >
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>
      
      <div className="flex flex-col space-y-10">
        {filteredEvents.map((event) => {
          const status = getStatus(event, currentTime);
          const timeStr = getTimeString(event, status, currentTime);

          return (
            <div
              key={event.id}
              className="group flex flex-col md:flex-row bg-white/80 backdrop-blur-lg rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {event.image && (
                <div className="md:w-1/3 max-h-72 w-full overflow-hidden">
                  <img
                    src={event.image.length > 2 ? event.image : "/images/logo.png"}
                    alt={event.name}
                    className="w-full h-64 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="flex-1 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CircleDot
                      className={`${statusColor[status]} w-3 h-3 animate-pulse`}
                    />
                    <p className="text-sm font-medium capitalize text-gray-500">
                      {status}
                    </p>
                  </div>

                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-2 pr-4">
                      {event.name}
                    </h2>
                    
                    <div className="flex space-x-2">
                      {isAuthenticated && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(event.id);
                          }}
                          className="p-2 text-indigo-500 hover:text-indigo-700 bg-indigo-100 rounded-full transition hover:scale-110 active:scale-95 flex-shrink-0"
                          title="Edit Event"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      )}
                      {
                      isAuthenticated && 
                      <button
                          onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(event);
                          }}
                          className="p-2 text-red-500 hover:text-red-700 bg-red-100 rounded-full transition hover:scale-110 active:scale-95 flex-shrink-0"
                          title="Delete Event"
                      >
                          <Trash2 className="w-5 h-5" />
                      </button>
                     }
                      
                   </div>
                  </div>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {new Date(event.startDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock3 className="w-4 h-4" /> {timeStr}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-emerald-500" />
                      <span className="font-medium text-gray-700">
                        {attendingCounts[event.id]}
                      </span>
                    </span>
                  </div>

                   <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                     Link:  <a href={`${getSafeLink(event.link)}`} rel="noopener noreferrer" target="_blank"> <Link2 className="w-4 text-blue-600 h-4" /></a>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full border border-emerald-200 hover:scale-105 transition-transform"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="hidden mt-6">
                  <button
                    onClick={() => handleCountMeIn(event.id)}
                    className={`relative overflow-hidden px-6 py-2.5 font-semibold text-white rounded-full transition-transform transform active:scale-95 ${
                      clicked === event.id
                        ? "bg-emerald-600"
                        : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    }`}
                  >
                    <span
                      className={`absolute inset-0 bg-white/20 animate-[shimmer_1s_ease-in-out] ${
                        clicked === event.id ? "opacity-0" : "opacity-100"
                      }`}
                    ></span>
                    <span className="relative">Count Me In</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>
        {`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        `}
      </style>
    </div>
  );
};

export default EventCards;
