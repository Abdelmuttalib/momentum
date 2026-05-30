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
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : Link;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

ButtonLink.displayName = "ButtonLink";

export { ButtonLink };
