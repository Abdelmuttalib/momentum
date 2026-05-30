import { api } from "@/lib/api";

// features/task/hooks/use-create-task.ts
import { useAppMutation } from "@/hooks/use-app-mutation";

export function useCreateTask() {
  const utils = api.useUtils();

  return useAppMutation(
    api.task.create.useMutation({
      onSuccess: async () => {
        await utils.task.invalidate();
      },
    }),
    {
      successMessage: "Task created successfully",
      errorMessage: "Failed to create task",
      redirectTo: (task) => `/projects/${task.projectId}/tasks/${task.id}`,
    }
  );
}

export function useUpdateTask() {
  const utils = api.useUtils();

  return useAppMutation(
    api.task.update.useMutation({
      onSuccess: async () => {
        await utils.task.invalidate();
      },
    }),
    {
      successMessage: "Task updated successfully",
      errorMessage: "Failed to update task",
      redirectTo: (task) => `/projects/${task.projectId}/tasks/${task.id}`,
    }
  );
}

export function useAddTaskComment() {
  const utils = api.useUtils();

  return useAppMutation(
    api.task.addComment.useMutation({
      onSuccess: async () => {
        await utils.task.invalidate();
        await utils.task.getTaskComments.invalidate();
      },
    }),
    {
      successMessage: "Comment added successfully",
      errorMessage: "Failed to add comment",
      // redirectTo
    }
  );
}

export function useDeleteTaskComment() {
  const utils = api.useUtils();

  return useAppMutation(
    api.task.deleteComment.useMutation({
      onSuccess: async () => {
        await utils.task.invalidate();
      },
    }),
    {
      successMessage: "Comment deleted successfully",
      errorMessage: "Failed to delete comment",
      // redirectTo
    }
  );
}
