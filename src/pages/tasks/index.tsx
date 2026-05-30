import { DataLoader, DataTableLoader } from "@/components/data-loader";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader, PageStack, Stack } from "@/components/page-components";
import { Seo } from "@/components/seo";
import { Typography } from "@/components/ui/typography";
import { CreateTask } from "@/components/views/project/tasks/forms/create-task";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { type RouterOutputs } from "@/lib/api";
import { type TaskPriority, TaskStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/features/tasks/components/task-card";
import { ButtonLink } from "@/components/common/button-link";
import { shortId } from "@/lib/utils";
import { type ColumnDef } from "@tanstack/react-table";
import { routes } from "@/lib/routes";
import { Eye, Pencil } from "lucide-react";
import { TaskStatusBadge } from "@/features/tasks/components/task-status-badge";
import { TaskPriorityBadge } from "@/features/tasks/components/task-priority-badge";
import { formatDistanceToNow } from "@/lib/date";
import { useViewMode } from "@/hooks/use-view-mode";
import { DataTable } from "@/components/ui/data-table";
import { ViewSwitcher } from "@/components/common/view-switcher";
import { ViewModeContainer } from "@/components/common/view-mode-container";

const tasksColumns: ColumnDef<RouterOutputs["task"]["getTasks"][number]>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ getValue }) => {
      const id = getValue() as string;
      return <span>{shortId(id)}</span>;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return <TaskStatusBadge status={status as TaskStatus} size="sm" />;
    },
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = formatDistanceToNow(row.getValue("createdAt"));
      return date;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const date = formatDistanceToNow(row.getValue("updatedAt"));
      return date;
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority");
      return (
        <TaskPriorityBadge priority={priority as TaskPriority} size="sm" />
      );
    },
  },
  {
    accessorKey: "id",
    header: "Actions",
    cell: ({ getValue, row }) => {
      const id = getValue() as string;
      const task = row.original;
      const projectId = task.projectId;
      return (
        <div className="flex gap-2 text-muted-foreground">
          <ButtonLink
            href={routes.projects.tasks.details({
              projectId: projectId,
              taskId: id,
            })}
            size="sm"
            variant="ghost"
          >
            <Eye className="h-4 w-4" />
            View
          </ButtonLink>

          <ButtonLink
            href={routes.projects.tasks.edit({
              projectId: projectId,
              taskId: id,
            })}
            size="sm"
            variant="ghost"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </ButtonLink>

          {/* <Button
            size="sm"
            variant="ghost"
            disabled
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            {tDelete}
          </Button> */}
        </div>
      );
    },
  },
];

export default function TasksPage() {
  const { data: session } = useSession();
  const companyId = session?.user?.company.id;

  const { data: tasks, isLoading: isLoadingTasks } = useTasks({
    companyId: companyId,
  });

  const { data: projects } = useProjects(companyId);

  return (
    <>
      <Seo title="Tasks" />

      <AppLayout>
        <PageStack>
          <PageHeader
            title="Tasks"
            description=""
            actions={projects && <CreateTask projects={projects} />}
          />

          <DataLoader data={tasks} isLoading={isLoadingTasks} error={null}>
            {(data) => (
              <ViewModeContainer
                defaultView="table"
                table={<DataTable columns={tasksColumns} data={data} />}
                cards={<ProjectDetailsTasksView data={data} />}
              />
            )}
          </DataLoader>
        </PageStack>
      </AppLayout>
    </>
  );
}

export function ProjectDetailsTasksView({
  data,
}: {
  data: RouterOutputs["task"]["getTasks"];
}) {
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
  });

  const filteredTasks = useMemo(() => {
    return data.filter((task: { status: string; priority: string }) => {
      if (filters.status !== "all" && task.status !== filters.status) {
        return false;
      }

      if (filters.priority !== "all" && task.priority !== filters.priority) {
        return false;
      }

      return true;
    });
  }, [data, filters]);

  return (
    <Stack spacing="compact">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={filters.status === "all" ? "default" : "outline"}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              status: "all",
            }))
          }
        >
          All
        </Button>
        {Object.values(TaskStatus).map((status) => (
          <Button
            key={status}
            size="sm"
            variant={filters.status === status ? "default" : "outline"}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                status: status,
              }))
            }
            className="capitalize"
          >
            {status.replace("_", " ").toLowerCase()}
          </Button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {filteredTasks?.map((task) => (
          <TaskCard key={task.id} task={task} projectId={null} />
        ))}
      </div>
    </Stack>
  );
}
