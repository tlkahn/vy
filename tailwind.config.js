/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.html', './src/**/*.js', './src/**/*.jsx'],
  theme: {
    extend: {
      backgroundColor: {
        'deep-blue': {
          500: '#1E3A8A',
          600: '#233D6B',
          700: '#152C5B',
        },
      },
    },
  },
  plugins: [],
};
