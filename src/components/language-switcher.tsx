import { useRouter } from "next/router";
import { Check, Languages } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { locales, localeNames, resolveLocale, type Locale } from "@/i18n/config";

/**
 * Language submenu preserving route, params, query and hash via
 * Next locale-aware routing (no duplicate page trees).
 */
export function LanguageSwitcherMenu() {
  const router = useRouter();
  const active = resolveLocale(router.locale);

  async function switchTo(next: Locale) {
    if (next === active) return;
    const { pathname, query, asPath } = router;
    const hash =
      typeof window !== "undefined" ? window.location.hash : "";
    await router.push({ pathname, query }, `${asPath.split("#")[0]}${hash}`, {
      locale: next,
    });
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Languages className="mr-2 h-4 w-4" />
        <span>{localeNames[active]}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            disabled={locale === active}
            onClick={() => void switchTo(locale)}
          >
            <span className="flex-1">{localeNames[locale]}</span>
            {locale === active && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
