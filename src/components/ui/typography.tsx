import { cn } from "@/utils/cn";
import { type VariantProps, cva } from "class-variance-authority";

type FontSize =
  | "xs"
  | "sm"
  | "base"
  | "md"
  | "lg"
  | "xl"
  | "display-xs"
  | "display-sm"
  | "display-md"
  | "display-lg"
  | "display-xl"
  | "display-2xl";

type FontWeight = "regular" | "medium" | "semibold" | "bold";

// extend type of props to include html attributes for the element
interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
  variant?: `${FontSize}/${FontWeight}`;
}

const typographyVariants = cva("font-normal leading-normal text-foreground", {
  variants: {
    variant: {
      // xs
      "xs/regular": "text-xs font-regular leading-xs",
      "xs/medium": "text-xs font-medium leading-xs",
      "xs/semibold": "text-xs font-semibold leading-xs",
      "xs/bold": "text-xs font-bold leading-xs",

      // sm
      "sm/regular": "text-sm font-regular leading-sm",
      "sm/medium": "text-sm font-medium leading-sm",
      "sm/semibold": "text-sm font-semibold leading-sm",
      "sm/bold": "text-sm font-bold leading-sm",

      // base
      "base/regular": "text-base font-regular leading-base",
      "base/medium": "text-base font-medium leading-base",
      "base/semibold": "text-base font-semibold leading-base",
      "base/bold": "text-base font-bold leading-base",

      // md
      "md/regular": "text-md font-regular leading-md",
      "md/medium": "text-md font-medium leading-md",
      "md/semibold": "text-md font-semibold leading-md",
      "md/bold": "text-md font-bold leading-md",

      // lg
      "lg/regular": "text-lg font-regular leading-lg",
      "lg/medium": "text-lg font-medium leading-lg",
      "lg/semibold": "text-lg font-semibold leading-lg",
      "lg/bold": "text-lg font-bold leading-lg",

      // xl
      "xl/regular": "text-xl font-regular leading-xl",
      "xl/medium": "text-xl font-medium leading-xl",
      "xl/semibold": "text-xl font-semibold leading-xl",
      "xl/bold": "text-xl font-bold leading-xl",

      // display-xs
      "display-xs/regular": "text-2xl font-regular leading-2xl",
      "display-xs/medium": "text-2xl font-medium leading-2xl",
      "display-xs/semibold": "text-2xl font-semibold leading-2xl",
      "display-xs/bold": "text-2xl font-bold leading-2xl",

      // display-sm
      "display-sm/regular": "text-3xl font-regular leading-3xl",
      "display-sm/medium": "text-3xl font-medium leading-3xl",
      "display-sm/semibold": "text-3xl font-semibold leading-3xl",
      "display-sm/bold": "text-3xl font-bold leading-3xl",

      // display-md
      "display-md/regular": "text-4xl font-regular leading-4xl",
      "display-md/medium": "text-4xl font-medium leading-4xl",
      "display-md/semibold": "text-4xl font-semibold leading-4xl",
      "display-md/bold": "text-4xl font-bold leading-4xl",

      // display-lg
      "display-lg/regular": "text-5xl font-regular leading-5xl",
      "display-lg/medium": "text-5xl font-medium leading-5xl",
      "display-lg/semibold": "text-5xl font-semibold leading-5xl",
      "display-lg/bold": "text-5xl font-bold leading-5xl",

      // display-xl
      "display-xl/regular": "text-6xl font-regular leading-6xl",
      "display-xl/medium": "text-6xl font-medium leading-6xl",
      "display-xl/semibold": "text-6xl font-semibold leading-6xl",
      "display-xl/bold": "text-6xl font-bold leading-6xl",

      // display-2xl
      "display-2xl/regular": "text-7xl font-regular leading-7xl",
      "display-2xl/medium": "text-7xl font-medium leading-7xl",
      "display-2xl/semibold": "text-7xl font-semibold leading-7xl",
      "display-2xl/bold": "text-7xl font-bold leading-7xl",
    },
  },
  defaultVariants: {
    variant: "md/regular",
  },
});

function Typography({
  as = "p",
  variant = "base/regular",
  className,
  ...props
}: TypographyProps) {
  const Comp = as;

  return (
    <Comp
      className={cn("text-balance", typographyVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Typography, type TypographyProps, typographyVariants };

// type LineHeight =
//   | 'xs'
//   | 'sm'
//   | 'base'
//   | 'md'
//   | 'lg'
//   | 'xl'
//   | 'display-xs'
//   | 'display-sm'
//   | 'display-md'
//   | 'display-lg'
//   | 'display-xl'
//   | 'display-2xl';
