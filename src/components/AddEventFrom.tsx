
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import supabase from "../utils/supabase";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function AddEventForm() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tags, setTags] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [attendees, setAttendees] = useState<number>(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.from("events").insert({
      name,
      start_date: startDate,
      end_date: endDate,
      tags: tags.split(",").map((t) => t.trim()),
      img_src: imgSrc,
      attendees,
      user_id: user?.id,
    });

    if (error) setError(error.message);
    else {
      setName(""); setStartDate(""); setEndDate(""); setTags(""); setImgSrc(""); setAttendees(0);
      alert("Event added successfully!");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center">Add New Event</h2>

      <Input placeholder="Event Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input type="datetime-local" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
      <Input type="datetime-local" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
      <Input placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
      <Input placeholder="Image URL" value={imgSrc} onChange={(e) => setImgSrc(e.target.value)} />
      <Input type="number" placeholder="Attendees" value={attendees} onChange={(e) => setAttendees(Number(e.target.value))} />

      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Event"}</Button>
    </form>
  );
}
