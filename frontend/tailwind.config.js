import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'dodgerblue': '#1E90FF',
        'bg_grey': '#F4F4F4'
      },
      width: {
        'almost_full': '97%',
      },
      margin: {
        'almost_full': '1.5%',
      }
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#570df8",
          "secondary": "#1e90ff",  // dodgerblue
          "accent": "#37cdbe",
          "neutral": "#3d4451",
          "base-100": "#ffffff",
        },
      },
    ],
  },
};