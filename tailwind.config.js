/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["**/*.{html,js,ejs}"],
  theme: {
    extend: {
      colors: {
        //base: '#ffffff',
        assort: '#ffccff',
        accent: '#ff0099',
      }
    },
    fontFamily: {
      tsl_title: 'Kaisei Decol',
      tsl_normal: 'Noto Sans JP', 
    }
  },
  plugins: [],
}

