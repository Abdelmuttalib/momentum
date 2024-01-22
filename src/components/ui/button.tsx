import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";
import Link, { type LinkProps } from "next/link";

const buttonVariants = cva(
  "inline-flex items-center justify-center border-2 border-transparent rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:border-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "justify-center rounded-md bg-indigo-600 leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        // outline:
        //   "border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        outline:
          "text-gray-900 bg-white border-gray-200/100 hover:bg-gray-100 focus:border-brand dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 dark:focus:border-primary-200 dark:text-gray-100",
        "outline-destructive":
          "border-destructive text-destructive bg-background shadow-sm hover:bg-destructive/10 hover:text-destructive",
        // secondary:
        //   "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        secondary:
          "text-gray-900 dark:text-gray-200 bg-gray-100/70 dark:bg-gray-800/50 dark:hover:bg-gray-800/60 dark:border-gray-700 hover:bg-gray-100 focus:bg-gray-100/70 focus:border-gray-300 dark:focus:bg-gray-800/70",
        ghost: "hover:bg-gray-100/70 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-10 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
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
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, isLoading = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {props.children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export interface ButtonLinkProps
  extends LinkProps,
    VariantProps<typeof buttonVariants> {
  className?: string;
  children?: React.ReactNode;
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <Link
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {props.children}
      </Link>
    );
  }
);
ButtonLink.displayName = "ButtonLink";

export { Button, ButtonLink, buttonVariants };
