import eslint from "@eslint/js";
import * as tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import solidTsConfig from "eslint-plugin-solid/configs/typescript";
import tsEslint from "typescript-eslint";

export const config = {
  files: ["**/*.tsx"],
  extends: [solidTsConfig],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: "tsconfig.json",
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

export default tsEslint.config(
  eslint.configs.recommended,
  prettierConfig,
  config,
);
