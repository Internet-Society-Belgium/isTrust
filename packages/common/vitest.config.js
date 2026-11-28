import { defineConfig } from "vitest/config";

// Two projects, selected by file name:
// - `unit`: `*.test.ts`, offline. `vitest.offline.ts` makes any network access
//   throw, so a test that reaches the network fails instead of passing by luck.
// - `live`: `*.live.test.ts`, calls the real services.
export default defineConfig({
  test: {
    testTimeout: 2 * 60 * 1000,
    setupFiles: ["./vitest.setup.ts"],
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["./src/**/*.test.ts"],
          exclude: ["./src/**/*.live.test.ts"],
          setupFiles: ["./vitest.offline.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "live",
          include: ["./src/**/*.live.test.ts"],
        },
      },
    ],
  },
});
