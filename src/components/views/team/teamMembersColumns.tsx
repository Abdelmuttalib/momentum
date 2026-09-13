import { UserRoleBadge } from "@/features/users/components/user-role-badge";
import type { Role } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";

export type TeamMemberRow = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  companyId: string;
};

export const teamMembersColumns: ColumnDef<TeamMemberRow>[] = [
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
