import eslint from "@eslint/js";
import { config as solidTsConfig } from "@istrust/eslint-config/solid";
import { config as tsConfig } from "@istrust/eslint-config/typescript";
import prettierConfig from "eslint-config-prettier";
import astroPlugin from "eslint-plugin-astro";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
  eslint.configs.recommended,
  prettierConfig,
  tsConfig,
  solidTsConfig,
  ...astroPlugin.configs.recommended,
);
