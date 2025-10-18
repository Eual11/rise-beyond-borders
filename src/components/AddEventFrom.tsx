import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import supabase from "../utils/supabase";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import toast, { Toaster } from "react-hot-toast";
import { format, isBefore } from "date-fns"; // Import isBefore for better date validation
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper to safely format a Date object into the ISO-like string required by Postgres datetime-local inputs

const formatToSupabaseDateTime = (date: Date | undefined, time: string): string => {
  if (!date) return "";

  const datePart = format(date, "yyyy-MM-dd");
  // Combine with time and append Ethiopia timezone offset (+03:00)
  return `${datePart}T${time}+03:00`;
};
export default function AddEventForm() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [startDateObj, setStartDateObj] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState("09:00");
  const [endDateObj, setEndDateObj] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState("17:00");

  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<number>(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // --- Date Logic ---

  // 1. Set End Date to Start Date if Start Date is set and End Date is empty
  useEffect(() => {
    if (startDateObj && !endDateObj) {
      setEndDateObj(startDateObj);
      if (startTime === endTime) {
        setEndTime("17:00");
      }
    }
  }, [startDateObj, endDateObj, startTime, endTime]);

  // --- File/Image Logic ---

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImagePreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setImagePreviewUrl(null);
    }
  };

  const uploadFile = async (): Promise<string | null> => {
    if (!file) return null;

    setUploadingImage(true);
    const fileName = `gallery/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("rise")
      .upload(fileName, file);

    if (uploadError) {
      toast.error(uploadError.message);
      setUploadingImage(false);
      return null;
    }

    const { data } = supabase.storage.from("rise").getPublicUrl(fileName);
    setUploadingImage(false);
    return data.publicUrl;
  };

  // --- Submission Handler ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!startDateObj || !endDateObj) {
      toast.error("Please select both a Start Date and End Date.");
      setLoading(false);
      return;
    }

    // Basic validation: End Date must not be before Start Date
    if (isBefore(endDateObj, startDateObj)) {
        toast.error("End Date cannot be before the Start Date.");
        setLoading(false);
        return;
    }

    // Format dates for Supabase insertion
    const finalStartDate = formatToSupabaseDateTime(startDateObj, startTime);
    const finalEndDate = formatToSupabaseDateTime(endDateObj, endTime);

    // Image Upload
    let finalImgSrc = "";
    if (file) {
      const uploadedUrl = await uploadFile();
      if (!uploadedUrl) {
        setLoading(false);
        return;
      }
      finalImgSrc = uploadedUrl;
    }

    const { data, error } = await supabase.from("events").insert({
      name,
      description,
      start_date: finalStartDate,
      end_date: finalEndDate,
      tags: tags.split(",").map((t) => t.trim()).filter(t => t),
      img_src: finalImgSrc,
      attendees,
    });

    if (error) {
      setError(error.message);
      toast.error(error.message);
    } else {
      // Reset form fields
      setName(""); setDescription(""); setStartDateObj(undefined); setStartTime("09:00");
      setEndDateObj(undefined); setEndTime("17:00"); setTags("");
      setFile(null); setImagePreviewUrl(null); setAttendees(0);
      toast.success("Event added successfully!");
    }

    setLoading(false);
  };

  // --- Render ---

  // Custom Calendar Picker Component (for re-use)
  const DatePicker = ({ date, setDate, id, label, time, setTime, minDate }: {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    id: string;
    label: string;
    time: string;
    setTime: (time: string) => void;
    minDate?: Date;
  }) => (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 min-w-[280px]" align="start"> 
            <Calendar
              className="w-full"
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              // Disable dates that are before the optional minimum date provided
              disabled={(d) => minDate && isBefore(d, minDate)}
            />
          </PopoverContent>
        </Popover>
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-1/3"
          required
        />
      </div>
    </div>
  );

  return (
    <>
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center">Add New Event</h2>

        <div>
          <Label htmlFor="eventName">Event Name</Label>
          <Input id="eventName" placeholder="Event Name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        {/* Description Field */}
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            placeholder="A brief description of the event..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
            rows={4}
            required
          />
        </div>

        {/* Start Date & Time */}
        <DatePicker
          id="startDate"
          label="Start Date & Time"
          date={startDateObj}
          setDate={setStartDateObj}
          time={startTime}
          setTime={setStartTime}
          // The start date must be today or in the future
          minDate={new Date(new Date().setHours(0, 0, 0, 0))}
        />

        {/* End Date & Time */}
        <DatePicker
          id="endDate"
          label="End Date & Time"
          date={endDateObj}
          setDate={setEndDateObj}
          time={endTime}
          setTime={setEndTime}
          // Min date for end date is the start date
          minDate={startDateObj} 
        />

        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input id="tags" placeholder="e.g., workshop, art, community" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>

        {/* Image Upload Field */}
        <div>
          <Label htmlFor="eventImage">Event Image</Label>
          <Input
            id="eventImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {uploadingImage && <p className="text-gray-600 mt-1">Uploading image...</p>}
          {imagePreviewUrl && (
            <div className="mt-4 border rounded-md overflow-hidden">
              <img
                src={imagePreviewUrl}
                alt="Image Preview"
                className="w-full h-48 object-cover"
              />
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="attendees">Attendees</Label>
          <Input id="attendees" type="number" placeholder="0" value={attendees} onChange={(e) => setAttendees(Number(e.target.value))} />
        </div>

        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" disabled={loading || uploadingImage || !startDateObj || !endDateObj || !description.trim() || !name.trim()}>
          {loading ? "Adding..." : uploadingImage ? "Uploading Image..." : "Add Event"}
        </Button>
      </form>
    </>
  );
}
