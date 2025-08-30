import { InformationCache } from "../../type";

export async function out_of_date(
  cache: InformationCache,
  key: string,
  days: number,
) {
  const lastUpdate = await cache.get(key);

  const cachingOutdated = new Date().setDate(new Date().getDate() - days);

  return (
    lastUpdate === undefined || new Date(lastUpdate).getTime() < cachingOutdated
  );
}

export async function updated(cache: InformationCache, key: string) {
  await cache.set(key, new Date().toISOString());
}

export async function waitMutex(cache: InformationCache, key: string) {
  let loading = await cache.get(key);

  let retry = 500;
  while (loading === "true" && retry > 0) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    loading = await cache.get(key);
    retry -= 1;
  }

  await cache.set(key, "true");
}

export async function releaseMutex(cache: InformationCache, key: string) {
  await cache.set(key, "false");
}
