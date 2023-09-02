import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/components/user/UserMenu";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { Priority } from "@/utils/enums";
import {
  getTaskPriorityBadgeColor,
  getTaskStatusBadgeColor,
} from "@/utils/getBadgeColor";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import CreateLabel from "./create-label";
import { PlusIcon } from "lucide-react";
import { TaskStatus } from "@prisma/client";

const taskFormSchema = z.object({
  title: z.string().min(1, "Please enter a team name").nonempty(),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(Priority),
  dueDate: z.date().optional(),
  assigneeId: z.string().optional(),
  labels: z.string(),
});

type TTaskForm = z.infer<typeof taskFormSchema>;

function CreateTaskForm({
  onSuccess,
  onCancel,
  defaultValues,
}: {
  onSuccess: () => void;
  onCancel: () => void;
  defaultValues: TTaskForm;
}) {
  const { query } = useRouter();
  const teamId = query.teamId as string;
  const projectId = query.projectId as string;
  const trpc = api.useContext();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TTaskForm>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  });

  const createTaskMutation = api.task.create.useMutation({
    onSuccess: async () => {
      // Handle the new team. For example, you could redirect to the team's page
      onSuccess();
      await trpc.task.getAllProjectTasks.invalidate();
      reset();
      toast.success("New task created!");
    },
    onError: () => {
      toast.error("Failed to create new task");
    },
  });

  async function onCreateProject(data: TTaskForm): Promise<void> {
    await createTaskMutation.mutateAsync({
      ...data,
      projectId,
      teamId,
    });
  }

  const { data: teamMembers } = api.team.getTeamMembers.useQuery(
    {
      teamId,
    },
    {
      enabled: !!teamId,
    }
  );

  const { data: taskLabels } = api.task.getLabels.useQuery();

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onCreateProject)}
      className="flex flex-col gap-5"
    >
      <div>
        <Label htmlFor="title" className="sr-only">
          Task title:
        </Label>
        <Input
          id="title"
          type="text"
          {...register("title")}
          placeholder="task title"
          variant="outline"
          inputMode="text"
          className={cn("h-16 border-b bg-white text-2xl text-gray-800")}
          error={errors.title}
        />
      </div>
      <div>
        <Label htmlFor="description">Task description:</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="task description"
          inputMode="text"
          className={cn("h-10 text-lg text-gray-500", {
            "border-red-500": errors.title,
          })}
          // error={errors.description}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>
      {/* Status Select */}
      <div className="grid w-full grid-cols-1 gap-x-3 gap-y-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="status">Project Status: </Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => field.onChange(value as TaskStatus)}
              >
                <SelectTrigger className="w-full text-gray-800">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    {Object.values(TaskStatus).map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="capitalize"
                      >
                        <Badge color={getTaskStatusBadgeColor(status)}>
                          {status.replace("_", " ")}
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

        {/* Priority Select */}
        <div>
          <Label htmlFor="priority">Task priority: </Label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => field.onChange(value as Priority)}
              >
                <SelectTrigger className="w-full text-gray-800">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    {Object.values(Priority).map((priorityStatus) => (
                      <SelectItem
                        key={priorityStatus}
                        value={priorityStatus}
                        className="capitalize"
                      >
                        <Badge
                          color={getTaskPriorityBadgeColor(priorityStatus)}
                        >
                          {priorityStatus.replace("_", " ")}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.priority && (
            <p className="text-red-500">{errors.priority?.message}</p>
          )}
        </div>

        <div className="flex items-center gap-x-2">
          <div>
            <Label htmlFor="labels">Label: </Label>
            <Controller
              name="labels"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select labels" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      {taskLabels?.map((taskLabel) => (
                        <SelectItem
                          key={taskLabel.id}
                          value={taskLabel.id}
                          className="capitalize"
                        >
                          <span className="flex items-center gap-x-1.5 capitalize">
                            <span
                              className="h-2 w-2 rounded"
                              style={{
                                backgroundColor: taskLabel.color,
                              }}
                            ></span>
                            <span>{taskLabel.name}</span>
                          </span>
                          {/* <Badge
                            color={getTaskPriorityBadgeColor(priorityStatus)}
                          >
                            {priorityStatus.replace("_", " ")}
                          </Badge> */}
                        </SelectItem>
                      ))}
                      <div className="my-2 -ml-1">
                        <CreateLabel />
                      </div>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority && (
              <p className="text-red-500">{errors.priority?.message}</p>
            )}
          </div>

          {/* <div className="mt-auto">
            <CreateLabel />
          </div> */}
        </div>
      </div>

      {/* Assign */}
      <div>
        <Label htmlFor="assigneeId">Assignee: </Label>
        <Controller
          name="assigneeId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              onValueChange={(value) => field.onChange(value as Priority)}
            >
              <SelectTrigger className="h-fit w-full text-gray-800">
                <SelectValue placeholder="Assign to..." />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  {teamMembers?.users?.map((user) => (
                    <SelectItem
                      key={user.id}
                      value={user.id}
                      className="capitalize"
                    >
                      <User />
                      {/* {user.firstName} {user.lastName} */}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.priority && (
          <p className="text-red-500">{errors.priority?.message}</p>
        )}
      </div>

      <div className="mt-2 flex flex-col-reverse md:flex-row md:gap-2 lg:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={createTaskMutation.isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 lg:flex-initial"
          disabled={createTaskMutation.isLoading}
          isLoading={createTaskMutation.isLoading}
        >
          Create Task
        </Button>
      </div>
    </form>
  );
}

export default function CreateTask({
  type = "default",
  status,
}: {
  type?: "default" | "column";
  status?: TaskStatus;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {type === "default" ? (
          <Button className="ml-2 inline-flex gap-1 whitespace-nowrap">
            <PlusIcon className="w-5" /> Create Task
          </Button>
        ) : (
          <Button size="icon" variant="outline" className="h-7 w-7">
            <PlusIcon className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      {isOpen && (
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader className="space-y-0">
            <DialogTitle>
              <h2 className="h5 inline">Create a new Task</h2>
            </DialogTitle>
          </DialogHeader>
          <CreateTaskForm
            onSuccess={() => {
              // onSuccess();
              setIsOpen(false);
            }}
            onCancel={() => setIsOpen(false)}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            defaultValues={{
              ...(status && { status }),
            }}
          />
        </DialogContent>
      )}
    </Dialog>
  );
}
