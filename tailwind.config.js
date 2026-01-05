/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // GitHub-inspired dark theme
        bg: {
          0: '#0d1117',
          1: '#161b22',
          2: '#1c2128',
          3: '#21262d',
          4: '#292e36',
        },
        border: {
          1: 'rgba(240, 246, 252, 0.1)',
          2: 'rgba(240, 246, 252, 0.15)',
        },
        text: {
          1: '#e6edf3',
          2: '#8b949e',
          3: '#6e7681',
          link: '#58a6ff',
        },
        accent: {
          blue: '#58a6ff',
          green: '#3fb950',
          amber: '#d29922',
          red: '#f85149',
          purple: '#a371f7',
          cyan: '#39d353',
        },
        diff: {
          add: 'rgba(63, 185, 80, 0.15)',
          del: 'rgba(248, 81, 73, 0.15)',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
