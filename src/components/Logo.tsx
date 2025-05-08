import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="text-xl font-bold flex items-center">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="w-6 h-6 mr-2 text-blue-500"
      >
        <path d="M15 3H9v12h6V3zM8 3c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v12c0 .6-.4 1-1 1H9c-.6 0-1-.4-1-1V3z"/>
        <path d="M8 14h8v4H8v-4zm-5-9h4v10H3V5zm18 0h-4v10h4V5z"/>
        <path d="M12 17.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>
        <path d="M5 16h14v2H5z"/>
      </svg>
      TrafficPulse
    </div>
  );
};

export default Logo;