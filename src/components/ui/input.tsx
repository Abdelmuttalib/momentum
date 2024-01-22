import * as React from "react";
import type { ErrorOption } from "react-hook-form";

import { cn } from "@/utils/cn";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "primary" | "outline" | "minimal";
  error?: ErrorOption;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "minimal", error, ...props }, ref) => {
    return (
      <>
        {/*  */}
        <input
          type={type}
          className={cn(
            "mt-2 flex h-10 w-full",
            {
              "rounded-lg border-2 border-gray-200/100 px-3 py-2 text-sm text-gray-700 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 hover:bg-gray-50 focus:border-brand focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-100 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:placeholder-gray-500 disabled:opacity-50 disabled:shadow-none dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus:border-brand-400 dark:focus-visible:ring-gray-900":
                variant === "primary",
            },
            {
              "rounded-none border-none bg-slate-50 font-medium text-slate-600 ring-0 placeholder:text-slate-400 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0":
                variant === "outline",
            },
            {
              "block w-full rounded-md border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-800 sm:text-sm sm:leading-6":
                variant === "minimal",
            },
            {
              "border-error-500 dark:border-error-400": error,
            },

            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-0.5 text-sm lowercase text-error-500">
            {error.message}
          </p>
        )}
      </>
    );
  }
);
Input.displayName = "Input";

export { Input };
