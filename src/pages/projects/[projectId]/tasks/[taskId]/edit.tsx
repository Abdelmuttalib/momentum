import { DataLoader } from "@/components/data-loader";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader, Stack } from "@/components/page-components";
import { Seo } from "@/components/seo";
import { TaskForm } from "@/components/views/project/tasks/forms/task-form";
import { useTask } from "@/features/projects/hooks/use-tasks";
import { useUpdateTask } from "@/features/tasks/hooks/use-task-mutations";
import { type TaskFormSchemaType } from "@/schema";
import { useRouter } from "next/router";

export default function EditTaskPage() {
  const { query } = useRouter();
  const projectId = query.projectId as string;
  const taskId = query.taskId as string;

  const { data: task, isLoading } = useTask(taskId);

  const { execute, isPending } = useUpdateTask();

  async function handleSubmit(data: TaskFormSchemaType) {
    await execute(
      {
        id: taskId,
        ...data,
      },
      {
        redirectTo: `/projects/${projectId}/tasks/${taskId}`,
      }
    );
  }

  return (
    <>
      <Seo title={`Edit Task | Momentum`} />

      <AppLayout>
        <Stack spacing="section">
          <PageHeader title="Edit Task" />
          <DataLoader data={task} isLoading={isLoading} error={null}>
            {(data) => (
              <div>
                <TaskForm
                  onSubmit={(data) => {
                    void handleSubmit(data);
                  }}
                  projectId={projectId}
                  defaultValues={data}
                  isPending={isPending}
                  mode="edit"
                />
              </div>
            )}
          </DataLoader>
        </Stack>
      </AppLayout>
    </>
  );
}
