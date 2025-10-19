
import React, { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Link, Mail, Instagram, Twitter, Facebook, Youtube, Linkedin, Trash2, Edit, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router"; 
import Header from "./Header";
import Footer from "./Footer"

interface Artist {
  id: number;
  name: string;
  bio: string;
  portrait_src: string;
  website?: string;
  email?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
}

const ArtistsPage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [artistToDelete, setArtistToDelete] = useState<Artist | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State to hold the authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  let navigate = useNavigate();

  // Define paths
  const ADMIN_EDIT_ROUTE = "/admin/artists/edit";
  const PUBLIC_VIEW_ROUTE = "/artist"; 
  
  const defaultImage = "/images/logo.png";

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // Set isAuthenticated to true if a session exists
      setIsAuthenticated(!!session);
    };

    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);


  const fetchArtists = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("artist")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching artists:", error.message);
      setError("Failed to load artists. Please try again.");
    } else {
      setArtists(data as Artist[]);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchArtists();
  }, []);

  const renderSocialLink = (url: string | undefined, Icon: React.ElementType, name: string, isMail:boolean=false) => {
    if (!url) return null;
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    if(isMail) {
      return    }

    return (
      <a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name} profile`}
        key={name}
      >
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:text-blue-600 transition-colors">
          <Icon className="h-4 w-4" />
        </Button>
      </a>
    );
  };

  const handleDelete = async () => {
    if (!artistToDelete) return;

    setIsDeleting(true);
    const artistId = artistToDelete.id;
    const artistName = artistToDelete.name;

    setArtistToDelete(null);

    try {
      const { error } = await supabase
        .from("artist")
        .delete()
        .eq("id", artistId);

      if (error) throw error;

      setArtists(prev => prev.filter(artist => artist.id !== artistId));
      toast.success(`${artistName} deleted successfully!`);

    } catch (err: any) {
      console.error("Deletion Error:", err);
      toast.error(`Error deleting artist: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="text-center p-20 min-h-[60vh]"><p>Loading artists...</p></div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="text-center p-20 min-h-[60vh] text-red-600 font-semibold">{error}</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <Header />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!artistToDelete} onOpenChange={(open) => !open && setArtistToDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you absolutely sure you want to delete <strong>{artistToDelete?.name}</strong>? This action cannot be undone and will remove the artist from the database.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setArtistToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Artist"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">
            {isAuthenticated ? "Admin Artist Management" : "Our Artists"}
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            {isAuthenticated 
                ? "Manage profiles, edit details, and remove artists from the database." 
                : "Discover the talented individuals contributing their work to the collective."
            }
          </p>

          {artists.length === 0 ? (
            <div className="text-center p-10"><p>No artists found in the database.</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {artists.map((artist) => (
                <Card
                  key={artist.id}
                  className="overflow-hidden flex flex-col h-full shadow-lg transition-all duration-300 hover:shadow-xl hover:border-blue-200"
                >
                  {/* Card Image Header */}
                  <CardHeader className="p-0 relative h-56">
                    <img
                      src={artist.portrait_src || defaultImage}
                      alt={`Portrait of ${artist.name}`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== defaultImage) {
                          target.onerror = null;
                          target.src = defaultImage;
                        }
                      }}
                    />
                    {/* Simple Tag */}
                    <div className="absolute top-0 left-0 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-br-lg font-medium">
                      <Users className="inline h-3 w-3 mr-1" /> Artist
                    </div>
                  </CardHeader>

                  {/* Card Content */}
                  <CardContent className="flex flex-col p-4 flex-grow">
                    <CardTitle className="text-xl font-bold truncate mb-1">{artist.name}</CardTitle>

                    <CardDescription className="text-gray-600 mb-3 flex-grow">
                      {artist.bio.length > 100
                        ? artist.bio.substring(0, 100) + "..."
                        : artist.bio}
                    </CardDescription>

                  </CardContent>

                  {/* Card Footer - Links and Actions */}
                  <CardFooter className="flex flex-col items-start gap-3 p-4 border-t w-full">
                    {/* Social Icons */}
                    <div className="flex flex-wrap gap-0 mb-2">
                      {renderSocialLink(artist.website, Link, "Website")}
                      {renderSocialLink(artist.email ? `mailto:${artist.email}` : undefined, Mail, "Email", true)}
                      {renderSocialLink(artist.instagram, Instagram, "Instagram")}
                      {renderSocialLink(artist.twitter, Twitter, "Twitter")}
                      {renderSocialLink(artist.linkedin, Linkedin, "LinkedIn")}
                      {renderSocialLink(artist.facebook, Facebook, "Facebook")}
                      {renderSocialLink(artist.youtube, Youtube, "YouTube")}
                    </div>

                    <div className="flex w-full gap-2 cursor-pointer">
                      
                      {/* 1. View Profile (Always present) */}
                      <Button
                        variant={isAuthenticated ? "secondary" : "default"}
                        className="flex-grow text-blue-600 hover:bg-blue-50"
                        onClick={() => navigate(`${PUBLIC_VIEW_ROUTE}/${artist.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" /> View Profile
                      </Button>
                      
                      {isAuthenticated && (
                        <Button
                          variant="default"
                          className="flex-grow text-white hover:bg-indigo-700 bg-indigo-600"
                          onClick={() => navigate(`${ADMIN_EDIT_ROUTE}/${artist.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                      )}
                      {isAuthenticated && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="flex-shrink-0 text-red-600 hover:bg-red-50 hover:border-red-300"
                          onClick={() => setArtistToDelete(artist)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ArtistsPage;
