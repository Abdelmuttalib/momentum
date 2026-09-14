import { AppLayout } from "@/components/layout/app-layout";
import { Stack } from "@/components/page-components";
import { Seo } from "@/components/seo";
import { TaskEditView } from "@/components/views/project/tasks/task-edit-view";
import { useProjectTask } from "@/features/projects/hooks/use-tasks";
import { useRouter } from "next/router";
import { requireAuthPage } from "@/server/auth-guard";
import { type GetServerSideProps } from "next";

export default function EditTaskPage() {
  const { query } = useRouter();
  const projectId = query.projectId as string;
  const taskId = query.taskId as string;

  const { data: task, isLoading, error } = useProjectTask(taskId);

  return (
    <>
      <Seo title={`Edit Task | Momentum`} />

      <AppLayout>
        <Stack spacing="section">
          <TaskEditView
            task={task}
            isLoading={isLoading}
            error={error}
            projectId={projectId}
          />
        </Stack>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuthPage();
