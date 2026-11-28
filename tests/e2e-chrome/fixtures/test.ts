import path from "node:path";
import {
  test as base,
  chromium,
  expect,
  type BrowserContext,
  type Locator,
  type Page,
  type Worker,
} from "@playwright/test";
import { replay_network, type Network } from "./network";
import { seed_random } from "./random";
import { load_scenario } from "./scenario";
import { variants, type Variant } from "./variants";

export { expect };

/** The domain of the recorded scenario (scenarios/istrust.org.json). */
export const domain = "istrust.org";

/** Live runs and the recorder: some services (crt.sh in particular) take minutes. */
export const live_timeout = 4 * 60_000;

export const extension_path = path.join(
  import.meta.dirname,
  "../../../apps/webextension/dist/chrome-mv3",
);

export interface Options {
  /** Scenario file in scenarios/, by domain. */
  scenario_domain: string;
  /** A change to the recorded scenario, see fixtures/variants.ts. */
  variant: Variant;
  /** Live projects: no stubs, no frozen clock, real services. */
  live: boolean;
}

interface Fixtures {
  network: Network | undefined;
}

export const test = base.extend<Options & Fixtures>({
  scenario_domain: [domain, { option: true }],
  variant: ["recorded", { option: true }],
  live: [false, { option: true }],

  // Auto: every test runs offline unless its project is live. It loads the
  // scenario itself, so a live run (or the recorder) needs no scenario file.
  network: [
    async ({ context, scenario_domain, variant, live }, use) => {
      if (live) {
        await use(undefined);
        return;
      }
      const scenario = variants[variant](load_scenario(scenario_domain));
      await context.clock.setFixedTime(new Date(scenario.recorded_at));
      await seed_random(context);
      const network = await replay_network(context, scenario);
      await use(network);
      expect(
        network.unexpected,
        "requests with no recorded response (run `npm run record:e2e`, or stub them)",
      ).toEqual([]);
    },
    { auto: true },
  ],
});

interface ExtensionFixtures {
  service_worker: Worker;
  extension_id: string;
  /** Opens the popup page, the way the toolbar button shows it. */
  open_popup: (query?: string) => Promise<Page>;
}

// The extension only loads in a persistent context, with Chromium's new
// headless mode (`channel: "chromium"`): the default headless shell can't run
// extensions.
export async function launch_extension(): Promise<BrowserContext> {
  return await chromium.launchPersistentContext("", {
    channel: "chromium",
    args: [
      `--disable-extensions-except=${extension_path}`,
      `--load-extension=${extension_path}`,
    ],
  });
}

async function service_worker_of(context: BrowserContext): Promise<Worker> {
  return (
    context.serviceWorkers().at(0) ??
    (await context.waitForEvent("serviceworker"))
  );
}

export async function extension_id_of(context: BrowserContext) {
  return new URL((await service_worker_of(context)).url()).host;
}

export const extension_test = test.extend<ExtensionFixtures>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    const context = await launch_extension();
    await use(context);
    await context.close();
  },

  service_worker: async ({ context }, use) => {
    await use(await service_worker_of(context));
  },

  extension_id: async ({ service_worker }, use) => {
    await use(new URL(service_worker.url()).host);
  },

  // Without a query, the popup analyzes the active tab. Playwright can't reach
  // the toolbar popup itself, so the popup page opens in a background tab: the
  // tab under test stays active, and the popup reads it as it would from the
  // toolbar. With a query, it opens detached (`?q=`), as the context menu does.
  open_popup: async ({ context, service_worker, extension_id }, use) => {
    await use(async (query?: string) => {
      const url = `chrome-extension://${extension_id}/popup.html`;
      if (query !== undefined) {
        const page = await context.newPage();
        await page.goto(`${url}?q=${encodeURIComponent(query)}`);
        return page;
      }
      const opened = context.waitForEvent("page");
      await service_worker.evaluate(
        (popup_url) => chrome.tabs.create({ url: popup_url, active: false }),
        url,
      );
      const page = await opened;
      await page.waitForLoadState();
      return page;
    });
  },
});

/** The content of a result item once its data arrived, e.g. `ready(page, "dnssec")`. */
export function ready(page: Page, testid: string): Locator {
  return page.getByTestId(testid).locator('[data-state="ready"]');
}

const settled =
  '[data-state="ready"], [data-state="empty"], [data-state="error"]';

/**
 * Waits until the checks have finished. Before its data arrives, an item shows
 * as `unavailable` (no data yet) or `loading`, so wait for the DNSSEC and
 * registration items to settle, then for nothing to be loading.
 */
export async function wait_for_results(
  page: Page,
  timeout = 60_000,
): Promise<void> {
  for (const testid of ["dnssec", "registration"]) {
    await expect(
      page.getByTestId(testid).locator(settled).first(),
    ).toBeAttached({ timeout });
  }
  await expect(page.locator('[data-state="loading"]')).toHaveCount(0, {
    timeout,
  });
}
