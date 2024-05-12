/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import {
  DialogContent,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/animated-dialog";
import { Typography } from "@/components/ui/typography";

const teamFormSchema = z.object({
  name: z.string().min(1, "Please enter a team name").nonempty(),
});

type TTeamForm = z.infer<typeof teamFormSchema>;

interface CreateTeamFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

function CreateTeamForm({ onCancel, onSuccess }: CreateTeamFormProps) {
  const apiContext = api.useContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TTeamForm>({
    resolver: zodResolver(teamFormSchema),
  });

  const createTeamMutation = api.team.createTeam.useMutation({
    onSuccess: async () => {
      // Handle the new team. For example, you could redirect to the team's page
      await apiContext.team.getAllTeamsByCompanyId.invalidate();
      onSuccess();
      reset();
      toast.success("New team created!");
    },
    onError: () => {
      toast.error("Failed to create new team");
    },
  });

  async function onCreateTeam(data: TTeamForm): Promise<void> {
    await createTeamMutation.mutateAsync({
      name: data.name,
    });
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onCreateTeam)}>
      <Label htmlFor="name" className="sr-only">
        Team Name:
      </Label>

      <Input
        id="name"
        type="text"
        {...register("name")}
        placeholder="team name"
        inputMode="text"
        error={errors.name}
      />
      <div className="mt-7 flex flex-col-reverse border-t pt-4 md:flex-row md:gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={createTeamMutation.isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={createTeamMutation.isLoading}
          isLoading={createTeamMutation.isLoading}
        >
          Create Team
        </Button>
      </div>
    </form>
  );
}
// interface CreateNewTeamDialogProps {}

export default function CreateTeam() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        leftIcon={<PlusIcon className="w-4" />}
        className="ml-2 inline-flex gap-1 whitespace-nowrap"
      >
        Create Team
      </Button>

      <DialogRoot open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogPortal>
          <DialogContent>
            <DialogTitle>
              <Typography as="h2" variant="lg/semibold">
                Create a new Team
              </Typography>
            </DialogTitle>
            <Typography as="p" className="text-foreground-light">
              Teams are a great way to organize your projects and invite other
              users
            </Typography>

            <div className="mt-4">
              <CreateTeamForm
                onSuccess={() => setIsOpen(false)}
                onCancel={() => setIsOpen(false)}
              />
            </div>
            {/* <div className="mt-6">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Create Project
                </Button>

                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
              </div> */}
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
    </>
  );
}
