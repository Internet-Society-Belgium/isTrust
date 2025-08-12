import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import tsEslint from "typescript-eslint";

export const config = {
  files: ["**/*.{ts,tsx}"],
  extends: [
    tsEslint.configs.strictTypeChecked,
    // tsEslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    eqeqeq: ["error", "always"],
    "@typescript-eslint/strict-boolean-expressions": "error",
    // "@typescript-eslint/naming-convention": [
    //   "warn",
    //   {
    //     selector: "default",
    //     format: ["snake_case"],
    //   },
    //   {
    //     selector: "variableLike",
    //     format: ["snake_case", "UPPER_CASE"],
    //   },
    //   {
    //     selector: "variable",
    //     types: ["function"],
    //     format: ["StrictPascalCase"],
    //   },
    //   {
    //     selector: "function",
    //     format: ["StrictPascalCase"],
    //   },
    //   {
    //     selector: "typeLike",
    //     format: ["StrictPascalCase"],
    //   },
    // ],
  },
};

export default tsEslint.config(
  eslint.configs.recommended,
  prettierConfig,
  config,
);
