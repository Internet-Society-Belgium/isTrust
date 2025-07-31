import { type Component } from "solid-js";
import "../styles.css";

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
            const hour = now.getHours() - then.getHours();
            if (hour > 0) {
              return `${hour} ${hour === 1 ? "hour" : "hours"} ago`;
            } else {
              const minute = now.getMinutes() - then.getMinutes();
              if (minute > 0) {
                return `${minute} ${minute === 1 ? "minute" : "minutes"} ago`;
              } else {
                return "now";
              }
            }
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
            const hour = then.getHours() - now.getHours();
            if (hour > 0) {
              return `in ${hour} ${hour === 1 ? "hour" : "hours"}`;
            } else {
              const minute = then.getMinutes() - now.getMinutes();
              if (minute > 0) {
                return `in ${minute} ${minute === 1 ? "minute" : "minutes"}`;
              } else {
                return "now";
              }
            }
          }
        }
      }
    }
  };

  return <span>{getText(props.date, props.locale)}</span>;
};
