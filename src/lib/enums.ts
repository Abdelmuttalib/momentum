// enums.ts

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TO_DO = "TO_DO",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export enum Priority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

/**
 * Relative effort/complexity estimation scale (Fibonacci-like).
 * NOT hours, NOT a performance measure. NULL means "not estimated" —
 * never use 0. Single source shared by Zod validation and UI.
 */
export const EFFORT_SCALE = [1, 2, 3, 5, 8, 13] as const;

export type EffortPoints = (typeof EFFORT_SCALE)[number];
