/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kingdom: {
          gold: '#EAB308',
          wood: '#854D0E',
          parchment: '#FEF9C3',
          parchmentDark: '#FEF08A',
          castle: '#F3E8FF',
          wheat: '#EAB308',
          wheatBg: '#FEF3C7',
          forest: '#15803D',
          forestBg: '#DCFCE7',
          lake: '#2563EB',
          lakeBg: '#DBEAFE',
          pasture: '#65A30D',
          pastureBg: '#ECFCCB',
          swamp: '#7E22CE',
          swampBg: '#F3E8FF',
          mine: '#334155',
          mineBg: '#F1F5F9',
          meepleBlue: '#0284C7',
          meepleGreen: '#16A34A',
          meepleYellow: '#EAB308',
          meeplePink: '#E11D48',
        }
      },
      fontFamily: {
        medieval: ['Cinzel', 'serif'],
        game: ['Poppins', 'Nunito', 'sans-serif'],
      },
      boxShadow: {
        'castle': '0 8px 24px -4px rgba(0, 0, 0, 0.15), 0 4px 8px -2px rgba(0, 0, 0, 0.1)',
        'tile': '0 4px 6px -1px rgba(0, 0, 0, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.25)',
        'meeple': '0 4px 10px rgba(0,0,0,0.25)',
      },
      animation: {
        'bounce-short': 'bounceShort 0.5s ease-in-out',
        'shake': 'shake 0.4s ease-in-out',
        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'glow': 'glow 2s infinite alternate',
      },
      keyframes: {
        bounceShort: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 4px rgba(234, 179, 8, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 12px rgba(234, 179, 8, 0.85))' },
        }
      }
    },
  },
  plugins: [],
}
