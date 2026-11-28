import { defineConfig } from "vitest/config";

// `unit`: offline `*.test.ts` (see vitest.offline.ts). `live`: `*.live.test.ts`.
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
