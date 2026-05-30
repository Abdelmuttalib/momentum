import {
  useProject,
  useProjects,
} from "@/features/projects/hooks/use-projects";
import { useRouter } from "next/router";
import { AppLayout } from "@/components/layout/app-layout";
import { Seo } from "@/components/seo";

import { Button } from "@/components/ui/button";
import { DataLoader } from "@/components/data-loader";
import {
  PageHeader,
  PageSubDescription,
  PageSubTitle,
  Stack,
} from "@/components/page-components";
import { TaskCard } from "@/features/tasks/components/task-card";
import { CreateTask } from "@/components/views/project/tasks/forms/create-task";
import { useSession } from "next-auth/react";
import { CBadge } from "@/components/common/cbadge";
import { ButtonLink } from "@/components/common/button-link";

export default function ProjectPage() {
  const { query } = useRouter();
  const projectId = query.projectId as string;
  const { data: session } = useSession();
  const companyId = session?.user?.company.id;

  const { data: project, isLoading, error } = useProject(projectId);
  const { data: projects, isLoading: isLoadingProjects } =
    useProjects(companyId);

  return (
    <>
      <Seo title={`${project?.name} | Momentum`} />

      <AppLayout>
        <Stack spacing="section">
          <PageHeader
            title={"Project: " + project?.name}
            description={
              project?.description || "No project description provided."
            }
            actions={
              <>
                <ButtonLink
                  href={`/projects/${projectId}/edit`}
                  variant="outline"
                  size="sm"
                >
                  Edit Project
                </ButtonLink>
                <CreateTask
                  projectId={projectId}
                  projects={projects}
                  triggerButton={<Button size="sm">Add Task</Button>}
                />
              </>
            }
          />

          <DataLoader data={project} isLoading={isLoading} error={null}>
            {(data) => (
              <Stack spacing="section">
                {/* Header */}
                <div>
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-center gap-3"></div>
                  </div>

                  <div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-lg border bg-muted/40 p-4">
                        <p className="text-sm text-muted-foreground">
                          Project ID
                        </p>

                        <p className="mt-1 break-all text-sm font-medium">
                          {data.id}
                        </p>
                      </div>

                      <div className="rounded-lg border bg-muted/40 p-4">
                        <p className="text-sm text-muted-foreground">Created</p>

                        <p className="mt-1 text-sm font-medium">
                          {formatDistanceToNow(data.createdAt)}
                        </p>
                      </div>

                      <div className="rounded-lg border bg-muted/40 p-4">
                        <p className="text-sm text-muted-foreground">Updated</p>

                        <p className="mt-1 text-sm font-medium">
                          {formatDistanceToNow(data.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <section className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div>
                        <PageSubTitle className="inline-flex items-center gap-2">
                          Tasks{" "}
                          <CBadge color="gray" size="sm">
                            {data?.tasks?.length}{" "}
                            {data.tasks.length === 1 ? "Task" : "Tasks"}
                          </CBadge>
                        </PageSubTitle>
                      </div>

                      <PageSubDescription>
                        Manage and track all project tasks.
                      </PageSubDescription>
                    </div>
                    <div>
                      <ButtonLink
                        href={`/projects/${project.id}/tasks`}
                        variant="outline"
                        className="flex-1 lg:flex-initial"
                        size="sm"
                      >
                        View All Tasks
                      </ButtonLink>
                    </div>
                  </div>

                  <ProjectDetailsTasksView data={data} />
                </section>
              </Stack>
            )}
          </DataLoader>
        </Stack>
      </AppLayout>
    </>
  );
}

import { useMemo, useState } from "react";
import { type RouterOutputs } from "@/lib/api";
import { TaskStatus } from "@prisma/client";
import { formatDistanceToNow } from "@/lib/date";

export function ProjectDetailsTasksView({
  data,
}: {
  data: RouterOutputs["project"]["getProject"];
}) {
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
  });

  const filteredTasks = useMemo(() => {
    return data.tasks.filter((task: { status: string; priority: string }) => {
      if (filters.status !== "all" && task.status !== filters.status) {
        return false;
      }

      if (filters.priority !== "all" && task.priority !== filters.priority) {
        return false;
      }

      return true;
    });
  }, [data.tasks, filters]);

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
          <TaskCard key={task.id} task={task} projectId={data.id} />
        ))}
      </div>
    </Stack>
  );
}
