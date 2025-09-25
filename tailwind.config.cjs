/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0b0f14',
          soft: '#0f1620',
          card: '#121a24',
          hover: '#1a2332',
        },
        fg: {
          DEFAULT: '#e6edf3',
          muted: '#9fb0c0',
          subtle: '#cbd5e1',
        },
        accent: {
          DEFAULT: '#4f9cff',
          soft: '#3a7bd9',
          hover: '#5ba3ff',
        },
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        purple: '#8b5cf6',
        pink: '#ec4899',
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
          light: 'rgba(0, 0, 0, 0.1)',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
      },
      boxShadow: {
        card: '0 10px 25px rgba(0,0,0,0.25)',
        'card-light': '0 4px 20px rgba(0,0,0,0.08)',
        glow: '0 0 20px rgba(79, 156, 255, 0.3)',
        'inner-light': 'inset 0 1px 0 rgba(255,255,255,0.1)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

