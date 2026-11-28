// Offline guard for the `unit` project (`*.test.ts`). The checks reach the
// network only through `fetch`, so `fetch` is stubbed to reject. Tests that
// need the network belong in `*.live.test.ts`; others stub the call (for
// example with `vi.spyOn(globalThis, "fetch")`).
//
// Rejecting alone isn't enough: the checks catch errors and fall back to a
// default result, so the test would still pass. Every call is also recorded,
// and the test fails afterwards whatever the code did with the error.
//
// Limits: calls are recorded per file, not per test, so with concurrent tests
// (`test.concurrent`) a call can be blamed on the wrong test. A call made after
// the file's last hook (for example from a retry timer) is not reported.
import { afterAll, afterEach, beforeEach } from "vitest";

const attempts: string[] = [];

/** Returns the network attempts recorded so far, and forgets them. */
export function take_network_attempts(): string[] {
  return attempts.splice(0);
}

/** Throws if any network attempt was recorded since the last check. */
export function check_network_attempts(when: string): void {
  if (attempts.length === 0) return;
  const targets = [...new Set(take_network_attempts())].join(", ");
  throw new Error(
    `Network access in an offline test: ${targets} (${when}). ` +
      "Rename the file to *.live.test.ts, or stub the call.",
  );
}

// Calls made before a test starts (at module load, in `beforeAll`, or by a
// call an earlier test didn't await) are reported by its `beforeEach`; those
// in `afterAll` by the `afterAll` below, which runs after the file's own hooks.
beforeEach(() => {
  check_network_attempts("before this test");
});
afterEach(() => {
  check_network_attempts("in this test");
});
afterAll(() => {
  check_network_attempts("in afterAll");
});

globalThis.fetch = (input) => {
  const url =
    input instanceof Request
      ? input.url
      : input instanceof URL
        ? input.href
        : input;
  attempts.push(url);
  return Promise.reject(new Error(`Network access in an offline test: ${url}`));
};
