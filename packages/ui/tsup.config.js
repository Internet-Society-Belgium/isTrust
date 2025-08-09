// Adapted from https://github.com/corvudev/corvu/blob/main/packages/corvu/tsup.config.ts

import { solidPlugin } from "esbuild-plugin-solid";
import { defineConfig } from "tsup";

/**
 * @param jsx {boolean}
 * @returns Options
 */
function generateConfig(jsx) {
  return {
    target: "esnext",
    platform: "browser",
    format: "esm",
    clean: true,
    dts: !jsx,
    entry: ["src/*/index.tsx"],
    outDir: "dist/",
    treeshake: { preset: "smallest" },
    replaceNodeEnv: true,
    esbuildOptions(options) {
      if (jsx) {
        options.jsx = "preserve";
      }
    },
    outExtension() {
      if (jsx) {
        return { js: ".jsx" };
      } else {
        return {};
      }
    },
    esbuildPlugins: !jsx ? [solidPlugin({ solid: { generate: "dom" } })] : [],
  };
}

export default defineConfig([generateConfig(false), generateConfig(true)]);
