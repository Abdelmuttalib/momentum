import { CBadge, type CBadgeProps } from "@/components/common/cbadge";

/**
 * Neutral effort badge (estimated complexity, NOT lifecycle state —
 * deliberately not a status color).
 */
export function TaskEffortBadge({
  points,
  ...props
}: { points: number } & Omit<CBadgeProps, "color" | "children">) {
  return (
    <CBadge color="gray" {...props}>
      {points}
    </CBadge>
  );
}
