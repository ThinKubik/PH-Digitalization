/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
    },
    fontSize: {
      xs: '0.667rem',
      sm: '0.889rem',
      base: '1rem',
      lg: '1.111rem',
      xl: '1.333rem',
      '2xl': '1.556rem',
      '3xl': '1.889rem',
      '4xl': '2.222rem',
      '5xl': '2.667rem',
      '6xl': '3.111rem',
      '7xl': '3.889rem',
      '8xl': '4.444rem',
      '9xl': '5.333rem',
    },
  },
  plugins: [],
}
