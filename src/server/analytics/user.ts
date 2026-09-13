import { TaskStatus } from "@prisma/client";
import { type prisma } from "@/server/db";
import {
  OPEN_STATUSES,
  averageCycleTime,
  completedInRangeWhere,
  rangeStart,
  scopeWhere,
  sumEffort,
  type RangeKey,
} from "./shared";
import { bucketCompletions } from "@/lib/analytics/buckets";

type Db = typeof prisma;

export type UserOverview = {
  kpis: {
    active: number;
    overdue: number;
    dueThisWeek: number;
    completedInRange: number;
    completedEffort: number;
    unestimatedCompleted: number;
    remainingEffort: number;
    unestimatedActive: number;
    avgCycleTimeMs: number | null;
    cycleTimeSampleSize: number;
  };
  trend: {
    granularity: "day" | "week" | "month";
    buckets: {
      date: string;
      label: string;
      completedTasks: number;
      completedEffort: number;
    }[];
  };
  byStatus: { status: TaskStatus; count: number }[];
  byProject: {
    id: string;
    name: string;
    active: number;
    completed: number;
    effort: number;
  }[];
  workload: {
    id: string;
    title: string;
    status: TaskStatus;
    dueDate: string | null;
    effortPoints: number | null;
    projectId: string;
    projectName: string;
    overdue: boolean;
  }[];
  recent: {
    id: string;
    title: string;
    status: TaskStatus;
    completedAt: string | null;
    projectId: string;
    projectName: string;
  }[];
};

const WORKLOAD_LIMIT = 10;
const RECENT_LIMIT = 5;

export async function getUserOverview(
  db: Db,
  companyId: string,
  userId: string,
  range: RangeKey
): Promise<UserOverview> {
  const now = new Date();
  const start = rangeStart(range, now);
  const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const scope = scopeWhere({ companyId, assigneeId: userId });
  const activeWhere = { ...scope, status: { in: OPEN_STATUSES } };
  const completedWhere = completedInRangeWhere(
    { companyId, assigneeId: userId },
    start
  );
  const overdueWhere = {
    ...activeWhere,
    dueDate: { lt: now },
  };
  const dueWeekWhere = {
    ...activeWhere,
    dueDate: { gte: now, lte: weekEnd },
  };

  const [
    active,
    overdue,
    dueWeek,
    completedCount,
    completedEffort,
    remaining,
    cycle,
    trendRows,
    byStatus,
    workloadRows,
    recentRows,
    doneProj,
    activeProj,
  ] = await Promise.all([
    db.task.count({ where: activeWhere }),
    db.task.count({ where: overdueWhere }),
    db.task.count({ where: dueWeekWhere }),
    db.task.count({ where: completedWhere }),
    sumEffort(db, completedWhere),
    sumEffort(db, activeWhere),
    averageCycleTime(db, completedWhere),
    db.task.findMany({
      where: completedWhere,
      select: { completedAt: true, effortPoints: true },
      orderBy: { completedAt: "asc" },
    }),
    db.task.groupBy({ by: ["status"], where: scope, _count: true }),
    db.task.findMany({
      where: activeWhere,
      select: {
        id: true,
        title: true,
        status: true,
        dueDate: true,
        effortPoints: true,
        projectId: true,
      },
      orderBy: [{ dueDate: "asc" }, { updatedAt: "desc" }],
      take: WORKLOAD_LIMIT,
    }),
    db.task.findMany({
      where: completedWhere,
      select: {
        id: true,
        title: true,
        status: true,
        completedAt: true,
        projectId: true,
      },
      orderBy: { completedAt: "desc" },
      take: RECENT_LIMIT,
    }),
    db.task.groupBy({
      by: ["projectId"],
      where: completedWhere,
      _count: true,
      _sum: { effortPoints: true },
    }),
    db.task.groupBy({
      by: ["projectId"],
      where: activeWhere,
      _count: true,
    }),
  ]);

  const doneProjMap = new Map(
    doneProj.map((r) => [
      r.projectId,
      { count: r._count, effort: r._sum.effortPoints ?? 0 },
    ])
  );
  const activeProjMap = new Map(
    activeProj.map((r) => [r.projectId, r._count])
  );
  const projectIds = [
    ...new Set([...doneProjMap.keys(), ...activeProjMap.keys()]),
  ];
  const projectRows = projectIds.length
    ? await db.project.findMany({
        where: { id: { in: projectIds }, companyId },
        select: { id: true, name: true },
      })
    : [];
  const projectName = new Map(projectRows.map((p) => [p.id, p.name]));

  const byProject = projectIds
    .map((id) => {
      const done = doneProjMap.get(id);
      return {
        id,
        name: projectName.get(id) ?? "Project",
        active: activeProjMap.get(id) ?? 0,
        completed: done?.count ?? 0,
        effort: done?.effort ?? 0,
      };
    })
    .filter((p) => p.active + p.completed > 0)
    .sort((a, b) => b.effort - a.effort || b.active - a.active)
    .slice(0, 8);

  return {
    kpis: {
      active,
      overdue,
      dueThisWeek: dueWeek,
      completedInRange: completedCount,
      completedEffort: completedEffort.total,
      unestimatedCompleted: completedEffort.unestimatedCount,
      remainingEffort: remaining.total,
      unestimatedActive: remaining.unestimatedCount,
      avgCycleTimeMs: cycle.averageMs,
      cycleTimeSampleSize: cycle.sampleSize,
    },
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
    byStatus: (Object.values(TaskStatus) as TaskStatus[]).map((status) => ({
      status,
      count: byStatus.find((r) => r.status === status)?._count ?? 0,
    })),
    byProject,
    workload: workloadRows.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      dueDate: t.dueDate?.toISOString() ?? null,
      effortPoints: t.effortPoints,
      projectId: t.projectId,
      projectName: projectName.get(t.projectId) ?? "Project",
      overdue: !!t.dueDate && t.dueDate < now,
    })),
    recent: recentRows.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      completedAt: t.completedAt?.toISOString() ?? null,
      projectId: t.projectId,
      projectName: projectName.get(t.projectId) ?? "Project",
    })),
  };
}
