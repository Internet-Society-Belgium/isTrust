import * as common from "@istrust/common";
import { storage } from "#imports";

export const cache: common.InformationCache = {
  psl: {
    set: async (key: string, value: string) => {
      await storage.setItem(`local:psl:${key}`, value);
    },
    get: async (key: string) => {
      const item = await storage.getItem<string>(`local:psl:${key}`);
      if (item === null) return;
      return item;
    },
    clear: async () => {
      const promises: Promise<void>[] = [];

      const snapshot = await storage.snapshot("local");
      for (const item in snapshot) {
        if (item.startsWith("psl:")) {
          promises.push(storage.removeItem(`local:${item}`));
        }
      }

      await Promise.allSettled(promises);
    },
  },
  rdap: {
    set: async (key: string, value: string) => {
      await storage.setItem(`local:rdap:${key}`, value);
    },
    get: async (key: string) => {
      const item = await storage.getItem<string>(`local:rdap:${key}`);
      if (item === null) return;
      return item;
    },
    clear: async () => {
      const promises: Promise<void>[] = [];

      const snapshot = await storage.snapshot("local");
      for (const item in snapshot) {
        if (item.startsWith("rdap:")) {
          promises.push(storage.removeItem(`local:${item}`));
        }
      }

      await Promise.allSettled(promises);
    },
  },
};
