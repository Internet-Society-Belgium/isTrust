import { defineConfig } from "vitest";

export default defineConfig({
  test: {
    testTimeout: 15 * 1000,
    include: ["./src/**/*.test.ts"],
  },
});
