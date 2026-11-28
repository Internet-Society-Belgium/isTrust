// The extension against the real services (`npm run test:e2e:live`). Upstream
// data changes, so this only checks that every check settles and that the
// registration date is found. See AGENTS.md before acting on a failure.
import {
  expect,
  item,
  extension_test as test,
  wait_for_results,
} from "../fixtures/test";

const domain = "istrust.org";

test("checks a domain", async ({ open_popup }) => {
  test.setTimeout(5 * 60_000);
  const popup = await open_popup(domain);
  await expect(popup.getByTestId("header-domain")).toContainText(domain);
  await wait_for_results(popup, 4 * 60_000);
  await expect(
    item(popup, "registration").locator('[data-state="ready"]'),
  ).toBeVisible();
});
