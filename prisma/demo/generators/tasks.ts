import { Prisma, TaskPriority, TaskStatus } from "@prisma/client";
import { randomUUID } from "crypto";
import type { CompanyContext } from "../context";
import type { DemoConfig } from "../config";
import { buildLifecycle, pickCreatedAt } from "../dates";
import { TASK_DESCRIPTIONS, TASK_TITLES } from "../content";
import type { Rng } from "../random";

export type GeneratedTask = Prisma.TaskCreateManyInput & {
  // createMany-compatible shape with explicit timestamps + id
  id: string;
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
};

export function distributeProjects(
  rng: Rng,
  projectCount: number,
  existingCounts: number[],
  total: number,
  minShare: number
): number[] {
  // Each project gets a floor share; the rest follows existing activity
  // (+1 so empty projects still compete), shuffled by construction order
  // remaining random.
  const floorEach = Math.floor((total * minShare) / projectCount);
  const assigned: number[] = new Array(projectCount).fill(0);
  let remaining = total;
  for (let i = 0; i < projectCount; i++) {
    assigned[i] = Math.min(floorEach, remaining);
    remaining -= assigned[i] as number;
  }
  const weights = existingCounts.map((c) => c + 1);
  const totalWeight = weights.reduce((n, w) => n + w, 0);
  for (let i = 0; i < remaining; i++) {
    let roll = rng.float() * totalWeight;
    let idx = 0;
    for (; idx < weights.length; idx++) {
      roll -= weights[idx] as number;
      if (roll <= 0) break;
    }
    idx = Math.min(idx, weights.length - 1);
    assigned[idx] = (assigned[idx] as number) + 1;
  }
  // Shuffle which tasks go where is handled by interleaving below.
  return assigned;
}

function pickEffort(rng: Rng, cfg: DemoConfig): number | null {
  if (rng.chance(cfg.unestimatedFraction)) return null;
  const entries = Object.entries(cfg.effortWeights)
    .filter(([k]) => k !== "null")
    .map(([k, w]) => [Number(k), w] as const);
  return rng.weighted(entries);
}

function pickAssignee(rng: Rng, cfg: DemoConfig, userIds: string[]): string | null {
  const [lo, hi] = cfg.unassignedFraction;
  if (rng.float() < lo + rng.float() * Math.max(0, hi - lo)) return null;
  // Tiered workloads: first third of users get ~50% of assignments.
  const n = userIds.length;
  const tier = rng.float();
  const pool =
    tier < 0.5 ? userIds.slice(0, Math.max(1, Math.ceil(n / 3))) : userIds;
  return rng.pick(pool);
}

function pickDueDate(
  rng: Rng,
  cfg: DemoConfig,
  now: Date,
  status: TaskStatus
): Date | null {
  if (rng.chance(cfg.noDueDateFraction)) return null;
  const isOpen =
    status === TaskStatus.BACKLOG ||
    status === TaskStatus.TO_DO ||
    status === TaskStatus.IN_PROGRESS;
  const roll = rng.float();
  if (isOpen && roll < cfg.overdueFraction) {
    // overdue: 1–21 days ago
    return new Date(now.getTime() - (1 + rng.float() * 20) * 86400000);
  }
  if (isOpen && roll < cfg.overdueFraction + 0.25) {
    // due within next 7 days
    return new Date(now.getTime() + rng.float() * 7 * 86400000);
  }
  // future: 8–60 days out
  return new Date(now.getTime() + (8 + rng.float() * 52) * 86400000);
}

export function generateTasks(
  rng: Rng,
  cfg: DemoConfig,
  ctx: CompanyContext,
  now: Date
): GeneratedTask[] {
  const projectCounts = distributeProjects(
    rng,
    ctx.projects.length,
    ctx.projects.map((p) => p.existingTaskCount),
    cfg.taskCount,
    cfg.projectMinShare
  );

  const orderCounters = new Map<string, number>();
  const tasks: GeneratedTask[] = [];
  const titlePool = [...TASK_TITLES];

  ctx.projects.forEach((project, pIdx) => {
    const count = projectCounts[pIdx] ?? 0;
    for (let i = 0; i < count; i++) {
      const status = rng.weighted(
        Object.entries(cfg.statusWeights).map(
          ([s, w]) => [s as TaskStatus, w] as const
        )
      );
      const priority = rng.weighted(
        Object.entries(cfg.priorityWeights).map(
          ([p, w]) => [p as TaskPriority, w] as const
        )
      );
      const effort = pickEffort(rng, cfg);
      const createdAt = pickCreatedAt(rng, now, cfg.timelineBuckets);
      const { startedAt, completedAt } = buildLifecycle(
        rng,
        now,
        status,
        createdAt,
        effort
      );
      const titleBase =
        titlePool.length > 0
          ? (rng.pick(titlePool) as string)
          : `Project work item`;
      const title =
        titleBase.length > 180 ? titleBase.slice(0, 180) : titleBase;
      const description = rng.chance(cfg.descriptionFraction)
        ? rng.pick(TASK_DESCRIPTIONS)
        : null;
      const assigneeId = pickAssignee(
        rng,
        cfg,
        ctx.users.map((u) => u.id)
      );
      const dueDate = pickDueDate(rng, cfg, now, status);
      const orderKey = `${project.id}:${status}`;
      const orderIndex = orderCounters.get(orderKey) ?? 0;
      orderCounters.set(orderKey, orderIndex + 1);

      tasks.push({
        id: randomUUID(),
        title,
        description,
        status,
        priority,
        effortPoints: effort,
        dueDate,
        assigneeId,
        projectId: project.id,
        teamId: project.teamId,
        companyId: ctx.companyId,
        orderIndex,
        createdAt,
        startedAt,
        completedAt,
      });
    }
  });

  // Interleave so insertion order isn't project-grouped.
  for (let i = tasks.length - 1; i > 0; i--) {
    const j = Math.floor(rng.float() * (i + 1));
    const a = tasks[i] as GeneratedTask;
    tasks[i] = tasks[j] as GeneratedTask;
    tasks[j] = a;
  }

  return tasks;
}
