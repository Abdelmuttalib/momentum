import { Heading, Text } from "@/components/typography";
import { Separator } from "@/components/ui/separator";

export type SettingSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

/** Standard settings row: label left, control right. Stacks on mobile. */
export function SettingSection({
  title,
  description,
  children,
}: SettingSectionProps) {
  return (
    <section className="w-full py-5 first:pt-0 last:pb-0 lg:flex lg:items-start lg:gap-6">
      <div className="mb-3 space-y-1 lg:mb-0 lg:w-2/5 lg:shrink-0">
        <Heading level="subsection">{title}</Heading>
        {description && (
          <Text size="sm" tone="muted" className="max-w-[420px]">
            {description}
          </Text>
        )}
      </div>
      <div className="min-w-0 lg:flex-1">{children}</div>
    </section>
  );
}

export function SettingDivider() {
  return <Separator />;
}
