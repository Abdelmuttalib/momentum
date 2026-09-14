import { type VariantProps } from "class-variance-authority";
import Link, { type LinkProps } from "next/link";
import { buttonVariants } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/cn";
import { Slot } from "@radix-ui/react-slot";

export interface ButtonLinkProps
  extends LinkProps,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    { className, variant, size, asChild = false, disabled = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : Link;

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          disabled && "pointer-events-none cursor-not-allowed opacity-50"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

ButtonLink.displayName = "ButtonLink";

export { ButtonLink };
