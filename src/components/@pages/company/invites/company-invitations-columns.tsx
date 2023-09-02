import Badge from "@/components/ui/badge";
import { formatFullDate } from "@/utils/formatFullDate";
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
      return <Badge color="green">{invitation?.status}</Badge>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row: { original } }) => {
      const invitation = original;
      return (
        <Badge color={getUserRoleBadgeColor(invitation?.role)}>
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
      return <p>{formatFullDate(invitation?.createdAt)}</p>;
    },
  },
];
