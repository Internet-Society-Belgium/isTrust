import type { BrowserContext } from "@playwright/test";

// The checks shuffle their sources with Math.random (DoH resolvers,
// certificate sources) and stop at the first one that answers. Seeding it
// makes them call the same services in the recording and in every replay.
// The shuffles run synchronously when a check starts, so the order holds even
// though the checks run concurrently.
export async function seed_random(context: BrowserContext): Promise<void> {
  await context.addInitScript(() => {
    // mulberry32
    let state = 0x15_7c_05_7e;
    Math.random = () => {
      state = (state + 0x6d_2b_79_f5) | 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
    };
  });
}
