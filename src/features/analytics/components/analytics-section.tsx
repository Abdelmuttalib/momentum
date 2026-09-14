import { Heading } from "@/components/typography";

export function AnalyticsSection({
  title,
  ariaLabel,
  children,
}: {
  title: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={ariaLabel ?? title} className="flex flex-col gap-3">
      <Heading level="subsection">{title}</Heading>
      {children}
    </section>
  );
}
