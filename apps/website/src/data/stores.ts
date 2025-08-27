type Platform = "chrome" | "edge" | "firefox" | "safari"; //| "thunderbird";

interface Store {
  link: string;
  icon: () => Promise<typeof import("*.svg")>;
}

// https://gs.statcounter.com/browser-market-share
export const stores: Record<Platform, Store> = {
  chrome: {
    link: "https://chrome.google.com/webstore/detail/istrust/kinlknncggaihnhdcalijdmpbhbflalm",
    icon: () => import("../assets/platform/chrome.svg"),
  },
  safari: {
    link: "https://apps.apple.com/app/istrust/id1600555060",
    icon: () => import("../assets/platform/safari.svg"),
  },
  edge: {
    link: "https://microsoftedge.microsoft.com/addons/detail/cphlaknpjmlpfaejjabjlgnekfkebeoo",
    icon: () => import("../assets/platform/edge.svg"),
  },
  firefox: {
    link: "https://addons.mozilla.org/firefox/addon/istrust/?utm_source=istrust.org",
    icon: () => import("../assets/platform/firefox.svg"),
  },
  // thunderbird: {
  //   link: "https://addons.mozilla.org/firefox/addon/istrust/?utm_source=istrust.org",
  //   icon: () => import("../assets/platform/thunderbird.svg"),
  // },
};
