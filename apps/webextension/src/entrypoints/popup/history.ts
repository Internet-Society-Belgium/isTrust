import * as common from "@istrust/common";
import { browser } from "#imports";

export interface HistoryData {
  visits: common.Information<string[]>;
}

export async function get_history_data(domain: string) {
  const historyItems = await browser.history.search({
    text: domain,
    startTime: 0,
    maxResults: Number.MAX_SAFE_INTEGER,
  });

  const visits = [];

  for (const historyItem of historyItems) {
    const pageUrl = historyItem.url;
    if (pageUrl === undefined) continue;

    const pageDomain = new URL(pageUrl).hostname;
    if (!(pageDomain === domain || pageDomain.endsWith(`.${domain}`))) continue;

    const visitItems = await browser.history.getVisits({ url: pageUrl });
    for (const visitItem of visitItems) {
      // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/history/TransitionType
      if (
        visitItem.transition === "link" ||
        visitItem.transition === "typed" ||
        visitItem.transition === "auto_bookmark" ||
        visitItem.transition === "generated" ||
        visitItem.transition === "keyword" ||
        visitItem.transition === "keyword_generated"
      ) {
        if (visitItem.visitTime === undefined) continue;

        const visit = new Date(visitItem.visitTime);

        visits.push(visit.toISOString());
      }
    }
  }

  let sources: common.Information<unknown>["sources"];

  if (import.meta.env.BROWSER === "firefox") {
    sources = [
      {
        organization: "Firefox",
        links: [],
      },
    ];
  } else if (import.meta.env.BROWSER === "edge") {
    sources = [
      {
        organization: "Microsoft Edge",
        links: [],
      },
    ];
  } else if (
    import.meta.env.BROWSER === "safari-macos" ||
    import.meta.env.BROWSER === "safari-ios"
  ) {
    sources = [
      {
        organization: "Safari",
        links: [],
      },
    ];
  } else {
    sources = [
      {
        organization: "Google Chrome",
        links: [],
      },
    ];
  }

  const visitsSorted = visits.sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  const data: HistoryData = {
    visits: {
      value: visitsSorted,
      sources,
    },
  };

  return data;
}
