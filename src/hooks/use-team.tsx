import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { createTeamFormSchema, type CreateTeamSchemaType } from "@/schema";
import { useFormErrorToast } from "./use-form-error-toast";

interface CreateTeamOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

export function useCreateTeam({ onSuccess, onError }: CreateTeamOptions = {}) {
  const apiContext = api.useContext();

  const form = useForm<CreateTeamSchemaType>({
    resolver: zodResolver(createTeamFormSchema),
  });

  const mutation = api.team.createTeam.useMutation({
    // ...mutationOptions,
    onSuccess: async () => {
      await apiContext.team.getAllTeamsByCompanyId.invalidate();
      toast.success("Team created!");
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to create team.");
      onError?.();
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    console.log("data", data);
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

export type UseCreateTeamReturnType = ReturnType<typeof useCreateTeam>;

/* Similar structure can be used for updateTeam, deleteTeam, etc. */

export function useTeam() {
  return {};
}
