
import React from "react";

const ComingSoon: React.FC = () => {
  return (
    <section className="w-full h-screen bg-gradient-to-br from-blue-600 to-pink-500 flex flex-col items-center justify-center text-center overflow-hidden relative">
      {/* Glow background circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/30 rounded-full animate-pulse-slow"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-400/30 rounded-full animate-pulse-slow"></div>

      {/* Main Text */}
      <h1 className="text-6xl sm:text-8xl font-extrabold text-white animate-fadeIn">
        Coming Soon
      </h1>

      <p className="mt-6 text-xl sm:text-2xl text-white/90 animate-fadeIn delay-200">
        We’re crafting something amazing. Stay tuned!
      </p>

      {/* Simple pulse underline */}
      <div className="mt-8 w-24 h-1 bg-white rounded-full animate-pulse-slow"></div>

      {/* Tailwind animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 1s ease forwards; }
        .delay-200 { animation-delay: 0.2s; }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

export default ComingSoon;
