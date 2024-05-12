import { cn } from "@/utils/cn";
import React from "react";

type FormLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function FormLabel({ className, ...props }: FormLabelProps) {
  return (
    <label
      // className="block text-sm font-medium leading-6 text-gray-900"
      className={cn("block text-sm leading-none text-foreground", className)}
      {...props}
    />
  );
}
