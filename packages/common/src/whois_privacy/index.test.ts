import { expect, test } from "vitest";
import { is_privacy } from ".";

test("Redacted for privacy", async () => {
  const privacy = await is_privacy("Redacted for privacy");

  expect(privacy).toStrictEqual(true);
});

test("Redacted for privacy purposes", async () => {
  const privacy = await is_privacy("Redacted for privacy purposes");

  expect(privacy).toStrictEqual(true);
});

test("Privacy protected", async () => {
  const privacy = await is_privacy("Privacy protected");

  expect(privacy).toStrictEqual(false);
});

test("REDACTED", async () => {
  const privacy = await is_privacy("REDACTED");

  expect(privacy).toStrictEqual(false);
});
