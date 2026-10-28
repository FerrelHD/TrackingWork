/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        comic: ['Bangers', 'Impact', 'sans-serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        theme: {
          bg: 'var(--bg)',
          card: 'var(--card)',
          ink: 'var(--ink)',
          mute: 'var(--mute)',
          red: 'var(--red)',
          blue: 'var(--blue)',
          navy: 'var(--navy)',
        },
      },
    },
  },
  plugins: [],
}
