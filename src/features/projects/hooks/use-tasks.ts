import { api } from "@/lib/api";

export function useProjectTasks(projectId: string) {
  return api.project.getProjectTasks.useQuery(
    {
      projectId,
    },
    {
      enabled: !!projectId,
    }
  );
}

export function useTask(taskId: string) {
  return api.project.getProjectTask.useQuery(
    {
      taskId,
    },
    {
      enabled: !!taskId,
    }
  );
}
