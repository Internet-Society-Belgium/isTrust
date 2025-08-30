import * as common from "@istrust/common";
import { storage } from "#imports";

export const cache: common.InformationCache = {
  set: async (key: string, value: string) => {
    return storage.setItem(`local:${key}`, value);
  },
  get: async (key: string) => {
    const item = await storage.getItem<string>(`local:${key}`);
    if (item === null) return;
    return item;
  },
  clear: async (prefix: string) => {
    const promises: Promise<void>[] = [];

    const snapshot = await storage.snapshot("local");
    for (const item in snapshot) {
      if (item.startsWith(prefix)) {
        promises.push(storage.removeItem(`local:${item}`));
      }
    }

    await Promise.allSettled(promises);
  },
};
