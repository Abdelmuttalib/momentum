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
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user/user-menu";
import { api } from "@/lib/api";
import { cn } from "@/lib/cn";
import { Priority } from "@/lib/enums";
import { Controller, useForm } from "react-hook-form";
import { TaskStatus } from "@prisma/client";
import { taskFormSchema, type TaskFormSchemaType } from "@/schema";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ButtonLoaderIcon } from "@/components/common/button-loader-icon";
import { BackButton } from "@/components/common/back-button";
import { TaskStatusBadge } from "@/features/tasks/components/task-status-badge";
import { TaskPriorityBadge } from "@/features/tasks/components/task-priority-badge";
import { useProjects } from "@/features/projects/hooks/use-projects";

type TaskFormProps = {
  onSubmit: (data: TaskFormSchemaType) => void;
  onSuccess?: (data: TaskFormSchemaType) => void;
  onCancel?: () => void;
  onError?: () => void;
  projectId: string;
  defaultValues: TaskFormSchemaType;
  mode?: "create" | "edit";
  isPending: boolean;
};

export function TaskForm({
  onSubmit,
  onSuccess,
  onCancel,
  onError,
  projectId,
  defaultValues,
  mode = "create",
  isPending,
}: TaskFormProps) {
  const { data: session } = useSession();
  const companyId = session?.user?.company.id;

  const form = useForm<TaskFormSchemaType>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const { data: companyUsers } = api.company.getCompanyUsers.useQuery();

  const { data: taskLabels } = api.task.getLabels.useQuery();

  const { data: projects } = useProjects(companyId);

  console.log("TaskForm form", form.formState);

  return (
    <form
      onSubmit={(e) => {
        void form.handleSubmit(onSubmit)(e);
      }}
      className="flex flex-col gap-5"
    >
      {/* {JSON.stringify(companyUsers)} */}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          {...form.register("title")}
          placeholder="task title"
          inputMode="text"
          disabled={isPending}
          data-invalid={form.formState.errors?.title?.message}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...form.register("description")}
          placeholder="task description"
          inputMode="text"
          disabled={isPending}
          className={cn("h-10 text-lg text-muted-foreground")}
          data-invalid={form.formState.errors?.description?.message}
        />
      </div>
      {/* Status Select */}
      <div className="grid w-full grid-cols-1 gap-x-3 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label htmlFor="status">Status</Label>
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => field.onChange(value as TaskStatus)}
                disabled={isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(TaskStatus).map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="capitalize"
                      >
                        <TaskStatusBadge status={status} />
                        {/* <CBadge color={getTaskStatusBadgeColor(status)}>
                          {status.replace("_", " ")}
                        </CBadge> */}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Priority Select */}
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Controller
            name="priority"
            control={form.control}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => field.onChange(value as Priority)}
                disabled={isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(Priority).map((priorityStatus) => (
                      <SelectItem
                        key={priorityStatus}
                        value={priorityStatus}
                        className="capitalize"
                      >
                        <TaskPriorityBadge priority={priorityStatus} />
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <Label htmlFor="labels">Label</Label>
          <Controller
            name="labels"
            control={form.control}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => field.onChange(value)}
                disabled={isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select labels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {taskLabels?.map((taskLabel) => (
                      <SelectItem
                        key={taskLabel.id}
                        value={taskLabel.id}
                        className="capitalize"
                      >
                        <span className="flex items-center gap-x-1.5 capitalize">
                          <span
                            className="h-3 w-3 rounded-sm"
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
                    {/* <div className="my-2 -ml-1">
                        <CreateLabel />
                      </div> */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      {/* Project */}
      <div>
        <Label htmlFor="projectId">Project</Label>
        <Controller
          name="projectId"
          control={form.control}
          render={({ field }) => (
            <Select
              {...field}
              onValueChange={(value) => field.onChange(value)}
              disabled={isPending}
            >
              <SelectTrigger className="h-fit w-full">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {projects?.map((project) => (
                    <SelectItem
                      key={project.id}
                      value={project.id}
                      className="flex capitalize"
                    >
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{project.name}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      {/* Assign */}
      <div>
        <Label htmlFor="assigneeId">Assignee</Label>
        <Controller
          name="assigneeId"
          control={form.control}
          render={({ field }) => (
            <Select
              {...field}
              onValueChange={(value) => field.onChange(value)}
              disabled={isPending}
            >
              <SelectTrigger className="h-fit w-full">
                <SelectValue placeholder="Assign to..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {companyUsers?.map((user) => (
                    <SelectItem
                      key={user.id}
                      value={user.id}
                      className="flex capitalize"
                      disabled={user.id === session?.user?.id}
                    >
                      <div className="flex items-center gap-2">
                        <UserAvatar user={user} />

                        <p className="font-medium">
                          {user.name}

                          {user.id === session?.user?.id && (
                            <span className="">(YOU)</span>
                          )}
                        </p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="mt-2 flex flex-col-reverse md:flex-row md:gap-2 lg:justify-end">
        <BackButton
          disabled={isPending}
          text="Cancel"
          // onClick={onCancel}
        />
        <Button
          type="submit"
          className="flex-1 lg:flex-initial"
          // disable if form is same values as default values
          disabled={isPending || !form.formState.isDirty}
        >
          <ButtonLoaderIcon isPending={isPending} />
          {mode === "create" ? "Create Task" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
