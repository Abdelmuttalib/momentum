import * as React from "react";
import type { ErrorOption } from "react-hook-form";

import { cn } from "@/utils/cn";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "outline";
  error?: ErrorOption;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", error, ...props }, ref) => {
    return (
      <>
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border-2 border-gray-200/100 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 hover:bg-gray-50 focus:border-brand focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-100 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:placeholder-gray-500 disabled:opacity-50 disabled:shadow-none dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus:border-brand-400 dark:focus-visible:ring-gray-900",
            {
              "rounded-none border-none bg-slate-50 font-medium text-slate-600 ring-0 placeholder:text-slate-400 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0":
                variant === "outline",
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
          <p className="mt-0.5 bg-gray-200 text-sm lowercase text-error-500">
            {error.message}
          </p>
        )}
      </>
    );
  }
);
Input.displayName = "Input";

export { Input };
