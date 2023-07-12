import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { useState, type Dispatch, type SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectStatus } from "@prisma/client";
import { PlusIcon } from "@heroicons/react/20/solid";
import Badge from "@/components/ui/badge";
import { getProjectStatusBadgeColor } from "@/utils/getBadgeColor";

const projectFormSchema = z.object({
  name: z.string().min(1, "Please enter a team name").nonempty(),
  status: z.nativeEnum(ProjectStatus),
});

type TProjectForm = z.infer<typeof projectFormSchema>;

export function CreateProjectForm({
  setIsOpen,
  onCancel,
  teamId,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onCancel: () => void;
  teamId: string;
}) {
  const apiContext = api.useContext();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TProjectForm>({
    resolver: zodResolver(projectFormSchema),
  });

  const createProjectMutation = api.project.createProject.useMutation({
    onSuccess: async () => {
      // Handle the new team. For example, you could redirect to the team's page
      setIsOpen(false);
      await apiContext.project.getAllProjectsByTeam.invalidate();
      reset();
      toast.success("New project created!");
    },
    onError: () => {
      toast.error("Failed to create new project");
    },
  });

  async function onCreateProject(data: TProjectForm): Promise<void> {
    await createProjectMutation.mutateAsync({
      name: data.name,
      teamId: teamId,
      status: data.status,
    });
  }

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onCreateProject)}
      className="flex flex-col gap-2"
    >
      <div>
        <Label htmlFor="name">Project Name:</Label>
        <Input
          id="name"
          type="text"
          {...register("name")}
          placeholder="project name"
          inputMode="text"
          className={cn({
            "border-red-500": errors.name,
          })}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      {/* Status Select */}
      <div>
        <Label htmlFor="status">Project Status: </Label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select {...field} onValueChange={(value) => field.onChange(value)}>
              <SelectTrigger className="w-full text-gray-800">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  {Object.values(ProjectStatus).map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="capitalize"
                    >
                      <Badge
                        color={getProjectStatusBadgeColor(status)}
                        className="capitalize"
                      >
                        {status.replace("_", " ").toLocaleLowerCase()}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.status && (
          <p className="text-red-500">{errors.status.message}</p>
        )}
      </div>

      <div className="flex flex-col-reverse md:flex-row md:gap-2 lg:w-full lg:justify-end">
        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={onCancel}
          disabled={createProjectMutation.isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="mt-2 flex-1 lg:flex-initial"
          disabled={createProjectMutation.isLoading}
          isLoading={createProjectMutation.isLoading}
        >
          Create Project
        </Button>
      </div>
    </form>
  );
}

export default function CreateProjectDialog({ teamId }: { teamId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="ml-2 inline-flex gap-1 whitespace-nowrap">
          <PlusIcon className="w-5" /> Create Project
        </Button>
      </DialogTrigger>
      {isOpen && (
        <DialogContent className="mt-10 bg-white sm:max-w-lg">
          <DialogHeader className="space-y-0">
            <DialogTitle>
              <h2 className="h5 inline">Create a new Project</h2>
            </DialogTitle>
            <DialogDescription className="body-sm inline text-gray-600">
              <p>
                Projects are where you manage your team&apos;s work. Each
                project has its own board and issues.
              </p>
            </DialogDescription>
          </DialogHeader>
          {/* <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='name' className='text-right'>
              Name
            </label>
            <Input id='name' value='Pedro Duarte' className='col-span-3' />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='username' className='text-right'>
              Username
            </label>
            <Input id='username' value='@peduarte' className='col-span-3' />
          </div>
        </div> */}
          <CreateProjectForm
            teamId={teamId}
            setIsOpen={setIsOpen}
            onCancel={() => setIsOpen(false)}
          />
        </DialogContent>
      )}
    </Dialog>
  );
}
