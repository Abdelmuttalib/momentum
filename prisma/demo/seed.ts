import { PrismaClient, TaskStatus } from "@prisma/client";
import { promises as fs } from "fs";
import { join } from "path";
import type { CompanyContext } from "./context";
import type { GeneratedTask } from "./generators/tasks";
import type { GeneratedComment } from "./generators/comments";

export type Manifest = {
  companyId: string;
  seed: string;
  preset: string;
  taskCount: number;
  generatedAt: string;
  taskIds: string[];
  commentIds: string[];
};

export function manifestPath(companyId: string) {
  // Sanitized: companyId is a uuid in practice; strip anything else.
  const safe = companyId.replace(/[^a-zA-Z0-9-]/g, "");
  return join(__dirname, `.manifest.${safe}.json`);
}

export async function manifestExists(companyId: string): Promise<boolean> {
  try {
    await fs.access(manifestPath(companyId));
    return true;
  } catch {
    return false;
  }
}

export async function writeManifest(manifest: Manifest): Promise<string> {
  const path = manifestPath(manifest.companyId);
  await fs.writeFile(path, JSON.stringify(manifest, null, 2));
  return path;
}

/**
 * Validates every generated record against the target company BEFORE any
 * write. Throws with itemized errors on the first problem class found.
 */
export function validateDataset(
  ctx: CompanyContext,
  tasks: GeneratedTask[],
  comments: GeneratedComment[]
): void {
  const errors: string[] = [];
  const userIds = new Set(ctx.users.map((u) => u.id));
  const projectById = new Map(ctx.projects.map((p) => [p.id, p]));
  const taskById = new Map(tasks.map((t) => [t.id, t]));
  const validStatuses = new Set(Object.values(TaskStatus));
  const validEffort = new Set([1, 2, 3, 5, 8, 13]);

  tasks.forEach((t, i) => {
    const tag = `task[${i}]`;
    if (t.companyId !== ctx.companyId) errors.push(`${tag}: wrong companyId`);
    const project = projectById.get(t.projectId as string);
    if (!project) {
      errors.push(`${tag}: unknown projectId`);
    } else if ((t.teamId ?? null) !== project.teamId) {
      errors.push(`${tag}: teamId does not match project team`);
    }
    if (t.assigneeId != null && !userIds.has(t.assigneeId)) {
      errors.push(`${tag}: assignee not in company`);
    }
    if (!validStatuses.has(t.status as TaskStatus)) {
      errors.push(`${tag}: invalid status`);
    }
    if (t.effortPoints != null && !validEffort.has(t.effortPoints)) {
      errors.push(`${tag}: invalid effort ${t.effortPoints}`);
    }
    if (typeof t.title !== "string" || t.title.length < 1 || t.title.length > 200) {
      errors.push(`${tag}: invalid title length`);
    }
    if (!Number.isInteger(t.orderIndex) || (t.orderIndex as number) < 0) {
      errors.push(`${tag}: invalid orderIndex`);
    }
    const { createdAt, startedAt, completedAt } = t;
    if (!(createdAt instanceof Date)) errors.push(`${tag}: bad createdAt`);
    if (t.status === TaskStatus.COMPLETED) {
      if (!startedAt || !completedAt) errors.push(`${tag}: completed missing lifecycle`);
      else if (!(createdAt <= startedAt && startedAt <= completedAt)) {
        errors.push(`${tag}: impossible lifecycle order`);
      }
    }
    if (
      (t.status === TaskStatus.BACKLOG || t.status === TaskStatus.TO_DO) &&
      completedAt
    ) {
      errors.push(`${tag}: ${t.status} must not have completedAt`);
    }
    if (t.status === TaskStatus.IN_PROGRESS && (!startedAt || completedAt)) {
      errors.push(`${tag}: IN_PROGRESS lifecycle invalid`);
    }
    if (t.status === TaskStatus.CANCELED && completedAt) {
      errors.push(`${tag}: CANCELED must not have completedAt`);
    }
  });

  comments.forEach((c, i) => {
    const tag = `comment[${i}]`;
    if (!userIds.has(c.authorId as string)) {
      errors.push(`${tag}: author not in company`);
    }
    const task = taskById.get(c.taskId as string);
    if (!task) {
      errors.push(`${tag}: unknown taskId`);
    } else {
      if (c.createdAt < task.createdAt) errors.push(`${tag}: before task creation`);
      const end = task.completedAt && task.completedAt < new Date() ? task.completedAt : new Date();
      if (c.createdAt > end) errors.push(`${tag}: after lifecycle window`);
    }
    if (
      typeof c.comment !== "string" ||
      c.comment.length < 1 ||
      c.comment.length > 2000
    ) {
      errors.push(`${tag}: invalid comment length`);
    }
  });

  if (errors.length > 0) {
    throw new Error(
      `Dataset validation failed with ${errors.length} error(s):\n` +
        errors.slice(0, 25).join("\n")
    );
  }
}

export async function insertDataset(
  prisma: PrismaClient,
  tasks: GeneratedTask[],
  comments: GeneratedComment[],
  batchSize = 150
): Promise<void> {
  for (let i = 0; i < tasks.length; i += batchSize) {
    await prisma.task.createMany({ data: tasks.slice(i, i + batchSize) });
  }
  for (let i = 0; i < comments.length; i += batchSize) {
    await prisma.comment.createMany({ data: comments.slice(i, i + batchSize) });
  }
}
