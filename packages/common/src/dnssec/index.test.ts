import { expect, test } from "vitest";
import { isValid } from ".";

test("wikipedia.org", async () => {
  const valid = await isValid("wikipedia.org");
  expect(valid).toStrictEqual(false);
});

test("internetsociety.org", async () => {
  const valid = await isValid("internetsociety.org");
  expect(valid).toStrictEqual(true);
});
