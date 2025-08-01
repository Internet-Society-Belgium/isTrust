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
    extends: ["plugin:@typescript-eslint/strict-type-checked"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      projectService: true,
    },
    plugins: ["@typescript-eslint"],
    rules: {
      eqeqeq: ["error", "always"],
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "default",
          format: ["camelCase"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "function",
          format: ["snake_case"],
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "enumMember",
          format: ["UPPER_CASE"],
        },
      ],
    },
  }),
  esLintConfigPrettier,
];
