/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.html', './src/**/*.js', './src/**/*.jsx'],
  theme: {
    extend: {
      width: {
        '2/7': '28.57143%',
        '1/7': '14.28571%',
        '1/9': '11.11111%',
        '6/7': '85.71429%',
      },
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
