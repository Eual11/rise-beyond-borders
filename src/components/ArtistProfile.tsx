
// ArtistProfile.tsx
import React from "react";
import ArtCard, { ArtCardProps } from "./ArtGalleryCard";
import { Globe, Mail, Twitter, Linkedin, Instagram, Facebook, Youtube, Github, Link } from 'lucide-react';

export interface ArtistProfileProps {
  name: string;
  bio: string;
  portraitSrc: string;
  artworks: ArtCardProps[];
  onOrder?: (art: ArtCardProps) => void;
  socialLinks?: {
    platform: string;
    url: string;
    icon?: string; // Optional: Can be used for custom icon name if needed
  }[];
  contactEmail?: string;
  website?: string;
}

const iconMap: { [key: string]: React.ComponentType<{ size?: number }> } = {
  website: Globe,
  email: Mail,
  twitter: Twitter,
  x: Twitter, // Assuming X is Twitter
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  github: Github,
  default: Link,
};

const ArtistProfile: React.FC<ArtistProfileProps> = ({
  name,
  bio,
  portraitSrc,
  artworks,
  onOrder,
  socialLinks = [],
  contactEmail,
  website,
}) => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Artist Header */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
          {/* Portrait - Made larger and more prominent */}
          <div className="flex-shrink-0 w-full lg:w-1/3 h-96 rounded-2xl overflow-hidden shadow-xl">
            <img src={portraitSrc} alt={name} className="w-full h-full object-cover" />
          </div>

          {/* Name, Bio, Contacts */}
          <div className="w-full lg:w-2/3 text-center lg:text-left">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">{name}</h1>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">{bio}</p>

            {/* Social Links and Contacts */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full transition-colors duration-300 font-medium"
                >
                  <Globe size={20} />
                  Website
                </a>
              )}
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full transition-colors duration-300 font-medium"
                >
                  <Mail size={20} />
                  Email
                </a>
              )}
              {socialLinks.map((link, index) => {
                const platformKey = link.platform.toLowerCase();
                const Icon = iconMap[platformKey] || iconMap['default'];
                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full transition-colors duration-300 font-medium"
                  >
                    <Icon size={20} />
                    {link.platform}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Artworks Grid */}
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Artworks by {name}</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {artworks.map((art, index) => (
              <ArtCard
                key={index}
                {...art}
                onOrder={() => onOrder && onOrder(art)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtistProfile;
