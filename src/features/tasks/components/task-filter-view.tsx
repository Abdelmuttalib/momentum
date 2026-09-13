import { useMemo, useState, type ComponentProps } from "react";
import { TaskStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/typography";
import { TaskCard } from "./task-card";
import { cn } from "@/lib/cn";
import { useTranslations } from "next-intl";
import { useTaskStatusLabel } from "./task-status-label";

export type StatusFilter = TaskStatus | "all";

export function useTaskStatusFilter<T extends { status: string }>(tasks: T[]) {
  const [status, setStatus] = useState<StatusFilter>("all");

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const task of tasks) {
      map.set(task.status, (map.get(task.status) ?? 0) + 1);
    }
    return map;
  }, [tasks]);

  const filtered = useMemo(() => {
    if (status === "all") return tasks;
    return tasks.filter((task) => task.status === status);
  }, [tasks, status]);

  return { status, setStatus, counts, filtered };
}

export function TaskStatusFilter({
  value,
  counts,
  total,
  onChange,
}: {
  value: StatusFilter;
  counts: Map<string, number>;
  total: number;
  onChange: (status: StatusFilter) => void;
}) {
  const t = useTranslations("tasks");
  const getStatusLabel = useTaskStatusLabel();
  const options: { value: StatusFilter; label: string; count: number }[] = [
    { value: "all", label: t("all"), count: total },
    ...Object.values(TaskStatus).map((status) => ({
      value: status as StatusFilter,
      label: getStatusLabel(status),
      count: counts.get(status) ?? 0,
    })),
  ];

  return (
    <div
      role="group"
      aria-label={t("filterByStatus")}
      className="flex flex-wrap gap-1.5"
    >
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <Button
            key={option.value}
            size="sm"
            variant={isActive ? "secondary" : "ghost"}
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-7 gap-1.5 px-2.5 capitalize",
              !isActive && "text-muted-foreground"
            )}
          >
            {option.label}
            <Text
              as="span"
              size="xs"
              tone={isActive ? "default" : "muted"}
            >
              {option.count}
            </Text>
          </Button>
        );
      })}
    </div>
  );
}

type CardTask = ComponentProps<typeof TaskCard>["task"];

/** Status-filtered TaskCard grid shared by /tasks and project detail. */
export function TaskFilterView({ tasks }: { tasks: CardTask[] }) {
  const t = useTranslations("tasks");
  const { status, setStatus, counts, filtered } = useTaskStatusFilter(tasks);

  return (
    <div className="flex flex-col gap-3">
      <TaskStatusFilter
        value={status}
        counts={counts}
        total={tasks.length}
        onChange={setStatus}
      />

      {filtered.length === 0 ? (
        <Text size="sm" tone="muted" className="py-6 text-center">
          {t("noMatch")}
        </Text>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
