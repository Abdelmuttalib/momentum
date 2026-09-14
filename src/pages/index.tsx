import { type GetStaticProps } from "next";
import { getMessagesProps } from "@/lib/i18n";
import { PublicLayout } from "@/components/layout/public-layout";
import { Seo } from "@/components/seo";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Zap, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Typography } from "@/components/ui/typography";
import Container from "@/components/views/landing-page/container";
import BoardExample from "@/components/views/landing-page/board-example";
import { siteConfig } from "@/config/site-config";
import { useTranslations } from "next-intl";

const FEATURES = [
  { key: "board", icon: Zap },
  { key: "analytics", icon: BarChart3 },
  { key: "collaboration", icon: Users },
] as const;

const TECH_STACK = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "React",
  "Prisma",
  "PostgreSQL",
  "tRPC",
];

export default function LandingPage() {
  const t = useTranslations("public");
  return (
    <>
      <Seo title="Momentum" />
      <PublicLayout>
        {/* Hero */}
        <section
          aria-labelledby="hero-title"
          className="pb-10 pt-6 md:pb-16 md:pt-10"
        >
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="flex max-w-xl flex-col gap-5">
              {/* <Badge variant="secondary" className="w-fit">
                {t("hero.badge")}
              </Badge> */}
              <Typography
                as="h1"
                id="hero-title"
                variant="4xl/semibold"
                className="text-balance leading-snug tracking-tight"
              >
                {t("hero.title")}
              </Typography>
              <Typography
                as="p"
                variant="lg/normal"
                className="text-muted-foreground"
              >
                {t("hero.description")}
              </Typography>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild>
                  <Link href={siteConfig.pages.main.links.signIn.href}>
                    {t("hero.primaryCta")}
                    <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={siteConfig.pages.main.links.signIn.href}>
                    {t("hero.secondaryCta")}
                  </Link>
                </Button>
              </div>
              <Typography variant="sm/normal" className="text-muted-foreground">
                {t("hero.proofNote")}
              </Typography>
            </div>
            <div
              className="max-h-[26rem] overflow-hidden rounded-lg border shadow-sm md:max-h-[30rem]"
              aria-hidden="true"
            >
              <BoardExample />
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          aria-labelledby="features-title"
          className="py-10 md:py-14"
        >
          <div className="flex flex-col gap-8">
            <div className="flex max-w-2xl flex-col gap-3">
              <Typography
                as="h2"
                id="features-title"
                variant="3xl/semibold"
                className="tracking-tight"
              >
                {t("features.title")}
              </Typography>
              <Typography
                variant="base/normal"
                className="text-muted-foreground"
              >
                {t("features.description")}
              </Typography>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {FEATURES.map(({ key, icon: Icon }) => (
                <Card key={key}>
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg border bg-background">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">
                      {key === "board"
                        ? t("features.boardTitle")
                        : key === "analytics"
                        ? t("features.analyticsTitle")
                        : t("features.collaborationTitle")}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {key === "board"
                        ? t("features.boardDescription")
                        : key === "analytics"
                        ? t("features.analyticsDescription")
                        : t("features.collaborationDescription")}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tech strip */}
        <section aria-labelledby="tech-title" className="py-10 md:py-14">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="space-y-2">
              <Typography
                as="h2"
                id="tech-title"
                variant="2xl/semibold"
                className="tracking-tight"
              >
                {t("tech.title")}
              </Typography>
              {/* <Typography variant="sm/normal" className="text-muted-foreground">
                {t("tech.description")}
              </Typography> */}
            </div>
            <div className="flex max-w-2xl flex-wrap justify-center gap-2">
              {TECH_STACK.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="cta-title" className="py-10 md:py-14">
          <div className="flex flex-col items-center gap-4 rounded-xl border bg-muted/40 px-6 py-10 text-center">
            <Typography
              as="h2"
              id="cta-title"
              variant="3xl/semibold"
              className="tracking-tight"
            >
              {t("cta.title")}
            </Typography>
            <Typography
              variant="base/normal"
              className="max-w-xl text-muted-foreground"
            >
              {t("cta.description")}
            </Typography>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild>
                <Link href={siteConfig.pages.main.links.signIn.href}>
                  {t("cta.primary")}
                  <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/faq">{t("nav.faq")}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Help teaser */}
        <section aria-labelledby="help-teaser-title" className="pb-4 pt-2">
          <div className="flex flex-col items-start justify-between gap-3 rounded-xl border p-6 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <Typography as="h2" id="help-teaser-title" variant="xl/semibold">
                {t("helpTeaser.title")}
              </Typography>
              <Typography variant="sm/normal" className="text-muted-foreground">
                {t("helpTeaser.description")}
              </Typography>
            </div>
            <Button variant="outline" asChild className="shrink-0">
              <Link href="/help">{t("helpTeaser.action")}</Link>
            </Button>
          </div>
        </section>
      </PublicLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps = ({ locale }) => {
  return {
    props: {
      ...getMessagesProps(locale),
    },
  };
};
