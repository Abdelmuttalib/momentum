import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader, Stack } from "@/components/page-components";
import { Seo } from "@/components/seo";
import { ProjectForm } from "@/features/projects/forms/project-form";
import { useCreateProject } from "@/features/projects/hooks/use-project-mutations";
import { type ProjectFormSchemaType } from "@/schema";

export default function NewProjectPage() {
  const { execute, isPending } = useCreateProject();

  async function handleSubmit(data: ProjectFormSchemaType) {
    console.log("data", data);
    await execute({
      name: data.name,
      description: data.description,
    });
  }

  return (
    <>
      <Seo title={`Create Project | Momentum`} />

      <AppLayout>
        <Stack spacing="section">
          <PageHeader title="Create Project" />
          <ProjectForm
            onSubmit={(data) => {
              void handleSubmit(data);
            }}
            onSuccess={() => {
              // handleSubmit(data);
              // toast.success("Project created successfully");
              // onClose();
            }}
            onError={() => {
              // toast.error("Failed to create project");
              // onClose();
            }}
            onCancel={() => {
              // onClose();
            }}
            defaultValues={{}}
            isPending={isPending}
            mode="create"
          />
        </Stack>
      </AppLayout>
    </>
  );
}
