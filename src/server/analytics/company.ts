import { TaskStatus } from "@prisma/client";
import { type prisma } from "@/server/db";
import { safeUserSummarySelect } from "@/server/db/selects";
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

export type CompanyOverview = {
  range: RangeKey;
  computedAt: string;
  kpis: {
    openTasks: number;
    activeProjects: number;
    remainingEffort: number;
    unestimatedOpen: number;
    completedTasks: number;
    completedEffort: number;
    estimatedCompletedCount: number;
    unestimatedCompletedCount: number;
    completionSnapshot: number | null;
    avgCycleTimeMs: number | null;
    cycleTimeSampleSize: number;
  };
  byStatus: { status: TaskStatus; count: number }[];
  trends: {
    granularity: "day" | "week" | "month";
    buckets: {
      date: string;
      label: string;
      completedTasks: number;
      completedEffort: number;
    }[];
  };
  byProject: {
    projects: {
      id: string;
      name: string;
      openTasks: number;
      completedTasks: number;
      remainingEffort: number;
      completedEffort: number;
    }[];
    moreCount: number;
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
};

const TOP_PROJECTS = 8;

export async function getCompanyOverview(
  db: Db,
  companyId: string,
  range: RangeKey
): Promise<CompanyOverview> {
  const now = new Date();
  const start = rangeStart(range, now);
  const scope = scopeWhere({ companyId });
  const openWhere = { ...scope, status: { in: OPEN_STATUSES } };
  const completedWhere = completedInRangeWhere({ companyId }, start);

  const [
    openTasks,
    byStatus,
    remaining,
    completedCount,
    completedEffort,
    cycle,
    openProjectIds,
    trendRows,
    projectAgg,
    doneByAssignee,
    activeByAssignee,
    cycleRows,
  ] = await Promise.all([
    db.task.count({ where: openWhere }),
    db.task.groupBy({ by: ["status"], where: scope, _count: true }),
    sumEffort(db, openWhere),
    db.task.count({ where: completedWhere }),
    sumEffort(db, completedWhere),
    averageCycleTime(db, completedWhere),
    db.task.groupBy({ by: ["projectId"], where: openWhere }),
    db.task.findMany({
      where: completedWhere,
      select: { completedAt: true, effortPoints: true },
      orderBy: { completedAt: "asc" },
    }),
    db.task.groupBy({
      by: ["projectId", "status"],
      where: {
        ...scope,
        ...(start
          ? {
              OR: [
                { status: { in: OPEN_STATUSES } },
                { status: TaskStatus.COMPLETED, completedAt: { gte: start } },
              ],
            }
          : {}),
      },
      _count: true,
      _sum: { effortPoints: true },
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
  ]);

  // --- Projects: names + per-project rollups ---
  const projectIds = [...new Set(projectAgg.map((r) => r.projectId))];
  const projectRows = projectIds.length
    ? await db.project.findMany({
        where: { id: { in: projectIds }, companyId },
        select: { id: true, name: true },
      })
    : [];
  const projectName = new Map(projectRows.map((p) => [p.id, p.name]));
  type ProjRollup = {
    open: number;
    done: number;
    remaining: number;
    doneEffort: number;
  };
  const rollups = new Map<string, ProjRollup>();
  for (const r of projectAgg) {
    const cur = rollups.get(r.projectId) ?? {
      open: 0,
      done: 0,
      remaining: 0,
      doneEffort: 0,
    };
    if (r.status === TaskStatus.COMPLETED) {
      cur.done += r._count;
      cur.doneEffort += r._sum.effortPoints ?? 0;
    } else if (
      (OPEN_STATUSES as string[]).includes(r.status) ||
      r.status === TaskStatus.CANCELED
    ) {
      // Remaining effort counts open work only; canceled tracked in byStatus.
      if ((OPEN_STATUSES as string[]).includes(r.status)) {
        cur.open += r._count;
        cur.remaining += r._sum.effortPoints ?? 0;
      }
    }
    rollups.set(r.projectId, cur);
  }
  const ranked = [...rollups.entries()]
    .map(([id, r]) => ({
      id,
      name: projectName.get(id) ?? "Project",
      openTasks: r.open,
      completedTasks: r.done,
      remainingEffort: r.remaining,
      completedEffort: r.doneEffort,
    }))
    .filter((p) => p.openTasks + p.completedTasks > 0)
    .sort((a, b) => b.remainingEffort - a.remainingEffort);
  const topProjects = ranked.slice(0, TOP_PROJECTS);

  // --- Contributors ---
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
  const contributors: CompanyOverview["contributors"] = [];
  for (const id of assigneeIds) {
    const user = userById.get(id);
    if (!user) continue;
    const done = doneMap.get(id);
    const cycle = cycleSums.get(id);
    contributors.push({
      id: user.id,
      name: user.name,
      image: user.image,
      completedTasks: done?.count ?? 0,
      completedEffort: done?.effort ?? 0,
      activeTasks: activeMap.get(id) ?? 0,
      avgCycleTimeMs:
        cycle && cycle.n > 0 ? Math.round(cycle.sum / cycle.n) : null,
    });
  }
  contributors.sort((a, b) => b.completedEffort - a.completedEffort);

  return {
    range,
    computedAt: now.toISOString(),
    kpis: {
      openTasks,
      activeProjects: openProjectIds.length,
      remainingEffort: remaining.total,
      unestimatedOpen: remaining.unestimatedCount,
      completedTasks: completedCount,
      completedEffort: completedEffort.total,
      estimatedCompletedCount: completedEffort.estimatedCount,
      unestimatedCompletedCount: completedEffort.unestimatedCount,
      completionSnapshot: completionSnapshot(completedCount, openTasks),
      avgCycleTimeMs: cycle.averageMs,
      cycleTimeSampleSize: cycle.sampleSize,
    },
    byStatus: (
      Object.values(TaskStatus) as TaskStatus[]
    ).map((status) => ({
      status,
      count: byStatus.find((r) => r.status === status)?._count ?? 0,
    })),
    trends: bucketCompletions(
      trendRows.flatMap((r) =>
        r.completedAt
          ? [{ completedAt: r.completedAt, effortPoints: r.effortPoints }]
          : []
      ),
      range,
      start,
      now
    ),
    byProject: {
      projects: topProjects,
      moreCount: Math.max(0, ranked.length - topProjects.length),
    },
    contributors,
  };
}
