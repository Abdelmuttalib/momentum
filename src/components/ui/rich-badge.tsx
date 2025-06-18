import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const richBadgeVariants = cva(
  "whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium lowercase",
  {
    variants: {
      color: {
        primary:
          "border-primary-600/10 bg-primary-200/70 text-primary-900 dark:opacity-80",
        green:
          "border-green-600/10 bg-green-100/80 text-green-800 dark:opacity-80",
        yellow:
          "border-yellow-600/10 bg-yellow-100/80 text-yellow-800 dark:opacity-90",
        red: "border-red-600/10 bg-red-100/80 text-red-700 dark:opacity-90",
        blue: "border-blue-600/10 bg-blue-100/50 text-blue-600 dark:bg-blue-100 dark:opacity-70",
        gray: "border-gray-600/10 bg-gray-200/70 text-gray-700",
        white: "border-gray-500/10 bg-white text-gray-800",
        "dark-gray":
          "border-gray-600/10 bg-gray-200/70 text-muted-foreground/80 dark:text-muted-foreground",
      },
    },
  }
);

interface RichBadgeProps extends VariantProps<typeof richBadgeVariants> {
  className?: string;
  as?: React.ElementType;
  children: React.ReactNode;
}

function RichBadge({ as, color, className, ...props }: RichBadgeProps) {
  const Component = as || "span";
  return (
    <Component
      className={cn(richBadgeVariants({ color, className }))}
      {...props}
    />
  );
}

export { RichBadge, type RichBadgeProps, richBadgeVariants };
