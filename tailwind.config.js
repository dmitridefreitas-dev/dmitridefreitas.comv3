/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './contexts/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        foreground: '#F9FAFB',
        muted: {
          DEFAULT: '#9CA3AF',
          foreground: '#9CA3AF',
        },
        accent: {
          DEFAULT: '#8B5CF6',
          blue: '#8B5CF6',
          indigo: '#4C1D95',
          violet: '#7C3AED',
          cyan: '#22D3EE',
          gold: '#F59E0B',
          foreground: '#FFFFFF',
          glow: 'rgba(139,92,246,0.15)',
        },
        surface: {
          DEFAULT: '#080810',
          hover: '#0f0f1c',
        },
        border: {
          DEFAULT: '#160e24',
          strong: '#231940',
        },
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        serif: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'Consolas', 'monospace'],
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display':    ['clamp(1.75rem,3.5vw,2.75rem)', { lineHeight: '1.0',  letterSpacing: '-0.03em' }],
        'headline':   ['clamp(1.2rem,2vw,1.75rem)',    { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'subhead':    ['clamp(0.95rem,1.5vw,1.2rem)',  { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'body-fluid': ['clamp(0.8rem,0.9vw,0.95rem)',  { lineHeight: '1.65' }],
      },
      keyframes: {
        'ticker-scroll': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.333%)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139,92,246,0.2), 0 0 40px rgba(139,92,246,0.08)' },
          '50%':      { boxShadow: '0 0 35px rgba(139,92,246,0.35), 0 0 70px rgba(139,92,246,0.15)' },
        },
        'grid-breathe': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
        'aurora-shift': {
          '0%':   { transform: 'translateX(-50%) scale(1) rotate(0deg)' },
          '33%':  { transform: 'translateX(-48%) scale(1.05) rotate(1deg)' },
          '66%':  { transform: 'translateX(-52%) scale(0.97) rotate(-1deg)' },
          '100%': { transform: 'translateX(-50%) scale(1) rotate(0deg)' },
        },
        'blob-drift-light': {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%':      { transform: 'translate(30px, -20px) scale(1.05)' },
          '66%':      { transform: 'translate(-15px, 15px) scale(0.97)' },
        },
      },
      animation: {
        'ticker-scroll':     'ticker-scroll 78s linear infinite',
        'pulse-glow':        'pulse-glow 2s ease-in-out infinite',
        'grid-breathe':      'grid-breathe 20s ease-in-out infinite',
        'aurora-shift':      'aurora-shift 25s ease-in-out infinite',
        'blob-drift-light':  'blob-drift-light 20s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
