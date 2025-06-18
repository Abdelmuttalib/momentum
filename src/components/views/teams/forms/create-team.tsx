import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { DialogForm } from "@/components/common/dialog-form";
import { useCreateTeam } from "@/hooks/use-team";
import { toast } from "sonner";

interface CreateTeamFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateTeamForm({
  // form,
  // handleSubmit,
  // mutation,

  onSuccess,
  onCancel,
}: CreateTeamFormProps) {
  const { form, handleSubmit, mutation } = useCreateTeam({
    onSuccess,
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            {...form.register("name")}
            inputMode="text"
            placeholder="e.g. Engineering, Design, Marketing"
            data-invalid={form.formState.errors.name?.message}
            disabled={mutation.isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...form.register("description")}
            inputMode="text"
            placeholder="What does this team work on?"
            data-invalid={form.formState.errors.description?.message}
            disabled={mutation.isLoading}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col-reverse border-t pt-4 md:flex-row md:gap-2">
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
          Create Team
        </Button>
      </div>
    </form>
  );
}

export function CreateTeam() {
  return (
    <>
      <DialogForm
        title="Create a new Team"
        description="Teams are a great way to organize your projects and invite other users"
        triggerButton={
          <Button
            type="button"
            className="ml-2 inline-flex gap-1 whitespace-nowrap"
          >
            <PlusIcon className="w-4" />
            Create Team
          </Button>
        }
        dialogContentClassName="sm:max-w-md"
      >
        {({ onClose }) => (
          <CreateTeamForm
            onSuccess={() => {
              toast.success("Team created successfully");
              onClose();
            }}
            onCancel={onClose}
          />
        )}
      </DialogForm>
    </>
  );
}
