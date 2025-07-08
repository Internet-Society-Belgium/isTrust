import prettierConfigBase from "./base.js";

/** @type {import("prettier").Config} */
export default Object.assign(prettierConfigBase, {
  plugins: ["prettier-plugin-tailwindcss"],
});
