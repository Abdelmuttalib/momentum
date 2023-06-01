/* eslint-disable @typescript-eslint/no-unsafe-argument */

import cn from "@/utils/cn";
import type { ReactNode } from "react";

export default function CustomTableLayout({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("w-full", className)}>{children}</div>;
}

export function CustomTableHead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-t-none label-sm grid w-full items-center justify-between rounded-t-primary border-2 bg-white px-4 py-5 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CustomTableHeadItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full whitespace-nowrap text-left", className)}>
      {children}
    </div>
  );
}

export function CustomTableBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-b-primary-lg border-2 border-t-0 bg-white pb-1.5",
        className
      )}
    >
      {children}
    </div>
  );
}

// className = "rounded-b-primary border-2 border-t-0";
export function CustomTableRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-t-none grid w-full items-center justify-between bg-white px-4 py-5 hover:bg-gray-50 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CustomTableRowItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("w-full text-left", className)}>{children}</div>;
}
