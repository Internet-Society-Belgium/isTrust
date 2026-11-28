// The website against the real services (`npm run test:e2e:live`). Upstream
// data changes, so this only checks that every check settles and that the
// registration date is found. See AGENTS.md before acting on a failure.
import { expect, item, test, wait_for_results } from "../fixtures/test";

const domain = "istrust.org";

test("checks a domain from the URL", async ({ page }) => {
  test.setTimeout(5 * 60_000);
  await page.goto(`/en/#${domain}`);
  await expect(page.getByTestId("header-domain")).toContainText(domain);
  await wait_for_results(page, 4 * 60_000);
  await expect(
    item(page, "registration").locator('[data-state="ready"]'),
  ).toBeVisible();
});
