import React from 'react';

/**
 * Nouveau design de Meeple / Pion KingdomiGuide
 * Inspiré de la figurine minimale dodue debout, bras le long du corps, style bois laqué avec couronne classique emoji 👑
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

          {/* Dégradé d'or royal pour la couronne */}
          <linearGradient id={`gold-crown-${cleanId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="45%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Ombre portée au sol */}
        <ellipse cx="50" cy="112" rx="26" ry="7" fill="#000000" opacity="0.35" />

        {/* Corps du bonhomme dodu debout, bras le long du corps */}
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

          {/* Lignes douces de séparation des bras */}
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

        {/* Couronne classique style emoji 👑 posée fièrement sur la tête */}
        {showCrown && (
          <g transform="translate(34, 4)">
            {/* Corps de la couronne à 3 pointes majestueuses */}
            <path
              d="M 2,16 
                 L 4,5 
                 L 11,11 
                 L 16,2 
                 L 21,11 
                 L 28,5 
                 L 30,16 
                 Z"
              fill={`url(#gold-crown-${cleanId})`}
              stroke="#78350F"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Bandeau inférieur de la couronne */}
            <path
              d="M 2,16 Q 16,19 30,16 L 30,19 Q 16,22 2,19 Z"
              fill="#D97706"
              stroke="#78350F"
              strokeWidth="1.2"
            />
            {/* Petites perles dorées brillantes au sommet de chaque pointe */}
            <circle cx="4" cy="5" r="2" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />
            <circle cx="16" cy="2" r="2.2" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />
            <circle cx="28" cy="5" r="2" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />

            {/* Petites gemmes colorées sur le bandeau */}
            <circle cx="8" cy="17.5" r="1.2" fill="#EF4444" />
            <circle cx="16" cy="18" r="1.4" fill="#3B82F6" />
            <circle cx="24" cy="17.5" r="1.2" fill="#10B981" />
          </g>
        )}
      </svg>
    </div>
  );
}
