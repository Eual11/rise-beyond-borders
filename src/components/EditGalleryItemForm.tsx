
import React, { useState, useEffect } from "react";
import supabase from "@/utils/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import toast, { Toaster } from "react-hot-toast";
import AdminHeader from "./AdminHeader";

interface Artist {
  id: string;
  name: string;
}

export default function EditArtworkForm() {
  const navigate = useNavigate();
  const { id: artworkId } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [onSale, setOnSale] = useState(false);
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [currentImgSrc, setCurrentImgSrc] = useState<string | null>(null);
  const [artistId, setArtistId] = useState<string | null>(null);
  const [artistName, setArtistName] = useState("");
  const [search, setSearch] = useState("");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!artworkId) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("artworks")
        .select(`
          id,
          title,
          on_sale,
          price,
          img_src,
          artist!inner(id, name)
        `)
        .eq("id", artworkId)
        .single();

      if (error) {
        toast.error("Failed to load artwork: " + error.message);
        setLoading(false);
        return;
      }

      if (data) {
        setTitle(data.title);
        setOnSale(data.on_sale);
        setPrice(data.price ? data.price.toString() : "");
        setCurrentImgSrc(data.img_src);

        if (data.artist) {
          const artistData = Array.isArray(data.artist)
            ? data.artist[0]
            : data.artist;
          setArtistId(artistData.id);
          setArtistName(artistData.name);
          setSearch(artistData.name);
        }
      }

      setLoading(false);
    };

    fetchArtwork();
  }, [artworkId]);

  useEffect(() => {
    const fetchArtists = async () => {
      if (!search || search === artistName) return setArtists([]);

      const { data, error } = await supabase
        .from("artist")
        .select("id, name")
        .ilike("name", `%${search}%`)
        .limit(10);

      if (!error && data) setArtists(data);
    };

    fetchArtists();
  }, [search, artistName]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    if (e.target.files?.[0]) {
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
    if (!artworkId) return;
    if (!artistId) {
      toast.error("Please select an artist.");
      return;
    }

    let imgSrc = currentImgSrc;
    if (file) {
      const uploadedUrl = await uploadFile();
      if (!uploadedUrl) return;
      imgSrc = uploadedUrl;
    }

    const updateData = {
      title,
      on_sale: onSale,
      price: onSale ? parseFloat(price) : null,
      img_src: imgSrc,
      artist: artistId,
    };

    const { error } = await supabase
      .from("artworks")
      .update(updateData)
      .eq("id", artworkId);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Artwork updated successfully!");
      setFile(null);
      setImagePreviewUrl(null);
      setCurrentImgSrc(imgSrc);
      setTimeout(() => navigate("/gallery"), 1500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
        <p className="text-center text-lg font-medium">Loading artwork data...</p>
      </div>
    );
  }

  return (
    <>
      <AdminHeader />
      <Toaster position="top-right" />
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold">Edit Artwork</h2>

        {/* Title */}
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

        {/* Upload image */}
        <div>
          <Label htmlFor="file">Upload New Image (Optional)</Label>
          <Input id="file" type="file" accept="image/*" onChange={handleFileChange} />
          {uploading && <p className="text-gray-600 mt-1">Processing...</p>}
          {(imagePreviewUrl || currentImgSrc) && (
            <div className="mt-4 border rounded-md overflow-hidden">
              <img
                src={imagePreviewUrl || currentImgSrc || ""}
                alt="Artwork"
                className="w-full h-48 object-cover"
              />
              <p className="p-2 text-sm text-gray-500">
                {imagePreviewUrl ? "New image preview" : "Current saved image"}
              </p>
            </div>
          )}
        </div>

        {/* On Sale */}
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

        {/* Price */}
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

        {/* Artist */}
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
            <p className="mt-1 text-gray-700">
              Selected artist: <strong>{artistName}</strong>
            </p>
          )}
        </div>

        <Button type="submit" disabled={uploading}>
          {uploading ? "Processing..." : "Update Artwork"}
        </Button>
      </form>
    </>
  );
}
