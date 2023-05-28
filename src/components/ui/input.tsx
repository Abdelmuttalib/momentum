import * as React from "react";

import cn from "@/utils/cn";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "label-sm placeholder:text-muted-foreground w-full rounded-lg border-2 bg-transparent bg-white px-2 py-2 text-gray-800 placeholder-gray-400 outline-none transition duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium hover:bg-gray-50 focus:border-primary focus:bg-white focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-200 disabled:opacity-50 md:px-3 md:py-2",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
