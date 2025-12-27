import React from 'react';

const Logo = ({ className = "w-8 h-8", color = "text-blue-500" }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} ${color}`}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      
      {/* Shield Shape */}
      <path 
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
        stroke="url(#logo-gradient)"
        fill="rgba(59, 130, 246, 0.1)"
      />
      
      {/* Gear Shape (Simplified) inside Shield */}
      <circle cx="12" cy="12" r="3" stroke="url(#logo-gradient)" />
      <path d="M12 8v1" stroke="url(#logo-gradient)" />
      <path d="M12 15v1" stroke="url(#logo-gradient)" />
      <path d="M15.5 12h-1" stroke="url(#logo-gradient)" />
      <path d="M8.5 12h-1" stroke="url(#logo-gradient)" />
      <path d="M14.5 9.5l-.7.7" stroke="url(#logo-gradient)" />
      <path d="M10.2 13.8l-.7.7" stroke="url(#logo-gradient)" />
      <path d="M14.5 14.5l-.7-.7" stroke="url(#logo-gradient)" />
      <path d="M10.2 10.2l-.7-.7" stroke="url(#logo-gradient)" />
    </svg>
  );
};

export default Logo;
