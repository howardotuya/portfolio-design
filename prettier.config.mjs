import * as tailwind from "prettier-plugin-tailwindcss";

/** @type {import("prettier").Config} */
const config = {
  printWidth: 100,
  trailingComma: "all",
  plugins: [tailwind],
  tailwindStylesheet: "./src/app/globals.css",
  tailwindFunctions: ["cn"],
};

export default config;
