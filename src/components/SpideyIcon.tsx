import React from 'react';

interface SpideyIconProps {
  className?: string;
  size?: number;
}

export const SpideyIcon: React.FC<SpideyIconProps> = ({ className = 'w-6 h-6', size = 64 }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Spider-Man Mask Silhouette */}
      <g>
        {/* Mask Base Head Shape */}
        <path
          d="M32 4C17.2 4 8 18.5 8 35.5C8 49 19.5 59.5 32 60C44.5 59.5 56 49 56 35.5C56 18.5 46.8 4 32 4Z"
          fill="#E62429"
        />

        {/* Web Lines on Mask */}
        <g fill="none" stroke="#12183A" strokeWidth="1.4" opacity="0.45" strokeLinecap="round">
          {/* Vertical Center Web */}
          <path d="M32 5V59" />
          {/* Radiating Webs */}
          <path d="M32 30L12 16M32 30L52 16" />
          <path d="M32 30L9 30M32 30L55 30" />
          <path d="M32 30L14 47M32 30L50 47" />
          <path d="M32 30L23 57M32 30L41 57" />

          {/* Web Arcs */}
          <path d="M22 17Q32 22 42 17" />
          <path d="M16 26Q32 32 48 26" />
          <path d="M16 38Q32 33 48 38" />
          <path d="M22 48Q32 43 42 48" />
        </g>

        {/* Left Eye: Outer Black Bezel */}
        <path
          d="M15 22C19.5 22.8 26.5 28.5 28.5 37.5C22 39.5 15.5 34 13.5 28C13 25.5 14 23 15 22Z"
          fill="#12183A"
        />
        {/* Left Eye: Inner White Lens */}
        <path
          d="M16.5 24C19.8 24.8 24.8 29.5 26.2 36C21.5 37.5 16.8 33 15 28.5C14.8 26.5 15.5 24.8 16.5 24Z"
          fill="#FFFFFF"
        />

        {/* Right Eye: Outer Black Bezel */}
        <path
          d="M49 22C44.5 22.8 37.5 28.5 35.5 37.5C42 39.5 48.5 34 50.5 28C51 25.5 50 23 49 22Z"
          fill="#12183A"
        />
        {/* Right Eye: Inner White Lens */}
        <path
          d="M47.5 24C44.2 24.8 39.2 29.5 37.8 36C42.5 37.5 47.2 33 49 28.5C49.2 26.5 48.5 24.8 47.5 24Z"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  );
};

