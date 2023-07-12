import { cva, type VariantProps } from "class-variance-authority";
import Link, { type LinkProps } from "next/link";
import React from "react";

import cn from "@/utils/cn";

const iconButtonVariants = cva(
  "cursor-pointer border-2 border-transparent transition duration-200 outline-transparent focus:outline-transparent whitespace-nowrap rounded-xl inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        primary:
          "text-white bg-primary hover:bg-primary-600 focus:border-primary-200 focus:bg-primary",

        // outline:
        //   "text-gray-900 bg-primary-50 border-primary-200 hover:bg-primary-50 focus:border-primary",
        outline:
          "text-gray-900 bg-white border-gray-200 hover:bg-gray-50 focus:border-primary",

        secondary:
          "text-primary-900 bg-primary-100/70 hover:bg-primary-100 focus:bg-primary-100/70 focus:border-primary-200",

        destructive: "bg-red-500 text-white hover:bg-red-600",
      },
      size: {
        default: "label-sm w-fit h-fit p-2",
        sm: "label-sm w-fit h-fit p-1.5",
        md: "label-sm w-fit h-fit p-2",
        lg: "label-md w-fit h-fit p-3",
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

export const IconButton = ({
  className,
  variant,
  size,
  ...props
}: IconButtonProps) => {
  return (
    <button
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

export const IconLink = ({
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
