
import React, { useState, useEffect } from "react";
import { CalendarDays, Clock3, CircleDot, Users } from "lucide-react";

export interface Event {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  description: string;
  tags: string[];
  image?: string;
  attendees?: number; // optional field
}

type Status = "upcoming" | "live" | "past";
type FilterType = "all" | "upcoming" | "past";

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

const EventCards: React.FC<{ events: Event[] }> = ({ events }) => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [clicked, setClicked] = useState<string | null>(null);
  const [attendingCounts, setAttendingCounts] = useState<Record<string, number>>(
    () => Object.fromEntries(events.map((e) => [e.id, e.attendees ?? Math.floor(Math.random() * 100 + 5)]))
  );

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

  const handleCountMeIn = (id: string) => {
    setClicked(id);
    setAttendingCounts((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
    setTimeout(() => setClicked(null), 700);
  };

  return (
    <div className="mx-auto p-6 max-w-7xl space-y-8">
      {/* Filter + Search Bar */}
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

      {/* Event Cards */}
      <div className="flex flex-col space-y-10">
        {filteredEvents.map((event) => {
          const status = getStatus(event, currentTime);
          const timeStr = getTimeString(event, status, currentTime);

          return (
            <div
              key={event.id}
              className="group flex flex-col md:flex-row bg-white/80 backdrop-blur-lg rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {/* Image Section */}
              {event.image && (
                <div className="md:w-1/3 w-full overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-64 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}

              {/* Content Section */}
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

                  <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-2">
                    {event.name}
                  </h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />{" "}
                      {new Date(event.startDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock3 className="w-4 h-4" /> {timeStr}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-emerald-500" />{" "}
                      <span className="font-medium text-gray-700">
                        {attendingCounts[event.id]}
                      </span>
                    </span>
                  </div>

                  {/* Tags */}
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

                {/* "Count Me In" button */}
                <div className="mt-6">
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

      {/* CSS for shimmer animation */}
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
