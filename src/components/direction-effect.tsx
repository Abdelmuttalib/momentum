import { useEffect } from "react";
import { useRouter } from "next/router";
import { localeDirections, resolveLocale } from "@/i18n/config";

/**
 * Keeps <html lang>/<html dir> authoritative from the active locale.
 * Components must not set direction themselves — describe start/end.
 */
export function DirectionEffect() {
  const { locale } = useRouter();
  useEffect(() => {
    const resolved = resolveLocale(locale);
    document.documentElement.lang = resolved;
    document.documentElement.dir = localeDirections[resolved];
  }, [locale]);
  return null;
}
