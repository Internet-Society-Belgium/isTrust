import { expect, test } from "vitest";
import { get_data } from ".";

test("wikipedia.org", async () => {
  const valid = await get_data("wikipedia.org");
  expect(valid).toStrictEqual(false);
});

test("internetsociety.org", async () => {
  const valid = await get_data("internetsociety.org");
  expect(valid).toStrictEqual(true);
});
