import { defineConfig } from "tsup";

export default defineConfig({
  target: "esnext",
  minify: true,
  bundle: true,
  format: "esm",
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  outDir: "dist/",
  treeshake: { preset: "smallest" },
  replaceNodeEnv: true,
  skipNodeModulesBundle: true,
});
