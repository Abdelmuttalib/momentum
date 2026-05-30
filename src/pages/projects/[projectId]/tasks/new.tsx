import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader, Stack } from "@/components/page-components";
import { Seo } from "@/components/seo";
import { TaskForm } from "@/components/views/project/tasks/forms/task-form";
import { useCreateTask } from "@/features/tasks/hooks/use-task-mutations";
import { type TaskFormSchemaType } from "@/schema";
import { useRouter } from "next/router";

export default function NewTaskPage() {
  const { query } = useRouter();
  const projectId = query.projectId as string;

  const { execute: createTask, isPending: isCreatingTask } = useCreateTask();

  async function handleSubmit(data: TaskFormSchemaType) {
    await createTask({
      ...data,
    });
  }

  return (
    <>
      <Seo title={`New Task | Momentum`} />

      <AppLayout>
        <Stack spacing="section">
          <PageHeader title="New Task" />
          <div>
            <TaskForm
              onSubmit={(data) => {
                void handleSubmit(data);
              }}
              onSuccess={() => {
                // toast.success("Task created successfully");
                // onClose();
              }}
              onCancel={() => {
                // onClose();
              }}
              onError={() => {
                // toast.error("Failed to create task");
                // onClose();
              }}
              projectId={projectId}
              defaultValues={{}}
              isPending={isCreatingTask}
              mode="create"
            />
          </div>
        </Stack>
      </AppLayout>
    </>
  );
}
