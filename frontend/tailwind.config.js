/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cabinet Grotesk"', '"DM Sans"', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        ink: '#0d0d0d',
        paper: '#f5f2eb',
        'paper-dark': '#ede9e0',
        'paper-border': '#e0dbd0',
        volt: '#d4f000',
        'volt-dark': '#b8d400',
        ember: '#ff4d2e',
        'ember-dark': '#e03a1e',
        ash: '#8a8478',
        'ash-light': '#c4bfb5',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'blink': 'blink 1.2s step-end infinite',
        'slide-up': 'slideUp 0.25s ease',
        'pop': 'pop 0.2s ease',
      },
      keyframes: {
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pop: { '0%': { transform: 'scale(0.95)' }, '60%': { transform: 'scale(1.03)' }, '100%': { transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}
