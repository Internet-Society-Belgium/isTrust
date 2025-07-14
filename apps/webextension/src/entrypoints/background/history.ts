import { browser } from "#imports";

export interface HistoryData {
  domain: string;
  visits: number;
  firstVisit?: string;
}

export async function get_history_data(domain: string) {
  const historyItems = await browser.history.search({ text: `${domain}` });

  let firstVisit: Date | undefined;
  let visits = 0;

  for (const historyItem of historyItems) {
    const pageUrl = historyItem.url;
    if (!pageUrl) continue;

    const pageDomain = new URL(pageUrl).hostname;
    if (pageDomain !== domain) continue;

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
        visits += 1;

        if (visitItem.visitTime) {
          const visitTime = new Date(visitItem.visitTime);

          if (firstVisit === undefined || visitTime < firstVisit) {
            firstVisit = visitTime;
          }
        }
      }
    }
  }

  const data: HistoryData = {
    domain,
    visits,
  };

  if (firstVisit !== undefined) {
    data.firstVisit = firstVisit.toISOString();
  }

  return data;
}
