import type { Label } from "@prisma/client";
import { CBadge } from "../common/cbadge";

interface LabelBadgeProps {
  name: Label["name"];
  color: Label["color"];
}

export default function LabelBadge({ name, color, ...props }: LabelBadgeProps) {
  return (
    <CBadge
      color={"slate"}
      size="sm"
      className="inline-flex items-center gap-x-1 whitespace-nowrap"
      {...props}
    >
      <span
        className="h-2 w-2 rounded-[2px]"
        style={{
          backgroundColor: color,
        }}
      ></span>
      <span>{name}</span>
    </CBadge>
  );
}
