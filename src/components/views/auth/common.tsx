import { Typography, type TypographyProps } from "@/components/ui/typography";
import { cn } from "@/utils/cn";

type AuthPageTitleProps = TypographyProps;

export function AuthPageTitle({ ...props }: AuthPageTitleProps) {
  return <Typography as="h1" variant="2xl/semibold" {...props} />;
}

export function AuthPageDescription({ ...props }: TypographyProps) {
  return (
    <Typography
      as="p"
      variant="sm/normal"
      className={cn("text-muted-foreground", props.className)}
      {...props}
    />
  );
}
