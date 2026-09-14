import { TaskStatus } from "@prisma/client";
import { type prisma } from "@/server/db";
import { safeUserSummarySelect } from "@/server/db/selects";
import {
  OPEN_STATUSES,
  scopeWhere,
} from "./shared";
import { bucketCompletions } from "@/lib/analytics/buckets";

type Db = typeof prisma;

export type AttentionReason = "overdue" | "unassigned" | "due-soon";

export type DashboardOverview = {
  open: number;
  overdue: number;
  dueWeek: number;
  myActive: number;
  myOverdue: number;
  spark: {
    granularity: "day" | "week" | "month";
    buckets: {
      date: string;
      label: string;
      completedTasks: number;
      completedEffort: number;
    }[];
  };
  attention: {
    id: string;
    title: string;
    status: TaskStatus;
    dueDate: string | null;
    projectId: string;
    projectName: string;
    assignee: { id: string; name: string; image: string | null } | null;
    reason: AttentionReason;
  }[];
  topProjects: {
    id: string;
    name: string;
    open: number;
    done: number;
    percent: number;
  }[];
};

const ATTENTION_LIMIT = 5;
const TOP_PROJECTS = 5;
const SPARK_DAYS = 7;

export async function getDashboardOverview(
  db: Db,
  companyId: string,
  userId: string
): Promise<DashboardOverview> {
  const now = new Date();
  const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const scope = scopeWhere({ companyId });
  const openWhere = { ...scope, status: { in: OPEN_STATUSES } };
  const myActiveWhere = {
    ...openWhere,
    assigneeId: userId,
  };

  const [open, overdue, dueWeek, myActive, myOverdue, sparkRows, attentionRows, topAgg] =
    await Promise.all([
      db.task.count({ where: openWhere }),
      db.task.count({ where: { ...openWhere, dueDate: { lt: now } } }),
      db.task.count({
        where: { ...openWhere, dueDate: { gte: now, lte: weekEnd } },
      }),
      db.task.count({ where: myActiveWhere }),
      db.task.count({
        where: { ...myActiveWhere, dueDate: { lt: now } },
      }),
      db.task.findMany({
        where: {
          ...scope,
          status: TaskStatus.COMPLETED,
          completedAt: {
            gte: new Date(now.getTime() - SPARK_DAYS * 24 * 60 * 60 * 1000),
          },
        },
        select: { completedAt: true, effortPoints: true },
        orderBy: { completedAt: "asc" },
      }),
      db.task.findMany({
        where: openWhere,
        select: {
          id: true,
          title: true,
          status: true,
          dueDate: true,
          projectId: true,
          assigneeId: true,
          assignee: { select: safeUserSummarySelect },
        },
        orderBy: [{ dueDate: "asc" }, { updatedAt: "desc" }],
        take: 20,
      }),
      db.task.groupBy({
        by: ["projectId", "status"],
        where: {
          ...scope,
          status: { in: [...OPEN_STATUSES, TaskStatus.COMPLETED] },
        },
        _count: true,
      }),
    ]);

  // Rank attention: overdue first, then unassigned, then due soon.
  const scored = attentionRows.map((t) => {
    let reason: AttentionReason = "due-soon";
    let rank = 2;
    if (t.dueDate && t.dueDate < now) {
      reason = "overdue";
      rank = 0;
    } else if (!t.assigneeId) {
      reason = "unassigned";
      rank = 1;
    }
    return { t, reason, rank };
  });
  scored.sort((a, b) => a.rank - b.rank);
  const top = scored.slice(0, ATTENTION_LIMIT);
  const attentionProjectIds = [...new Set(top.map((s) => s.t.projectId))];
  const attentionProjects =
    attentionProjectIds.length > 0
      ? await db.project.findMany({
          where: { id: { in: attentionProjectIds }, companyId },
          select: { id: true, name: true },
        })
      : [];
  const attentionProjectName = new Map(
    attentionProjects.map((p) => [p.id, p.name])
  );

  // Least-complete projects with open work.
  const rollups = new Map<string, { open: number; done: number }>();
  for (const r of topAgg) {
    const cur = rollups.get(r.projectId) ?? { open: 0, done: 0 };
    if (r.status === TaskStatus.COMPLETED) cur.done += r._count;
    else cur.open += r._count;
    rollups.set(r.projectId, cur);
  }
  const ranked = [...rollups.entries()]
    .filter(([, r]) => r.open > 0)
    .map(([id, r]) => ({
      id,
      open: r.open,
      done: r.done,
      percent:
        r.open + r.done === 0
          ? 0
          : Math.round((r.done / (r.open + r.done)) * 100),
    }))
    .sort((a, b) => a.percent - b.percent)
    .slice(0, TOP_PROJECTS);
  const rankedProjects =
    ranked.length > 0
      ? await db.project.findMany({
          where: { id: { in: ranked.map((r) => r.id) }, companyId },
          select: { id: true, name: true },
        })
      : [];
  const rankedName = new Map(rankedProjects.map((p) => [p.id, p.name]));

  return {
    open,
    overdue,
    dueWeek,
    myActive,
    myOverdue,
    spark: bucketCompletions(
      sparkRows.flatMap((r) =>
        r.completedAt
          ? [{ completedAt: r.completedAt, effortPoints: r.effortPoints }]
          : []
      ),
      "7d",
      new Date(now.getTime() - (SPARK_DAYS - 1) * 24 * 60 * 60 * 1000),
      now
    ),
    attention: top.map(({ t, reason }) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      dueDate: t.dueDate?.toISOString() ?? null,
      projectId: t.projectId,
      projectName: attentionProjectName.get(t.projectId) ?? "Project",
      assignee: t.assignee
        ? { id: t.assignee.id, name: t.assignee.name, image: t.assignee.image }
        : null,
      reason,
    })),
    topProjects: ranked.map((r) => ({
      ...r,
      name: rankedName.get(r.id) ?? "Project",
    })),
  };
}
