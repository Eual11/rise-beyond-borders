
import React, { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import ArtistProfile from "./ArtistProfile";
import { ArtCardProps } from "./ArtGalleryCard";
import Header from "./Header";
import Footer from "./Footer";
import { Loader2 } from "lucide-react"; // For a loading spinner
import { useParams } from "react-router";


interface ArtistData {
  id: number;
  name: string;
  bio: string;
  portrait_src: string;
  background_src?: string;
  website?: string;
  email?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
}

// Define the structure for social links to be passed to ArtistProfile
interface SocialLink {
  platform: string;
  url: string;
}

const ArtistPage = () => {
  const {id} = useParams();
  const [artist, setArtist] = useState<ArtistData | null>(null);
  const [artworks, setArtworks] = useState<ArtCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to place an order (retains original logic)
  const handleOrder = (art: ArtCardProps) => {
    if (art.onSale) {
      alert(`Placing order for "${art.title}" by ${art.artist}`);
    } else {
      alert(`"${art.title}" is not for sale`);
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Artist ID not provided in the route.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch Artist Data
        const { data: artistData, error: artistError } = await supabase
          .from("artist")
          .select("*")
          .eq("id", id).single();

        if (artistError || !artistData) {
          throw new Error(artistError?.message || "Artist not found.");
        }
        setArtist(artistData as ArtistData);

        // 2. Fetch Artworks by Artist ID
        const { data: artworkData, error: artworkError } = await supabase
          .from("artworks")
          .select(`
            id,
            title,
            on_sale,
            price,
            img_src,
            artist_url
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
          `)
          .eq("artist", id);

        if (artworkError) {
          throw new Error(artworkError.message);
        }

        const formattedArtworks: ArtCardProps[] = artworkData.map((item: any) => ({
          title: item.title,
          artist: artistData.name,
          onSale: item.on_sale,
          price: item.on_sale ? `${item.price} Br` : undefined,
          imageSrc: item.img_src,
          artPageUrl: item.artPageUrl || `/art/${item.id}`,
          artistWebsite: item.artist?.website,
          artistEmail: item.artist?.email,
          artistInstagram: item.artist?.instagram,
          artistTwitter: item.artist?.twitter,
          artistLinkedin: item.artist?.linkedin,
          artistFacebook: item.artist?.facebook,
          artistYoutube: item.artist?.youtube,          
        }));

        

        setArtworks(formattedArtworks);

      } catch (err: any) {
        console.error("Fetch error:", err.message);
        setError(`Failed to load profile: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mr-2" />
          <p className="text-lg text-gray-700">Loading artist profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !artist) {
    return (
      <>
        <Header />
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 p-8">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-lg text-gray-700">{error || "Artist data could not be loaded."}</p>
        </div>
        <Footer />
      </>
    );
  }
  
  // Format social links from the fetched data for the ArtistProfile component
  const socialLinks: SocialLink[] = [
    artist.linkedin && { platform: "LinkedIn", url: artist.linkedin },
    artist.twitter && { platform: "Twitter", url: artist.twitter },
    artist.instagram && { platform: "Instagram", url: artist.instagram },
    artist.facebook && { platform: "Facebook", url: artist.facebook },
    artist.youtube && { platform: "YouTube", url: artist.youtube },
  ].filter((link): link is SocialLink => !!link);


  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        
        <ArtistProfile
          name={artist.name}
          bio={artist.bio}
          portraitSrc={artist.portrait_src}
          artworks={artworks}
          onOrder={handleOrder}
          website={artist.website}
          contactEmail={artist.email}
          socialLinks={socialLinks}
          backgroundSrc={artist.background_src}
        />

        {/* --- Exhibitions & Achievements (Static for now, could also be fetched) --- */}
        <section className=" hidden py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Exhibitions & Achievements
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-8 rounded-2xl shadow-md">
                <h3 className="text-2xl font-semibold mb-4">Community Art Expo</h3>
                <p className="text-gray-700">
                  Featured artist at the annual expo, showcasing themes of cultural identity.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-2xl shadow-md">
                <h3 className="text-2xl font-semibold mb-4">Youth Resilience Award</h3>
                <p className="text-gray-700">
                  Recipient of the award for outstanding contributions to art and community empowerment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Get in Touch (Dynamic) --- */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Get in Touch</h2>
            <p className="text-xl text-gray-700 mb-8">
              Interested in commissioning a piece or collaborating? Reach out!
            </p>
            {artist.email ? (
              <a
                href={`mailto:${artist.email}`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-300"
              >
                Contact {artist.name}
              </a>
            ) : (
              <p className="text-gray-500">Contact information not publicly available.</p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ArtistPage;
