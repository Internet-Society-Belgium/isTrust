import * as common from "@istrust/common";
import { browser } from "#imports";

export interface HistoryData {
  visits: common.Data<string[]>;
}

export async function get_history_data(domain: string) {
  const historyItems = await browser.history.search({ text: `${domain}` });

  let visits = [];

  for (const historyItem of historyItems) {
    const pageUrl = historyItem.url;
    if (!pageUrl) continue;

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

  let verification: common.Data<unknown>["verification"] = {
    status: "unverified",
    authorities: [],
  };

  if (import.meta.env.CHROME) {
    verification = {
      status: "verified",
      authorities: [
        {
          organization: "Google Chrome",
          links: [],
        },
      ],
    };
  } else if (import.meta.env.FIREFOX) {
    verification = {
      status: "verified",
      authorities: [
        {
          organization: "Firefox",
          links: [],
        },
      ],
    };
  } else if (import.meta.env.EDGE) {
    verification = {
      status: "verified",
      authorities: [
        {
          organization: "Microsoft Edge",
          links: [],
        },
      ],
    };
  } else if (import.meta.env.SAFARI) {
    verification = {
      status: "verified",
      authorities: [
        {
          organization: "Safari",
          links: [],
        },
      ],
    };
  }

  visits = visits.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const data: HistoryData = {
    visits: {
      value: visits,
      verification,
    },
  };

  return data;
}
