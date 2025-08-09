import tailwindConfig from "./tailwind.js";

/** @type {import("prettier").Config} */
export default {
  ...tailwindConfig,
  plugins: ["prettier-plugin-astro", ...tailwindConfig.plugins],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
