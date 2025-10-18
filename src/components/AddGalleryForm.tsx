import React, { useState, useEffect } from "react";
import supabase from "@/utils/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import toast, { Toaster } from "react-hot-toast";

interface Artist {
  id: string;
  name: string;
}

export default function AddArtworkForm() {
  const [title, setTitle] = useState("");
  const [onSale, setOnSale] = useState(false);
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); // New state for image preview
  const [artistId, setArtistId] = useState<string | null>(null);
  const [artistName, setArtistName] = useState("");
  const [search, setSearch] = useState("");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [uploading, setUploading] = useState(false);

  // Fetch artists
  useEffect(() => {
    const fetchArtists = async () => {
      if (!search) return setArtists([]);
      const { data, error } = await supabase
        .from("artist")
        .select("id, name")
        .ilike("name", `%${search}%`)
        .limit(10);
      if (!error && data) setArtists(data);
    };
    fetchArtists();
  }, [search]);

  // Clean up image preview URL
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl); // Clean up previous preview
    }
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImagePreviewUrl(URL.createObjectURL(selectedFile)); // Set new preview URL
    } else {
      setFile(null);
      setImagePreviewUrl(null);
    }
  };

  const uploadFile = async (): Promise<string | null> => {
    if (!file) return null;
    setUploading(true);
    const fileName = `gallery/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("rise")
      .upload(fileName, file);

    if (uploadError) {
      toast.error(uploadError.message);
      setUploading(false);
      return null;
    }

    const { data } = supabase.storage.from("rise").getPublicUrl(fileName);
    setUploading(false);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!artistId) {
      toast.error("Please select an artist.");
      return;
    }

    let imgSrc = "";
    if (file) {
      const uploadedUrl = await uploadFile();
      if (!uploadedUrl) return; // stop if upload fails
      imgSrc = uploadedUrl;
    }

    const { error: insertError } = await supabase.from("artworks").insert([
      {
        title,
        on_sale: onSale,
        price: onSale ? parseFloat(price) : null,
        img_src: imgSrc,
        artist_url: artistId,
        artist: artistId, // match your foreign key column
      },
    ]);

    if (insertError) toast.error(insertError.message);
    else {
      toast.success("Artwork added successfully!");
      setTitle("");
      setOnSale(false);
      setPrice("");
      setFile(null);
      setImagePreviewUrl(null); // Clear image preview after successful submission
      setArtistId(null);
      setArtistName("");
      setSearch("");
      setArtists([]);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold">Add New Artwork</h2>

        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Artwork title"
            required
          />
        </div>

        <div>
          <Label htmlFor="file">Upload Image</Label>
          <Input
            id="file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {uploading && <p className="text-gray-600 mt-1">Uploading...</p>}
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

        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            id="onSale"
            checked={onSale}
            onChange={(e) => setOnSale(e.target.checked)}
            className="w-4 h-4"
          />
          <Label htmlFor="onSale">On Sale</Label>
        </div>

        {onSale && (
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="200 Br"
              required
            />
          </div>
        )}

        <div>
          <Label>Artist</Label>
          <Command>
            <CommandInput
              placeholder="Search artist..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>No artists found.</CommandEmpty>
              {artists.map((artist) => (
                <CommandItem
                  key={artist.id}
                  onSelect={() => {
                    setArtistId(artist.id);
                    setArtistName(artist.name);
                    setSearch(artist.name);
                    setArtists([]);
                  }}
                >
                  {artist.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
          {artistName && (
            <p className="mt-1 text-gray-700">Selected artist: {artistName}</p>
          )}
        </div>

        <Button type="submit">{uploading ? "Processing..." : "Add Artwork"}</Button>
      </form>
    </>
  );
}
