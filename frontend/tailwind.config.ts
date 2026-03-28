import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fdf8f0',
          100: '#faefd8',
          200: '#f5dca8',
          300: '#edc372',
          400: '#e3a33d',
          500: '#d9892a',
          600: '#c06d20',
          700: '#9f541c',
          800: '#81431d',
          900: '#6a381a',
          950: '#391c0b',
        },
      },
    },
  },
  plugins: [],
};

export default config;
