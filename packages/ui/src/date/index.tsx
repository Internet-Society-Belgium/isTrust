import { type Component } from "solid-js";
import "../styles.css";

interface DateDifferenceProps {
  date: string | undefined;
}

export const DateDifference: Component<DateDifferenceProps> = (props) => {
  const getText = (date: string | undefined) => {
    const now = new Date();
    const then = new Date(date || now);

    const direction = now >= then ? "past" : "future";

    let millisecond;
    if (direction === "past") {
      millisecond = now.getTime() - then.getTime();
    } else {
      millisecond = then.getTime() - now.getTime();
    }

    const minute = millisecond / 1000 / 60;

    if (minute < 60) {
      const m = Math.round(minute);

      if (m === 0) return "now";

      if (direction === "past") {
        return `${m} ${m === 1 ? "minute" : "minutes"} ago`;
      } else {
        return `in ${m} ${m === 1 ? "minute" : "minutes"}`;
      }
    }

    const hour = minute / 60;
    if (hour < 24) {
      const h = Math.round(hour);

      if (direction === "past") {
        return `${h} ${h === 1 ? "hour" : "hours"} ago`;
      } else {
        return `in ${h} ${h === 1 ? "hour" : "hours"}`;
      }
    }

    const day = hour / 24;
    if (day < 30) {
      const d = Math.round(day);

      if (direction === "past") {
        return `${d} ${d === 1 ? "day" : "days"} ago`;
      } else {
        return `in ${d} ${d === 1 ? "day" : "days"}`;
      }
    }

    let month;
    if (direction === "past") {
      month =
        now.getMonth() -
        then.getMonth() +
        12 * (now.getFullYear() - then.getFullYear());
    } else {
      month =
        then.getMonth() -
        now.getMonth() +
        12 * (then.getFullYear() - now.getFullYear());
    }
    if (month < 12) {
      const m = Math.round(month);

      if (direction === "past") {
        return `${m} ${m === 1 ? "month" : "months"} ago`;
      } else {
        return `in ${m} ${m === 1 ? "month" : "months"}`;
      }
    }

    let year = month / 12;

    const y = Math.round(year);

    if (direction === "past") {
      return `${y} ${y === 1 ? "year" : "years"} ago`;
    } else {
      return `in ${y} ${y === 1 ? "year" : "years"}`;
    }
  };

  return <span>{getText(props.date)}</span>;
};

interface DateFrequencyProps {
  dates: string[];
}

export const DateFrequency: Component<DateFrequencyProps> = (props) => {
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

  const getText = (dates: string[]) => {
    const previousDates = dates.filter(
      (date) => new Date(date).toDateString() !== new Date().toDateString(),
    );

    const now = new Date();
    const first = new Date(previousDates[0]);

    const uniqueDates = new Set<string>();
    for (const previousDate of previousDates) {
      const date = new Date(previousDate);
      uniqueDates.add(date.toDateString());
    }

    const uniquePreviousDates = uniqueDates.values().toArray();

    const rangeWeek =
      1 +
      weekNumber(now) -
      weekNumber(first) +
      52 * (now.getFullYear() - first.getFullYear());

    const countPerWeek = new Map<string, number>();
    for (const previousDate of uniquePreviousDates) {
      const date = new Date(previousDate);

      const week = weekNumber(date);

      const dateString = `${date.getFullYear()}-${week}`;

      const count = countPerWeek.get(dateString);
      countPerWeek.set(dateString, (count || 0) + 1);
    }

    const averagePerWeek = average(countPerWeek.values().toArray(), rangeWeek);

    if (averagePerWeek >= 1) {
      return `${Math.round(averagePerWeek)}x in the last ${rangeWeek} week`;
    }

    const rangeMonth =
      1 +
      now.getMonth() -
      first.getMonth() +
      12 * (now.getFullYear() - first.getFullYear());

    const countPerMonth = new Map<string, number>();
    for (const previousDate of uniquePreviousDates) {
      const date = new Date(previousDate);
      const dateString = `${date.getFullYear()}-${date.getMonth()}`;

      const count = countPerMonth.get(dateString);
      countPerMonth.set(dateString, (count || 0) + 1);
    }

    const averagePerMonth = average(
      countPerMonth.values().toArray(),
      rangeMonth,
    );

    if (averagePerMonth >= 1) {
      return `${Math.round(averagePerMonth)}x in the last ${rangeMonth} month`;
    }

    const rangeYear = 1 + now.getFullYear() - first.getFullYear();
    const countPerYear = new Map<string, number>();
    for (const previousDate of uniquePreviousDates) {
      const date = new Date(previousDate);
      const dateString = `${date.getFullYear()}`;

      const count = countPerYear.get(dateString);
      countPerYear.set(dateString, (count || 0) + 1);
    }

    const averagePerYear = average(countPerYear.values().toArray(), rangeYear);
    if (averagePerYear >= 1) {
      return `${Math.round(averagePerYear)}x in the last ${rangeYear} year`;
    }

    return "now";
  };

  return <span>{getText(props.dates)}</span>;
};
