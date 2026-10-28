/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spidey: {
          blue: '#1D4ED8',        // Classic solid Web-Blue
          'blue-dark': '#1E40AF',
          'blue-light': '#EFF6FF',
          'blue-border': '#93C5FD',
          red: '#B91C1C',         // Solid Spidey Red for urgent / danger
          'red-light': '#FEF2F2',
          'red-border': '#FECACA',
          amber: '#D97706',       // Solid Spider-Sense Amber
          'amber-light': '#FFFBEB',
          'amber-border': '#FDE68A',
          ink: '#0F172A',         // Solid comic ink black
          'ink-muted': '#475569',
          canvas: '#F1F4F9',      // Classic light paper canvas
        },
      },
      boxShadow: {
        // Pure solid claymorphism: outer physical shelf + soft ambient shadow (no gradient)
        'clay-card': '0 5px 0 0 #D1D5DB, 0 8px 16px -2px rgba(15, 23, 42, 0.08)',
        'clay-card-hover': '0 7px 0 0 #93C5FD, 0 12px 20px -2px rgba(29, 78, 216, 0.12)',
        'clay-btn-blue': '0 4px 0 0 #1E40AF, 0 6px 12px -2px rgba(29, 78, 216, 0.25)',
        'clay-btn-blue-active': '0 1px 0 0 #1E40AF, inset 0 2px 4px 0 rgba(15, 23, 42, 0.2)',
        'clay-btn-white': '0 3px 0 0 #D1D5DB, 0 4px 8px -1px rgba(15, 23, 42, 0.06)',
        'clay-btn-white-active': '0 1px 0 0 #CBD5E1, inset 0 2px 4px 0 rgba(15, 23, 42, 0.1)',
        'clay-inset': 'inset 0 2px 4px 0 rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
}
