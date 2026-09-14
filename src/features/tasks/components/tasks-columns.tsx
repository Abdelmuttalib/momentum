import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import type { TaskPriority, TaskStatus } from "@prisma/client";
import { ButtonLink } from "@/components/common/button-link";
import { Text } from "@/components/typography";
import { UserAvatar } from "@/components/user/user-menu";
import { TaskStatusBadge } from "@/features/tasks/components/task-status-badge";
import { TaskPriorityBadge } from "@/features/tasks/components/task-priority-badge";
import { TaskEffortBadge } from "@/features/tasks/components/task-effort-badge";
import { routes } from "@/lib/routes";
import { formatDistanceToNow } from "@/lib/date";
import type { RouterOutputs } from "@/lib/api";
import type { useTranslations } from "next-intl";

type GlobalTask = RouterOutputs["task"]["getTasks"][number];
type ProjectOption = { id: string; name: string };

export function getTasksColumns(
  projects: ProjectOption[] | undefined,
  t: ReturnType<typeof useTranslations<"tasks">>
): ColumnDef<GlobalTask>[] {
  return [
    {
      accessorKey: "title",
      header: t("columnTitle"),
      cell: ({ row }) => {
        const task = row.original;
        return (
          <Link
            href={routes.projects.tasks.details({
              projectId: task.projectId,
              taskId: task.id,
            })}
            className="font-medium hover:underline"
          >
            {task.title}
          </Link>
        );
      },
    },
    {
      accessorKey: "projectId",
      header: t("project"),
      cell: ({ row }) => {
        const task = row.original;
        const name =
          projects?.find((p) => p.id === task.projectId)?.name ??
          t("project");
        return (
          <Link
            href={routes.projects.details({ projectId: task.projectId })}
            className="text-muted-foreground hover:text-foreground hover:underline"
          >
            {name}
          </Link>
        );
      },
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => {
        const status = row.getValue("status");
        return <TaskStatusBadge status={status as TaskStatus} size="sm" />;
      },
    },
    {
      accessorKey: "priority",
      header: t("priority"),
      cell: ({ row }) => {
        const priority = row.getValue("priority");
        return (
          <TaskPriorityBadge priority={priority as TaskPriority} size="sm" />
        );
      },
    },
    {
      accessorKey: "effortPoints",
      header: t("effort"),
      cell: ({ row }) => {
        const points = row.original.effortPoints;
        if (points == null) {
          return (
            <Text size="xs" tone="muted" as="span">
              —
            </Text>
          );
        }
        return <TaskEffortBadge points={points} size="sm" />;
      },
    },
    {
      accessorKey: "assignee",
      header: t("assignee"),
      cell: ({ row }) => {
        const assignee = row.original.assignee;
        if (!assignee) {
          return (
            <Text size="xs" tone="muted" as="span">
              {t("unassigned")}
            </Text>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5">
            <UserAvatar user={assignee} size="sm" />
            <span className="text-sm">{assignee.name}</span>
          </span>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: t("due"),
      cell: ({ row }) => {
        const dueDate = row.original.dueDate;
        if (!dueDate) {
          return (
            <Text size="xs" tone="muted" as="span">
              {t("noDueDate")}
            </Text>
          );
        }
        return (
          <span className="text-sm">
            {formatDistanceToNow(new Date(dueDate))}
          </span>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: t("updated"),
      cell: ({ row }) => {
        const date = formatDistanceToNow(row.getValue("updatedAt"));
        return <span className="text-sm text-muted-foreground">{date}</span>;
      },
    },
    {
      accessorKey: "id",
      header: t("actions"),
      cell: ({ getValue, row }) => {
        const id = getValue() as string;
        const task = row.original;
        const projectId = task.projectId;
        return (
          <div className="flex gap-1 text-muted-foreground">
            <ButtonLink
              href={routes.projects.tasks.details({
                projectId: projectId,
                taskId: id,
              })}
              size="sm"
              variant="ghost"
            >
              <Eye className="h-4 w-4" />
              {t("view")}
            </ButtonLink>

            <ButtonLink
              href={routes.projects.tasks.edit({
                projectId: projectId,
                taskId: id,
              })}
              size="sm"
              variant="ghost"
            >
              <Pencil className="h-4 w-4" />
              {t("edit")}
            </ButtonLink>
          </div>
        );
      },
    },
  ];
}
