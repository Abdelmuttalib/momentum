import { api } from "@/lib/api";

export function useTasks({ companyId }: { companyId: string }) {
  return api.task.getTasks.useQuery(
    {
      companyId,
    },
    {
      enabled: !!companyId,
    }
  );
}

export function useTask({
  taskId,
  companyId,
}: {
  taskId: string;
  companyId: string;
}) {
  return api.task.getTask.useQuery(
    {
      taskId,
      companyId,
    },
    {
      enabled: !!taskId,
    }
  );
}
