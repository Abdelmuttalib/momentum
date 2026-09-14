import Link from "next/link";
import { useRouter } from "next/router";
import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import Container from "@/components/views/landing-page/container";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "@/components/typography";
import { locales, localeNames, resolveLocale, type Locale } from "@/i18n/config";
import { siteConfig } from "@/config/site-config";

export function PublicLanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const active = resolveLocale(router.locale);

  async function switchTo(next: Locale) {
    if (next === active) return;
    const { pathname, query, asPath } = router;
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    await router.push({ pathname, query }, `${asPath.split("#")[0]}${hash}`, {
      locale: next,
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Language / اللغة"
          className={compact ? "h-8 w-8 px-0" : ""}
        >
          <Globe className="h-4 w-4" />
          {!compact && <span className="ms-1.5">{localeNames[active]}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            disabled={locale === active}
            onClick={() => void switchTo(locale)}
          >
            {localeNames[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function PublicHeader() {
  const t = useTranslations("public");
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <Container>
        <nav
          aria-label={t("nav.main")}
          className="flex h-14 items-center justify-between gap-4"
        >
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="Momentum home"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
              M
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              Momentum
            </span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link href="/#features">{t("nav.features")}</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link href="/faq">{t("nav.faq")}</Link>
            </Button>
            <PublicLanguageSwitcher compact />
            <Button variant="ghost" size="sm" asChild>
              <Link href={siteConfig.pages.main.links.signIn.href}>
                {t("nav.signIn")}
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={siteConfig.pages.main.links.signIn.href}>
                {t("nav.getStarted")}
              </Link>
            </Button>
          </div>
        </nav>
      </Container>
    </header>
  );
}

export function PublicFooter() {
  const t = useTranslations("public");
  return (
    <footer className="border-t">
      <Container>
        <div className="flex flex-col gap-3 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">
              M
            </span>
            <Text size="sm" weight="medium">
              Momentum
            </Text>
            <Text size="xs" tone="muted" as="span">
              © {new Date().getFullYear()}
            </Text>
          </div>
          <nav
            aria-label={t("nav.footer")}
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <Link
              href="/faq"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {t("nav.faq")}
            </Link>
            <Link
              href="/help"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {t("nav.help")}
            </Link>
            <Link
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              GitHub
            </Link>
            <Link
              href={siteConfig.pages.main.links.signIn.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {t("nav.signIn")}
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PublicHeader />
      <main className="flex-1">
        <Container>
          <div className="py-10 md:py-16">{children}</div>
        </Container>
      </main>
      <PublicFooter />
    </div>
  );
}
