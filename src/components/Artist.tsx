
import React from "react";
import ArtistProfile from "./ArtistProfile";
import { ArtCardProps } from "./ArtGalleryCard";
import Header from "./Header";
import Footer from "./Footer";

const aminaArtworks: ArtCardProps[] = [
  {
    title: "Sunset Dreams",
    artist: "Amina Yusuf",
    onSale: true,
    price: "$200",
    imageSrc:
      "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=800&q=80",
    artPageUrl: "/art/sunset-dreams",
  },
  {
    title: "Reflections",
    artist: "Amina Yusuf",
    onSale: false,
    imageSrc:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
    artPageUrl: "/art/reflections",
  },
  // ... other artworks
];

const ArtistPage = () => {
  const handleOrder = (art: ArtCardProps) => {
    if (art.onSale) {
      alert(`Placing order for "${art.title}" by ${art.artist}`);
    } else {
      alert(`"${art.title}" is not for sale`);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Artist Profile with Background */}
        <ArtistProfile
          name="Amina Yusuf"
          bio="Amina is a refugee youth artist who explores themes of hope, resilience, and identity through her work. She uses vibrant colors and dynamic forms to convey stories from her community. Born in Somalia and resettled in the United States, Amina's art draws from her personal experiences of displacement and triumph. Her pieces have been exhibited in local galleries and featured in community art programs. Amina is passionate about using art as a tool for social change and empowerment."
          portraitSrc="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
          artworks={aminaArtworks}
          onOrder={handleOrder}
          website="https://aminayusuf.art"
          contactEmail="amina@artist.com"
          socialLinks={[
            { platform: "LinkedIn", url: "https://linkedin.com/in/amina-yusuf" },
            { platform: "Twitter", url: "https://twitter.com/amina_art" },
            { platform: "Instagram", url: "https://instagram.com/amina.yusuf.art" },
            { platform: "Facebook", url: "https://facebook.com/amina.yusuf.artist" },
          ]}
          backgroundSrc="https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&w=1920&q=80"
        />

        {/* Exhibitions & Achievements */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Exhibitions & Achievements
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-8 rounded-2xl shadow-md">
                <h3 className="text-2xl font-semibold mb-4">Community Art Expo 2023</h3>
                <p className="text-gray-700">
                  Featured artist at the annual expo, showcasing themes of cultural identity.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-2xl shadow-md">
                <h3 className="text-2xl font-semibold mb-4">Youth Resilience Award 2024</h3>
                <p className="text-gray-700">
                  Recipient of the award for outstanding contributions to art and community empowerment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Get in Touch */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Get in Touch</h2>
            <p className="text-xl text-gray-700 mb-8">
              Interested in commissioning a piece or collaborating? Reach out!
            </p>
            <a
              href="mailto:amina@artist.com"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-300"
            >
              Contact Amina
            </a>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ArtistPage;
