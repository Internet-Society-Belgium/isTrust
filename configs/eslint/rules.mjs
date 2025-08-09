export default {
  rules: {
    eqeqeq: ["error", "always"],
    "@typescript-eslint/strict-boolean-expressions": "error",
    "@typescript-eslint/naming-convention": [
      "warn",
      {
        selector: "default",
        format: ["snake_case"],
      },
      {
        selector: "variableLike",
        format: ["snake_case", "UPPER_CASE"],
      },
      {
        selector: "variable",
        types: ["function"],
        format: ["StrictPascalCase"],
      },
      {
        selector: "function",
        format: ["StrictPascalCase"],
      },
      {
        selector: "typeLike",
        format: ["StrictPascalCase"],
      },
    ],
  },
};
