import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";
import React from "react";
import { inputVariants } from "./input";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// className="block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // "placeholder:text-muted-foreground focus:border-brand focus-visible:border-brand focus-visible:ring-brand-100 dark:focus:border-brand-400 rounded-lg border-2 border-gray-200/100 bg-transparent px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus-visible:ring-gray-900",
          "flex min-h-[60px] w-full",
          inputVariants({
            variant: "default",
            size: "lg",
          }),
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
