// src/components/Admin/AddArtistForm.tsx
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import supabase from "@/utils/supabase";
import toast, { Toaster } from "react-hot-toast";

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

const initialFormData: ArtistFormData = {
  name: "",
  bio: "",
  website: "",
  email: "",
  twitter: "",
  linkedin: "",
  instagram: "",
  facebook: "",
  youtube: "",
};

const MAX_BIO_LENGTH = 500;

const AddArtistForm: React.FC = () => {
  const [formData, setFormData] = useState<ArtistFormData>(initialFormData);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'bio' && value.length > MAX_BIO_LENGTH) {
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

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

  const uploadImage = async (): Promise<string | null> => {
    if (!file) return null;

    setUploading(true);
    const filePath = `gallery/${Date.now()}-${file.name.replace(/\s/g, '_')}`;

    const { error: uploadError } = await supabase.storage
      .from("rise")
      .upload(filePath, file, {
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
    setLoading(true);

    let portraitUrl = "";

    if (file) {
      const url = await uploadImage();
      if (!url) {
        setLoading(false);
        return;
      }
      portraitUrl = url;
    }

    try {
      const artistDataToInsert = {
        ...formData,
        portrait_src: portraitUrl,
      };

      const { error } = await supabase.from("artist").insert([artistDataToInsert]);

      if (error) throw error;

      toast.success("Artist added successfully!");

      setFormData(initialFormData);
      setFile(null);
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);

    } catch (err: any) {
      console.error("Supabase Insert Error:", err);
      toast.error(`Failed to add artist: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name.trim() && formData.bio.trim();
  const isDisabled = loading || uploading || !isFormValid;
  const bioLength = formData.bio.length;
  const charsRemaining = MAX_BIO_LENGTH - bioLength;

  return (
    <>
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-2xl flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 border-b pb-4 mb-4">
          Add New Artist 🎨
        </h1>

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

        <div className="border p-4 rounded-lg bg-gray-50">
          <Label htmlFor="portrait_file" className="text-lg font-semibold mb-2 block">Artist Portrait</Label>
          <Input
            type="file"
            name="portrait_file"
            id="portrait_file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {uploading && <p className="text-blue-500 mt-2">Uploading image...</p>}
          {imagePreviewUrl && (
            <div className="mt-4 border rounded-md overflow-hidden shadow-sm max-w-xs">
              <img
                src={imagePreviewUrl}
                alt="Portrait Preview"
                className="w-full h-48 object-cover"
              />
            </div>
          )}
        </div>

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
          {loading ? "Saving Artist..." : uploading ? "Uploading Image..." : "Add Artist"}
        </Button>
      </form>
    </>
  );
};

export default AddArtistForm;
