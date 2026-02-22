import eslint from "@eslint/js";
import * as tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import solidTsConfig from "eslint-plugin-solid/configs/typescript";
import { defineConfig } from "eslint/config";

export const config = {
  files: ["**/*.tsx"],
  extends: [solidTsConfig],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
    globals: {
      document: false,
      window: false,
      navigator: false,
      setTimeout: false,
      localStorage: false,
      console: false,
    },
  },
};

export default defineConfig(eslint.configs.recommended, prettierConfig, config);
