/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.{js,jsx,ts,tsx}", "./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./src/**/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
        fontFamily: {
            'poppins-black': ['Poppins-Black'],
            'poppins-bold': ['Poppins-Bold'],
            'poppins-extrabold': ['Poppins-ExtraBold'],
            'poppins-extralight': ['Poppins-ExtraLight'],
            'poppins-light': ['Poppins-Light'],
            'poppins-medium': ['Poppins-Medium'],
            'poppins-regular': ['Poppins-Regular'],
            'poppins-semibold': ['Poppins-SemiBold'],
            'poppins-thin': ['Poppins-Thin'],
        },
    },
},
  plugins: [],
};