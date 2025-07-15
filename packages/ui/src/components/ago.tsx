import { type Component } from "solid-js";

interface Props {
  date: string;
  locale: Intl.LocalesArgument;
}

export const Ago: Component<Props> = (props) => {
  const getText = (date: string, locale: Intl.LocalesArgument) => {
    const now = new Date();
    const then = new Date(date);

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
  };

  return <>{getText(props.date, props.locale)}</>;
};
