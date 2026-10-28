import React from 'react';

interface SpideyIconProps {
  className?: string;
  size?: number;
}

export const SpideyIcon: React.FC<SpideyIconProps> = ({ className = 'w-6 h-6', size }) => {
  return (
    <img
      src="/spidey-logo.png"
      alt="Spider-Man Emblem"
      width={size}
      height={size}
      className={`inline-block object-contain select-none pointer-events-none rounded-full ${className}`}
      draggable={false}
    />
  );
};
