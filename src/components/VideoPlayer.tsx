
import React, { useState } from "react";
import ReactPlayer from 'react-player';

export interface VideoPlayerProps {
  videoSrc: string;         // Required: video file URL
  poster?: string;          // Optional fallback image
  caption?: string;         // Optional overlay text
  mute?: boolean;           // Start muted (default: true)
  loop?: boolean;           // Loop playback (default: true)
  autoplay?: boolean;       // Autoplay (default: true)
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoSrc,
  poster = "",
  caption = "Mon–Fri 🌞🌙 | 24/7 ⚡",
  mute = true,
  loop = true,
  autoplay = true,
}) => {
  const [isMuted, setIsMuted] = useState(mute);

  return (
    <div id="story" className="ffv-root relative w-full h-screen overflow-hidden bg-black">
      <ReactPlayer
        src={videoSrc}
        playing={autoplay}
        loop={loop}
        muted={isMuted}
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
      />

      {/* overlay content */}
      <div className="ffv-content absolute inset-0 flex w-full justify-center items-end z-10 pointer-events-none pb-8">
        <div className="ffv-card flex justify-between bg-gradient-to-t w-full from-black/70 to-transparent p-6 rounded-t-xl text-center text-white shadow-lg  w-full">
          <div className="ffv-headline w-full text-3xl font-extrabold tracking-wide">{caption}</div>
          <button
            className="ffv-cta bg-white/90 text-black px-6 py-3 rounded-full font-bold hover:bg-white transition-colors pointer-events-auto flex items-center justify-center mx-auto"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <>
                <span className="mr-2">🔇</span> Unmute
              </>
            ) : (
              <>
                <span className="mr-2">🔊</span> Mute
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
