import { InformationCache } from "../../type";
import { source_error } from "../../utils/error";
import { PlatformData } from "../type";

// https://github.com/disposable/disposable-email-domains
// daily update
const CACHING_DAYS = 1;

export async function update(cache: InformationCache) {
  let loading = await cache.get("disposable_email:_loading");

  while (loading === "true") {
    await new Promise((resolve) => setTimeout(resolve, 100));
    loading = await cache.get("disposable_email:_loading");
  }

  const lastUpdate = await cache.get("disposable_email:_lastUpdate");

  const cachingOutdated = new Date().setDate(
    new Date().getDate() - CACHING_DAYS,
  );

  if (
    lastUpdate === undefined ||
    new Date(lastUpdate).getTime() < cachingOutdated
  ) {
    await load(cache);
  }
}

export async function load(cache: InformationCache) {
  await cache.set("disposable_email:_loading", "true");

  await cache.clear("disposable_email:");

  // https://github.com/disposable/disposable-email-domains
  const res = await fetch(
    "https://disposable.github.io/disposable-email-domains/domains_mx.txt",
  );

  if (!res.ok) throw source_error("disposable-email-domains not available");

  const text = await res.text();
  const lines = text.split("\n");

  const promises: Promise<void>[] = [];

  for (const line of lines) {
    promises.push(cache.set(`disposable_email:${line}`, ""));
  }

  await Promise.allSettled(promises);

  await cache.set("disposable_email:_lastUpdate", new Date().toISOString());

  await cache.set("disposable_email:_loading", "false");
}

export async function get_data(domain: string, cache: InformationCache) {
  await update(cache);

  const data: PlatformData = {
    platforms: [],
  };

  const labels = domain.split(".");

  for (let l = 0; l < labels.length; l++) {
    const match = await cache.get(
      `disposable_email:${labels.slice(l).join(".")}`,
    );
    if (match !== undefined) {
      data.platforms = [
        {
          value: "disposable_email",
          sources: [
            {
              organization: "Disposable email domains",
              links: ["https://github.com/disposable/disposable"],
            },
          ],
        },
      ];

      break;
    }
  }

  return data;
}
