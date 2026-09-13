import { TaskStatus, type Prisma } from "@prisma/client";
import { type prisma } from "@/server/db";
import { safeUserSummarySelect } from "@/server/db/selects";

type Db = typeof prisma;

/** Active (not completed, not canceled) statuses. */
export const OPEN_STATUSES: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TO_DO,
  TaskStatus.IN_PROGRESS,
];

/**
 * Scope for metric builders. Company is always required and always comes
 * from the session; future project/team/user analytics add the optional
 * filters without rewriting the metrics.
 */
export type AnalyticsScope = {
  companyId: string;
  projectId?: string;
  teamId?: string;
  assigneeId?: string;
};

export function scopeWhere(scope: AnalyticsScope): Prisma.TaskWhereInput {
  return {
    companyId: scope.companyId,
    ...(scope.projectId ? { projectId: scope.projectId } : {}),
    ...(scope.teamId ? { teamId: scope.teamId } : {}),
    ...(scope.assigneeId ? { assigneeId: scope.assigneeId } : {}),
  };
}

export type RangeKey = "7d" | "30d" | "90d" | "all";

export function rangeStart(range: RangeKey, now = new Date()): Date | null {
  if (range === "all") return null;
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

/** Completed in range (by completedAt; NULL timestamps excluded, never fabricated). */
export function completedInRangeWhere(
  scope: AnalyticsScope,
  start: Date | null
): Prisma.TaskWhereInput {
  return {
    ...scopeWhere(scope),
    status: TaskStatus.COMPLETED,
    ...(start ? { completedAt: { gte: start } } : { completedAt: { not: null } }),
  };
}

export type EffortSummary = {
  /** Sum over estimated tasks only. NULL effort never counts as 0. */
  total: number;
  estimatedCount: number;
  unestimatedCount: number;
};

/** Sum of effortPoints + estimation coverage for tasks matching `where`. */
export async function sumEffort(
  db: Db,
  where: Prisma.TaskWhereInput
): Promise<EffortSummary> {
  const [sum, estimatedCount, totalCount] = await Promise.all([
    db.task.aggregate({ where, _sum: { effortPoints: true } }),
    db.task.count({ where: { ...where, effortPoints: { not: null } } }),
    db.task.count({ where }),
  ]);
  return {
    total: sum._sum.effortPoints ?? 0,
    estimatedCount,
    unestimatedCount: totalCount - estimatedCount,
  };
}

export type CycleTimeSummary = {
  /** Average ms, or null when no task has both timestamps. */
  averageMs: number | null;
  sampleSize: number;
};

/**
 * Average cycle time. Prisma has no date-diff aggregate, so this fetches
 * only (startedAt, completedAt) pairs for completed tasks with both
 * timestamps present — bounded and field-minimal by construction.
 */
export async function averageCycleTime(
  db: Db,
  where: Prisma.TaskWhereInput
): Promise<CycleTimeSummary> {
  const rows = await db.task.findMany({
    where: {
      ...where,
      status: TaskStatus.COMPLETED,
      startedAt: { not: null },
      completedAt: { not: null },
    },
    select: { startedAt: true, completedAt: true },
  });
  if (rows.length === 0) return { averageMs: null, sampleSize: 0 };
  const timed = rows.flatMap((r) =>
    r.startedAt && r.completedAt
      ? [Math.max(0, r.completedAt.getTime() - r.startedAt.getTime())]
      : []
  );
  if (timed.length === 0) return { averageMs: null, sampleSize: 0 };
  const sum = timed.reduce((n, ms) => n + ms, 0);
  return { averageMs: Math.round(sum / timed.length), sampleSize: timed.length };
}

/**
 * Snapshot completion rate: completed / (completed + currently open).
 * CANCELED is excluded. Returns null when there is nothing to divide.
 */
export function completionSnapshot(
  completed: number,
  open: number
): number | null {
  const denom = completed + open;
  return denom === 0 ? null : Math.round((completed / denom) * 1000) / 10;
}

export { safeUserSummarySelect };
