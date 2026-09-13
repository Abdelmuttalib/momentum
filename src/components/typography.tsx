import { cn } from "@/lib/cn";
import {
  Typography,
  type TypographyProps,
  type TypographyTone,
} from "@/components/ui/typography";

// Linear-inspired restrained hierarchy. Page titles establish order without
// dominating the viewport; body stays compact and information-dense.
//
// page       ~17-18px semibold, tight tracking  (app screens)
// section    ~15-16px semibold                 (card/region titles)
// subsection ~14px medium                      (group labels)

type HeadingLevel = "page" | "section" | "subsection";

const headingConfig: Record<
  HeadingLevel,
  { as: "h1" | "h2" | "h3"; size: "lg" | "base"; weight: "semibold" | "medium"; className: string }
> = {
  page: {
    as: "h1",
    size: "lg",
    weight: "semibold",
    className: "tracking-tight",
  },
  section: {
    as: "h2",
    size: "base",
    weight: "semibold",
    className: "tracking-tight",
  },
  subsection: {
    as: "h3",
    size: "base",
    weight: "medium",
    className: "tracking-tight",
  },
};

export type HeadingProps = Omit<TypographyProps, "size" | "weight" | "variant" | "as"> & {
  level?: HeadingLevel;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  tone?: TypographyTone;
};

export function Heading({
  level = "section",
  as,
  tone = "default",
  className,
  ...props
}: HeadingProps) {
  const config = headingConfig[level];
  return (
    <Typography
      as={as ?? config.as}
      size={config.size}
      weight={config.weight}
      tone={tone}
      className={cn(config.className, className)}
      {...props}
    />
  );
}

// body  14px (sm) — default UI text
// small 13px (xs on mobile → sm) — secondary/meta
// tiny  12px (xs) — timestamps, counts

export type TextProps = Omit<TypographyProps, "variant" | "size"> & {
  size?: "xs" | "sm" | "md";
  tone?: TypographyTone;
};

export function Text({
  size = "sm",
  tone = "default",
  weight = "normal",
  as = "p",
  className,
  ...props
}: TextProps) {
  return (
    <Typography
      as={as}
      size={size}
      weight={weight}
      tone={tone}
      className={className}
      {...props}
    />
  );
}

export type LabelProps = Omit<TypographyProps, "variant" | "weight" | "size"> & {
  size?: "xs" | "sm";
  tone?: TypographyTone;
};

export function Label({
  size = "xs",
  tone = "default",
  as = "span",
  className,
  ...props
}: LabelProps) {
  return (
    <Typography
      as={as}
      size={size}
      weight="medium"
      tone={tone}
      className={className}
      {...props}
    />
  );
}
