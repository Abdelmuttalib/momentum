import { DataLoader } from "@/components/data-loader";
import { AppLayout } from "@/components/layout/app-layout";
import { CompactPageHeader } from "@/components/common/page-header";
import { Seo } from "@/components/seo";
import { CreateTask } from "@/components/views/project/tasks/forms/create-task";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { useSession } from "next-auth/react";
import { TaskFilterView } from "@/features/tasks/components/task-filter-view";
import { DataTable } from "@/components/ui/data-table";
import { ViewModeContainer } from "@/components/common/view-mode-container";
import { requireAuthPage } from "@/server/auth-guard";
import { type GetServerSideProps } from "next";
import { useTranslations } from "next-intl";
import { getTasksColumns } from "@/features/tasks/components/tasks-columns";

export default function TasksPage() {
  const { data: session } = useSession();
  const t = useTranslations("tasks");
  const companyId = session?.user?.company.id;

  const { data: tasks, isLoading: isLoadingTasks, error: tasksError } = useTasks({
    companyId: companyId,
  });

  const { data: projects } = useProjects(companyId);

  return (
    <>
      <Seo title="Tasks" />

      <AppLayout>
        <div className="space-y-6">
          <CompactPageHeader
            title={t("title")}
            description={
              tasks?.length
                ? t("countAcross", {
                    tasks: tasks.length,
                    projects: projects?.length ?? 0,
                  })
                : undefined
            }
            actions={projects && <CreateTask projects={projects} />}
          />

          <DataLoader data={tasks} isLoading={isLoadingTasks} error={tasksError}>
            {(data) => (
              <ViewModeContainer
                defaultView="table"
                table={
                  <DataTable columns={getTasksColumns(projects, t)} data={data} />
                }
                cards={<TaskFilterView tasks={data} />}
              />
            )}
          </DataLoader>
        </div>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuthPage();
