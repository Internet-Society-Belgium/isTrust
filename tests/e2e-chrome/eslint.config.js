import typescriptConfig from "@istrust/eslint-config/typescript";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["playwright-report", "test-results"]),
  ...typescriptConfig,
]);
