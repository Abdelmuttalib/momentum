import { CBadge, type CBadgeProps } from "@/components/common/cbadge";
import { getInviteStatusBadgeColor } from "@/lib/color";
import { type InvitationStatus } from "@prisma/client";

export function InviteStatusBadge({
  status,
  ...props
}: { status: InvitationStatus } & CBadgeProps) {
  if (!status) return null;

  const label = status.replace("_", " ").toLocaleLowerCase();

  return (
    <CBadge
      color={getInviteStatusBadgeColor(status)}
      className="capitalize"
      {...props}
    >
      {label}
    </CBadge>
  );
}
