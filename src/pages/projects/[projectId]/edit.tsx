import { DataLoader } from "@/components/data-loader";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader, Stack } from "@/components/page-components";
import { Seo } from "@/components/seo";
import { ProjectForm } from "@/features/projects/forms/project-form";
import { useUpdateProject } from "@/features/projects/hooks/use-project-mutations";
import { useProject } from "@/features/projects/hooks/use-projects";
import { type ProjectFormSchemaType } from "@/schema";
import { useRouter } from "next/router";

export default function EditProjectPage() {
  const { query } = useRouter();
  const projectId = query.projectId as string;
  const { data: project, isLoading } = useProject(projectId);

  const { execute: updateProject, isPending: isUpdatingProject } =
    useUpdateProject();

  async function handleSubmit(data: ProjectFormSchemaType) {
    await updateProject({
      id: projectId,
      ...data,
    });
  }

  return (
    <div>
      <Seo title={`${project?.name ?? "Project"} | Momentum`} />

      <AppLayout>
        <Stack spacing="group">
          <PageHeader title={"Edit Project"} />
          <DataLoader data={project} isLoading={isLoading} error={null}>
            {(data) => (
              <ProjectForm
                onSubmit={(data) => void handleSubmit(data)}
                defaultValues={data}
                isPending={isUpdatingProject}
                mode="edit"
              />
            )}
          </DataLoader>
        </Stack>
      </AppLayout>
    </div>
  );
}
