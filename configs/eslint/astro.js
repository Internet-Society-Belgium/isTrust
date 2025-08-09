import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import astroPlugin from "eslint-plugin-astro";
import solidConfigTs from "eslint-plugin-solid/configs/typescript";
import tsEslint from "typescript-eslint";
import rules from "./rules.mjs";

export default tsEslint.config(
  eslint.configs.recommended,
  tsEslint.configs.strictTypeChecked,
  // tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  prettierConfig,
  {
    files: ["**/*.tsx"],
    extends: [solidConfigTs],
  },
  {
    files: ["**/*.astro"],
    extends: [astroPlugin.configs.recommended],
  },
  rules,
);
