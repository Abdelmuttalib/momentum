import { Badge } from "@/components/ui/badge";
import { formatFullDate, formatShortDateWithYear } from "@/utils/date";
import { getUserRoleBadgeColor } from "@/utils/getBadgeColor";
import type { Invitation } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";

export const companyInvitationsColumns: ColumnDef<Invitation>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Invite Status",
    cell: ({ row: { original } }) => {
      const invitation = original;
      return (
        <Badge color="green" className="uppercase">
          {invitation?.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row: { original } }) => {
      const invitation = original;
      return (
        <Badge
          color={getUserRoleBadgeColor(invitation?.role)}
          className="rounded"
        >
          {invitation?.role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Invitation Date",
    cell: ({ row: { original } }) => {
      const invitation = original;
      return <p>{formatShortDateWithYear(invitation?.createdAt)}</p>;
    },
  },
];
