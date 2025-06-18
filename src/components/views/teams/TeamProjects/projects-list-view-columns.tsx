import { formatShortDateWithYear } from "@/utils/date";
import type { Project } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";

// id: string;
// name: string;
// description: string;
// createdAt: Date;
// updatedAt: Date;
// teamId: string;
// companyId: string;

export const projectsListViewColumns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row: { original } }) => {
      const project = original;
      return (
        <p>
          {formatShortDateWithYear(project?.createdAt as unknown as string)}
        </p>
      );
    },
  },
];
