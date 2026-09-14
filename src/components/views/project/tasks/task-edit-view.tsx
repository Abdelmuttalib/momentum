import { DataLoader } from "@/components/data-loader";
import { PageHeader } from "@/components/page-components";
import { TaskForm } from "@/components/views/project/tasks/forms/task-form";
import { useUpdateTask } from "@/features/tasks/hooks/use-task-mutations";
import { type TaskFormSchemaType } from "@/schema";
import { type RouterOutputs } from "@/lib/api";
import { useTranslations } from "next-intl";

type EditableTask = NonNullable<
  RouterOutputs["project"]["getProjectTask"]
>;

export type TaskEditViewProps = {
  task: EditableTask | null | undefined;
  isLoading: boolean;
  error: unknown;
  projectId: string;
};

export function TaskEditView({
  task,
  isLoading,
  error,
  projectId,
}: TaskEditViewProps) {
  const t = useTranslations("projects");
  const { execute, isPending } = useUpdateTask();

  async function handleSubmit(taskId: string, data: TaskFormSchemaType) {
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
    <div className="flex flex-col gap-4">
      <PageHeader title={t("editTask")} />
      <DataLoader data={task} isLoading={isLoading} error={error}>
        {(data) => (
          <TaskForm
            onSubmit={(formData) => void handleSubmit(data.id, formData)}
            projectId={projectId}
            defaultValues={{
              title: data.title,
              description: data.description ?? undefined,
              status: data.status,
              priority: data.priority,
              effortPoints: (data.effortPoints ??
                undefined) as TaskFormSchemaType["effortPoints"],
              dueDate: data.dueDate ?? undefined,
              assigneeId: data.assigneeId ?? undefined,
              labels: data.labels?.map((label) => label.id).join(",") ?? "",
              projectId: data.projectId,
            }}
            isPending={isPending}
            mode="edit"
          />
        )}
      </DataLoader>
    </div>
  );
}
