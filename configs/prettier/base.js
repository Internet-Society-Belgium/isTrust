/** @type {import("prettier").Config} */
export default {
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-sort-json",
    "prettier-plugin-packagejson",
  ],
  jsonRecursiveSort: true,
};
