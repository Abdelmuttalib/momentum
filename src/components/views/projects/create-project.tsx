import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useCreateProject } from "@/hooks/use-project";
import { DialogForm } from "@/components/common/dialog-form";
import { toast } from "sonner";

interface CreateProjectFormProps {
  onSuccess: () => void;
  onError: () => void;
  onCancel: () => void;
  teamId: string;
}

export function CreateProjectForm({
  onSuccess,
  onError,
  onCancel,
  teamId,
}: CreateProjectFormProps) {
  const { form, handleSubmit, mutation } = useCreateProject({
    onSuccess,
    onError,
    teamId,
  });

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            type="text"
            {...form.register("name")}
            placeholder="project name"
            inputMode="text"
            disabled={mutation.isLoading}
            data-invalid={form.formState.errors.name?.message}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Project Description</Label>
          <Input
            id="description"
            type="text"
            {...form.register("description")}
            placeholder="project description"
            inputMode="text"
            disabled={mutation.isLoading}
            data-invalid={form.formState.errors.description?.message}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="teamId">Team ID</Label>
          <Input
            id="teamId"
            type="text"
            {...form.register("teamId")}
            placeholder="team id"
            inputMode="text"
            value={teamId.toString()}
            defaultValue={teamId.toString()}
            disabled={!!teamId}
            data-invalid={form.formState.errors.teamId?.message}
          />
        </div>

        <div className="mt-4 flex flex-col-reverse border-t md:flex-row md:gap-2 lg:w-full lg:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={mutation.isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={mutation.isLoading}
            isLoading={mutation.isLoading}
          >
            Create Project
          </Button>
        </div>
      </div>
    </form>
  );
}

export function CreateProject({ teamId }: { teamId: string }) {
  return (
    <>
      <DialogForm
        title="Create a new Project"
        description="Projects are where you manage your team's work. Each project has its own board and issues."
        triggerButton={
          <Button
            type="button"
            className="ml-2 inline-flex gap-1 whitespace-nowrap"
          >
            <PlusIcon className="w-4" />
            Create Project
          </Button>
        }
        dialogContentClassName="sm:max-w-md"
      >
        {({ onClose }) => (
          <CreateProjectForm
            onSuccess={() => {
              // toast.success("Project created successfully");
              onClose();
            }}
            onCancel={onClose}
            onError={() => {
              // toast.error("Failed to create project");
              onClose();
            }}
            teamId={teamId}
          />
        )}
      </DialogForm>
    </>
  );
}
