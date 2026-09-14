import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { PublicLanguageSwitcher } from "@/components/layout/public-layout";
import { useTranslations } from "next-intl";

export function AuthLayout({ children }: { children: ReactNode }) {
  const t = useTranslations("auth");
  return (
    <div className="grid min-h-[100svh] w-full grid-flow-row grid-cols-1 grid-rows-6 bg-background lg:grid-flow-col lg:grid-cols-3 lg:grid-rows-1 lg:px-0">
      <div className="relative h-full">
        <div className="flex h-full w-full flex-col bg-foreground dark:bg-background">
          <div className="flex items-center justify-between rounded-md p-4 py-3">
            <Typography
              as="h2"
              variant="5xl/semibold"
              className="tracking-tight text-white dark:text-foreground"
            >
              Momentum
            </Typography>
            <PublicLanguageSwitcher compact />
          </div>
        </div>
      </div>

      <div className="relative row-span-5 flex h-full w-full items-center justify-center rounded-t-lg bg-popover lg:col-span-2 lg:row-span-1 lg:rounded-s-lg lg:rounded-se-none">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="absolute start-4 top-4"
        >
          <Link href="/" aria-label={t("backHome")}>
            <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
            <span className="ms-1.5 hidden sm:inline">{t("backHome")}</span>
          </Link>
        </Button>
        {children}
      </div>
    </div>
  );
}
