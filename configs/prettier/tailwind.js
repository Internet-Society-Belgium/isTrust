import prettierConfigBase from "./base.js";

/** @type {import("prettier").Config} */
export default {
  ...prettierConfigBase,
  plugins: [...prettierConfigBase.plugins, "prettier-plugin-tailwindcss"],
};
