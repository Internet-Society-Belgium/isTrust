import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
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
    globals: {
      console: false,
    },
  },
  rules: {
    eqeqeq: ["error", "always"],
    "@typescript-eslint/strict-boolean-expressions": "error",
  },
};

export default defineConfig(eslint.configs.recommended, prettierConfig, config);
