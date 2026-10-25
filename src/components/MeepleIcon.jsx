import React from 'react';

/**
 * Pion / Avatar moderne et épuré (Flat & Soft Vector Design)
 */
export default function MeepleIcon({ color = '#0EA5E9', size = 44, className = '', showCrown = true }) {
  const cleanId = color.replace('#', '');

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 transition-transform ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 112"
        width={size}
        height={size * 1.12}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={`modern-pawn-${cleanId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.82" />
          </linearGradient>

          <filter id={`soft-drop-${cleanId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Ombre douce au sol */}
        <ellipse cx="50" cy="105" rx="24" ry="5" fill="currentColor" className="text-black/15 dark:text-black/40" />

        {/* Silhouette géométrique moderne et épurée du pion */}
        <g filter={`url(#soft-drop-${cleanId})`}>
          {/* Tête géométrique pure */}
          <circle
            cx="50"
            cy="35"
            r="17.5"
            fill={`url(#modern-pawn-${cleanId})`}
          />

          {/* Buste / Base arrondie minimaliste */}
          <path
            d="M 31,58
               C 25,60 22,68 22,82
               C 22,94 27,100 36,100
               L 64,100
               C 73,100 78,94 78,82
               C 78,68 75,60 69,58
               C 63,56 57,57 50,57
               C 43,57 37,56 31,58 Z"
            fill={`url(#modern-pawn-${cleanId})`}
          />

          {/* Liseré intérieur subtil haut de gamme */}
          <circle
            cx="50"
            cy="35"
            r="16.5"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.22"
            strokeWidth="1.5"
          />
          <path
            d="M 32,59.5 C 26.5,61.5 23.5,69 23.5,82 C 23.5,93 28,98.5 36,98.5 L 64,98.5 C 72,98.5 76.5,93 76.5,82 C 76.5,69 73.5,61.5 68,59.5 Z"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.18"
            strokeWidth="1.5"
          />
        </g>

        {/* Couronne minimaliste vectorielle monochrome ambre */}
        {showCrown && (
          <g transform="translate(35, 3)">
            <path
              d="M 3,14 L 5,4 L 11.5,9.5 L 15,2 L 18.5,9.5 L 25,4 L 27,14 Z"
              fill="#F59E0B"
              stroke="#FEF3C7"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <rect x="3" y="15.5" width="24" height="2.8" rx="1.4" fill="#D97706" />
          </g>
        )}
      </svg>
    </div>
  );
}
