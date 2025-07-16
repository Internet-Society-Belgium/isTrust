import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "./src/index.ts"),
      name: "common",
      formats: ["es"],
    },
  },
  plugins: [dts({ rollupTypes: true })],
  test: {
    projects: [
      {
        test: {
          name: "minimal",
          include: ["./src/**/*.test.ts"],
          exclude: [
            "src/certificate/crtsh/index.test.ts",
            "src/certificate/sslmate/index.test.ts",
          ],
        },
      },
      {
        test: {
          name: "manual",
          include: [
            "src/certificate/crtsh/index.test.ts",
            "src/certificate/sslmate/index.test.ts",
          ],
          testTimeout: 0,
        },
      },
    ],
  },
});
