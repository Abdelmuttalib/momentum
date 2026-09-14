import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/common/button-link";
import { Heading, Text } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/user/user-menu";
import LabelBadge from "@/components/ui/label-badge";
import { TaskStatusBadge } from "@/features/tasks/components/task-status-badge";
import { TaskPriorityBadge } from "@/features/tasks/components/task-priority-badge";
import {
  useMarkProjectTaskAsDone,
  useMoveTaskToBacklog,
} from "@/features/tasks/hooks/use-task-mutations";
import { formatCycleTime, formatDistanceToNow } from "@/lib/date";
import { TaskEffortBadge } from "@/features/tasks/components/task-effort-badge";
import { type RouterOutputs } from "@/lib/api";
import { TaskComments } from "./task-comments";
import { useTranslations } from "next-intl";

export type TaskDetail = NonNullable<
  RouterOutputs["project"]["getProjectTask"]
>;

export type TaskDetailViewProps = {
  task: TaskDetail;
  /** Shown as "Projects / {name}" context. Falls back to a project link. */
  projectName?: string | null;
  editHref: string;
};

function MetaRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Text
        size="xs"
        tone="muted"
        as="span"
        className="w-20 shrink-0 pt-0.5"
      >
        {label}
      </Text>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function TaskDetailView({
  task,
  projectName,
  editHref,
}: TaskDetailViewProps) {
  const t = useTranslations("tasks");
  const tCommon = useTranslations("common");
  const { execute: markAsDone, isPending: isMarkingDone } =
    useMarkProjectTaskAsDone();
  const { execute: moveToBacklog, isPending: isMovingToBacklog } =
    useMoveTaskToBacklog();
  const isMutating = isMarkingDone || isMovingToBacklog;

  return (
    <div className="flex flex-col gap-5">
      {/* Context + title */}
      <div className="flex flex-col gap-2">
        <Text size="xs" tone="muted">
          {projectName
            ? t("contextCrumbWithProject", { project: projectName })
            : t("contextCrumb")}
        </Text>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <Heading level="page" className="min-w-0 flex-1 break-words">
            {task.title}
          </Heading>
          <ButtonLink href={editHref} variant="outline" size="sm">
            {tCommon("edit")}
          </ButtonLink>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <TaskStatusBadge status={task.status} size="sm" />
          <TaskPriorityBadge priority={task.priority} size="sm" />
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
          <section aria-label={t("description")} className="flex flex-col gap-2">
            <Heading level="subsection">{t("description")}</Heading>
            <Text
              size="sm"
              tone={task.description ? "default" : "muted"}
              className="whitespace-pre-wrap break-words"
            >
              {task.description || t("noDescription")}
            </Text>
          </section>

          <Separator />

          <TaskComments taskId={task.id} />
        </div>

        {/* Aside */}
        <div className="flex flex-col gap-4">
          <section
            aria-label={t("details")}
            className="flex flex-col gap-3 rounded-lg border p-4"
          >
            <Heading level="subsection">{t("details")}</Heading>
            <MetaRow label={t("assignee")}>
              {task.assignee ? (
                <span className="inline-flex items-center gap-2">
                  <UserAvatar user={task.assignee} size="sm" />
                  <Text size="sm">{task.assignee.name}</Text>
                </span>
              ) : (
                <Text size="sm" tone="muted">
                  {t("unassigned")}
                </Text>
              )}
            </MetaRow>
            <MetaRow label={t("dueDate")}>
              <Text size="sm">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : t("noDueDate")}
              </Text>
            </MetaRow>
            <MetaRow label={t("effort")}>
              {task.effortPoints != null ? (
                <TaskEffortBadge points={task.effortPoints} />
              ) : (
                <Text size="sm" tone="muted">
                  {t("notEstimated")}
                </Text>
              )}
            </MetaRow>
            <MetaRow label={t("started")}>
              <Text size="sm" tone={task.startedAt ? "default" : "muted"}>
                {task.startedAt
                  ? formatDistanceToNow(task.startedAt)
                  : t("notStarted")}
              </Text>
            </MetaRow>
            <MetaRow label={t("completed")}>
              <Text size="sm" tone={task.completedAt ? "default" : "muted"}>
                {task.completedAt
                  ? formatDistanceToNow(task.completedAt)
                  : t("notCompleted")}
              </Text>
            </MetaRow>
            {task.startedAt && task.completedAt && (
              <MetaRow label={t("cycleTime")}>
                <Text size="sm" tone="muted">
                  {formatCycleTime(task.startedAt, task.completedAt)}
                </Text>
              </MetaRow>
            )}
            <MetaRow label={t("project")}>
              <Link
                href={`/projects/${task.projectId}`}
                className="text-sm font-medium hover:underline"
              >
                {projectName ?? t("viewProject")}
              </Link>
            </MetaRow>
            {task.labels && task.labels.length > 0 && (
              <MetaRow label={t("labels")}>
                <span className="flex flex-wrap gap-1">
                  {task.labels.map((label) => (
                    <LabelBadge
                      key={label.id}
                      name={label.name}
                      color={label.color}
                    />
                  ))}
                </span>
              </MetaRow>
            )}
            <MetaRow label={t("created")}>
              <Text size="sm" tone="muted">
                {formatDistanceToNow(task.createdAt)}
              </Text>
            </MetaRow>
            <MetaRow label={t("updated")}>
              <Text size="sm" tone="muted">
                {formatDistanceToNow(task.updatedAt)}
              </Text>
            </MetaRow>
          </section>

          <section
            aria-label={t("actions")}
            className="flex flex-col gap-2 rounded-lg border p-4"
          >
            <Heading level="subsection">{t("actions")}</Heading>
            <Button
              size="sm"
              className="w-full"
              onClick={() => void markAsDone({ taskId: task.id })}
              disabled={isMutating || task.status === "COMPLETED"}
            >
              {t("markDone")}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="w-full"
              onClick={() => void moveToBacklog({ taskId: task.id })}
              disabled={isMutating || task.status === "BACKLOG"}
            >
              {t("moveToBacklog")}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="w-full"
              disabled
              title={t("deleteUnsupported")}
            >
              {t("deleteTask")}
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
