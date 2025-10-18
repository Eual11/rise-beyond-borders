
import React from "react";
import ArtCard, { ArtCardProps } from "./ArtGalleryCard";
import Footer from "./Footer";
import Header from "./Header";

const artPieces: ArtCardProps[] = [
  {
    title: "Sunset Dreams",
    artist: "Amina Yusuf",
    onSale: true,
    price: "$200",
    imageSrc: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Hope in Motion",
    artist: "Mohammed Ali",
    onSale: false,
    imageSrc: "https://images.unsplash.com/photo-1534308143481-5d5aa7e09c22?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Refugee Voices",
    artist: "Sara Ahmed",
    onSale: true,
    price: "$350",
    imageSrc: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=500&q=80",
    artistUrl:"/artist"
  },
  {
    title: "New Beginnings",
    artist: "Daniel Teklu",
    onSale: false,
    imageSrc: "https://images.unsplash.com/photo-1499084732479-de2c02d45fc4?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Resilience",
    artist: "Hanan Abebe",
    onSale: true,
    price: "$180",
    imageSrc: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80",
  },
];

const ArtGallery: React.FC = () => {
  return (
    <>
      <Header/>
    <section id="gallery" className="py-24 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Art Gallery
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Explore a curated collection of artwork created by refugee youth and community artists. Support the artists by purchasing pieces that are on sale.
          </p>
        </div>

        {/* Art Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {artPieces.map((piece, index) => (
            <ArtCard
              key={index}
              {...piece}
              onOrder={() => piece.onSale && alert(`Buying ${piece.title} by ${piece.artist}`)}
            />
          ))}
        </div>
      </div>
    </section>
  <Footer/>
  </>
  );
};

export default ArtGallery;
