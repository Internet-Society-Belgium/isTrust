import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 15 * 1000,
    include: ["./src/**/*.test.ts"],
  },
});
