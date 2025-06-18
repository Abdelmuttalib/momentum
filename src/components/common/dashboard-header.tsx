import { Typography, type TypographyProps } from "@/components/ui/typography";
import { cn } from "@/utils/cn";

interface DashboardPageTypographyProps extends TypographyProps {
  className?: string;
}

export function DashboardPageTitle({
  as = "h1",
  variant = "2xl/semibold",
  className,
  ...props
}: DashboardPageTypographyProps) {
  return <Typography as={as} variant={variant} {...props} />;
}

export function DashboardPageSubTitle({
  as = "h2",
  variant = "xl/semibold",
  className,
  ...props
}: DashboardPageTypographyProps) {
  return (
    <Typography
      as={as}
      variant={variant}
      className={cn("tracking-tight", className)}
      {...props}
    />
  );
}

export function DashboardPageDescription({
  as = "p",
  variant = "base/normal",
  className,
  ...props
}: DashboardPageTypographyProps) {
  return (
    <Typography
      as={as}
      variant={variant}
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

export function DashboardPageHeader({
  title,
  description,
  className,
  actions,
  actionsClassName,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  actionsClassName?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:justify-between",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <DashboardPageTitle>{title}</DashboardPageTitle>
        {description && (
          <DashboardPageDescription>{description}</DashboardPageDescription>
        )}
      </div>

      {actions && (
        <div className={cn("flex items-center gap-4", actionsClassName)}>
          {actions}
        </div>
      )}
    </div>
  );
}
