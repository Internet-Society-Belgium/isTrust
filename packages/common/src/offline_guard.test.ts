// Checks that the offline guard (`vitest.offline.ts`) is active: if it stopped
// working, a network call in a `*.test.ts` file would pass unnoticed again.
import { describe, expect, test } from "vitest";
import {
  check_network_attempts,
  take_network_attempts,
} from "../vitest.offline";

describe("offline guard", () => {
  test("rejects fetch", async () => {
    await expect(fetch("https://example.com/")).rejects.toThrow(
      /Network access in an offline test/,
    );
    expect(take_network_attempts()).toContain("https://example.com/");
  });

  test("reports a call even when the error is swallowed", async () => {
    await fetch(new URL("https://example.com/")).catch(() => undefined);
    expect(() => {
      check_network_attempts("in this test");
    }).toThrow(/https:\/\/example\.com\/ \(in this test\)/);
    expect(take_network_attempts()).not.toContain("https://example.com/");
  });
});
