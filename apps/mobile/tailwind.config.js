/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        surface: '#111827',
        accent: '#22d3ee',
        muted: '#64748b'
      }
    }
  },
  plugins: []
};

