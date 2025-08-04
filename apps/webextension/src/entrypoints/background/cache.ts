import * as common from "@istrust/common";
import { storage } from "#imports";

export const cache: common.InformationCache = {
  psl: {
    set: async (key: string, value: string) =>
      storage.setItem(`local:psl:${key}`, value),
    get: async (key: string) => {
      const item = await storage.getItem<string>(`local:psl:${key}`);
      if (item === null) return;
      return item;
    },
    clear: async () => {
      const snapshot = await storage.snapshot("local");
      for (const item in snapshot) {
        if (item.startsWith("psl:")) {
          storage.removeItem(`local:${item}`);
        }
      }
    },
  },
  rdap: {
    set: async (key: string, value: string) =>
      storage.setItem(`local:rdap:${key}`, value),
    get: async (key: string) => {
      const item = await storage.getItem<string>(`local:rdap:${key}`);
      if (item === null) return;
      return item;
    },
    clear: async () => {
      const snapshot = await storage.snapshot("local");
      for (const item in snapshot) {
        if (item.startsWith("rdap:")) {
          storage.removeItem(`local:${item}`);
        }
      }
    },
  },
};
