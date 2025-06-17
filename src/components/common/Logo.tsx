import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${sizeClasses[size]} mr-2 relative`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="eventraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#0891B2" />
            </linearGradient>
          </defs>
          
          {/* Main logo shape - abstract E with event calendar elements */}
          <path
            d="M8 10 L8 30 L32 30 L32 26 L12 26 L12 22 L28 22 L28 18 L12 18 L12 14 L32 14 L32 10 Z"
            fill="url(#eventraGradient)"
            className="drop-shadow-sm"
          />
          
          {/* Event dots/indicators */}
          <circle cx="16" cy="16" r="1.5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="20" cy="16" r="1.5" fill="#FFFFFF" opacity="0.7" />
          <circle cx="24" cy="16" r="1.5" fill="#FFFFFF" opacity="0.9" />
          
          <circle cx="16" cy="24" r="1.5" fill="#FFFFFF" opacity="0.7" />
          <circle cx="20" cy="24" r="1.5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="24" cy="24" r="1.5" fill="#FFFFFF" opacity="0.7" />
        </svg>
      </div>
      
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
          Eventra
        </span>
      )}
    </div>
  );
};

export default Logo;