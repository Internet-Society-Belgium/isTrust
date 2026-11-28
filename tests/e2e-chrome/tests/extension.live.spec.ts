// The extension against the real services (`npm run test:e2e:live`). Upstream
// data changes, so this only checks that every check settles and that the
// registration date is found. See AGENTS.md before acting on a failure.
import {
  domain,
  expect,
  live_timeout,
  ready,
  extension_test as test,
  wait_for_results,
} from "../fixtures/test";

test("checks a domain", async ({ open_popup }) => {
  test.setTimeout(live_timeout + 60_000);
  const popup = await open_popup(domain);
  await expect(popup.getByTestId("header-domain")).toContainText(domain);
  await wait_for_results(popup, live_timeout);
  await expect(ready(popup, "registration")).toBeVisible();
});
