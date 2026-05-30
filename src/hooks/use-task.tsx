import { taskFormSchema, type TaskFormSchemaType } from "@/schema";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useFormErrorToast } from "./use-form-error-toast";

interface CreateTaskOptions {
  onSuccess: () => void;
  onCancel: () => void;
  onError: () => void;
  projectId: string;
  defaultValues: TaskFormSchemaType;
}

export function useCreateTask({
  onSuccess,
  onError,
  onCancel,
  projectId,
  defaultValues,
}: CreateTaskOptions) {
  const apiContext = api.useContext();

  const form = useForm<TaskFormSchemaType>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  });

  const mutation = api.task.create.useMutation({
    onSuccess: async () => {
      // Handle the new team. For example, you could redirect to the team's page
      onSuccess();
      await apiContext.task.getAllProjectTasks.invalidate({
        projectId,
      });
      form.reset();
      toast.success("New task created!");
    },
    onError: () => {
      toast.error("Failed to create new task");
      onError?.();
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutation.mutateAsync({
      ...data,
      projectId,
    });
  });

  useFormErrorToast({
    errors: form.formState.errors,
    touchedFields: form.formState.touchedFields,
  });

  return {
    form,
    handleSubmit,
    mutation,
  };
}

export type UseCreateTaskReturnType = ReturnType<typeof useCreateTask>;
