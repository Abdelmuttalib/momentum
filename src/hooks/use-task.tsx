import { createTaskFormSchema, type CreateTaskSchemaType } from "@/schema";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useFormErrorToast } from "./use-form-error-toast";

interface CreateTaskOptions {
  onSuccess: () => void;
  onCancel: () => void;
  onError: () => void;
  teamId: string;
  projectId: string;
  defaultValues: CreateTaskSchemaType;
}

export function useCreateTask({
  onSuccess,
  onError,
  onCancel,
  teamId,
  projectId,
  defaultValues,
}: CreateTaskOptions) {
  const apiContext = api.useContext();

  const form = useForm<CreateTaskSchemaType>({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues,
  });

  console.log(form.formState.errors);

  const mutation = api.task.create.useMutation({
    onSuccess: async () => {
      // Handle the new team. For example, you could redirect to the team's page
      onSuccess();
      await apiContext.task.getAllProjectTasks.invalidate();
      form.reset();
      toast.success("New task created!");
    },
    onError: () => {
      toast.error("Failed to create new task");
      onError?.();
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    console.log("Form submitted", data);
    await mutation.mutateAsync({
      ...data,
      projectId,
      teamId,
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
