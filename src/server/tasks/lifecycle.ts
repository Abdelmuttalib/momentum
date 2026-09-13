import { TaskStatus } from "@prisma/client";

export type LifecyclePatch = {
  startedAt?: Date;
  completedAt?: Date | null;
};

type PreviousState = {
  status: TaskStatus;
  startedAt: Date | null;
} | null;

/**
 * Single reusable implementation of task lifecycle timestamp logic.
 * Server-controlled only — clients control status, the server derives
 * timestamps. Call AFTER ownership/company checks, merge the patch into
 * the Prisma update/create data with lifecycle fields winning.
 *
 * Semantics:
 * - First entry into IN_PROGRESS sets startedAt once, forever preserved
 *   (reopening never resets it).
 * - Entry into COMPLETED sets completedAt; leaving COMPLETED clears it;
 *   re-completing records a fresh timestamp.
 * - `prev === null` means creation.
 */
export function applyTaskStatusLifecycle(
  prev: PreviousState,
  nextStatus: TaskStatus,
  now: Date = new Date()
): LifecyclePatch {
  // Creation.
  if (prev === null) {
    if (nextStatus === TaskStatus.COMPLETED) {
      return { startedAt: now, completedAt: now };
    }
    if (nextStatus === TaskStatus.IN_PROGRESS) {
      return { startedAt: now };
    }
    return {};
  }

  const patch: LifecyclePatch = {};
  const wasCompleted = prev.status === TaskStatus.COMPLETED;
  const willComplete = nextStatus === TaskStatus.COMPLETED;

  if (nextStatus === TaskStatus.IN_PROGRESS && !prev.startedAt) {
    patch.startedAt = now;
  }

  if (willComplete && !wasCompleted) {
    patch.completedAt = now;
  } else if (!willComplete && wasCompleted) {
    patch.completedAt = null;
  }

  return patch;
}
