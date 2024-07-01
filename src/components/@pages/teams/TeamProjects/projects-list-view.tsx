import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table-2";
import { DataTable } from "@/components/ui/data-table-2";
import { projectsListViewColumns } from "./projects-list-view-columns";
import type { Project } from "@prisma/client";

export function ProjectsListView({
  data,
  isLoading = false,
  error,
}: {
  data: Project[];
  isLoading: boolean;
  error: unknown;
}) {
  if (isLoading) {
    return <ListItemLoaderUI />;
  }
  
  return <DataTable columns={projectsListViewColumns} data={data} />;
}

function ListItemLoaderUI() {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell"></TableCell>
      <TableCell className="py-3 text-sm text-foreground-lighter">
        - no products found
      </TableCell>
      <TableCell></TableCell>
      <TableCell className="hidden md:table-cell"></TableCell>
      <TableCell className="hidden md:table-cell"></TableCell>
      <TableCell className="hidden md:table-cell"></TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
}
