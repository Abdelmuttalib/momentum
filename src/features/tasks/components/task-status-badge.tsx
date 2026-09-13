import { CBadge, type CBadgeProps } from "@/components/common/cbadge";
import { getTaskStatusBadgeColor } from "@/lib/color";
import { type TaskStatus } from "@prisma/client";
import { useTaskStatusLabel } from "./task-status-label";

export function TaskStatusBadge({
  status,
  ...props
}: { status: TaskStatus } & CBadgeProps) {
  const getLabel = useTaskStatusLabel();
  if (!status) return null;

  return (
    <CBadge
      color={getTaskStatusBadgeColor(status).color}
      className="capitalize"
      {...props}
    >
      {getLabel(status)}
    </CBadge>
  );
}
