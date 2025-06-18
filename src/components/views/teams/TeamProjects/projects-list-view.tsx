import { DataTable } from "@/components/ui/data-table";
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
    <>
      <span className="py-3 text-sm text-muted-foreground">
        - no products found
      </span>
    </>
  );
}
