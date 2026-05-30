import { api } from "@/lib/api";

export function useInvites({ companyId }: { companyId: string }) {
  return api.company.getAllInvitations.useQuery(
    {
      companyId,
    },
    {
      enabled: !!companyId,
    }
  );
}
