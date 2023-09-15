import { cn } from "@/utils/cn";
import type { ClassValue } from "clsx";
import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: ClassValue;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto max-w-7xl px-4 md:px-12 xl:px-6", className)}>
      {children}
    </div>
  );
}
