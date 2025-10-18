
// src/components/Admin/AddArtistForm.tsx
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import supabase from "@/utils/supabase"; // your supabase client

const AddArtistForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    portrait_src: "",
    website: "",
    email: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    facebook: "",
    youtube: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.from("artist").insert([formData]);
      if (error) throw error;
      setMessage("Artist added successfully!");
      setFormData({
        name: "",
        bio: "",
        portrait_src: "",
        website: "",
        email: "",
        twitter: "",
        linkedin: "",
        instagram: "",
        facebook: "",
        youtube: "",
      });
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Add New Artist</h1>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input name="name" id="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea name="bio" id="bio" value={formData.bio} onChange={handleChange} rows={4} required />
      </div>

      <div>
        <Label htmlFor="portrait_src">Portrait URL</Label>
        <Input name="portrait_src" id="portrait_src" value={formData.portrait_src} onChange={handleChange} />
      </div>

      <div>
        <Label htmlFor="website">Website</Label>
        <Input name="website" id="website" value={formData.website} onChange={handleChange} />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} />
      </div>

      {/* Social Links */}
      <div>
        <Label htmlFor="twitter">Twitter</Label>
        <Input name="twitter" id="twitter" value={formData.twitter} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input name="linkedin" id="linkedin" value={formData.linkedin} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="instagram">Instagram</Label>
        <Input name="instagram" id="instagram" value={formData.instagram} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="facebook">Facebook</Label>
        <Input name="facebook" id="facebook" value={formData.facebook} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="youtube">YouTube</Label>
        <Input name="youtube" id="youtube" value={formData.youtube} onChange={handleChange} />
      </div>

      {message && (
        <p className={`text-center ${message.startsWith("Error") ? "text-red-500" : "text-green-600"}`}>
          {message}
        </p>
      )}

      <Button type="submit" className="mt-4" disabled={loading}>
        {loading ? "Adding..." : "Add Artist"}
      </Button>
    </form>
  );
};

export default AddArtistForm;
