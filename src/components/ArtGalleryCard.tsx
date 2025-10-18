
import React from "react";

export interface ArtCardProps {
  title: string;
  artist: string;
  onSale: boolean;
  price?: string;
  imageSrc: string;
  onOrder?: () => void; // renamed from onBuy
  artistUrl?: string; // optional URL to the artist's profile
}

const ArtCard: React.FC<ArtCardProps> = ({ title, artist, onSale, price, imageSrc, onOrder, artistUrl }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Image */}
      <div className="h-64 w-full overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {artistUrl ? (
          <a
            href={artistUrl}
            className="text-gray-600 text-sm hover:text-blue-600 hover:underline transition-colors duration-300"
          >
            {artist}
          </a>
        ) : (
          <p className="text-gray-600 text-sm">{artist}</p>
        )}

        {onSale ? (
          <div className="flex items-center justify-between mt-2">
            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {price}
            </span>
            {onOrder && (
              <button
                onClick={onOrder}
                className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
              >
                Place Order
              </button>
            )}
          </div>
        ) : (
          <span className="bg-gray-200 max-w-[100px] text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
            Not for Sale
          </span>
        )}
      </div>
    </div>
  );
};

export default ArtCard;
