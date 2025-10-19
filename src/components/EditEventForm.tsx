import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import supabase from "@/utils/supabase";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, Trash2 } from "lucide-react";
import AdminHeader from "./AdminHeader";

interface EventFormData {
  name: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  link: string;
  location: string;
}

interface FetchedEventData {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  img_src: string;
  location: string;
  link: string;
}

const MAX_DESC_LENGTH = 1000;

const EditEventForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = id ? parseInt(id) : null;
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState<FetchedEventData | null>(null);
  const [formData, setFormData] = useState<EventFormData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId === null || isNaN(eventId)) {
      setError("Invalid Event ID provided.");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("events")
          .select("id, name, description, start_date, end_date, img_src, location, link")
          .eq("id", eventId)
          .single();

        if (fetchError || !data) {
          throw new Error(fetchError?.message || `Event with ID ${eventId} not found.`);
        }

        const fetchedEvent = data as FetchedEventData;

        const startDateTime = new Date(fetchedEvent.start_date);
        const startDatePart = startDateTime.toISOString().split('T')[0];
        const startTimePart = startDateTime.toTimeString().substring(0, 5);

        const endDateTime = fetchedEvent.end_date ? new Date(fetchedEvent.end_date) : startDateTime;
        const endDatePart = endDateTime.toISOString().split('T')[0];
        const endTimePart = endDateTime.toTimeString().substring(0, 5);

        const formFields: EventFormData = {
          name: fetchedEvent.name,
          description: fetchedEvent.description || "",
          startDate: startDatePart,
          startTime: startTimePart,
          endDate: endDatePart,
          endTime: endTimePart,
          link: fetchedEvent.link || "",
          location: fetchedEvent.location || "",
        };

        setInitialData(fetchedEvent);
        setFormData(formFields);
        setExistingImageUrl(fetchedEvent.img_src);

      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(`Failed to load event: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!formData) return;

    if (name === 'description' && value.length > MAX_DESC_LENGTH) {
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImagePreviewUrl(URL.createObjectURL(selectedFile));
      setExistingImageUrl(null);
    } else {
      setFile(null);
      setImagePreviewUrl(null);
      setExistingImageUrl(initialData?.img_src || null);
    }
  };

  const handleRemoveExistingImage = () => {
    setExistingImageUrl(null);
    setFile(null);
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(null);
    toast.success("Event image marked for removal upon save.");
  };

  const uploadImage = async (fileToUpload: File): Promise<string | null> => {
    setUploading(true);
    const fileExtension = fileToUpload.name.split('.').pop();
    const filePath = `events/event_${eventId}-${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from("rise")
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      toast.error(`Image upload failed: ${uploadError.message}`);
      setUploading(false);
      return null;
    }
    const { data: { publicUrl } } = supabase.storage.from("rise").getPublicUrl(filePath);
    setUploading(false);
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !initialData || eventId === null) return;

    setLoading(true);

    let finalImageUrl = existingImageUrl;

    try {
      if (file) {
        finalImageUrl = await uploadImage(file);
        if (!finalImageUrl) {
          setLoading(false);
          return;
        }
      }

      const startIso = `${formData.startDate}T${formData.startTime}:00Z`;
      const endIso = `${formData.endDate}T${formData.endTime}:00Z`;
      
      const eventDataToUpdate = {
        name: formData.name,
        description: formData.description,
        start_date: startIso,
        end_date: endIso,
        location: formData.location,
        link: formData.link,
        img_src: finalImageUrl || "",
      };

      const { error } = await supabase
        .from("events")
        .update(eventDataToUpdate)
        .eq('id', eventId);

      if (error) throw error;

      toast.success("Event updated successfully!");

      setInitialData({ ...initialData, ...eventDataToUpdate, id: initialData.id });
      setExistingImageUrl(eventDataToUpdate.img_src);
      setFile(null);
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);

      navigate("/events");

    } catch (err: any) {
      console.error("Supabase Update Error:", err);
      toast.error(`Failed to update event: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mr-2" />
        <p className="text-lg text-gray-700">Loading event data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg max-w-3xl mx-auto my-10">
        <h2 className="text-xl font-bold">Error Loading Event</h2>
        <p>{error}</p>
      </div>
    );
  }

  const isFormValid = formData.name.trim() && formData.startDate.trim() && formData.location.trim();
  const isDisabled = loading || uploading || !isFormValid;
  const charsRemaining = MAX_DESC_LENGTH - formData.description.length;

  return (
    <>
      <AdminHeader/>
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-2xl flex flex-col gap-6 my-10">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 border-b pb-4 mb-4">
          Edit Event: {initialData?.name}
        </h1>

        <div>
          <Label htmlFor="name">Event name *</Label>
          <Input name="name" id="name" value={formData.name} onChange={handleChange} placeholder="Event Name" required />
        </div>
        
        <div>
          <Label htmlFor="location">Location *</Label>
          <Input name="location" id="location" value={formData.location} onChange={handleChange} placeholder="Venue Name" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-indigo-50/50">
          <div>
            <Label htmlFor="startDate" className="font-semibold text-indigo-800">Start Date *</Label>
            <Input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="startTime" className="font-semibold text-indigo-800">Start Time</Label>
            <Input type="time" name="startTime" id="startTime" value={formData.startTime} onChange={handleChange} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-green-50/50">
          <div>
            <Label htmlFor="endDate" className="font-semibold text-green-800">End Date</Label>
            <Input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="endTime" className="font-semibold text-green-800">End Time</Label>
            <Input type="time" name="endTime" id="endTime" value={formData.endTime} onChange={handleChange} />
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Detailed description of the event."
            maxLength={MAX_DESC_LENGTH}
          />
          <p className={`text-sm mt-1 text-right ${charsRemaining <= 50 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
            {formData.description.length} / {MAX_DESC_LENGTH} characters
          </p>
        </div>

        <div>
          <Label htmlFor="link">Registration/Ticket Link</Label>
          <Input name="link" id="link" value={formData.link} onChange={handleChange} placeholder="https://buytickets.com/event" />
        </div>

        <div className="border p-4 rounded-lg bg-gray-50">
          <Label htmlFor="image_file" className="text-lg font-semibold mb-2 block">Event Poster/Image</Label>

          {(existingImageUrl && !file) && (
            <div className="mt-4 mb-4 border rounded-md overflow-hidden shadow-sm max-w-sm relative group">
              <img
                src={existingImageUrl}
                alt="Current Event Image"
                className="w-full h-48 object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveExistingImage}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" /> Remove
              </Button>
              <p className="text-xs text-gray-500 p-2">Current Image</p>
            </div>
          )}

          <Input
            type="file"
            name="image_file"
            id="image_file"
            accept="image/*"
            onChange={handleFileChange}
          />

          {(imagePreviewUrl && file) && (
            <div className="mt-4 border rounded-md overflow-hidden shadow-sm max-w-sm">
              <img
                src={imagePreviewUrl}
                alt="New Event Preview"
                className="w-full h-48 object-cover"
              />
              <p className="text-xs text-blue-500 p-2">New Image Preview (Will be uploaded on save)</p>
            </div>
          )}
          {uploading && <p className="text-blue-500 mt-2">Uploading image...</p>}
        </div>

        <Button type="submit" className="mt-6 py-3 text-lg" disabled={isDisabled}>
          {loading ? "Saving Changes..." : uploading ? "Uploading Image..." : "Save Changes"}
        </Button>
      </form>
    </>
  );
};

export default EditEventForm;
