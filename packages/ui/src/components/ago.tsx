import { type Component } from "solid-js";

interface Props {
  timestamp: number;
}

export const Ago: Component<Props> = (props) => {
  const getText = (timestamp: number) => {
    const now = new Date();
    const then = new Date(timestamp);

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
          return "today";
        }
      }
    }
  };

  return <>{getText(props.timestamp)}</>;
};
