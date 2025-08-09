import { type Component } from "solid-js";

interface DatePastPeriodProps {
  date: string | undefined;
}

export const DatePastPeriod: Component<DatePastPeriodProps> = (props) => {
  const getText = (date: string | undefined) => {
    const now = new Date();
    const then = new Date(date || now);

    const millisecond = Math.abs(now.getTime() - then.getTime());

    const minute = millisecond / 1000 / 60;

    if (minute < 60) {
      const m = Math.round(minute);

      if (m === 0) return "now";

      return `${m} ${m === 1 ? "minute" : "minutes"} ago`;
    }

    const hour = minute / 60;
    if (hour < 24) {
      const h = Math.round(hour);

      return `${h} ${h === 1 ? "hour" : "hours"} ago`;
    }

    const day = hour / 24;
    if (day < 30) {
      const d = Math.round(day);

      return `${d} ${d === 1 ? "day" : "days"} ago`;
    }

    const month =
      now.getMonth() -
      then.getMonth() +
      12 * (now.getFullYear() - then.getFullYear());

    if (month < 12) {
      const m = Math.round(month);

      return `${m} ${m === 1 ? "month" : "months"} ago`;
    }

    const year = month / 12;

    const y = Math.round(year);

    return `${y} ${y === 1 ? "year" : "years"} ago`;
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
    const unique = new Set<string>();
    for (const previousDate of dates) {
      const date = new Date(previousDate);
      unique.add(date.toDateString());
    }

    const uniqueDates = unique.values().toArray();

    const now = new Date();
    const first = new Date(uniqueDates.at(0) || now);

    const rangeWeek =
      1 +
      weekNumber(now) -
      weekNumber(first) +
      52 * (now.getFullYear() - first.getFullYear());

    const countPerWeek = new Map<string, number>();
    for (const previousDate of uniqueDates) {
      const date = new Date(previousDate);

      const week = weekNumber(date);

      const dateString = `${date.getFullYear()}-${week}`;

      const count = countPerWeek.get(dateString);
      countPerWeek.set(dateString, (count || 0) + 1);
    }

    const averagePerWeek = average(countPerWeek.values().toArray(), rangeWeek);

    if (averagePerWeek >= 1) {
      const days = Math.round(averagePerWeek);
      return `${days} ${days <= 1 ? "day" : "days"} per week`;
    }

    const rangeMonth =
      1 +
      now.getMonth() -
      first.getMonth() +
      12 * (now.getFullYear() - first.getFullYear());

    const countPerMonth = new Map<string, number>();
    for (const previousDate of uniqueDates) {
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
      const days = Math.round(averagePerMonth);
      return `${days} ${days <= 1 ? "day" : "days"} per month`;
    }

    const rangeYear = 1 + now.getFullYear() - first.getFullYear();

    const countPerYear = new Map<string, number>();
    for (const previousDate of uniqueDates) {
      const date = new Date(previousDate);
      const dateString = `${date.getFullYear()}`;

      const count = countPerYear.get(dateString);
      countPerYear.set(dateString, (count || 0) + 1);
    }

    const averagePerYear = average(countPerYear.values().toArray(), rangeYear);

    const days = Math.round(averagePerYear);

    if (days < 1) {
      return `less than 1 day a year`;
    }

    return `${days} ${days <= 1 ? "day" : "days"} per year`;
  };

  return <span>{getText(props.dates)}</span>;
};
