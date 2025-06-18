import { RichBadge } from "@/components/ui/rich-badge";
import { getUserRoleBadgeColor } from "@/utils/getBadgeColor";
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
          <RichBadge color={getUserRoleBadgeColor(role)} className="capitalize">
            {role}
          </RichBadge>
        </>
      );
    },
  },
];
