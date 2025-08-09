import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
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
  rules,
);
