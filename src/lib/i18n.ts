import type { AbstractIntlMessages } from "next-intl";
import {
  defaultLocale,
  isLocale,
  type Locale,
} from "@/i18n/config";
import en from "../../messages/en.json";
import ar from "../../messages/ar.json";

/**
 * Shared message loading. English is the production fallback: the Arabic
 * catalog is deep-merged over English so missing `ar` keys fall back
 * instead of rendering broken keys. Components just call useTranslations().
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const existing = out[key];
    out[key] =
      isRecord(existing) && isRecord(value)
        ? deepMerge(existing, value)
        : value;
  }
  return out;
}

const catalogs: Record<Locale, AbstractIntlMessages> = {
  en: en as AbstractIntlMessages,
  ar: deepMerge(
    en as Record<string, unknown>,
    ar as Record<string, unknown>
  ) as AbstractIntlMessages,
};

export function getMessages(locale: Locale): AbstractIntlMessages {
  return catalogs[locale] ?? catalogs.en;
}

/** For getServerSideProps/getStaticProps: validate + load in one call. */
export function getMessagesProps(locale: unknown): {
  locale: Locale;
  messages: AbstractIntlMessages;
} {
  const resolved = isLocale(locale) ? locale : defaultLocale;
  return { locale: resolved, messages: getMessages(resolved) };
}
