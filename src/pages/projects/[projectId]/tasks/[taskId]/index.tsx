// app/projects/[projectId]/tasks/[taskId]/page.tsx

import { useRouter } from "next/router";
import { useProjectTask } from "@/features/projects/hooks/use-tasks";
import { useProject } from "@/features/projects/hooks/use-projects";
import { AppLayout } from "@/components/layout/app-layout";
import { DataLoader } from "@/components/data-loader";
import { TaskDetailView } from "@/components/views/project/tasks/task-detail-view";
import { routes } from "@/lib/routes";
import { requireAuthPage } from "@/server/auth-guard";
import { type GetServerSideProps } from "next";

export default function ProjectTaskPage() {
  const { query } = useRouter();
  const projectId = query.projectId as string;
  const taskId = query.taskId as string;
  const { data: task, isLoading, error } = useProjectTask(taskId);
  const { data: project } = useProject(projectId);

  return (
    <>
      <AppLayout>
        <DataLoader data={task} isLoading={isLoading} error={error}>
          {(data) => (
            <TaskDetailView
              task={data}
              projectName={project?.name}
              editHref={routes.projects.tasks.edit({
                projectId: data.projectId,
                taskId: data.id,
              })}
            />
          )}
        </DataLoader>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuthPage();
