import { CBadge, type CBadgeProps } from "@/components/common/cbadge";
import { getTaskPriorityBadgeColor } from "@/lib/color";
import { type TaskPriority } from "@prisma/client";
import { useTaskPriorityLabel } from "./task-status-label";

export function TaskPriorityBadge({
  priority,
  ...props
}: { priority: TaskPriority } & CBadgeProps) {
  const getLabel = useTaskPriorityLabel();
  if (!priority) return null;

  return (
    <CBadge
      color={getTaskPriorityBadgeColor(priority).color}
      className="capitalize"
      {...props}
    >
      {getLabel(priority)}
    </CBadge>
  );
}
