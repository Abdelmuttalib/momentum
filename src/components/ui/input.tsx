import * as React from "react";

import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import type { FieldError } from "react-hook-form";

const inputVariants = cva(
  "relative text-lg border-0 transition-colors focus:outline-transparent transition duration-200 disabled:pointer-events-none disabled:opacity-60 disabled:hover:opacity-60 disabled:cursor-not-allowed disabled:shadow-none ring-1 mt-1 ring-transparent ring-inset focus:ring-2 focus:ring-inset outline-none focus:outline-none w-full rounded focus:outline-transparent focus:ring-2 focus:ring-inset focus:outline-none disabled:bg-layer-3 disabled:hover:disabled:bg-background-muted/30 disabled:text-foreground-muted disabled:placeholder:text-foreground-muted",
  {
    variants: {
      variant: {
        default:
          "ring-1 ring-inset shadow-sm ring-input-border text-sm px-3 py-2 text-foreground placeholder-foreground-muted outline-none dark:bg-layer-2 dark:hover:bg-layer-3 focus:ring-primary focus:bg-layer-2 focus:ring-offset-2 focus:ring-offset-primary-100",
        transparent:
          "bg-transparent text-foreground placeholder-foreground-muted hover:bg-layer focus:ring-transparent",
      },
      size: {
        default: "px-3 py-2 md:px-4 md:py-2.5",
        sm: "px-2.5 py-1 md:px-3 md:py-1.5",
        lg: "py-3 px-3.5 text-base md:px-4 md:py-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"

// export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
//   size?: "default" | "lg" | "sm";
//   variant?: "default" | "transparent";
//   error?: FieldError;
// };

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants> & {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    error?: FieldError;
  };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, error, ...props }, ref) => {
    return (
      <>
        <input
          className={cn(
            // 'text-base font-medium w-full flex-1 rounded-md border shadow-sm border-border bg-background px-3 py-2 text-foreground placeholder-foreground-muted outline-none transition duration-200 hover:bg-gray-50 focus:border-primary focus:bg-white focus:outline-none dark:text-gray-200 dark:hover:bg-gray-800/50 dark:focus:border-primary-400 focus:dark:bg-gray-800/70 md:px-4 md:py-2.5',
            // 'font-medium w-full flex-1 rounded-md border-0 ring-1 ring-inset shadow-sm ring-border text-sm bg-layer px-3 py-2 text-foreground placeholder-foreground-muted outline-none transition duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-primary focus:bg-white focus:outline-none dark:text-gray-200 dark:hover:bg-gray-800/50 dark:focus:ring-primary-400 focus:dark:bg-gray-800/70 md:px-4 md:py-2.5',
            // disabled
            // 'flex h-10 w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900',
            inputVariants({ variant, size, ...props }),
            {
              "border-error-500 dark:border-error-400": error?.message,
            },
            className
          )}
          ref={ref}
          {...props}
        />
        {/* <input
          type={type}
          className={cn(
            "mt-1 flex h-11 w-full text-base font-medium",
            // disabled
            "disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-800 disabled:placeholder-gray-800 disabled:opacity-50 disabled:shadow-none",
            {
              "focus:border-brand focus-visible:border-brand focus-visible:ring-brand-100 dark:focus:border-brand-400 rounded-lg border-2 border-gray-200/100 px-3 py-2 text-sm text-gray-700 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:placeholder-gray-500 disabled:opacity-50 disabled:shadow-none dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus-visible:ring-gray-900":
                variant === "primary",
            },
            {
              "rounded-none border-none bg-slate-50 font-medium text-slate-600 ring-0 placeholder:text-slate-400 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0":
                variant === "outline",
            },
            {
              "block w-full rounded border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-800 sm:text-sm sm:leading-6":
                variant === "minimal",
            },
            {
              "label-sm w-full flex-1 rounded-md border-[2px] border-gray-300 bg-transparent bg-white px-3 py-2 text-base text-gray-800 placeholder-gray-400 outline-none transition  duration-200 hover:bg-gray-50 focus:border-primary focus:bg-white focus:outline-none focus-visible:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800/50 dark:focus:border-primary-400 focus:dark:bg-gray-800/70 md:px-5 md:py-3":
                variant === "one",
            },
            {
              "border-error-500 dark:border-error-400": error,
            },

            className
          )}
          ref={ref}
          {...props}
        /> */}
        {/* {error && (
          <p className="text-error-500 mt-0.5 text-sm lowercase">
            {error.message}
          </p>
        )} */}
      </>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
