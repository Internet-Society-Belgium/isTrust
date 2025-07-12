/* eslint-disable @typescript-eslint/no-explicit-any */
export function deepMerge(target: any, source: any, override: boolean = false) {
  for (const key in source) {
    if (typeof source[key] === "object") {
      if (source[key] instanceof Date) {
        const date_string = source[key].toISOString();
        Object.assign(target, { [key]: new Date(date_string) });
      } else {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }

        deepMerge(target[key], source[key], override);
      }
    } else {
      if (!target[key] || (target[key] && override)) {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
}
