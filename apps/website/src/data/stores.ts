// https://gs.statcounter.com/browser-market-share
type Platform = "chrome" | "safari" | "edge" | "firefox" | "thunderbird";

interface Store {
  link: string;
  icon: () => Promise<typeof import("*.svg")>;
}

export const stores: Record<Platform, Store> = {
  chrome: {
    link: "https://chrome.google.com/webstore/detail/istrust/kinlknncggaihnhdcalijdmpbhbflalm",
    icon: () => import("../assets/platform/chrome.svg"),
  },
  // safari: {
  //   link: "",
  //   icon: () => import("../assets/platform/safari.svg"),
  // },
  edge: {
    link: "https://microsoftedge.microsoft.com/addons/detail/cphlaknpjmlpfaejjabjlgnekfkebeoo",
    icon: () => import("../assets/platform/edge.svg"),
  },
  firefox: {
    link: "https://addons.mozilla.org/firefox/addon/istrust/?utm_source=istrust.org",
    icon: () => import("../assets/platform/firefox.svg"),
  },
  thunderbird: {
    link: "https://addons.mozilla.org/firefox/addon/istrust/?utm_source=istrust.org",
    icon: () => import("../assets/platform/thunderbird.svg"),
  },
};
