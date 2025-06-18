import { createLabelFormSchema, type CreateLabelSchemaType } from "@/schema";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useFormErrorToast } from "./use-form-error-toast";

interface CreateLabelOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

export function useCreateLabel({ onSuccess, onError }: CreateLabelOptions) {
  const apiContext = api.useContext();

  const form = useForm<CreateLabelSchemaType>({
    resolver: zodResolver(createLabelFormSchema),
  });

  const mutation = api.task.createLabel.useMutation({
    onSuccess: async () => {
      // Handle the new team. For example, you could redirect to the team's page
      await apiContext.task.getLabels.invalidate();
      onSuccess();
      toast.success("Label created successfully");
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast.error("Error creating label");
      onError?.();
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    console.log("Form submitted", data);
    await mutation.mutateAsync(data);
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

export type UseCreateLabelReturnType = ReturnType<typeof useCreateLabel>;
