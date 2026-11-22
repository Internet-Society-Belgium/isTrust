import eslint from "@eslint/js";
import { config as solidTsConfig } from "@istrust/eslint-config/solid";
import { config as tsConfig } from "@istrust/eslint-config/typescript";
import prettierConfig from "eslint-config-prettier";
import astroPlugin from "eslint-plugin-astro";
import { defineConfig } from "eslint/config";
import tsEslint from "typescript-eslint";

export default defineConfig(
  eslint.configs.recommended,
  prettierConfig,
  tsConfig,
  solidTsConfig,
  ...astroPlugin.configs.recommended,
  // eslint-plugin-astro only auto-detects TypeScript when
  // @typescript-eslint/parser resolves from the app, which npm hoisting does
  // not guarantee. Without it, frontmatter is parsed as JavaScript and
  // <script> blocks are extracted as .js files. Set both explicitly.
  {
    files: ["**/*.astro"],
    processor: "astro/client-side-ts",
    languageOptions: {
      parserOptions: {
        parser: tsEslint.parser,
      },
    },
  },
  // <script> blocks are linted as virtual "<file>.astro/<n>.ts" files, which the
  // shared TypeScript config also matches. Type-aware rules can't resolve those
  // virtual files, and their results were silently dropped, so turn type
  // checking off for them while keeping the other rules.
  {
    files: ["**/*.astro/*.ts"],
    extends: [tsEslint.configs.disableTypeChecked],
  },
);
