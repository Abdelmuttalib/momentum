import { api } from "@/lib/api";

export function useProjects(companyId: string) {
  return api.project.getProjects.useQuery(
    {
      companyId,
    },
    {
      enabled: !!companyId,
    }
  );
}

export function useProject(projectId: string) {
  return api.project.getProject.useQuery(
    {
      projectId,
    },
    {
      enabled: !!projectId,
    }
  );
}
