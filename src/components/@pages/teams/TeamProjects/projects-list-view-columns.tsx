import Badge from "@/components/ui/badge";
import { formatFullDate, formatShortDate, formatShortDateWithYear } from "@/utils/date";
import { getUserRoleBadgeColor } from "@/utils/getBadgeColor";
import type { Invitation, Project } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";

// id: string;
// name: string;
// createdAt: Date;
// updatedAt: Date;
// status: ProjectStatus;
// teamId: string;
// companyId: string;

export const projectsListViewColumns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Project Status",
    cell: ({ row: { original } }) => {
      const project = original;
      return (
        <Badge color="green" className="rounded">
          {project?.status?.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row: { original } }) => {
      const project = original;
      return <p>{formatShortDateWithYear(project?.createdAt as unknown as string)}</p>;
    },
  },
];
