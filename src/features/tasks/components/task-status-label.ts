import { useTranslations } from "next-intl";
import type { TaskPriority, TaskStatus } from "@prisma/client";

/** Localized presentation labels for language-neutral enum values. */
export function useTaskStatusLabel() {
  const t = useTranslations("tasks");
  return (status: TaskStatus) => t(`status.${status}`);
}

export function useTaskPriorityLabel() {
  const t = useTranslations("tasks");
  return (priority: TaskPriority) => t(`priority.${priority}`);
}
