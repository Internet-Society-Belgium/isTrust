import { expect, test } from "vitest";
import { is_valid } from ".";

test("wikipedia.org", async () => {
  const valid = await is_valid("wikipedia.org");
  expect(valid).toStrictEqual(false);
});

test("internetsociety.org", async () => {
  const valid = await is_valid("internetsociety.org");
  expect(valid).toStrictEqual(true);
});
