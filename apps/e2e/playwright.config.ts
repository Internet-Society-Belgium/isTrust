import { defineConfig, devices } from "@playwright/test";
import type { Options } from "./fixtures/test";

// E2E tests of the website and the Chrome extension, run against their builds
// (`apps/website/dist`, `apps/webextension/dist/chrome-mv3`). Turbo builds them
// first: run through `npm run test:e2e` from the repo root.
//
// - website, extension: offline. Every request is answered from
//   scenarios/*.json (see fixtures/network.ts).
// - website-live, extension-live: the real services, on a schedule.
// - record: rewrites scenarios/*.json from the real services.

const port = 4321;
const base_url = `http://127.0.0.1:${String(port)}`;
const is_ci = process.env.CI !== undefined;

export default defineConfig<Options>({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: is_ci,
  retries: is_ci ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: base_url,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `node serve.ts ${String(port)}`,
    url: `${base_url}/en/`,
    reuseExistingServer: !is_ci,
  },
  projects: [
    {
      name: "website",
      testMatch: /(^|\/)website\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "extension",
      testMatch: /(^|\/)extension\.spec\.ts$/,
    },
    {
      name: "website-live",
      testMatch: /(^|\/)website\.live\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"], live: true },
    },
    {
      name: "extension-live",
      testMatch: /(^|\/)extension\.live\.spec\.ts$/,
      use: { live: true },
    },
    {
      name: "record",
      testMatch: /(^|\/)record\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"], live: true },
    },
  ],
});
