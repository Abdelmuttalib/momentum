import { TaskStatus } from "@prisma/client";
import { type prisma } from "@/server/db";
import { safeUserSummarySelect } from "@/server/db/selects";
import { TRPCError } from "@trpc/server";
import {
  OPEN_STATUSES,
  averageCycleTime,
  completedInRangeWhere,
  completionSnapshot,
  rangeStart,
  scopeWhere,
  sumEffort,
  type RangeKey,
} from "./shared";
import { bucketCompletions } from "@/lib/analytics/buckets";

type Db = typeof prisma;

export type ProjectOverview = {
  project: { id: string; name: string; description: string | null };
  lastActivityAt: string | null;
  kpis: {
    totalTasks: number;
    openTasks: number;
    completedTasks: number;
    canceledTasks: number;
    totalEffort: number;
    completedEffort: number;
    remainingEffort: number;
    unestimatedOpen: number;
    completionRate: number | null;
    avgCycleTimeMs: number | null;
    cycleTimeSampleSize: number;
  };
  status: { status: TaskStatus; count: number }[];
  trend: {
    granularity: "day" | "week" | "month";
    buckets: {
      date: string;
      label: string;
      completedTasks: number;
      completedEffort: number;
    }[];
  };
  contributors: {
    id: string;
    name: string;
    image: string | null;
    completedTasks: number;
    completedEffort: number;
    activeTasks: number;
    avgCycleTimeMs: number | null;
  }[];
  remaining: {
    id: string;
    title: string;
    dueDate: string | null;
    effortPoints: number | null;
    status: TaskStatus;
    assignee: { id: string; name: string; image: string | null } | null;
  }[];
  recent: {
    id: string;
    title: string;
    status: TaskStatus;
    completedAt: string | null;
    assignee: { id: string; name: string; image: string | null } | null;
  }[];
};

const TOP_CONTRIBUTORS = 10;
const REMAINING_LIMIT = 10;
const RECENT_LIMIT = 5;

