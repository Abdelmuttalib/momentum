import type { User } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";

export const teamMembersColumns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];
