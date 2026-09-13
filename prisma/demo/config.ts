/**
 * Centralized demo-dataset configuration. All distributions live here —
 * never scattered literals in generators.
 */

export type DemoPresetName = "small" | "demo" | "large";

export const DEMO_PRESETS: Record<DemoPresetName, { taskCount: number }> = {
  small: { taskCount: 100 },
  demo: { taskCount: 300 },
  large: { taskCount: 1000 },
};

export type DemoConfig = {
  companyId: string;
  seed: string;
  taskCount: number;
  /** fraction of tasks left unassigned */
  unassignedFraction: [number, number];
  /** fraction of tasks with NULL effort */
  unestimatedFraction: number;
  /** fraction of tasks with NULL dueDate */
  noDueDateFraction: number;
  /** fraction of dated open tasks that are overdue */
  overdueFraction: number;
  /** fraction of tasks with descriptions */
  descriptionFraction: number;
  /** fraction of tasks receiving comments + comments per task */
  commentTaskFraction: number;
  commentsPerTask: [number, number];
  statusWeights: Record<string, number>;
  priorityWeights: Record<string, number>;
  effortWeights: Record<number | "null", number>;
  /** timeline bucket weights: [label, weight, daysAgoMin, daysAgoMax] */
  timelineBuckets: ReadonlyArray<readonly [string, number, number, number]>;
  /** minimum share of tasks per project (floor before activity weighting) */
  projectMinShare: number;
};

export const DEFAULT_DEMO_CONFIG: Omit<DemoConfig, "companyId" | "seed" | "taskCount"> = {
  unassignedFraction: [0.15, 0.3],
  unestimatedFraction: 0.2,
  noDueDateFraction: 0.2,
  overdueFraction: 0.25,
  descriptionFraction: 0.4,
  commentTaskFraction: 0.25,
  commentsPerTask: [1, 4],
  statusWeights: {
    BACKLOG: 15,
    TO_DO: 20,
    IN_PROGRESS: 15,
    COMPLETED: 40,
    CANCELED: 10,
  },
  priorityWeights: { HIGH: 20, MEDIUM: 50, LOW: 30 },
  effortWeights: { 1: 20, 2: 22, 3: 20, 5: 18, 8: 8, 13: 3, null: 20 },
  timelineBuckets: [
    ["90-60d", 15, 60, 90],
    ["60-30d", 25, 30, 60],
    ["30-14d", 30, 14, 30],
    ["14-0d", 30, 0, 14],
  ],
  projectMinShare: 0.05,
};

export function resolveConfig(env: NodeJS.ProcessEnv): DemoConfig {
  const companyId = (env.COMPANY_ID ?? "").trim();
  if (!companyId) {
    throw new Error(
      "COMPANY_ID is required. Example: COMPANY_ID=<id> npm run db:seed:demo"
    );
  }
  const seed = (env.DEMO_SEED ?? "").trim() || "momentum-demo-2026";
  const presetRaw = (env.DEMO_PRESET ?? "demo").trim() as DemoPresetName;
  const preset = DEMO_PRESETS[presetRaw] ?? DEMO_PRESETS.demo;
  const countRaw = Number.parseInt(env.DEMO_COUNT ?? "", 10);
  const taskCount =
    Number.isFinite(countRaw) && countRaw > 0 ? countRaw : preset.taskCount;
  return { ...DEFAULT_DEMO_CONFIG, companyId, seed, taskCount };
}
