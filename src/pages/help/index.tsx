import { PublicLayout } from "@/components/layout/public-layout";
import { Seo } from "@/components/seo";
import { Typography } from "@/components/ui/typography";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { type GetStaticProps } from "next";
import { getMessagesProps } from "@/lib/i18n";

type HelpSection = { title: string; body: string };

const SECTION_KEYS = [
  "gettingStarted",
  "projects",
  "tasks",
  "teams",
  "inviting",
  "needMore",
] as const;

export default function HelpPage() {
  const t = useTranslations("help");
  const tp = useTranslations("public");

  return (
    <>
      <Seo title="Help" />
      <PublicLayout>
        <section aria-labelledby="help-title" className="mx-auto max-w-3xl py-4">
          <div className="mb-8 space-y-2 text-center">
            <Typography as="h1" id="help-title" variant="3xl/semibold" className="tracking-tight">
              {t("title")}
            </Typography>
            <Typography variant="base/normal" className="text-muted-foreground">
              {t("description")}
            </Typography>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {SECTION_KEYS.map((key, index) => (
              <AccordionItem key={key} value={`section-${index}`}>
                <AccordionTrigger className="text-start">
                  {t(`${key}Title`)}
                </AccordionTrigger>
                <AccordionContent>
                  <Typography variant="sm/normal" className="text-muted-foreground">
                    {t(`${key}Body`)}
                  </Typography>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-8 flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/faq">{tp("nav.faq")}</Link>
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
}
