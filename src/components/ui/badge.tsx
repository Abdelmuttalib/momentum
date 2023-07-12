import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

export type BadgeColor =
  | "green"
  | "yellow"
  | "red"
  | "blue"
  | "gray"
  | "white"
  | "dark-gray";

const Badge = ({
  color,
  children,
  className,
}: {
  color: BadgeColor;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "whitespace-nowrap rounded-full px-3 py-1 text-sm font-semibold",
        {
          "bg-green-100 text-green-800": color === "green",
          "bg-yellow-100 text-yellow-800": color === "yellow",
          "bg-red-100 text-red-800": color === "red",
          "bg-primary-100/70 text-primary-700": color === "blue",
          "bg-gray-200/70 text-gray-800": color === "gray",
          "bg-white text-gray-800": color === "white",
          "bg-gray-300 text-gray-500": color === "dark-gray",
        },
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
