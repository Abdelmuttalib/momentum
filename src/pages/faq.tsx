import { type GetStaticProps } from "next";
import { getMessagesProps } from "@/lib/i18n";
import { PublicLayout } from "@/components/layout/public-layout";
import { Seo } from "@/components/seo";
import { Typography } from "@/components/ui/typography";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

type FaqItem = { question: string; answer: string };

export default function FaqPage() {
  const t = useTranslations("public");
  const items = t.raw("faq.items") as FaqItem[];

  return (
    <>
      <Seo title="FAQ" />
      <PublicLayout>
        <section aria-labelledby="faq-title" className="mx-auto max-w-3xl py-4">
          <div className="mb-8 space-y-2 text-center">
            <Typography as="h1" id="faq-title" variant="3xl/semibold" className="tracking-tight">
              {t("faq.title")}
            </Typography>
            <Typography variant="base/normal" className="text-muted-foreground">
              {t("faq.description")}
            </Typography>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-start">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <Typography variant="sm/normal" className="text-muted-foreground">
                    {item.answer}
                  </Typography>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
