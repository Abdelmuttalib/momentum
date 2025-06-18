import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import Link, { type LinkProps } from "next/link";
import React from "react";

const iconButtonVariants = cva(
  "cursor-pointer border-0 border-transparent ring-1 ring-inset ring-transparent transition duration-150 ease-linear outline-transparent focus:outline-transparent whitespace-nowrap rounded inline-flex items-center justify-center focus:ring-2 focus:ring-inset",
  {
    variants: {
      // variant: {
      //   primary:
      //     "text-white bg-primary hover:bg-primary focus:ring-primary/20 focus:bg-primary",
      //   "primary-outline":
      //     "text-primary bg-background ring-primary/40 hover:bg-primary-100/40 focus:ring-primary",
      //   outline:
      //     "text-foreground bg-background ring-border hover:bg-primary-100/30 focus:ring-primary",
      //   secondary:
      //     "text-primary dark:text-gray-200 bg-primary-100/50 hover:bg-primary-100/70 focus:bg-primary-100/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/60 dark:ring-gray-700  dark:focus:bg-gray-800/70",
      //   dark: "bg-gray-900 text-white hover:bg-gray-900/90 active:bg-gray-700 disabled:bg-gray-700 focus:ring-primary/30",
      //   destructive:
      //     "bg-destructive text-white hover:bg-red-600 dark:hover:bg-red-600",
      //   "destructive-outline":
      //     "bg-background text-destructive ring-destructive hover:bg-destructive/10 dark:hover:bg-destructive hover:text-white",
      //   "primary-ghost": "hover:bg-accent hover:text-accent-foreground",
      //   ghost: "hover:bg-accent focus:bg-hover",
      // },
      variant: {
        primary:
          "text-white bg-primary shadow-sm hover:bg-primary focus:ring-primary/20 dark:focus:ring-primary active:bg-primary focus:bg-primary",
        "primary-outline":
          "text-primary bg-background ring-primary/40 hover:bg-primary-100/40 dark:hover:bg-popover focus:ring-primary",
        outline:
          "text-foreground bg-background ring-border hover:bg-popover focus:ring-primary",
        secondary:
          "text-primary dark:text-gray-200 bg-primary-100/50 hover:bg-primary-100/70 focus:bg-primary-100/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/60 dark:ring-gray-700  dark:focus:bg-gray-800/70",
        destructive:
          "bg-destructive text-white hover:bg-red-600 dark:hover:bg-red-600",
        "destructive-outline":
          "ring-red-500 text-destructive hover:bg-red-500 hover:text-white focus:bg-red-500 focus:ring-red-200 focus:text-white dark:text-red-400 dark:ring-red-400 dark:hover:ring-red-500 dark:hover:bg-destructive dark:hover:text-white dark:focus:bg-red-500 dark:focus:ring-red-400 dark:focus:text-white",
        dark: "bg-gray-900 text-white duration-150 ease-linear hover:bg-gray-900/90 active:bg-gray-700 disabled:bg-gray-700 focus:ring-primary/30",
        ghost: "hover:bg-accent dark:hover:bg-popover text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "w-11 h-11",
        xs: "w-8 h-8",
        sm: "w-10 h-10",
        lg: "w-12 h-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  className?: string;
}

const IconButton = ({
  className,
  variant,
  size,
  type,
  ...props
}: IconButtonProps) => {
  return (
    <button
      type={type ?? "button"}
      className={cn(iconButtonVariants({ variant, size, className }))}
      {...props}
    />
  );
};

interface IconLinkProps
  extends LinkProps,
    VariantProps<typeof iconButtonVariants> {
  className?: string;
  children: React.ReactNode;
  href: string;
  newTab?: boolean;
}

const IconLink = ({
  className,
  variant,
  href,
  size,
  children,
  newTab,
  ...props
}: IconLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(iconButtonVariants({ variant, size, className }))}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
    </Link>
  );
};

export {
  IconButton,
  IconLink,
  iconButtonVariants,
  type IconButtonProps,
  type IconLinkProps,
};
