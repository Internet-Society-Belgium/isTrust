// https://gs.statcounter.com/browser-market-share
type Browser = "chrome" | "safari" | "edge" | "firefox";

interface Store {
  name: string;
  link: string;
  icon: () => Promise<typeof import("*.svg")>;
}

export const stores = new Map<Browser, Store>()
  .set("chrome", {
    name: "Chrome",
    link: "https://chrome.google.com/webstore/detail/istrust/kinlknncggaihnhdcalijdmpbhbflalm",
    icon: () => import("../assets/chrome.svg"),
  })
  .set("safari", {
    name: "Safari",
    link: "",
    icon: () => import("../assets/safari.svg"),
  })
  .set("edge", {
    name: "Edge",
    link: "https://microsoftedge.microsoft.com/addons/detail/cphlaknpjmlpfaejjabjlgnekfkebeoo",
    icon: () => import("../assets/edge.svg"),
  })
  .set("firefox", {
    name: "Firefox",
    link: "https://addons.mozilla.org/firefox/addon/istrust/?utm_source=istrust.org",
    icon: () => import("../assets/firefox.svg"),
  });
