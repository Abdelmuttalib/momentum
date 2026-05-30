import { InviteStatusBadge } from "@/features/company/components/invite-status-badge";
import { UserRoleBadge } from "@/features/users/components/user-role-badge";
import { formatShortDateWithYear } from "@/lib/date";
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
      return <InviteStatusBadge status={invitation?.status} />;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row: { original } }) => {
      const invitation = original;
      return (
        <>
          <UserRoleBadge role={invitation?.role} />
        </>
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
