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

    const month = day / 30;
    if (month < 12) {
      const m = Math.round(month);

      if (direction === "past") {
        return `${m} ${m === 1 ? "month" : "months"} ago`;
      } else {
        return `in ${m} ${m === 1 ? "month" : "months"}`;
      }
    }

    const year = day / 365;

    const y = Math.round(year);

    if (direction === "past") {
      return `${y} ${y === 1 ? "year" : "years"} ago`;
    } else {
      return `in ${y} ${y === 1 ? "year" : "years"}`;
    }
  };

  return <span>{getText(props.date)}</span>;
};

};
