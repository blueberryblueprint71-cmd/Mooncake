import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fade out after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500);

    // Completely remove component after fade out completes (3 seconds total)
    const removeTimer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this only runs once on mount

  return (
    <div 
      className={`fixed inset-0 z-[200] bg-moon-bg flex flex-col items-center justify-center transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-moon-pink/10 via-moon-bg to-moon-blue/10 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-moon-pink/20 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Cute Bunny SVG */}
      <div className="relative z-10 animate-bounce-soft mb-8">
        <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-[0_10px_20px_rgba(255,143,179,0.3)]">
          {/* Ears */}
          <g transform="rotate(-15 70 50)">
            <ellipse cx="70" cy="50" rx="16" ry="45" fill="#ffffff" />
            <ellipse cx="70" cy="50" rx="8" ry="35" fill="#ff8fb3" />
          </g>
          <g transform="rotate(15 130 50)">
            <ellipse cx="130" cy="50" rx="16" ry="45" fill="#ffffff" />
            <ellipse cx="130" cy="50" rx="8" ry="35" fill="#ff8fb3" />
          </g>
          
          {/* Head */}
          <circle cx="100" cy="100" r="48" fill="#ffffff" />
          
          {/* Eyes */}
          <circle cx="82" cy="95" r="5" fill="#252233" />
          <circle cx="118" cy="95" r="5" fill="#252233" />
          
          {/* Eye Sparkles */}
          <circle cx="80" cy="93" r="1.5" fill="#ffffff" />
          <circle cx="116" cy="93" r="1.5" fill="#ffffff" />
          
          {/* Blush */}
          <ellipse cx="70" cy="105" rx="8" ry="4" fill="#ff8fb3" opacity="0.6" />
          <ellipse cx="130" cy="105" rx="8" ry="4" fill="#ff8fb3" opacity="0.6" />
          
          {/* Cute 'w' Mouth */}
          <path d="M 92 105 Q 96 112 100 105 Q 104 112 108 105" stroke="#252233" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Body */}
          <path d="M 65 135 Q 100 190 135 135 Z" fill="#ffffff" />
          
          {/* Carrot Cake Base */}
          <rect x="75" y="140" width="50" height="25" rx="4" fill="#d97736" />
          <rect x="75" y="150" width="50" height="4" fill="#8d4c20" opacity="0.3" />
          
          {/* Frosting */}
          <path d="M 73 140 Q 100 132 127 140 Q 130 148 125 150 Q 100 145 75 150 Q 70 148 73 140 Z" fill="#ffffff" />
          <circle cx="85" cy="145" r="3" fill="#ffda75" />
          <circle cx="100" cy="143" r="3" fill="#ff8fb3" />
          <circle cx="115" cy="145" r="3" fill="#8cd0ff" />
          
          {/* Little Carrot on top */}
          <polygon points="100,138 96,122 104,122" fill="#ff9800" />
          <path d="M 98 122 Q 100 115 102 122" stroke="#4caf50" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          
          {/* Paws holding cake */}
          <circle cx="75" cy="148" r="10" fill="#ffffff" />
          <circle cx="125" cy="148" r="10" fill="#ffffff" />
        </svg>
      </div>

      {/* Branding */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl font-display font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-moon-pink via-moon-purple to-moon-blue tracking-tight drop-shadow-sm mb-4">
          Mooncake
        </h1>
        
        {/* Loading Indicator */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-moon-pink animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2.5 h-2.5 rounded-full bg-moon-purple animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2.5 h-2.5 rounded-full bg-moon-blue animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-sm font-bold text-gray-400 tracking-wide uppercase">Baking memories...</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;