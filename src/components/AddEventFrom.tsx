import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import supabase from "../utils/supabase";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import toast, { Toaster } from "react-hot-toast";
import { format, isBefore } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";



const formatToSupabaseDateTime = (date: Date | undefined, time: string): string => {
  if (!date) return "";

  const datePart = format(date, "yyyy-MM-dd");
  return `${datePart}T${time}+03:00`;
};

const MAX_DESC_LENGTH = 1000;

export default function AddEventForm() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");

  const [startDateObj, setStartDateObj] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState("09:00");
  const [endDateObj, setEndDateObj] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState("17:00");

  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<number | string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (startDateObj && !endDateObj) {
      setEndDateObj(startDateObj);
      if (startTime === endTime) {
        setEndTime("17:00");
      }
    }
  }, [startDateObj, endDateObj, startTime, endTime]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!startDateObj || !endDateObj) {
      toast.error("Please select both a Start Date and End Date.");
      setLoading(false);
      return;
    }
    if (!name.trim() || !location.trim()) {
      toast.error("Event Name and Location are required.");
      setLoading(false);
      return;
    }

    const startDateTimeForValidation = new Date(`${format(startDateObj, 'yyyy-MM-dd')}T${startTime}:00`);
    const endDateTimeForValidation = new Date(`${format(endDateObj, 'yyyy-MM-dd')}T${endTime}:00`);
    
    if (isBefore(endDateTimeForValidation, startDateTimeForValidation)) {
        toast.error("End Date/Time cannot be before the Start Date/Time.");
        setLoading(false);
        return;
    }

    const finalStartDate = formatToSupabaseDateTime(startDateObj, startTime);
    const finalEndDate = formatToSupabaseDateTime(endDateObj, endTime);

    let finalImgSrc = "";
    if (file) {
      const uploadedUrl = await uploadFile();
      if (!uploadedUrl) {
        setLoading(false);
        return;
      }
      finalImgSrc = uploadedUrl;
    }
    
    const numericAttendees = typeof attendees === 'number' ? attendees : (parseInt(attendees as string) || 0);

    const { error } = await supabase.from("events").insert({
      name,
      description,
      start_date: finalStartDate,
      end_date: finalEndDate,
      location,
      link,
      tags: tags.split(",").map((t) => t.trim()).filter(t => t),
      img_src: finalImgSrc,
      attendees: numericAttendees,
    });

    if (error) {
      setError(error.message);
      toast.error(`Error adding event: ${error.message}`);
    } else {
      setName(""); setDescription(""); setStartDateObj(undefined); setStartTime("09:00");
      setEndDateObj(undefined); setEndTime("17:00"); setTags(""); setLocation(""); setLink("");
      setFile(null); setImagePreviewUrl(null); setAttendees("");
      toast.success("Event added successfully! 🎉");
    }

    setLoading(false);
  };

  const DatePicker = ({ date, setDate, id, label, time, setTime, minDate, colorClass }: {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    id: string;
    label: string;
    time: string;
    setTime: (time: string) => void;
    minDate?: Date;
    colorClass: string;
  }) => (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg ${colorClass}`}>
      <div className="flex flex-col gap-1">
        <Label htmlFor={id} className="font-semibold">
            {label} Date *
        </Label>
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
              disabled={(d) => minDate && isBefore(d, minDate)}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor={`${id}-time`} className="font-semibold">
            {label} Time
        </Label>
        <Input
          type="time"
          id={`${id}-time`}
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
    </div>
  );

  const charsRemaining = MAX_DESC_LENGTH - description.length;
  const isDisabled = loading || uploadingImage || !name.trim() || !location.trim() || !startDateObj || !endDateObj;
  
  return (
    <>
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto p-8 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 border-b pb-4">Add New Event</h2>

        <div>
          <Label htmlFor="eventName">Event Name *</Label>
          <Input id="eventName" placeholder="Event Name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        
        <div>
          <Label htmlFor="location">Location *</Label>
          <Input id="location" placeholder="Venue Name / City" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>

        <DatePicker
          id="startDate"
          label="Start"
          date={startDateObj}
          setDate={setStartDateObj}
          time={startTime}
          setTime={setStartTime}
          colorClass="bg-indigo-50/50"
          minDate={new Date(new Date().setHours(0, 0, 0, 0))}
        />

        <DatePicker
          id="endDate"
          label="End"
          date={endDateObj}
          setDate={setEndDateObj}
          time={endTime}
          setTime={setEndTime}
          colorClass="bg-green-50/50"
          minDate={startDateObj}
        />

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="A detailed description of the event..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            maxLength={MAX_DESC_LENGTH}
            required
          />
          <p className={`text-sm mt-1 text-right ${charsRemaining <= 50 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
             {description.length} / {MAX_DESC_LENGTH} characters
          </p>
        </div>
        
        <div>
          <Label htmlFor="link">Registration/Ticket Link</Label>
          <Input id="link" placeholder="https://buytickets.com/event" value={link} onChange={(e) => setLink(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input id="tags" placeholder="e.g., workshop, art, community" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>

        <div className="border p-4 rounded-lg bg-gray-50">
            <Label htmlFor="eventImage" className="text-lg font-semibold mb-2 block">Event Poster/Image</Label>
            <Input
              id="eventImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {uploadingImage && <p className="text-blue-500 mt-2 flex items-center"><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Uploading image...</p>}
            {imagePreviewUrl && (
              <div className="mt-4 border rounded-md overflow-hidden shadow-sm max-w-sm">
                <img
                  src={imagePreviewUrl}
                  alt="Image Preview"
                  className="w-full h-48 object-cover"
                />
                <p className="text-xs text-blue-500 p-2">New Image Preview (Will be uploaded on save)</p>
              </div>
            )}
        </div>

        <div>
          <Label htmlFor="attendees">Estimated Attendees</Label>
          <Input 
            id="attendees" 
            type="number" 
            placeholder="0" 
            min="0"
            value={attendees} 
            onChange={(e) => setAttendees(e.target.value)} 
          />
        </div>

        {error && <p className="text-red-500 text-center font-medium">{error}</p>}
        
        <Button 
          type="submit" 
          className="w-full py-3 text-lg" 
          disabled={isDisabled}
        >
          {loading ? "Adding Event..." : uploadingImage ? "Uploading Image..." : "Add Event"}
        </Button>
      </form>
    </>
  );
}
