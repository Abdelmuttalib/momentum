import { ButtonLink } from "@/components/common/button-link";

import LabelBadge from "@/components/ui/label-badge";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/typography";
import { routes } from "@/lib/routes";

import { type Label, type Task, type Role } from "@prisma/client";
import { TaskStatusBadge } from "./task-status-badge";
import { UserAvatar } from "@/components/user/user-menu";
import { useTaskComments } from "../hooks/use-task-comment";
import { TaskPriorityBadge } from "./task-priority-badge";

type TaskCardProps = {
  task: Task & {
    comments: {
      comment: string;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      author: {
        name: string;
        email: string;
        role: Role;
        id: string;
        image: string;
      };
    }[];
    labels: Label[];
    assignee: {
      name: string;
      email: string;
      role: Role;
      id: string;
      image: string;
    };
  };
  projectId?: string;
};

export function TaskCard({ task, projectId }: TaskCardProps) {
  const { data: taskComments, isLoading: isLoadingTaskComments } =
    useTaskComments(task.id);
  const resolvedProjectId = projectId ?? task.projectId;

  return (
    <>
      <div
        key={task.id}
        className="rounded-lg border bg-card p-4 hover:bg-popover"
        // onClick={() => setSelectedTask(task)}
      >
        <div className="flex justify-between">
          <Typography as="h3" variant="base/medium" className="mb-2">
            {task.title}
          </Typography>

          {task.assigneeId && <UserAvatar user={task?.assignee} size="sm" />}
        </div>
        <Typography
          as="p"
          variant="sm/normal"
          className="text-muted-foreground"
        >
          {task.description}
        </Typography>
        <div className="mt-4 flex items-center justify-between gap-2">
          {task?.labels?.map((label: Label) => (
            <LabelBadge key={label.id} name={label.name} color={label.color} />
          ))}

          <TaskStatusBadge status={task.status} size="sm" />
        </div>
        <div className="mt-2 flex flex-col gap-2">
          <div>
            <TaskPriorityBadge priority={task.priority} size="sm" />
          </div>

          <div className="inline-flex items-center gap-x-1 text-muted-foreground">
            <Typography
              as="span"
              variant="sm/normal"
              className="text-muted-foreground"
            >
              {taskComments?.length} Comments
            </Typography>
          </div>
        </div>

        <Separator />
        <div className="flex justify-end gap-2 pt-2">
          <ButtonLink
            href={routes.projects.tasks.edit({
              projectId: resolvedProjectId,
              taskId: task.id,
            })}
            variant="outline"
            size="sm"
          >
            Edit
          </ButtonLink>

          <ButtonLink
            href={routes.projects.tasks.details({
              projectId: resolvedProjectId,
              taskId: task.id,
            })}
            variant="outline"
            size="sm"
          >
            View
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
