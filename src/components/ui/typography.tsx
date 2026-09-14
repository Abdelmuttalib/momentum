import { cn } from "@/lib/cn";
import { cva, type VariantProps } from "class-variance-authority";

type FontSize =
  | "xs"
  | "sm"
  | "base"
  | "md" // deprecated alias of "base"; do not use in new code
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl";

type FontWeight = "normal" | "medium" | "semibold" | "bold" | "extrabold";

const fontSizeMap: Record<FontSize, string> = {
  xs: "text-xs",
  sm: "text-xs sm:text-sm",
  base: "text-sm sm:text-md",
  md: "text-sm sm:text-md",
  lg: "text-md md:text-lg",
  xl: "text-lg md:text-xl",
  "2xl": "text-lg sm:text-xl md:text-2xl",
  "3xl": "text-xl sm:text-2xl md:text-3xl",
  "4xl": "text-2xl sm:text-3xl md:text-4xl",
  "5xl": "text-3xl sm:text-4xl md:text-5xl",
  "6xl": "text-4xl sm:text-5xl md:text-6xl",
  "7xl": "text-5xl sm:text-6xl md:text-7xl",
};

const fontWeightMap: Record<FontWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
};

const fontLeadingMap: Record<FontSize, string> = {
  xs: "leading-xs",
  sm: "leading-sm",
  base: "leading-base",
  md: "leading-md",
  lg: "leading-lg",
  xl: "leading-xl",
  "2xl": "leading-2xl",
  "3xl": "leading-3xl",
  "4xl": "leading-4xl",
  "5xl": "leading-5xl",
  "6xl": "leading-6xl",
  "7xl": "leading-7xl",
};

export type TypographyTone =
  | "default"
  | "muted"
  | "subtle"
  | "destructive"
  | "inherit";

const toneMap: Record<TypographyTone, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  subtle: "text-subtle-foreground",
  destructive: "text-destructive",
  inherit: "",
};

// Generate variant combinations.
// Typography owns size, weight, and line-height. Color is flexible via
// `tone` (theme tokens) or `className` — never hard-code color-specific
// components on top of this primitive.
// Canonical hierarchy for dense SaaS UI:
//   page title        -> Heading level="page"      (lg/semibold)
//   section heading   -> Heading level="section"   (base/semibold)
//   subsection/group  -> Heading level="subsection"(base/medium)
//   body              -> Text size="sm"
//   muted description -> Text size="sm" tone="muted"
//   metadata/caption  -> Text size="xs" (tone muted as needed)
//   form/table labels -> Label
// Do not add color-named components; use `tone` + `className`.
const typographyVariants = cva("font-normal", {
  variants: {
    size: fontSizeMap,
    weight: fontWeightMap,
    tone: toneMap,
    leading: fontLeadingMap,
  },
  defaultVariants: {
    size: "base",
    weight: "normal",
    tone: "default",
    leading: "base",
  },
});

type TypographyVariant = `${FontSize}/${FontWeight}`;

// extend type of props to include html attributes for the element
interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
  variant?: TypographyVariant;
  /** Opt-in balanced wrapping (e.g. marketing headlines). Defaults off so
   * truncated/meta text is never affected. */
  balance?: boolean;
}

function Typography({
  as = "p",
  // variant = "base/normal",
  variant = `base/normal`,
  size,
  weight,
  tone,
  leading,
  balance = false,
  className,
  ...props
}: TypographyProps) {
  const Comp = as;

  const isValidTypographyVariant = (size: string, weight: string): boolean => {
    return size in fontSizeMap && weight in fontWeightMap;
  };

  function getVariant(): { size: FontSize; weight: FontWeight } | undefined {
    const [s, w] = variant.split("/") as [FontSize, FontWeight];
    if (isValidTypographyVariant(s, w)) {
      return { size: s, weight: w };
    }

    return { size: "base", weight: "normal" };
  }

  const v = getVariant();
  const resolvedSize = size ?? v?.size ?? "base";
  const resolvedWeight = weight ?? v?.weight ?? "normal";

  return (
    <Comp
      className={cn(
        balance && "text-balance",
        typographyVariants({
          size: resolvedSize,
          weight: resolvedWeight,
          tone: tone ?? "default",
          leading: leading ?? resolvedSize,
        }),
        className
      )}
      {...props}
    />
  );
}

export { Typography, type TypographyProps, typographyVariants };
