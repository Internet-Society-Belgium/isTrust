import { expect, test } from "vitest";
import * as whois from ".";

test("istrust.org", async () => {
  const data = await whois.get("istrust.org");

  expect(data).toStrictEqual({
    domain: "istrust.org",
  } satisfies typeof data);
});
