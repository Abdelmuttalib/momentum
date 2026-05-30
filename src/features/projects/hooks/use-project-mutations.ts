import { api } from "@/lib/api";

// features/project/hooks/use-create-project.ts
import { useAppMutation } from "@/hooks/use-app-mutation";

export function useCreateProject() {
  const utils = api.useUtils();

  return useAppMutation(
    api.project.create.useMutation({
      onSuccess: async () => {
        await utils.project.invalidate();
      },
    }),
    {
      successMessage: "project created successfully",
      errorMessage: "Failed to create project",
      redirectTo: () => `/projects`,
    }
  );
}

export function useUpdateProject() {
  const utils = api.useUtils();

  return useAppMutation(
    api.project.update.useMutation({
      onSuccess: async () => {
        await utils.project.invalidate();
      },
    }),
    {
      successMessage: "project updated successfully",
      errorMessage: "Failed to update project",
      redirectTo: (project) => `/projects/${project.id}`,
    }
  );
}
