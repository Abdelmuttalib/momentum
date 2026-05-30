import { CBadge, type CBadgeProps } from "@/components/common/cbadge";
import { getTaskStatusBadgeColor } from "@/lib/color";
import { type TaskStatus } from "@prisma/client";

export function TaskStatusBadge({
  status,
  ...props
}: { status: TaskStatus } & CBadgeProps) {
  if (!status) return null;

  const label = status.replace("_", " ").toLocaleLowerCase();

  return (
    <CBadge
      color={getTaskStatusBadgeColor(status).color}
      className="capitalize"
      {...props}
    >
      {label}
    </CBadge>
  );
}
