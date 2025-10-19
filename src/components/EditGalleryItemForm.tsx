import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import supabase from "@/utils/supabase";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, Trash2 } from "lucide-react";
import AdminHeader from "./AdminHeader";

interface GalleryFormData {
  title: string;
  artist_id: number | null; // Nullable to handle artists not being loaded yet
  description: string;
}

interface GalleryData extends GalleryFormData {
  id: number;
  img_url: string; // Assuming 'img_url' is the column name
}

interface ArtistOption {
    id: number;
    name: string;
}

const EditGalleryItemForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const itemId = id ? parseInt(id) : null;
  const navigate = useNavigate();

  const [artistOptions, setArtistOptions] = useState<ArtistOption[]>([]);
  const [initialData, setInitialData] = useState<GalleryData | null>(null);
  const [formData, setFormData] = useState<GalleryFormData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Artists and Gallery Item Data
  useEffect(() => {
    if (itemId === null || isNaN(itemId)) {
      setError("Invalid Gallery Item ID provided.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch Artists for the dropdown
        const { data: artistsData } = await supabase
          .from("artist")
          .select('id, name')
          .order("name", { ascending: true });
        
        setArtistOptions(artistsData as ArtistOption[] || []);
        
        // Fetch Gallery Item
        const { data: itemData, error: fetchError } = await supabase
          .from("gallery")
          .select('*')
          .eq("id", itemId)
          .single();

        if (fetchError || !itemData) {
          throw new Error(fetchError?.message || `Gallery item with ID ${itemId} not found.`);
        }

        const fetchedItem = itemData as GalleryData;
        
        const formFields: GalleryFormData = {
          title: fetchedItem.title || "",
          artist_id: fetchedItem.artist_id || null,
          description: fetchedItem.description || "",
        };

        setInitialData(fetchedItem);
        setFormData(formFields);
        setExistingImageUrl(fetchedItem.img_url);

      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(`Failed to load gallery item: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [itemId]);

  // Clean up image preview URL
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  // 2. Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!formData) return;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSelectChange = (value: string) => {
    if (!formData) return;
    const artistId = value ? parseInt(value) : null;
    setFormData({ ...formData, artist_id: artistId });
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
      setExistingImageUrl(initialData?.img_url || null);
    }
  };

  const handleRemoveExistingImage = () => {
      setExistingImageUrl(null);
      setFile(null);
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
      toast.success("Image marked for removal upon save. The gallery item will remain, but without an image.");
  };

  // 3. Supabase Upload Logic
  const uploadImage = async (fileToUpload: File): Promise<string | null> => {
    setUploading(true);
    const fileExtension = fileToUpload.name.split('.').pop();
    const filePath = `gallery/item_${itemId}-${Date.now()}.${fileExtension}`;

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

  // 4. Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !initialData || itemId === null) return;
    
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
        
        const galleryItemDataToUpdate = {
            ...formData,
            // Convert null to 0 or leave as null based on DB schema. Using null for foreign keys is safer.
            artist_id: formData.artist_id, 
            img_url: finalImageUrl || "",
        };

        const { error } = await supabase
            .from("gallery")
            .update(galleryItemDataToUpdate)
            .eq('id', itemId);

        if (error) throw error;

        toast.success("Gallery item updated successfully!");
        
        // Refresh state and navigate away (optional)
        setInitialData({ ...initialData, ...galleryItemDataToUpdate });
        setExistingImageUrl(galleryItemDataToUpdate.img_url);
        setFile(null);
        if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
        setImagePreviewUrl(null);
        
        navigate("/admin/gallery");

    } catch (err: any) {
        console.error("Supabase Update Error:", err);
        toast.error(`Failed to update gallery item: ${err.message}`);
    } finally {
        setLoading(false);
    }
  };

  // 5. Render Logic
  if (loading || !formData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mr-2" />
        <p className="text-lg text-gray-700">Loading gallery data...</p>
      </div>
    );
  }
  
  if (error) {
      return (
          <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg max-w-3xl mx-auto my-10">
              <h2 className="text-xl font-bold">Error Loading Gallery Item</h2>
              <p>{error}</p>
          </div>
      );
  }

  const isFormValid = formData.title.trim();
  const isDisabled = loading || uploading || !isFormValid;

  return (
    <div>
      <AdminHeader/>
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-2xl flex flex-col gap-6 my-10">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 border-b pb-4 mb-4">
          Edit Gallery Item: {initialData?.title}
        </h1>

        {/* Title */}
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input name="title" id="title" value={formData.title} onChange={handleChange} placeholder="Artwork Title" required />
        </div>
        
        {/* Artist Selection */}
        <div>
            <Label htmlFor="artist_id">Artist</Label>
            <Select 
                name="artist_id" 
                value={formData.artist_id?.toString() || ""} 
                onValueChange={handleSelectChange}
                disabled={artistOptions.length === 0}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select an Artist (Optional)" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="">-- None --</SelectItem>
                    {artistOptions.map((artist) => (
                        <SelectItem key={artist.id} value={artist.id.toString()}>
                            {artist.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {artistOptions.length === 0 && <p className="text-sm text-red-500 mt-1">No artists available. Add artists first!</p>}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="A brief description of the artwork."
          />
        </div>

        {/* Image Upload Field */}
        <div className="border p-4 rounded-lg bg-gray-50">
          <Label htmlFor="image_file" className="text-lg font-semibold mb-2 block">Artwork Image</Label>
          
          {(existingImageUrl && !file) && (
              <div className="mt-4 mb-4 border rounded-md overflow-hidden shadow-sm max-w-xs relative group">
                  <img
                      src={existingImageUrl}
                      alt="Current Artwork"
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
          <p className="text-sm text-gray-500 mt-1">Upload a new image to replace the current one.</p>

          {(imagePreviewUrl && file) && (
            <div className="mt-4 border rounded-md overflow-hidden shadow-sm max-w-xs">
              <img
                src={imagePreviewUrl}
                alt="New Artwork Preview"
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
    </div>
  );
};

export default EditGalleryItemForm;
