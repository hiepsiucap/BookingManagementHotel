import {nextui} from '@nextui-org/theme';
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            'hero-pattern': "url('https://res.cloudinary.com/dhhuv7n0h/image/upload/v1723455345/dan-gold-4HG3Ca3EzWw-unsplash_lax4z9.jpg')",
      },
      colors:{
        primary: "#14942c",
        primary2: "#c5e5cb",
      },
      
      fontFamily: {
       sans: ['var(--font-Roboto)']
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
