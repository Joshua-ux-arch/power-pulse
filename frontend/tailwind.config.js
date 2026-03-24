/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0d0d0d',
        paper: '#f5f2eb',
        'paper-dark': '#ede9e0',
        'paper-border': '#e0dbd0',
        volt: '#d4f000',
        ember: '#ff4d2e',
        ash: '#8a8478',
      },
      fontFamily: {
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      animation: {
        'blink': 'blink 1.2s step-end infinite',
        'slide-up': 'slideUp 0.25s ease',
        'fade-in': 'fadeIn 0.3s ease',
      },
      keyframes: {
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
      },
    },
  },
  plugins: [],
}
