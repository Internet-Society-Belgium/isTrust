import solidConfig from "@istrust/eslint-config/solid";
import typescriptonfig from "@istrust/eslint-config/typescript";
import { defineConfig } from "eslint/config";

export default defineConfig([...typescriptonfig, ...solidConfig]);
