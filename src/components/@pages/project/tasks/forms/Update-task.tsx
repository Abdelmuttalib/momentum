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
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { Priority, TaskStatus } from "@/utils/enums";
import {
  getTaskPriorityBadgeColor,
  getTaskStatusBadgeColor,
} from "@/utils/getBadgeColor";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Task } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

export default function UpdateTaskForm({
  onSuccess,
  onCancel,
  task,
}: {
  onSuccess: () => void;
  onCancel: () => void;
  task: Task;
}) {
  const apiContext = api.useContext();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TTaskForm>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task.title,
      ...(task.description ? { description: task.description } : {}),
      status: task.status as TaskStatus,
      priority: task.priority as Priority,
    },
  });

  const updateTaskMutation = api.task.update.useMutation({
    onSuccess: async () => {
      // Handle the new team. For example, you could redirect to the team's page
      onSuccess();
      await apiContext.task.getAllProjectTasks.invalidate();
      // reset();
      toast.success("Task updated successfully");
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });

  async function onUpdateTask(data: TTaskForm): Promise<void> {
    await updateTaskMutation.mutateAsync({
      ...data,
      id: task.id,
    });
  }

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onUpdateTask)}
      className="flex flex-col gap-2"
    >
      <div>
        <Label htmlFor="title">Task title:</Label>
        <Input
          id="title"
          type="text"
          {...register("title")}
          placeholder="task title"
          inputMode="text"
          error={errors.title}
        />
      </div>
      <div>
        <Label htmlFor="description">Task description:</Label>
        <Input
          id="description"
          type="text"
          {...register("description")}
          placeholder="task description"
          inputMode="text"
          className={cn({
            "border-red-500": errors.title,
          })}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>
      {/* Status Select */}
      <div className="grid grid-cols-1 gap-x-2 md:grid-cols-2">
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
            <p className="text-red-500">{errors.priority.message}</p>
          )}
        </div>
      </div>
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

      <div className="mt-4 flex flex-col-reverse md:flex-row md:gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Save Changes
        </Button>
      </div>
    </form>
  );
}
