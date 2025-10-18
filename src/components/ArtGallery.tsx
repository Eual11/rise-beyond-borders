
import React, { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import ArtCard, { ArtCardProps } from "./ArtGalleryCard";
import Footer from "./Footer";
import Header from "./Header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
interface GalleryArtCardProps extends ArtCardProps {
  id: string;
  artistWebsite?: string;
  artistEmail?: string;
  artistInstagram?: string;
  artistTwitter?: string;
  artistLinkedin?: string;
  artistFacebook?: string;
  artistYoutube?: string;
}

const ArtGallery: React.FC = () => {
  const [artPieces, setArtPieces] = useState<GalleryArtCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [artworkToDelete, setArtworkToDelete] =
    useState<GalleryArtCardProps | null>(null);

  const openDeleteDialog = (artwork: GalleryArtCardProps) => {
    setArtworkToDelete(artwork);
  };

  const closeDeleteDialog = () => {
    setArtworkToDelete(null);
  };

  useEffect(() => {
    const checkSessionAndFetchArtworks = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData.session);

      setLoading(true);

      const { data, error } = await supabase.from("artworks").select(
        `
          id,
          title,
          on_sale,
          price,
          img_src,
          artist_url,
          artist:artist( 
            name, 
            website, 
            email, 
            instagram, 
            twitter, 
            linkedin, 
            facebook, 
            youtube 
          )
        `
      );

      if (error) {
        console.error("Error fetching artworks:", error.message);
        setLoading(false);
        return;
      }

      if (data) {
        const formatted: GalleryArtCardProps[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          artist: item.artist?.name || "Unknown Artist",
          onSale: item.on_sale,
          price: item.on_sale ? `$${item.price}` : undefined,
          imageSrc: item.img_src,
          artistUrl: `/artist/${item.artist_url}`,
          artistWebsite: item.artist?.website,
          artistEmail: item.artist?.email,
          artistInstagram: item.artist?.instagram,
          artistTwitter: item.artist?.twitter,
          artistLinkedin: item.artist?.linkedin,
          artistFacebook: item.artist?.facebook,
          artistYoutube: item.artist?.youtube,
        }));

        setArtPieces(formatted);
      }

      setLoading(false);
    };

    checkSessionAndFetchArtworks();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 2. Deletion Handler
  const handleDeleteArtwork = async () => {
    if (!artworkToDelete || !session) return;

    const artworkId = artworkToDelete.id;
    closeDeleteDialog();
    setLoading(true);

    const { error } = await supabase
      .from("artworks")
      .delete()
      .eq("id", artworkId);

    if (error) {
      console.error("Error deleting artwork:", error.message);
      alert(`Failed to delete artwork: ${error.message}`);
    } else {
      setArtPieces((prev) => prev.filter((piece) => piece.id !== artworkId));
      alert("Artwork deleted successfully!");
    }
    setLoading(false);
  };

  // 3. Render
  return (
    <>
      <Header />

      <Dialog
        open={!!artworkToDelete}
        onOpenChange={(open) => !open && closeDeleteDialog()}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you absolutely sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {artworkToDelete?.title}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteArtwork}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <section
        id="gallery"
        className="py-24 bg-gradient-to-b from-gray-50 to-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Art Gallery
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Explore a curated collection of artwork created by refugee youth and
              community artists. Support the artists by viewing their contact
              details.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading artworks...</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {artPieces.map((piece) => (
                <ArtCard
                  key={piece.id}
                  {...piece}
                  onDelete={
                    session ? () => openDeleteDialog(piece) : undefined
                  }
                  artistWebsite={piece.artistWebsite}
                  artistEmail={piece.artistEmail}
                  artistInstagram={piece.artistInstagram}
                  artistTwitter={piece.artistTwitter}
                  artistLinkedin={piece.artistLinkedin}
                  artistFacebook={piece.artistFacebook}
                  artistYoutube={piece.artistYoutube}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ArtGallery;
