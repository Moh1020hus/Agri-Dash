/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // <--- Updated package name
    autoprefixer: {},
  },
};

export default config;
