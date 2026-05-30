import { CBadge, type CBadgeProps } from "@/components/common/cbadge";
import { getUserRoleBadgeColor } from "@/lib/color";
import { type Role } from "@prisma/client";

export function UserRoleBadge({
  role,
  ...props
}: { role: Role } & CBadgeProps) {
  if (!role) return null;

  const label = role.replace("_", " ").toLocaleLowerCase();

  return (
    <CBadge
      color={getUserRoleBadgeColor(role)}
      className="capitalize"
      {...props}
    >
      {label}
    </CBadge>
  );
}
