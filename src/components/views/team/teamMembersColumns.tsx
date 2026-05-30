import { UserRoleBadge } from "@/features/users/components/user-role-badge";
import type { User } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";

export const teamMembersColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const { role } = row.original;
      return (
        <>
          <UserRoleBadge role={role} />
        </>
      );
    },
  },
];
