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
import { api } from "@/lib/api";
import { cn } from "@/lib/cn";
import { Priority, EFFORT_SCALE } from "@/lib/enums";

import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { type Project, TaskStatus } from "@prisma/client";
import { FormLabel } from "@/components/ui/form-label";
import { DialogForm } from "@/components/common/dialog-form";
import { taskFormSchema, type TaskFormSchemaType } from "@/schema";
import { useSession } from "next-auth/react";
import { useCreateTask } from "@/features/tasks/hooks/use-task-mutations";
import { TaskEffortBadge } from "@/features/tasks/components/task-effort-badge";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { ButtonLoaderIcon } from "@/components/common/button-loader-icon";
import { CBadge } from "@/components/common/cbadge";
import {
  getTaskPriorityBadgeColor,
  getTaskStatusBadgeColor,
} from "@/lib/color";
import { useTranslations } from "next-intl";

interface CreateTaskFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  onError: () => void;
  projectId?: string;
  defaultValues: TaskFormSchemaType;
  projects: Project[];
}

function CreateTaskForm({
  onSuccess,
  onCancel,
  onError,
  projectId,
  defaultValues,
  projects,
}: CreateTaskFormProps) {
  const t = useTranslations("tasks");
  const { data: session } = useSession();
  const { query } = useRouter();
  const pId = query.projectId as string;

  const { execute, isPending } = useCreateTask();

  async function handleSubmit(data: TaskFormSchemaType) {
    await execute({
      ...data,
    });

    onSuccess();
  }

  const form = useForm<TaskFormSchemaType>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const { data: companyUsers } = api.company.getCompanyUsers.useQuery();

  const { data: taskLabels } = api.task.getLabels.useQuery();

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col gap-5"
    >
      {/* {JSON.stringify(companyUsers)} */}
      <div>
        <Label htmlFor="title">{t("formTitle")}</Label>
        <Input
          id="title"
          type="text"
          {...form.register("title")}
          placeholder={t("formTitlePlaceholder")}
          inputMode="text"
          disabled={isPending}
          data-invalid={form.formState.errors?.title?.message}
        />
      </div>
      <div>
        <Label htmlFor="description">{t("formDescription")}</Label>
        <Textarea
          id="description"
          {...form.register("description")}
          placeholder={t("formDescriptionPlaceholder")}
          inputMode="text"
          disabled={isPending}
          className={cn("min-h-10 text-sm")}
          data-invalid={form.formState.errors?.description?.message}
        />
      </div>
      {/* Status Select */}
      <div className="grid w-full grid-cols-1 gap-x-3 gap-y-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="status">{t("statusLabel")}</Label>
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
                  <SelectValue placeholder={t("selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(TaskStatus).map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="capitalize"
                      >
                        <CBadge
                          color={getTaskStatusBadgeColor(status).color}
                          className=""
                        >
                          {status.replace("_", " ").toLocaleLowerCase()}
                        </CBadge>
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
          <Label htmlFor="priority">{t("priorityLabel")}</Label>
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
                  <SelectValue placeholder={t("selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(Priority).map((priorityStatus) => (
                      <SelectItem
                        key={priorityStatus}
                        value={priorityStatus}
                        className="capitalize"
                      >
                        <CBadge
                          color={
                            getTaskPriorityBadgeColor(priorityStatus).color
                          }
                        >
                          {priorityStatus.replace("_", " ")}
                        </CBadge>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Effort Select */}
        <div>
          <Label htmlFor="effortPoints">{t("effortLabel")}</Label>
          <Controller
            name="effortPoints"
            control={form.control}
            render={({ field }) => (
              <Select
                value={field.value == null ? "none" : String(field.value)}
                onValueChange={(value) =>
                  field.onChange(value === "none" ? null : Number(value))
                }
                disabled={isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("noEstimate")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="none">
                      <span className="text-muted-foreground">{t("noEstimate")}</span>
                    </SelectItem>
                    {EFFORT_SCALE.map((points) => (
                      <SelectItem key={points} value={String(points)}>
                        <TaskEffortBadge points={points} />
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <Label htmlFor="labels">{t("labelLabel")}</Label>
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
                  <SelectValue placeholder={t("selectLabels")} />
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
                    {/* <div className="my-2 -ms-1">
                        <CreateLabel />
                      </div> */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Assign */}
      <div>
        <Label htmlFor="assigneeId">{t("assigneeLabel")}</Label>
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
                <SelectValue placeholder={t("assignTo")} />
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

      <div>
        <Label htmlFor="projectId">{t("projectLabel")}</Label>
        <Controller
          name="projectId"
          control={form.control}
          render={({ field }) => (
            <Select
              {...field}
              onValueChange={(value) => field.onChange(value)}
              disabled={isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("selectProject")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {projects?.map((project) => (
                    <SelectItem
                      key={project.id}
                      value={project.id}
                      className="capitalize"
                    >
                      {/* <Badge
                          color={getTaskPriorityBadgeColor(priorityStatus)}
                        > */}
                      {project.name}
                      {/* </Badge> */}
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
          disabled={isPending}
        >
          {t("cancelButton")}
        </Button>
        <Button
          type="submit"
          className="flex-1 lg:flex-initial"
          disabled={isPending}
        >
          <ButtonLoaderIcon isPending={isPending} />
          {t("createButton")}
        </Button>
      </div>
    </form>
  );
}

export function CreateTask({
  type = "project",
  status,
  projectId,
  triggerButton,
  projects,
}: {
  type?: "project" | "column";
  status?: TaskStatus;
  projectId?: string;
  triggerButton?: React.ReactNode;
  projects: Project[];
}) {
  const t = useTranslations("tasks");
  return (
    <>
      <DialogForm
        title={t("createDialogTitle")}
        description={t("createDialogDescription")}
        triggerButton={
          triggerButton || (
            <Button
              type="button"
              className="ms-2 inline-flex gap-1 whitespace-nowrap"
            >
              <PlusIcon className="w-5" />
              {t("createButton")}
            </Button>
          )
        }
        dialogContentClassName="sm:max-w-md"
      >
        {({ onClose }) => (
          <CreateTaskForm
            onSuccess={() => {
              onClose();
            }}
            onCancel={onClose}
            onError={() => {
              onClose();
            }}
            projectId={projectId}
            defaultValues={{}}
            projects={projects}
            // defaultValues={{
            //   ...(status && { status }),
            // }}
          />
        )}
      </DialogForm>
    </>
  );
}
