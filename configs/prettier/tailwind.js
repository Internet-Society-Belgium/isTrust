import javascriptConfig from "./javascript.js";

/** @type {import("prettier").Config} */
export default {
  ...javascriptConfig,
  plugins: [...javascriptConfig.plugins, "prettier-plugin-tailwindcss"],
};
