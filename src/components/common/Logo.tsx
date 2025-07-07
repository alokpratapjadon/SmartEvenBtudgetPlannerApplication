import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-4xl'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${sizeClasses[size]} mr-3 relative`}>
        <svg
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Gradient definitions - Dune inspired colors */}
          <defs>
            <linearGradient id="duneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="25%" stopColor="#B8860B" />
              <stop offset="50%" stopColor="#CD853F" />
              <stop offset="75%" stopColor="#8B4513" />
              <stop offset="100%" stopColor="#A0522D" />
            </linearGradient>
            
            <linearGradient id="duneAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#FFA500" />
              <stop offset="100%" stopColor="#FF8C00" />
            </linearGradient>

            <radialGradient id="duneGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8B4513" stopOpacity="0.1" />
            </radialGradient>

            {/* Filter for glow effect */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background glow circle */}
          <circle cx="30" cy="30" r="28" fill="url(#duneGlow)" opacity="0.3" />
          
          {/* Main geometric shape - inspired by Dune's angular architecture */}
          <g filter="url(#glow)">
            {/* Central diamond/crystal structure */}
            <path
              d="M30 8 L45 20 L45 40 L30 52 L15 40 L15 20 Z"
              fill="url(#duneGradient)"
              stroke="url(#duneAccent)"
              strokeWidth="1.5"
              className="drop-shadow-lg"
            />
            
            {/* Inner geometric pattern */}
            <path
              d="M30 15 L38 22 L38 38 L30 45 L22 38 L22 22 Z"
              fill="none"
              stroke="url(#duneAccent)"
              strokeWidth="1"
              opacity="0.8"
            />
            
            {/* Central E symbol - stylized and angular */}
            <g transform="translate(30, 30)">
              {/* Main E structure */}
              <path
                d="M-8 -12 L-8 12 M-8 -12 L4 -12 M-8 -1 L2 -1 M-8 12 L4 12"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="drop-shadow-sm"
              />
              
              {/* Decorative angular elements */}
              <path
                d="M6 -10 L10 -6 M6 2 L10 6 M6 14 L10 10"
                stroke="url(#duneAccent)"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.9"
              />
            </g>
            
            {/* Corner accent elements - like Dune's architectural details */}
            <circle cx="18" cy="18" r="1.5" fill="url(#duneAccent)" opacity="0.8" />
            <circle cx="42" cy="18" r="1.5" fill="url(#duneAccent)" opacity="0.8" />
            <circle cx="18" cy="42" r="1.5" fill="url(#duneAccent)" opacity="0.8" />
            <circle cx="42" cy="42" r="1.5" fill="url(#duneAccent)" opacity="0.8" />
            
            {/* Subtle geometric lines */}
            <path
              d="M15 20 L22 22 M38 22 L45 20 M15 40 L22 38 M38 38 L45 40"
              stroke="url(#duneAccent)"
              strokeWidth="0.8"
              opacity="0.6"
            />
          </g>
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold leading-none tracking-wider ${textSizeClasses[size]}`}
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 25%, #CD853F 50%, #8B4513 75%, #A0522D 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  fontFamily: 'serif',
                  letterSpacing: '0.1em'
                }}>
            EVENTRA
          </span>
          {size === 'lg' && (
            <span className="text-xs tracking-widest text-amber-600 opacity-80 font-medium mt-1"
                  style={{ fontFamily: 'serif', letterSpacing: '0.2em' }}>
              EVENTS OF LEGEND
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;