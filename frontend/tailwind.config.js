/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        kid: {
          mint: '#A8DF8E',
          pink: '#FFAAB8',
          'mint-soft': '#E6F7DE',
          'pink-soft': '#FFE4EA',
          ink: '#1E293B',
          green: '#7ACD53',
        },
        shop: {
          mint: '#E8F3F1',
          blue: '#E1F0F7',
          tan: '#C19A83',
          teal: '#88C9D1',
          ink: '#2c2418',
        },
      },
      boxShadow: {
        'kid-card': '0 8px 0 0 rgba(30, 41, 59, 0.08)',
        'kid-card-hover': '0 12px 0 0 rgba(30, 41, 59, 0.1)',
        'shop-soft': '0 18px 40px rgba(44, 36, 24, 0.06)',
      },
      fontFamily: {
        sans: ['Be Vietnam Pro', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Be Vietnam Pro', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
