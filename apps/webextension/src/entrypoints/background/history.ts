import * as common from "@istrust/common";
import { browser } from "#imports";

export interface HistoryData {
  daysWithVisit: common.Data<number>;
  firstVisit: common.Data<string> | null;
}

export async function get_history_data(domain: string) {
  const historyItems = await browser.history.search({ text: `${domain}` });

  const daysWithVisit = new Set<string>();
  let firstVisit;

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
        if (visitItem.visitTime !== undefined) {
          const visitDate = new Date(visitItem.visitTime);

          const visitDay = visitDate.toDateString();
          daysWithVisit.add(visitDay);

          const visitTime = visitDate.getTime();
          if (firstVisit === undefined || visitTime < firstVisit) {
            firstVisit = visitTime;
          }
        }
      }
    }
  }

  let verification: common.Data<unknown>["verification"] = {
    status: "unverified",
    authorities: null,
  };

  if (import.meta.env.CHROME) {
    verification = {
      status: "verified",
      authorities: [
        {
          organization: "Google Chrome",
          country: null,
          links: null,
        },
      ],
    };
  } else if (import.meta.env.FIREFOX) {
    verification = {
      status: "verified",
      authorities: [
        {
          organization: "Firefox",
          country: null,
          links: null,
        },
      ],
    };
  } else if (import.meta.env.EDGE) {
    verification = {
      status: "verified",
      authorities: [
        {
          organization: "Microsoft Edge",
          country: null,
          links: null,
        },
      ],
    };
  } else if (import.meta.env.SAFARI) {
    verification = {
      status: "verified",
      authorities: [
        {
          organization: "Safari",
          country: null,
          links: null,
        },
      ],
    };
  }

  const data: HistoryData = {
    daysWithVisit: {
      value: daysWithVisit.size,
      verification,
    },
    firstVisit: null,
  };

  if (firstVisit !== undefined) {
    data.firstVisit = {
      value: new Date(firstVisit).toISOString(),
      verification,
    };
  }

  return data;
}
