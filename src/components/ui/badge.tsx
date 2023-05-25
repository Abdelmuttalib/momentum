import React from "react";

import cn from "@/utils/cn";
import { Priority, ProjectStatus, TaskStatus } from "@prisma/client";

export type TColor =
  | "green"
  | "yellow"
  | "red"
  | "blue"
  | "gray"
  | "white"
  | "dark-gray";

export function getProjectStatusBadgeColor(status: ProjectStatus): TColor {
  switch (status) {
    case ProjectStatus.PLANNED:
      return "blue";

    case ProjectStatus.IN_PROGRESS:
      return "yellow";

    case ProjectStatus.COMPLETED:
      return "green";

    default:
      return "gray";
  }
}
export function getTaskStatusBadgeColor(status: TaskStatus): TColor {
  switch (status) {
    case TaskStatus.BACKLOG:
      return "gray";

    case TaskStatus.IN_PROGRESS:
      return "yellow";

    case TaskStatus.IN_REVIEW:
      return "blue";

    case TaskStatus.REVISION:
      return "red";

    case TaskStatus.COMPLETED:
      return "green";

    case TaskStatus.CANCELED:
      return "dark-gray";

    default:
      return "gray";
  }
}

export function getTaskPriorityBadgeColor(status: Priority): TColor {
  switch (status) {
    case Priority.HIGH:
      return "red";

    case Priority.MEDIUM:
      return "yellow";

    case Priority.LOW:
      return "green";

    default:
      return "green";
  }
}

const Badge = ({
  color,
  children,
  className,
}: {
  color: TColor;
  children: React.ReactNode;
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
