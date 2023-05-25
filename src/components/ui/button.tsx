import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

import cn from "@/utils/cn";

// text-primary-900 bg-primary-100/70 hover:bg-primary-100 focus:bg-primary-100/70

const buttonVariants = cva(
  "relative inline-flex items-center outline-none transition duration-200 justify-center rounded-lg border-2 border-transparent focus:outline-transparent disabled:opacity-50 disabled:pointer-events-none disabled:opacity-40 disabled:hover:opacity-40 disabled:cursor-not-allowed disabled:shadow-none",
  {
    variants: {
      variant: {
        primary:
          "text-white bg-primary hover:bg-primary-600 focus:bg-primary disabled:bg-primary disabled:hover:bg-primary disabled:focus:bg-primary focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:bg-primary-600",

        outline:
          "text-primary-800 bg-white border-gray-200/100 hover:bg-gray-50 focus:border-primary",

        secondary:
          "text-primary-800 bg-primary-100/70 hover:bg-primary-100 focus:bg-primary-100/70 focus:border-primary-200",

        destructive: "bg-red-500 text-white hover:bg-red-600",
        "outline-destructive":
          "border-red-500 text-red-500 hover:bg-red-500 hover:text-white",

        subtle:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100",

        ghost:
          "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100 dark:hover:text-slate-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent",

        link: "bg-transparent underline-offset-4 hover:underline text-gray-900 hover:bg-transparent",

        dark: "bg-gray-900 text-gray-200 duration-150 ease-linear hover:bg-gray-900/90 active:bg-gray-800 disabled:bg-gray-700 focus:bg-gray-900",
      },
      size: {
        default: "label-sm px-5 py-3",
        sm: "label-sm px-4 py-2",
        md: "label-sm px-5 py-2.5",
        lg: "label-md px-5 py-2.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, isLoading, ...props }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({
            variant,
            size,
            className,
          }),
          {
            "cursor-not-allowed": isLoading,
          }
        )}
        ref={ref}
        {...props}
      >
        {!isLoading ? (
          children
        ) : (
          <div className="inline-flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading
          </div>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
