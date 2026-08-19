/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fond principal — bleu nuit très sombre
        base: '#0a0e17',
        surface: '#0d1220',
        surfaceLight: '#111827',
        surfaceCard: '#131c2e',

        // Accent principal — bleu vif CTA
        primary: {
          DEFAULT: '#3b6df0',
          light: '#6090f8',
          dark: '#2451c7',
        },

        // Accents catégories
        redteam: {
          DEFAULT: '#e74c3c',
          light: '#ff6b6b',
          bg: 'rgba(231,76,60,0.10)',
          border: 'rgba(231,76,60,0.30)',
        },
        blueteam: {
          DEFAULT: '#22d3ee',
          light: '#67e8f9',
          bg: 'rgba(34,211,238,0.10)',
          border: 'rgba(34,211,238,0.30)',
        },
        grc: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          bg: 'rgba(245,158,11,0.10)',
          border: 'rgba(245,158,11,0.30)',
        },

        // Textes
        muted: '#8A93A6',
      },

      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },

      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)",
        'grid-circuit': "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
      },

      backgroundSize: {
        'grid': '32px 32px',
        'grid-sm': '24px 24px',
      },

      animation: {
        'scan': 'scan 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s step-end infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },

      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};