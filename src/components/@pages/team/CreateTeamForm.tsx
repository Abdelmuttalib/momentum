import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import cn from "@/utils/cn";
import type { User } from "@prisma/client";

const teamFormSchema = z.object({
  name: z.string().min(1, "Please enter a team name").nonempty(),
});

type TTeamForm = z.infer<typeof teamFormSchema>;

interface CreateTeamFormProps {
  onCancel: () => void;
  organizationId: User["organizationId"];
}

export default function CreateTeamForm({
  onCancel,
  organizationId,
}: CreateTeamFormProps) {
  const apiContext = api.useContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TTeamForm>({
    resolver: zodResolver(teamFormSchema),
  });

  const createTeamMutation = api.team.admin.createTeam.useMutation({
    onSuccess: async () => {
      // Handle the new team. For example, you could redirect to the team's page
      await apiContext.team.admin.getAllTeamsByOrganization.invalidate();
      onCancel();
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
      organizationId,
    });
    // Handle the new team. For example, you could redirect to the team's page
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onCreateTeam)}>
      <Label htmlFor="name">
        Team Name:
        <Input
          id="name"
          type="text"
          {...register("name")}
          placeholder="team name"
          inputMode="text"
          className={cn({
            "border-red-500": errors.name,
          })}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </Label>
      <div className="flex flex-col-reverse md:flex-row md:gap-2">
        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" className="mt-2 flex-1">
          Create Team
        </Button>
      </div>
    </form>
  );
}
