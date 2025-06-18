import { Badge } from "@/components/ui/badge";
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
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { Priority } from "@/utils/enums";
import {
  getTaskPriorityBadgeColor,
  getTaskStatusBadgeColor,
} from "@/utils/getBadgeColor";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { TaskStatus } from "@prisma/client";
import { FormLabel } from "@/components/ui/form-label";
import { DialogForm } from "@/components/common/dialog-form";
import { type CreateTaskSchemaType } from "@/schema";
import { useCreateTask } from "@/hooks/use-task";

interface CreateTaskFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  onError: () => void;
  teamId: string;
  projectId: string;
  defaultValues: CreateTaskSchemaType;
}

function CreateTaskForm({
  onSuccess,
  onCancel,
  onError,
  teamId,
  projectId,
  defaultValues,
}: CreateTaskFormProps) {
  const { form, handleSubmit, mutation } = useCreateTask({
    onSuccess,
    onError,
    onCancel,
    teamId,
    projectId,
    defaultValues,
  });

  const data = api.team.getTeamMembers.useQuery(
    {
      teamId,
    },
    {
      enabled: !!teamId,
    }
  );

  const teamMembers = data?.data;

  const { data: taskLabels } = api.task.getLabels.useQuery();

  console.log("teamMembers", data, teamMembers);
  console.log("task labels", taskLabels);

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      {JSON.stringify(teamMembers)}
      <div>
        <Label htmlFor="title" className="sr-only">
          Task title:
        </Label>
        <Input
          id="title"
          type="text"
          {...form.register("title")}
          placeholder="task title"
          inputMode="text"
          disabled={mutation.isLoading}
          data-invalid={form.formState.errors?.title?.message}
        />
      </div>
      <div>
        <Label htmlFor="description">Task description:</Label>
        <Textarea
          id="description"
          {...form.register("description")}
          placeholder="task description"
          inputMode="text"
          disabled={mutation.isLoading}
          className={cn("h-10 text-lg text-muted-foreground")}
          data-invalid={form.formState.errors?.description?.message}
        />
      </div>
      {/* Status Select */}
      <div className="grid w-full grid-cols-1 gap-x-3 gap-y-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="status">Status</Label>
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => field.onChange(value as TaskStatus)}
                disabled={mutation.isLoading}
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
                disabled={mutation.isLoading}
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
        </div>

        <div className="flex items-center gap-x-2">
          <div>
            <FormLabel htmlFor="labels">Label</FormLabel>
            <Controller
              name="labels"
              control={form.control}
              render={({ field }) => (
                <Select
                  {...field}
                  onValueChange={(value) => field.onChange(value)}
                  disabled={mutation.isLoading}
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
              onValueChange={(value) => field.onChange(value as Priority)}
              disabled={mutation.isLoading}
            >
              <SelectTrigger className="h-fit w-full">
                <SelectValue placeholder="Assign to..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {teamMembers?.users?.map((user) => (
                    <SelectItem
                      key={user.id}
                      value={user.id}
                      className="flex capitalize"
                    >
                      <div className="flex items-center gap-2">
                        <UserAvatar user={user} />

                        <p className="font-medium">{user.name}</p>
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
          className="flex-1 lg:flex-initial"
          disabled={mutation.isLoading}
          isLoading={mutation.isLoading}
        >
          Create Task
        </Button>
      </div>
    </form>
  );
}

export function CreateTask({
  type = "project",
  status,
  teamId,
  projectId,
}: {
  type?: "project" | "column";
  status?: TaskStatus;
  teamId: string;
  projectId: string;
}) {
  return (
    <>
      <DialogForm
        title="Create a new Task"
        description="Tasks are a great way to organize your projects and invite other users"
        triggerButton={
          <Button
            type="button"
            className="ml-2 inline-flex gap-1 whitespace-nowrap"
          >
            <PlusIcon className="w-5" />
            Create Task
          </Button>
        }
        dialogContentClassName="sm:max-w-md"
      >
        {({ onClose }) => (
          <CreateTaskForm
            onSuccess={() => {
              toast.success("Task created successfully");
              onClose();
            }}
            onCancel={onClose}
            onError={() => {
              toast.error("Failed to create task");
              onClose();
            }}
            teamId={teamId}
            projectId={projectId}
            defaultValues={{}}
            // defaultValues={{
            //   ...(status && { status }),
            // }}
          />
        )}
      </DialogForm>
    </>
  );
}
