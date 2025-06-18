import {
  createProjectFormSchema,
  type CreateProjectSchemaType,
} from "@/schema";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useFormErrorToast } from "./use-form-error-toast";
import React from "react";

interface CreateProjectOptions {
  onSuccess?: () => void;
  onError?: () => void;
  teamId: string;
}

export function useCreateProject({
  onSuccess,
  onError,
  teamId,
}: CreateProjectOptions) {
  const apiContext = api.useContext();

  console.log("createProjectFormSchema", onSuccess, onError, teamId);

  const form = useForm<CreateProjectSchemaType>({
    resolver: zodResolver(createProjectFormSchema),
  });

  React.useEffect(() => {
    form.setValue("teamId", teamId);
  }, [teamId, form]);

  console.log("formState.errors", form.formState.errors);

  const mutation = api.project.createProject.useMutation({
    onSuccess: async () => {
      // Handle the new team. For example, you could redirect to the team's page
      toast.success("New project created!");
      await apiContext.project.getAllProjectsByTeamId.invalidate({
        teamId: teamId,
      });
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to create new project");
      onError?.();
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    console.log("Form submitted", data);
    await mutation.mutateAsync({
      ...data,
      teamId: teamId,
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

export type UseCreateProjectReturnType = ReturnType<typeof useCreateProject>;
