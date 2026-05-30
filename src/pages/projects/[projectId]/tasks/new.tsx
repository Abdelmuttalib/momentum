import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader, Stack } from "@/components/page-components";
import { Seo } from "@/components/seo";
import { TaskForm } from "@/components/views/project/tasks/forms/task-form";
import { useRouter } from "next/router";

export default function NewTaskPage() {
  const { query } = useRouter();
  const projectId = query.projectId as string;

  console.log("projectId", projectId);
  return (
    <>
      <Seo title={`New Task | Momentum`} />

      <AppLayout>
        <Stack spacing="section">
          <PageHeader title="New Task" />
          <div>
            <TaskForm
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
              onSubmit={(data) => {
                console.log("submit", data);
              }}
            />
          </div>
        </Stack>
      </AppLayout>
    </>
  );
}
