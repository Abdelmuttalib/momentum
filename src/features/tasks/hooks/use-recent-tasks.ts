import { api } from "@/lib/api";

export function useRecentTasks({ companyId }: { companyId: string }) {
  return api.task.getRecentTasks.useQuery(
    {
      companyId,
    },
    {
      enabled: !!companyId,
    }
  );
}
