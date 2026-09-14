import { FontName, type FontValue } from "@/hooks/use-font";

export type Locale = "en" | "ar";

export const localesData: Record<
  Locale,
  {
    locale: Locale;
    name: string;
    direction: string;
    fonts: FontValue[];
    flag: string;
  }
> = {
  en: {
    locale: "en",
    name: "English",
    direction: "ltr",
    fonts: ["inter", "plus-jakarta", "onest"],
    flag: "🇺🇸",
  },
  ar: {
    locale: "ar",
    name: "العربية",
    direction: "rtl",
    fonts: ["ibm-plex-sans-arabic"],
    flag: "🇸🇦",
  },
};

export const localesList = Object.values(localesData);

export const locales = Object.values(localesData).map((v) => v.locale);

export const defaultLocale: Locale = "en";

export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (locales as readonly string[]).includes(value)
  );
}

export function resolveLocale(value: unknown): Locale {
  return isLocale(value) ? value : defaultLocale;
}
