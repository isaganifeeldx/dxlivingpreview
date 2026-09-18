'use client';

import React, { useState } from 'react';

interface InfoTooltipProps {
  content: string;
  children: React.ReactNode;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className="relative cursor-help py-[5px] hover:text-[#6a758c]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {children}
      <div
        className={`absolute z-[55] w-64 md:w-72 p-3 text-sm text-white bg-gray-800 rounded-lg shadow-lg left-0 bottom-full mb-2 pointer-events-auto md:pointer-events-none transition-opacity duration-300 ease-in-out ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="tooltip"
      >
        <div className="whitespace-normal" dangerouslySetInnerHTML={{ __html: content }} />
        <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
      </div>
    </span>
  );
};

export default InfoTooltip;
