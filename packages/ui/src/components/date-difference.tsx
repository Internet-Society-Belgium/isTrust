import { type Component } from "solid-js";

interface Props {
  date: string;
  locale: Intl.LocalesArgument;
}

export const DateDifference: Component<Props> = (props) => {
  const getText = (date: string, locale: Intl.LocalesArgument) => {
    const now = new Date();
    const then = new Date(date);

    if (now >= then) {
      const year = now.getFullYear() - then.getFullYear();
      if (year > 0) {
        return `${year} ${year === 1 ? "year" : "years"} ago`;
      } else {
        const month = now.getMonth() - then.getMonth();
        if (month > 0) {
          return `${month} ${month === 1 ? "month" : "months"} ago`;
        } else {
          const day = now.getDay() - then.getDay();
          if (day > 0) {
            return `${day} ${day === 1 ? "day" : "days"} ago`;
          } else {
            const timeString = then.toLocaleTimeString(locale, {
              hour: "2-digit",
              minute: "2-digit",
            });
            return `today at ${timeString}`;
          }
        }
      }
    } else {
      const year = then.getFullYear() - now.getFullYear();
      if (year > 0) {
        return `in ${year} ${year === 1 ? "year" : "years"}`;
      } else {
        const month = then.getMonth() - now.getMonth();
        if (month > 0) {
          return `in ${month} ${month === 1 ? "month" : "months"}`;
        } else {
          const day = then.getDay() - now.getDay();
          if (day > 0) {
            return `in ${day} ${day === 1 ? "day" : "days"}`;
          } else {
            const timeString = then.toLocaleTimeString(locale, {
              hour: "2-digit",
              minute: "2-digit",
            });
            return `today at ${timeString}`;
          }
        }
      }
    }
  };

  return <>{getText(props.date, props.locale)}</>;
};
