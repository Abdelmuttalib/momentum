import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

type FontSize =
  | "xs"
  | "sm"
  | "base"
  | "md"
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

// Generate variant combinations
const typographyVariants = cva("font-normal text-foreground", {
  variants: {
    size: fontSizeMap,
    weight: fontWeightMap,
  },
  defaultVariants: {
    size: "md",
    weight: "normal",
  },
});

type TypographyVariant = `${FontSize}/${FontWeight}`;

// extend type of props to include html attributes for the element
interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
  variant?: TypographyVariant;
}

function Typography({
  as = "p",
  // variant = "base/normal",
  variant = `base/normal`,
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

    return { size: "md", weight: "normal" };
  }

  const v = getVariant();

  return (
    <Comp
      className={cn("text-balance", typographyVariants(v), className)}
      {...props}
    />
  );
}

export { Typography, type TypographyProps, typographyVariants };
