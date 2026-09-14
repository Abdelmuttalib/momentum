import { cn } from "@/lib/cn";
import { Heading, Text } from "@/components/typography";

export type EmptyStateProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  title = "No data",
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 py-10 text-center",
        className
      )}
    >
      {icon}
      <Heading level="subsection">{title}</Heading>
      {description && (
        <Text size="sm" tone="muted" className="max-w-sm">
          {description}
        </Text>
      )}
      {action}
    </div>
  );
}
