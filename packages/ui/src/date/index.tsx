import i18n from "@istrust/i18n";

export function DatePastPeriod(props: {
  lang: string;
  date: string | undefined;
}) {
  const getText = () => {
    const now = new Date();
    const then = new Date(props.date !== undefined ? props.date : now);

    const millisecond = Math.abs(now.getTime() - then.getTime());

    const minute = millisecond / 1000 / 60;

    if (minute < 60) {
      const m = Math.round(minute);

      if (m === 0) return i18n("now", props.lang);
      if (m === 1) return i18n("# minute ago", props.lang, [m.toString()]);
      return i18n("# minutes ago", props.lang, [m.toString()]);
    }

    const hour = minute / 60;
    if (hour < 24) {
      const h = Math.round(hour);

      if (h === 0) return i18n("now", props.lang);
      if (h === 1) return i18n("# hour ago", props.lang, [h.toString()]);
      return i18n("# hours ago", props.lang, [h.toString()]);
    }

    const day = hour / 24;
    if (day < 30) {
      const d = Math.round(day);

      if (d === 0) return i18n("now", props.lang);
      if (d === 1) return i18n("# day ago", props.lang, [d.toString()]);
      return i18n("# days ago", props.lang, [d.toString()]);
    }

    const month =
      now.getMonth() -
      then.getMonth() +
      12 * (now.getFullYear() - then.getFullYear());

    if (month < 12) {
      const m = Math.round(month);

      if (m === 0) return i18n("now", props.lang);
      if (m === 1) return i18n("# month ago", props.lang, [m.toString()]);
      return i18n("# months ago", props.lang, [m.toString()]);
    }

    const year = month / 12;

    const y = Math.round(year);

    if (y === 0) return i18n("now", props.lang);
    if (y === 1) return i18n("# year ago", props.lang, [y.toString()]);
    return i18n("# years ago", props.lang, [y.toString()]);
  };

  return <span>{getText()}</span>;
}

export function DateFrequency(props: { lang: string; dates: string[] }) {
  const average = (values: number[], range: number) => {
    let sum = 0;
    for (const count of values) {
      sum += count;
    }
    const avg = sum / range;

    return isNaN(avg) ? 0 : avg;
  };

  const weekNumber = (date: Date) => {
    const yearStart = new Date(date.getFullYear(), 0, 0);
    const dayOfYear =
      Math.round((date.getTime() - yearStart.getTime()) / 1000 / 60 / 60 / 24) +
      1;

    return Math.floor(dayOfYear / 7);
  };

  const getText = () => {
    const unique = new Set<string>();
    for (const previousDate of props.dates) {
      const date = new Date(previousDate);
      unique.add(date.toDateString());
    }

    const uniqueDates = unique.values().toArray();

    const now = new Date();
    const firstUniqueDate = uniqueDates.at(0);
    const first = new Date(
      firstUniqueDate !== undefined ? firstUniqueDate : now,
    );

    const rangeWeek =
      1 +
      weekNumber(now) -
      weekNumber(first) +
      52 * (now.getFullYear() - first.getFullYear());

    const countPerWeek = new Map<string, number>();
    for (const previousDate of uniqueDates) {
      const date = new Date(previousDate);

      const week = weekNumber(date);

      const dateString = `${date.getFullYear().toString()}-${week.toString()}`;

      const count = countPerWeek.get(dateString);
      countPerWeek.set(dateString, (count !== undefined ? count : 0) + 1);
    }

    const averagePerWeek = average(countPerWeek.values().toArray(), rangeWeek);

    if (averagePerWeek >= 1) {
      const days = Math.round(averagePerWeek);

      if (days === 0) return i18n("now", props.lang);
      if (days === 1)
        return i18n("# day per week", props.lang, [days.toString()]);
      return i18n("# days per week", props.lang, [days.toString()]);
    }

    const rangeMonth =
      1 +
      now.getMonth() -
      first.getMonth() +
      12 * (now.getFullYear() - first.getFullYear());

    const countPerMonth = new Map<string, number>();
    for (const previousDate of uniqueDates) {
      const date = new Date(previousDate);
      const dateString = `${date.getFullYear().toString()}-${date.getMonth().toString()}`;

      const count = countPerMonth.get(dateString);
      countPerMonth.set(dateString, (count !== undefined ? count : 0) + 1);
    }

    const averagePerMonth = average(
      countPerMonth.values().toArray(),
      rangeMonth,
    );

    if (averagePerMonth >= 1) {
      const days = Math.round(averagePerMonth);

      if (days === 0) return i18n("now", props.lang);
      if (days === 1)
        return i18n("# day per month", props.lang, [days.toString()]);
      return i18n("# days per month", props.lang, [days.toString()]);
    }

    const rangeYear = 1 + now.getFullYear() - first.getFullYear();

    const countPerYear = new Map<string, number>();
    for (const previousDate of uniqueDates) {
      const date = new Date(previousDate);
      const dateString = date.getFullYear().toString();

      const count = countPerYear.get(dateString);
      countPerYear.set(dateString, (count !== undefined ? count : 0) + 1);
    }

    const averagePerYear = average(countPerYear.values().toArray(), rangeYear);

    const days = Math.round(averagePerYear);

    if (days < 1) {
      return i18n("less than 1 day a year", props.lang);
    }

    if (days === 0) return i18n("now", props.lang);
    if (days === 1)
      return i18n("# day per year", props.lang, [days.toString()]);
    return i18n("# days per year", props.lang, [days.toString()]);
  };

  return <span>{getText()}</span>;
}
