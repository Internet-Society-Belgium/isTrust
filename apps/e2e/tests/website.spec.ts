// The website (apps/website), offline: every service answers from
// scenarios/istrust.org.json. Texts are checked through @istrust/i18n, so the
// same assertions hold in every language.
import i18n, { translatedLangs } from "@istrust/i18n";
import {
  domain,
  expect,
  ready,
  test,
  wait_for_results,
} from "../fixtures/test";

for (const lang of translatedLangs) {
  test.describe(lang, () => {
    test("home page loads", async ({ page }) => {
      await page.goto(`/${lang}/`);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator('form input[type="q"]')).toBeVisible();
      await expect(page.getByTestId("header-domain")).toContainText(
        i18n("Domain name", lang),
      );
    });

    test("checks a domain from the URL", async ({ page }) => {
      await page.goto(`/${lang}/#${domain}`);
      await expect(page.getByTestId("header-domain")).toContainText(domain);
      await wait_for_results(page);

      await expect(ready(page, "registration")).toContainText(
        i18n("Registered", lang),
      );
      await expect(ready(page, "dnssec")).toContainText(
        i18n("Not protected with", lang),
      );
      await expect(page.getByTestId("alert-banner")).toHaveCount(0);
      await expect(page.getByTestId("first-visit")).toHaveAttribute(
        "data-state",
        "not-available",
      );
    });
  });
}

test("checks a domain typed in the search bar", async ({ page }) => {
  await page.goto("/en/");
  await page.locator('form input[type="q"]').fill(domain);
  await page.locator('form input[type="q"]').press("Enter");

  await expect(page).toHaveURL(new RegExp(`#${domain.replace(".", "\\.")}$`));
  await expect(page.getByTestId("header-domain")).toContainText(domain);
  await wait_for_results(page);
});

test.describe("a domain protected with DNSSEC", () => {
  test.use({ variant: "dnssec" });

  test("shows the protection", async ({ page }) => {
    await page.goto(`/en/#${domain}`);
    await wait_for_results(page);
    await expect(ready(page, "dnssec")).toContainText(
      i18n("Protected with", "en"),
    );
  });
});

test.describe("a malicious domain", () => {
  test.use({ variant: "alerts" });

  test("shows the alerts", async ({ page }) => {
    await page.goto(`/en/#${domain}`);
    await wait_for_results(page);

    const banners = page.getByTestId("alert-banner");
    await expect(banners.and(page.locator('[data-type="bad"]'))).toContainText(
      i18n("Known to be malicious", "en"),
    );
    await expect(banners).toContainText([
      i18n("Known to be malicious", "en"),
      i18n("Known to redirect to another domain", "en"),
    ]);
  });
});
