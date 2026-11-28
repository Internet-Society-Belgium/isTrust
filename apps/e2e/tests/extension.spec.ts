// The Chrome extension (apps/webextension, MV3 build), offline: every service
// answers from scenarios/istrust.org.json. Chromium also covers Edge.
import i18n from "@istrust/i18n";
import {
  domain,
  expect,
  ready,
  extension_test as test,
  wait_for_results,
} from "../fixtures/test";

// The popup follows the browser language: en-US in Playwright's Chromium.
const lang = "en";

test("checks the active tab", async ({ context, open_popup }) => {
  const tab = await context.newPage();
  await tab.goto(`https://${domain}/`);

  const popup = await open_popup();
  await expect(popup.getByTestId("header-domain")).toContainText(domain);
  await wait_for_results(popup);

  await expect(ready(popup, "registration")).toContainText(
    i18n("Registered", lang),
  );
  await expect(ready(popup, "dnssec")).toContainText(
    i18n("Not protected with", lang),
  );
  await expect(popup.getByTestId("first-visit")).toBeVisible();
});

test("checks a domain from the context menu", async ({ open_popup }) => {
  const popup = await open_popup(domain);
  await expect(popup.getByTestId("header-domain")).toContainText(domain);
  await wait_for_results(popup);
  await expect(popup.getByTestId("alert-banner")).toHaveCount(0);
});

test.describe("a malicious domain", () => {
  test.use({ variant: "alerts" });

  test("shows the alerts", async ({ open_popup }) => {
    const popup = await open_popup(domain);
    await wait_for_results(popup);
    await expect(popup.getByTestId("alert-banner")).toContainText([
      i18n("Known to be malicious", lang),
      i18n("Known to redirect to another domain", lang),
    ]);
  });
});
