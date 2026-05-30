// import { useQuery } from "@tanstack/react-query";
// const { data: projects } = api.project.getAllProjectsByTeamId.useQuery({
//   teamId: teamId,
// });

import { api } from "@/lib/api";
import { type Project } from "@prisma/client";
import { type UseQueryResult } from "@tanstack/react-query";

export function useTaskComments(taskId: string) {
  return api.task.getTaskComments.useQuery(
    {
      taskId,
    },
    {
      enabled: !!taskId,
    }
  );
}

export function useProject(projectId: string): UseQueryResult<Project> {
  return api.project.getProject.useQuery<Project>(
    {
      projectId,
    },
    {
      enabled: !!projectId,
    }
  );
}
