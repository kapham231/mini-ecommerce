/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        kid: {
          mint: '#4CAF50',
          pink: '#4CAF50',
          'mint-soft': '#E8F5E9',
          'pink-soft': '#E8F5E9',
          ink: '#1E293B',
          green: '#43A047',
        },
        shop: {
          mint: '#E8F5E9',
          blue: '#F7F9FC',
          tan: '#FFD93D',
          teal: '#2E7D32',
          ink: '#1E293B',
          deep: '#1B5E20',
        },
      },
      boxShadow: {
        'kid-card': '0 8px 0 0 rgba(30, 41, 59, 0.08)',
        'kid-card-hover': '0 12px 0 0 rgba(30, 41, 59, 0.1)',
        'shop-soft': '0 18px 40px rgba(30, 41, 59, 0.07)',
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
