import { cn } from "@/utils/cn";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-lg border-2 border-gray-200/100 bg-transparent px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 placeholder:text-muted-foreground hover:bg-gray-50 focus:border-brand focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-100 focus-visible:ring-ring  disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus:border-brand-400 dark:focus-visible:ring-gray-900",
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
