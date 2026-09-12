import { cn } from "@/lib/cn";
import { Heading, Text } from "@/components/typography";

// Compact Linear-inspired page header: restrained title, muted description,
// right-aligned actions. Content-first — never pushes workspace content
// below the fold.
export type CompactPageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function CompactPageHeader({
  title,
  description,
  actions,
  className,
}: CompactPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <Heading level="page">{title}</Heading>
        {description && (
          <Text size="sm" tone="muted">
            {description}
          </Text>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
