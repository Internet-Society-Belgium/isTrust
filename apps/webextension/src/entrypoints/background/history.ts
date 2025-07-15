import { browser } from "#imports";

export interface HistoryData {
  daysWithVisit: number;
  firstVisit?: string;
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

  const data: HistoryData = {
    daysWithVisit: daysWithVisit.size,
  };

  if (firstVisit !== undefined) {
    data.firstVisit = new Date(firstVisit).toISOString();
  }

  return data;
}
