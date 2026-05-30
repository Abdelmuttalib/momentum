import { CBadge, type CBadgeProps } from "@/components/common/cbadge";
import { getTaskPriorityBadgeColor } from "@/lib/color";
import { type TaskPriority } from "@prisma/client";

export function TaskPriorityBadge({
  priority,
  ...props
}: { priority: TaskPriority } & CBadgeProps) {
  if (!priority) return null;

  const label = priority.replace("_", " ").toLocaleLowerCase();

  return (
    <CBadge
      color={getTaskPriorityBadgeColor(priority).color}
      className="capitalize"
      {...props}
    >
      {label}
    </CBadge>
  );
}
