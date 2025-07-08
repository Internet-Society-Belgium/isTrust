import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typeScriptEsLintPlugin from "@typescript-eslint/eslint-plugin";
import esLintConfigPrettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...new FlatCompat({
    recommendedConfig: typeScriptEsLintPlugin.configs["recommended"],
  }).config({
    env: { node: true },
    extends: ["plugin:@typescript-eslint/recommended"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: ["@typescript-eslint"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  }),
  esLintConfigPrettier,
];
