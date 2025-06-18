export function formatFullDate(date: Date | string) {
  const newDate = new Date(date);
  return newDate.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export const formatShortDate = (date: Date | string) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString("en-us", {
    month: "short",
    day: "numeric",
  });
};

export const formatShortDateWithYear = (date: Date | string) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString("en-us", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
