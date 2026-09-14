import * as React from "react";

import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { PublicLayout } from "@/components/layout/public-layout";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFoundPage() {
  const t = useTranslations("public");
  return (
    <>
      <Seo templateTitle="404 | Not Found" />

      <PublicLayout>
        <main className="flex w-full items-center justify-center px-6 py-16 sm:py-20">
          <div className="max-w-md text-center">
            <Typography as="p" variant="3xl/semibold" className="text-primary">
              404
            </Typography>
            <Typography as="h1" variant="3xl/semibold" className="mt-4 tracking-tight">
              {t("notFound.title")}
            </Typography>
            <Typography
              as="p"
              className="mt-4 text-base leading-7 text-muted-foreground"
            >
              {t("notFound.description")}
            </Typography>
            <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
              <Button asChild>
                <Link href="/">{t("notFound.home")}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/overview">{t("notFound.dashboard")}</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/sign-in">{t("notFound.signIn")}</Link>
              </Button>
            </div>
          </div>
        </main>
      </PublicLayout>
    </>
  );
}
