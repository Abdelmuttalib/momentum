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

const enLocale = "en-US";
const arLocale = "ar-SA";
const arLocaleHijri = "ar-SA-u-ca-islamic";

export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
) {
  if (!date) return "";

  const d = new Date(date);

  return formatDateEnglish(d, options);

  // return i18next.language === "ar"
  //   ? formatDateArabic(d, options)
  //   : formatDateEnglish(d, options);
}

export function formatDateEnglish(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
) {
  if (!date) return "";
  const formatted = new Intl.DateTimeFormat(
    enLocale,
    options ?? {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }
  ).format(date as Date);

  return formatted;
}

export function formatDateArabic(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
) {
  if (!date) return "";
  const formatted = new Intl.DateTimeFormat(
    arLocale,
    options ?? {
      // dateStyle: 'medium',
      timeZone: "Asia/Riyadh",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      // timeStyle: 'short',
    }
  ).format(date as Date);

  return formatted;
}

// hijri
export function formatDateHijri(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
) {
  const formatted = new Intl.DateTimeFormat(
    arLocaleHijri,
    options ?? {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date as Date);

  return formatted;
}

/**
 * Combine a Date object and a time string ("HH:mm") into a single Date object
 * Returns a Date in local time
 */
export function combineDateAndTime(date: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const combined = new Date(date); // copy date
  combined.setHours(hours);
  combined.setMinutes(minutes);
  combined.setSeconds(0);
  combined.setMilliseconds(0);

  return combined;
}

// formatDistanceToNow(new Date(task.updatedAt), {
//                 addSuffix: true,
//               })

export function formatDistanceToNow(date: Date | string) {
  if (!date) return "";

  const d = new Date(date);
  return formatDistanceToNowEnglish(d);
}

const rtf = new Intl.RelativeTimeFormat(enLocale, {
  numeric: "auto",
});

type Unit = "year" | "month" | "week" | "day" | "hour" | "minute" | "second";

function getUnit(diffInSeconds: number): [Unit, number] {
  const abs = Math.abs(diffInSeconds);

  if (abs >= 60 * 60 * 24 * 365)
    return ["year", diffInSeconds / (60 * 60 * 24 * 365)];
  if (abs >= 60 * 60 * 24 * 30)
    return ["month", diffInSeconds / (60 * 60 * 24 * 30)];
  if (abs >= 60 * 60 * 24 * 7)
    return ["week", diffInSeconds / (60 * 60 * 24 * 7)];
  if (abs >= 60 * 60 * 24) return ["day", diffInSeconds / (60 * 60 * 24)];
  if (abs >= 60 * 60) return ["hour", diffInSeconds / (60 * 60)];
  if (abs >= 60) return ["minute", diffInSeconds / 60];

  return ["second", diffInSeconds];
}

export function formatDistanceToNowEnglish(date: Date | string) {
  if (!date) return "";

  const d = new Date(date);
  const now = new Date();

  const diffInSeconds = (d.getTime() - now.getTime()) / 1000;

  const [unit, value] = getUnit(diffInSeconds);

  return rtf.format(Math.round(value), unit);
}