export async function getProjectOverview(
  db: Db,
  companyId: string,
  projectId: string,
  range: RangeKey
): Promise<ProjectOverview> {
  const project = await db.project.findFirst({
    where: { id: projectId, companyId },
    select: { id: true, name: true, description: true },
  });
  if (!project) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  const now = new Date();
  const start = rangeStart(range, now);
  const scope = scopeWhere({ companyId, projectId });
  const openWhere = { ...scope, status: { in: OPEN_STATUSES } };
  const completedWhere = completedInRangeWhere({ companyId, projectId }, start);

  const [
    byStatus,
    remaining,
    completedEffort,
    cycle,
    trendRows,
    doneByAssignee,
    activeByAssignee,
    cycleRows,
    remainingRows,
    recentRows,
    lastActivity,
  ] = await Promise.all([
    db.task.groupBy({ by: ["status"], where: scope, _count: true }),
    sumEffort(db, openWhere),
    sumEffort(db, completedWhere),
    averageCycleTime(db, completedWhere),
    db.task.findMany({
      where: completedWhere,
      select: { completedAt: true, effortPoints: true },
      orderBy: { completedAt: "asc" },
    }),
    db.task.groupBy({
      by: ["assigneeId"],
      where: { ...completedWhere, assigneeId: { not: null } },
      _count: true,
      _sum: { effortPoints: true },
    }),
    db.task.groupBy({
      by: ["assigneeId"],
      where: { ...openWhere, assigneeId: { not: null } },
      _count: true,
    }),
    db.task.findMany({
      where: {
        ...completedWhere,
        assigneeId: { not: null },
        startedAt: { not: null },
      },
      select: { assigneeId: true, startedAt: true, completedAt: true },
    }),
    db.task.findMany({
      where: openWhere,
      select: {
        id: true,
        title: true,
        status: true,
        dueDate: true,
        effortPoints: true,
        assignee: { select: { id: true, name: true, image: true } },
      },
      orderBy: { dueDate: "asc" },
      take: REMAINING_LIMIT,
    }),
    db.task.findMany({
      where: completedWhere,
      select: {
        id: true,
        title: true,
        status: true,
        completedAt: true,
        assignee: { select: { id: true, name: true, image: true } },
      },
      orderBy: { completedAt: "desc" },
      take: RECENT_LIMIT,
    }),
    db.task.aggregate({ where: scope, _max: { updatedAt: true } }),
  ]);

  const countOf = (s: TaskStatus) =>
    byStatus.find((r) => r.status === s)?._count ?? 0;
  const completed = countOf(TaskStatus.COMPLETED);
  const canceled = countOf(TaskStatus.CANCELED);
  const open = OPEN_STATUSES.reduce((n, s) => n + countOf(s), 0);
  const total = byStatus.reduce((n, r) => n + r._count, 0);

  const assigneeIds = [
    ...new Set(
      [...doneByAssignee, ...activeByAssignee]
        .map((r) => r.assigneeId)
        .filter((id): id is string => !!id)
    ),
  ];
  const users = assigneeIds.length
    ? await db.user.findMany({
        where: { id: { in: assigneeIds }, companyId },
        select: safeUserSummarySelect,
      })
    : [];
  const userById = new Map(users.map((u) => [u.id, u]));
  const doneMap = new Map(
    doneByAssignee.flatMap((r) =>
      r.assigneeId
        ? [[r.assigneeId, { count: r._count, effort: r._sum.effortPoints ?? 0 }] as const]
        : []
    )
  );
  const activeMap = new Map(
    activeByAssignee.flatMap((r) =>
      r.assigneeId ? [[r.assigneeId, r._count] as const] : []
    )
  );
  const cycleSums = new Map<string, { sum: number; n: number }>();
  for (const r of cycleRows) {
    if (!r.assigneeId || !r.startedAt || !r.completedAt) continue;
    const cur = cycleSums.get(r.assigneeId) ?? { sum: 0, n: 0 };
    cur.sum += Math.max(0, r.completedAt.getTime() - r.startedAt.getTime());
    cur.n += 1;
    cycleSums.set(r.assigneeId, cur);
  }
  const contributors = assigneeIds
    .map((id) => {
      const user = userById.get(id);
      if (!user) return null;
      const done = doneMap.get(id);
      const cycle = cycleSums.get(id);
      return {
        id: user.id,
        name: user.name,
        image: user.image,
        completedTasks: done?.count ?? 0,
        completedEffort: done?.effort ?? 0,
        activeTasks: activeMap.get(id) ?? 0,
        avgCycleTimeMs:
          cycle && cycle.n > 0 ? Math.round(cycle.sum / cycle.n) : null,
      };
    })
    .filter((c): c is NonNullable<typeof c> => !!c)
    .sort((a, b) => b.completedEffort - a.completedEffort)
    .slice(0, TOP_CONTRIBUTORS);

  return {
    project,
    lastActivityAt: lastActivity._max.updatedAt?.toISOString() ?? null,
    kpis: {
      totalTasks: total,
      openTasks: open,
      completedTasks: completed,
      canceledTasks: canceled,
      totalEffort: remaining.total + completedEffort.total,
      completedEffort: completedEffort.total,
      remainingEffort: remaining.total,
      unestimatedOpen: remaining.unestimatedCount,
      completionRate: completionSnapshot(completed, open),
      avgCycleTimeMs: cycle.averageMs,
      cycleTimeSampleSize: cycle.sampleSize,
    },
    status: (Object.values(TaskStatus) as TaskStatus[]).map((status) => ({
      status,
      count: countOf(status),
    })),
    trend: bucketCompletions(
      trendRows.flatMap((r) =>
        r.completedAt
          ? [{ completedAt: r.completedAt, effortPoints: r.effortPoints }]
          : []
      ),
      range,
      start,
      now
    ),
    contributors,
    remaining: remainingRows.map((t) => ({
      id: t.id,
      title: t.title,
      dueDate: t.dueDate?.toISOString() ?? null,
      effortPoints: t.effortPoints,
      status: t.status,
      assignee: t.assignee,
    })),
    recent: recentRows.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      completedAt: t.completedAt?.toISOString() ?? null,
      assignee: t.assignee,
    })),
  };
}
