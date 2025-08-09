import astroConfig from "@istrust/eslint-config/astro";
import solidConfig from "@istrust/eslint-config/solid";
import typescriptConfig from "@istrust/eslint-config/typescript";
import { defineConfig } from "eslint/config";

export default defineConfig([
  ...typescriptConfig,
  ...astroConfig,
  ...solidConfig,
]);
