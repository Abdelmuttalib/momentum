import {
  useProject,
  useProjects,
} from "@/features/projects/hooks/use-projects";
import { useRouter } from "next/router";
import { AppLayout } from "@/components/layout/app-layout";
import { Seo } from "@/components/seo";

import { Button } from "@/components/ui/button";
import { DataLoader } from "@/components/data-loader";
import { Stack } from "@/components/page-components";
import { CompactPageHeader } from "@/components/common/page-header";
import { Heading, Text } from "@/components/typography";
import { Progress } from "@/components/ui/progress";
import { TaskCard } from "@/features/tasks/components/task-card";
import { CreateTask } from "@/components/views/project/tasks/forms/create-task";
import { useSession } from "next-auth/react";
import { CBadge } from "@/components/common/cbadge";
import { ButtonLink } from "@/components/common/button-link";
import { routes } from "@/lib/routes";

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
          <CompactPageHeader
            title={project?.name ?? "Project"}
            description={
              project?.description || "No project description provided."
            }
            actions={
              <>
                <ButtonLink
                  href={routes.projects.tasks.index({ projectId })}
                  size="sm"
                >
                  Open board
                </ButtonLink>
                <ButtonLink
                  href={routes.projects.edit({ projectId })}
                  variant="outline"
                  size="sm"
                >
                  Edit
                </ButtonLink>
                <CreateTask
                  projectId={projectId}
                  projects={projects}
                  triggerButton={
                    <Button size="sm" variant="outline">
                      Add Task
                    </Button>
                  }
                />
              </>
            }
          />

          <DataLoader data={project} isLoading={isLoading} error={error}>
            {(data) => (
              <Stack spacing="section">
                <ProjectProgressSummary
                  tasks={data.tasks}
                  updatedAt={data.updatedAt}
                />

                {/* Tasks */}
                <section className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Heading level="subsection">Tasks</Heading>
                      <CBadge color="gray" size="sm">
                        {data?.tasks?.length}{" "}
                        {data.tasks.length === 1 ? "Task" : "Tasks"}
                      </CBadge>
                    </div>
                    <Text size="sm" tone="muted">
                      Manage and track all project tasks.
                    </Text>
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

function ProjectProgressSummary({
  tasks,
  updatedAt,
}: {
  tasks: { status: string }[];
  updatedAt: Date;
}) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "COMPLETED").length;
  const active = tasks.filter(
    (t) => t.status === "TO_DO" || t.status === "IN_PROGRESS"
  ).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-muted/40 p-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <Text size="sm" weight="medium">
          {done}/{total} done
        </Text>
        <Text size="sm" tone="muted">
          {active} active
        </Text>
        <Text size="xs" tone="muted" className="ml-auto">
          Updated {formatDistanceToNow(updatedAt)}
        </Text>
      </div>
      <Progress value={percent} className="h-1.5" />
    </div>
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

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {filteredTasks?.map((task) => (
          <TaskCard key={task.id} task={task} projectId={data.id} />
        ))}
      </div>
    </Stack>
  );
}
