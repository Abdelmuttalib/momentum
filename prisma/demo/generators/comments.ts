import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import type { CompanyContext } from "../context";
import type { DemoConfig } from "../config";
import { TASK_COMMENTS } from "../content";
import type { GeneratedTask } from "./tasks";
import type { Rng } from "../random";

export type GeneratedComment = Prisma.CommentCreateManyInput & {
  createdAt: Date;
};

export function generateComments(
  rng: Rng,
  cfg: DemoConfig,
  ctx: CompanyContext,
  tasks: GeneratedTask[],
  now: Date
): GeneratedComment[] {
  const comments: GeneratedComment[] = [];
  const authorIds = ctx.users.map((u) => u.id);

  for (const task of tasks) {
    if (!rng.chance(cfg.commentTaskFraction)) continue;
    const [lo, hi] = cfg.commentsPerTask;
    const n = rng.int(lo, hi);
    const windowEnd =
      task.completedAt && task.completedAt < now ? task.completedAt : now;
    for (let i = 0; i < n; i++) {
      const createdAt = rng.dateBetween(task.createdAt, windowEnd);
      comments.push({
        id: randomUUID(),
        comment: rng.pick(TASK_COMMENTS).slice(0, 2000),
        authorId: rng.pick(authorIds),
        taskId: task.id,
        createdAt,
      });
    }
  }

  return comments;
}
