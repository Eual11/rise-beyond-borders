
import React, { useState } from "react";
import { Trash2, Copy, Link, Mail, Instagram, Twitter, Facebook, Youtube, Linkedin, Edit2 } from "lucide-react";

const copyToClipboard = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy text: ', err);
    alert('Failed to copy. Please try manually.');
  }
};

export interface ArtCardProps {
  id:string,
  title: string;
  artist: string;
  onSale: boolean;
  price?: string;
  imageSrc: string;
  artistUrl?: string;
  onDelete?: () => void;
  onEdit?: (id:string) => void;
  artistWebsite?: string;
  artistEmail?: string;
  artistInstagram?: string;
  artistTwitter?: string;
  artistLinkedin?: string;
  artistFacebook?: string;
  artistYoutube?: string;
}

const ArtCard: React.FC<ArtCardProps> = ({
  id,
  title,
  artist,
  onSale,
  price,
  imageSrc,
  artistUrl,
  onDelete,
  onEdit,
  artistWebsite,
  artistEmail,
  artistInstagram,
  artistTwitter,
  artistLinkedin,
  artistFacebook,
  artistYoutube,
}) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const openImageModal = () => setIsImageModalOpen(true);
  const closeImageModal = () => setIsImageModalOpen(false);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  const renderContactItem = (value: string | undefined, Icon: React.ElementType, name: string, isLink: boolean = false) => {
    if (!value) return null;

    const displayValue = name === "Email" ? value : value.replace(/^(https?:\/\/|mailto:)/i, '');
    const copyValue = isLink && !value.startsWith('http') ? `https://${value}` : value;
    const linkHref = isLink ? (value.startsWith('http') ? value : `https://${value}`) : (name === "Email" ? `mailto:${value}` : undefined);

    return (
      <div className="flex items-center justify-between p-3 border-b last:border-b-0">
        <div className="flex items-center gap-4 min-w-0">
          <Icon className="h-6 w-6 text-gray-500 flex-shrink-0" />
          <span className="truncate text-gray-700 font-medium">
            {linkHref ? (
              <a href={linkHref} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">
                {displayValue}
              </a>
            ) : (
              displayValue
            )}
          </span>
        </div>
        <button
          onClick={() => copyToClipboard(copyValue, name)}
          className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition-colors flex-shrink-0"
          aria-label={`Copy ${name}`}
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
        <div
          className="h-64 w-full overflow-hidden cursor-pointer"
          onClick={openImageModal}
        >
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="p-4 flex flex-col gap-2 flex-grow">
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

          <div className="flex items-end justify-between mt-auto pt-2">
            {onSale ? (
              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {price}
              </span>
            ) : (
              <span className="bg-gray-200 max-w-[100px] text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                {

                  //                Not for Sale
                }
              </span>
            )}

            <div className="flex gap-2 items-center">
              {onDelete && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="p-2 cursor-pointer rounded-full text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="Delete artwork"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )} {
                onEdit && (

                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(id); }}
                    className="p-2 cursor-pointer  rounded-full text-green-600 hover:bg-green-50 transition-colors"
                    aria-label="Delete artwork"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>)
              }
              {

                (artistWebsite || artistEmail || artistInstagram || artistTwitter || artistLinkedin || artistFacebook || artistYoutube) &&

                <button
                  onClick={openContactModal}
                  className="bg-gray-800 cursor-pointer text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-gray-700 transition-colors"
                >
                  Show Artist
                </button>

              }

            </div>
          </div>
        </div>
      </div>

      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" // Changed here
          onClick={closeImageModal}
        >
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-4 text-white text-4xl font-light z-50 p-2 leading-none"
            aria-label="Close image preview"
          >
            &times;
          </button>

          <div
            className="max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageSrc}
              alt={title}
              className="object-contain max-h-[90vh] max-w-[90vw]"
            />
          </div>
        </div>
      )}

      {isContactModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" // Changed here
          onClick={closeContactModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Contact {artist}</h3>
              <button
                onClick={closeContactModal}
                className="text-gray-500 hover:text-gray-900 text-2xl"
                aria-label="Close contact modal"
              >
                &times;
              </button>
            </div>

            <div className="p-4 space-y-2">
              <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                Use the copy button to get the artist's credentials.
              </p>

              <div className="border rounded-lg divide-y divide-gray-100">
                {renderContactItem(artistWebsite, Link, "Website", true)}
                {renderContactItem(artistEmail, Mail, "Email")}
                {renderContactItem(artistInstagram, Instagram, "Instagram", true)}
                {renderContactItem(artistTwitter, Twitter, "Twitter", true)}
                {renderContactItem(artistLinkedin, Linkedin, "LinkedIn", true)}
                {renderContactItem(artistFacebook, Facebook, "Facebook", true)}
                {renderContactItem(artistYoutube, Youtube, "YouTube", true)}

                {!(artistWebsite || artistEmail || artistInstagram || artistTwitter || artistLinkedin || artistFacebook || artistYoutube) && (
                  <div className="p-4 text-center text-gray-500">
                    No public contact credentials provided for this artist.
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t text-right">
              <button
                onClick={closeContactModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArtCard;
