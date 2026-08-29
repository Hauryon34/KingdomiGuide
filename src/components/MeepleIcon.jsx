import React from 'react';

/**
 * Nouveau design de Meeple / Pion KingdomiGuide
 * Inspiré de la figurine minimale dodue debout, bras le long du corps, style bois laqué avec couronne
 */
export default function MeepleIcon({ color = '#0284c7', size = 48, className = '', showCrown = true }) {
  const cleanId = color.replace('#', '');

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 transition-transform ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 120"
        width={size}
        height={size * 1.2}
        className="drop-shadow-md overflow-visible"
      >
        <defs>
          <filter id={`wood-shadow-${cleanId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.45" />
          </filter>

          {/* Dégradé doux type bois laqué */}
          <linearGradient id={`pion-grad-${cleanId}`} x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="25%" stopColor={color} stopOpacity="1" />
            <stop offset="80%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
          </linearGradient>

          {/* Reflet de brillance sur le côté gauche */}
          <linearGradient id={`highlight-${cleanId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ombre portée au sol */}
        <ellipse cx="50" cy="112" rx="26" ry="7" fill="#000000" opacity="0.35" />

        {/* Corps du bonhomme dodu debout, bras le long du corps */}
        {/* Bras gauches et droits intégrés + torse cylindrique + jambes courtes arrondies */}
        <g filter={`url(#wood-shadow-${cleanId})`}>
          {/* Tête ronde dodue */}
          <circle
            cx="50"
            cy="36"
            r="19"
            fill={`url(#pion-grad-${cleanId})`}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2.5"
          />

          {/* Reflet sur la tête */}
          <ellipse
            cx="44"
            cy="30"
            rx="6"
            ry="4"
            transform="rotate(-25 44 30)"
            fill="#ffffff"
            opacity="0.35"
          />

          {/* Corps principal (torse + bras le long du corps + base arrondie) */}
          <path
            d="M 33,52
               C 24,53 20,62 20,74
               C 20,86 23,94 28,95
               C 31,95 34,90 35,84
               L 36,104
               C 36,108 40,111 46,111
               L 48,111
               C 49,98 51,98 52,111
               L 54,111
               C 60,111 64,108 64,104
               L 65,84
               C 66,90 69,95 72,95
               C 77,94 80,86 80,74
               C 80,62 76,53 67,52
               C 62,51 58,54 50,54
               C 42,54 38,51 33,52 Z"
            fill={`url(#pion-grad-${cleanId})`}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="2.5"
          />

          {/* Ligne douce de séparation des bras le long du corps */}
          <path
            d="M 33,57 C 32,68 32,80 34,87"
            stroke="rgba(0,0,0,0.25)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 67,57 C 68,68 68,80 66,87"
            stroke="rgba(0,0,0,0.25)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Fente séparation jambes */}
          <path
            d="M 50,88 L 50,108"
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* Petite couronne dorée sur la tête */}
        {showCrown && (
          <g transform="translate(32, 8) scale(0.75)">
            <path
              d="M 4,24 L 8,10 L 24,18 L 40,10 L 44,24 Z"
              fill="#FACC15"
              stroke="#B45309"
              strokeWidth="2.5"
            />
            <circle cx="8" cy="10" r="3" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
            <circle cx="24" cy="18" r="3" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
            <circle cx="40" cy="10" r="3" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
          </g>
        )}
      </svg>
    </div>
  );
}
