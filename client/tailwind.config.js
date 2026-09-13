/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        retro: ['"VT323"', 'monospace'],
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        dungeon: {
          950: '#07060c',
          900: '#0e0b18',
          850: '#151124',
          800: '#1d1733',
          700: '#2c234d',
          600: '#3e326b',
          border: '#473b75',
          borderHighlight: '#7462bc',
        },
        rpg: {
          gold: '#fbbf24',
          goldLight: '#fef08a',
          goldDark: '#b45309',
          gem: '#38bdf8',
          hp: '#ef4444',
          hpBg: '#450a0a',
          mana: '#3b82f6',
          manaBg: '#172554',
          xp: '#a855f7',
          xpBg: '#3b0764',
          stamina: '#10b981',
        },
        stat: {
          intellect: '#60a5fa',
          strength: '#f87171',
          agility: '#4ade80',
          vitality: '#fb923c',
          wisdom: '#c084fc',
          charisma: '#f472b6',
        }
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0, 0, 0, 0.85)',
        'pixel-sm': '2px 2px 0px 0px rgba(0, 0, 0, 0.85)',
        'pixel-lg': '6px 6px 0px 0px rgba(0, 0, 0, 0.9)',
        'pixel-bevel': 'inset 2px 2px 0px rgba(255, 255, 255, 0.15), inset -2px -2px 0px rgba(0, 0, 0, 0.6)',
        'pixel-gold': '0 0 12px rgba(251, 191, 36, 0.4), 4px 4px 0px 0px #000',
        'pixel-xp': '0 0 12px rgba(168, 85, 247, 0.4), 4px 4px 0px 0px #000',
      },
      animation: {
        'float-up': 'floatUp 1.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        floatUp: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '70%': { opacity: '0.9', transform: 'translateY(-28px) scale(1.15)' },
          '100%': { opacity: '0', transform: 'translateY(-48px) scale(0.9)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      }
    },
  },
  plugins: [],
}
