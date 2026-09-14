import type { Rng } from "./random";

/**
 * Timeline + lifecycle timestamp builders. Mirrors
 * src/server/tasks/lifecycle.ts semantics exactly:
 * - BACKLOG/TO_DO: nulls (TO_DO may keep startedAt ~15% as reopened-style)
 * - IN_PROGRESS: startedAt set, completedAt null
 * - COMPLETED: createdAt <= startedAt <= completedAt
 * - CANCELED: completedAt null, ~50% keep startedAt
 */

export type LifecycleTimestamps = {
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function daysAgo(rng: Rng, now: Date, min: number, max: number): Date {
  const days = min + rng.float() * (max - min);
  return new Date(now.getTime() - days * DAY_MS);
}

export function pickCreatedAt(
  rng: Rng,
  now: Date,
  buckets: ReadonlyArray<readonly [string, number, number, number]>
): Date {
  const bucket = rng.weighted(
    buckets.map(([, w, min, max]) => [{ min, max }, w] as const)
  );
  return daysAgo(rng, now, bucket.min, bucket.max);
}

/**
 * Cycle duration in ms, loosely scaled by effort with noise and occasional
 * long runners. Deliberately imperfect correlation.
 */
export function cycleDurationMs(rng: Rng, effort: number | null): number {
  const baseDays =
    effort == null
      ? rng.float() * 6 + 0.5
      : effort <= 2
        ? rng.float() * 3 + 0.25
        : effort <= 5
          ? rng.float() * 9 + 1
          : rng.float() * 21 + 3;
  const longRunner = rng.chance(0.06) ? rng.float() * 30 + 10 : 0;
  return Math.max(
    30 * 60 * 1000,
    (baseDays + longRunner) * DAY_MS * (0.5 + rng.float())
  );
}

export function buildLifecycle(
  rng: Rng,
  now: Date,
  status: string,
  createdAt: Date,
  effort: number | null
): Omit<LifecycleTimestamps, "createdAt"> {
  switch (status) {
    case "IN_PROGRESS": {
      const startedAt = rng.dateBetween(createdAt, now);
      return { startedAt, completedAt: null };
    }
    case "COMPLETED": {
      const span = Math.max(0, now.getTime() - createdAt.getTime());
      const cycle = Math.min(cycleDurationMs(rng, effort), Math.max(span, 1));
      const completedAt = rng.dateBetween(
        new Date(Math.min(createdAt.getTime() + cycle, now.getTime())),
        now
      );
      const earliestStart = createdAt.getTime();
      const latestStart = completedAt.getTime();
      const startedAt = new Date(
        earliestStart + rng.float() * Math.max(0, latestStart - earliestStart)
      );
      return { startedAt, completedAt };
    }
    case "CANCELED": {
      if (rng.chance(0.5)) {
        return { startedAt: rng.dateBetween(createdAt, now), completedAt: null };
      }
      return { startedAt: null, completedAt: null };
    }
    case "TO_DO": {
      // reopened-style history on a minority of todo tasks
      if (rng.chance(0.15)) {
        return { startedAt: rng.dateBetween(createdAt, now), completedAt: null };
      }
      return { startedAt: null, completedAt: null };
    }
    case "BACKLOG":
    default:
      return { startedAt: null, completedAt: null };
  }
}
