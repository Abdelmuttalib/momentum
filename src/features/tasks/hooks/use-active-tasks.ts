import { api } from "@/lib/api";

export function useActiveTasks({ companyId }: { companyId: string }) {
  return api.task.getActiveTasks.useQuery(
    {
      companyId,
    },
    {
      enabled: !!companyId,
    }
  );
}
