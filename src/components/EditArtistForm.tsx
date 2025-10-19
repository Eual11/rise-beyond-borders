// src/components/Admin/EditArtistForm.tsx
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import supabase from "@/utils/supabase";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, Trash2 } from "lucide-react"; // Added Trash2 for image removal
import { useParams } from "react-router";
import AdminHeader from "./AdminHeader";
import Header from "./Header";

interface ArtistFormData {
  name: string;
  bio: string;
  website: string;
  email: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  youtube: string;
}

// Define the full set of data, including the portrait URL
interface ArtistData extends ArtistFormData {
  id: number;
  portrait_src: string;
}

const MAX_BIO_LENGTH = 500;

// Prop interface for the Edit form
interface EditArtistFormProps {
  onSave?: () => void; // Optional callback after a successful save
}

const EditArtistForm: React.FC<EditArtistFormProps> = ({  onSave }) => {
  const [initialData, setInitialData] = useState<ArtistData | null>(null);
  const [formData, setFormData] = useState<ArtistFormData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const {id} = useParams()

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtist = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("artist")
          .select('*')
          .eq("id", id)
          .single();
          
        if (fetchError || !data) {
          throw new Error(fetchError?.message || "Artist not found.");
        }
        
        // Cast and set all states based on fetched data
        const fetchedArtist = data as ArtistData;
        
        // Separate form data from the whole object
        const formFields: ArtistFormData = {
          name: fetchedArtist.name,
          bio: fetchedArtist.bio,
          website: fetchedArtist.website || "",
          email: fetchedArtist.email || "",
          twitter: fetchedArtist.twitter || "",
          linkedin: fetchedArtist.linkedin || "",
          instagram: fetchedArtist.instagram || "",
          facebook: fetchedArtist.facebook || "",
          youtube: fetchedArtist.youtube || "",
        };

        setInitialData(fetchedArtist);
        setFormData(formFields);
        setExistingImageUrl(fetchedArtist.portrait_src);
        
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(`Failed to load artist: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchArtist();
  }, [id]);
  
  // Clean up image preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  // --- 2. Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (!formData) return;

    if (name === 'bio' && value.length > MAX_BIO_LENGTH) {
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Revoke old preview URL if exists
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImagePreviewUrl(URL.createObjectURL(selectedFile));
      setExistingImageUrl(null); // Clear existing image if a new one is selected
    } else {
      setFile(null);
      setImagePreviewUrl(null);
      // Revert to existing URL if the user cancels file selection
      setExistingImageUrl(initialData?.portrait_src || null);
    }
  };
  
  const handleRemoveExistingImage = () => {
      setExistingImageUrl(null); // Mark for deletion/removal from the database
      setFile(null); // Ensure no file is pending upload
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
      toast.success("Profile image marked for removal upon save.");
  };

  const uploadImage = async (fileToUpload: File): Promise<string | null> => {
    setUploading(true);
    // Use artist ID to make the path unique and predictable (optional, but good practice)
    const fileExtension = fileToUpload.name.split('.').pop();
    const filePath = `gallery/artist_${id}-${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from("rise")
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: false // Set to true if you want to allow overwrites
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
    if (!formData || !initialData) return;
    
    setLoading(true);

    let finalPortraitUrl = existingImageUrl;
    
    try {
        // A. Handle New File Upload
        if (file) {
            finalPortraitUrl = await uploadImage(file);
            if (!finalPortraitUrl) {
                setLoading(false);
                return; // Stop submission if upload failed
            }
        }
        
        // B. Prepare Update Data
        const artistDataToUpdate = {
            ...formData,
            portrait_src: finalPortraitUrl || "", // Use new, existing, or empty string
        };

        // C. Execute Supabase Update
        const { error } = await supabase
            .from("artist")
            .update(artistDataToUpdate)
            .eq('id', id);

        if (error) throw error;

        toast.success("Artist profile updated successfully!");
        
        // D. Call external save handler and refresh local state
        onSave?.();
        // Since the initial fetch is expensive, we'll manually update initialData
        setInitialData({ ...initialData, ...artistDataToUpdate });
        setExistingImageUrl(artistDataToUpdate.portrait_src);
        setFile(null); // Clear pending file upload
        if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
        setImagePreviewUrl(null);

    } catch (err: any) {
        console.error("Supabase Update Error:", err);
        toast.error(`Failed to update artist: ${err.message}`);
    } finally {
        setLoading(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mr-2" />
        <p className="text-lg text-gray-700">Loading artist data...</p>
      </div>
    );
  }
  
  if (error) {
      return (
          <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg max-w-3xl mx-auto my-10">
              <h2 className="text-xl font-bold">Error Loading Artist</h2>
              <p>{error}</p>
          </div>
      );
  }

  const isFormValid = formData.name.trim() && formData.bio.trim();
  const isDisabled = loading || uploading || !isFormValid;
  const bioLength = formData.bio.length;
  const charsRemaining = MAX_BIO_LENGTH - bioLength;

  return (
    <div>
      <AdminHeader/>
      <Toaster position="bottom-right" />
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-2xl flex flex-col gap-6 my-10">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 border-b pb-4 mb-4">
          Edit Artist Profile: {initialData?.name}
        </h1>

        {/* Core Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input name="name" id="name" value={formData.name} onChange={handleChange} placeholder="Full Name or Alias" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} placeholder="contact@example.com" />
          </div>
        </div>

        {/* Bio with Limit */}
        <div>
          <Label htmlFor="bio">Biography *</Label>
          <Textarea
            name="bio"
            id="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            placeholder="A short description of the artist's background and work (max 300 characters)."
            required
            maxLength={MAX_BIO_LENGTH}
          />
          <p className={`text-sm mt-1 text-right ${charsRemaining <= 20 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
            {bioLength} / {MAX_BIO_LENGTH} characters used
          </p>
        </div>

        {/* Image Upload Field */}
        <div className="border p-4 rounded-lg bg-gray-50">
          <Label htmlFor="portrait_file" className="text-lg font-semibold mb-2 block">Artist Portrait</Label>
          
          {/* Existing Image Display */}
          {(existingImageUrl && !file) && (
              <div className="mt-4 mb-4 border rounded-md overflow-hidden shadow-sm max-w-xs relative group">
                  <img
                      src={existingImageUrl}
                      alt="Current Portrait"
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
            name="portrait_file"
            id="portrait_file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <p className="text-sm text-gray-500 mt-1">Upload a new image to replace the current one, or click "Remove" above.</p>

          {/* New Image Preview */}
          {(imagePreviewUrl && file) && (
            <div className="mt-4 border rounded-md overflow-hidden shadow-sm max-w-xs">
              <img
                src={imagePreviewUrl}
                alt="New Portrait Preview"
                className="w-full h-48 object-cover"
              />
              <p className="text-xs text-blue-500 p-2">New Image Preview (Will be uploaded on save)</p>
            </div>
          )}
          {uploading && <p className="text-blue-500 mt-2">Uploading image...</p>}
        </div>

        {/* Optional Links Section (Reused from AddForm) */}
        <div className="space-y-4 pt-4 border-t">
          <h2 className="text-xl font-semibold text-gray-700">Optional Links</h2>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input name="website" id="website" value={formData.website} onChange={handleChange} placeholder="https://artistportfolio.com" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input name="instagram" id="instagram" value={formData.instagram} onChange={handleChange} placeholder="https://instagram.com/artist_handle" />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter / X</Label>
              <Input name="twitter" id="twitter" value={formData.twitter} onChange={handleChange} placeholder="https://x.com/artist_handle" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input name="linkedin" id="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/artist_profile" />
            </div>
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input name="facebook" id="facebook" value={formData.facebook} onChange={handleChange} placeholder="https://facebook.com/artist_page" />
            </div>
          </div>
          <div>
            <Label htmlFor="youtube">YouTube</Label>
            <Input name="youtube" id="youtube" value={formData.youtube} onChange={handleChange} placeholder="https://youtube.com/@channel_name" />
          </div>
        </div>

        <Button type="submit" className="mt-6 py-3 text-lg" disabled={isDisabled}>
          {loading ? "Saving Changes..." : uploading ? "Uploading Image..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default EditArtistForm;
