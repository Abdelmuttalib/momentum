import type { GeneratedComment } from "./generators/comments";
import type { GeneratedTask } from "./generators/tasks";

export type SmokeIssue = string;

export type VerificationSummary = {
  tasks: number;
  comments: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byEffort: Record<string, number>;
  unestimated: number;
  assigned: number;
  unassigned: number;
  byProject: Record<string, number>;
  byAssignee: Record<string, number>;
  started: number;
  completedWithTimestamps: number;
  overdue: number;
  dueThisWeek: number;
  noDueDate: number;
  completedLast7d: number;
  completedLast30d: number;
  completedLast90d: number;
};

export function summarize(
  tasks: GeneratedTask[],
  comments: GeneratedComment[],
  now: Date
): VerificationSummary {
  const s: VerificationSummary = {
    tasks: tasks.length,
    comments: comments.length,
    byStatus: {},
    byPriority: {},
    byEffort: {},
    unestimated: 0,
    assigned: 0,
    unassigned: 0,
    byProject: {},
    byAssignee: {},
    started: 0,
    completedWithTimestamps: 0,
    overdue: 0,
    dueThisWeek: 0,
    noDueDate: 0,
    completedLast7d: 0,
    completedLast30d: 0,
    completedLast90d: 0,
  };
  const bump = (m: Record<string, number>, k: string) => {
    m[k] = (m[k] ?? 0) + 1;
  };

  for (const t of tasks) {
    bump(s.byStatus, t.status);
    bump(s.byPriority, t.priority as string);
    if (t.effortPoints == null) s.unestimated++;
    else bump(s.byEffort, String(t.effortPoints));
    if (t.assigneeId) {
      s.assigned++;
      bump(s.byAssignee, t.assigneeId as string);
    } else s.unassigned++;
    bump(s.byProject, t.projectId as string);
    if (t.startedAt) s.started++;
    if (t.status === "COMPLETED" && t.startedAt && t.completedAt) {
      s.completedWithTimestamps++;
      const ageDays = (now.getTime() - t.completedAt.getTime()) / 86400000;
      if (ageDays <= 7) s.completedLast7d++;
      if (ageDays <= 30) s.completedLast30d++;
      if (ageDays <= 90) s.completedLast90d++;
    }
    if (!t.dueDate) {
      s.noDueDate++;
    } else if (
      t.dueDate < now &&
      (t.status === "BACKLOG" || t.status === "TO_DO" || t.status === "IN_PROGRESS")
    ) {
      s.overdue++;
    } else if (t.dueDate <= new Date(now.getTime() + 7 * 86400000)) {
      s.dueThisWeek++;
    }
  }
  return s;
}

/**
 * Analytics smoke checks: the dataset must not be degenerate, otherwise the
 * dashboards it is meant to exercise would render empty states.
 */
export function smokeCheck(s: VerificationSummary): SmokeIssue[] {
  const issues: SmokeIssue[] = [];
  if (s.tasks === 0) issues.push("zero tasks generated");
  if ((s.byStatus.COMPLETED ?? 0) === 0) issues.push("zero completions");
  if (s.completedLast7d === 0) issues.push("zero 7-day completion activity");
  if (s.completedLast30d === 0) issues.push("zero 30-day completion activity");
  if (Object.keys(s.byEffort).length <= 1) issues.push("effort has no variation");
  if (Object.keys(s.byProject).length <= 1) issues.push("single-project dataset");
  if (Object.keys(s.byAssignee).length <= 1) issues.push("single-assignee dataset");
  if (s.overdue === 0) issues.push("no overdue tasks");
  if (s.unassigned === 0) issues.push("no unassigned tasks");
  if (s.unestimated === 0) issues.push("no unestimated tasks");
  if (s.noDueDate === 0) issues.push("every task has a due date");
  if (s.completedWithTimestamps === 0 && (s.byStatus.COMPLETED ?? 0) > 0) {
    issues.push("completed tasks lack lifecycle timestamps");
  }
  return issues;
}

export function printSummary(
  companyName: string,
  seed: string,
  preset: string,
  s: VerificationSummary,
  extra: { users: number; teams: number; projects: number; manifest?: string }
): void {
  const line = (k: string, v: string) => console.log(`  ${k}: ${v}`);
  console.log(`\nCompany: ${companyName} | seed: ${seed} | preset: ${preset}`);
  console.log("Context:");
  line("Users", String(extra.users));
  line("Teams", String(extra.teams));
  line("Projects", String(extra.projects));
  console.log("Created:");
  line("Tasks", String(s.tasks));
  line("Comments", String(s.comments));
  console.log("Task status:");
  for (const [k, v] of Object.entries(s.byStatus)) line(`  ${k}`, String(v));
  console.log("Effort:");
  line("Estimated", String(s.tasks - s.unestimated));
  line("Unestimated", String(s.unestimated));
  for (const [k, v] of Object.entries(s.byEffort)) line(`  ${k} pts`, String(v));
  console.log("Lifecycle:");
  line("Started", String(s.started));
  line("Completed w/ timestamps", String(s.completedWithTimestamps));
  console.log("Dates:");
  line("Overdue", String(s.overdue));
  line("Due this week", String(s.dueThisWeek));
  line("No due date", String(s.noDueDate));
  line("Completed 7d/30d/90d", `${s.completedLast7d}/${s.completedLast30d}/${s.completedLast90d}`);
  console.log("Distribution:");
  line("Projects used", String(Object.keys(s.byProject).length));
  line("Assignees used", String(Object.keys(s.byAssignee).length));
  line("Assigned/Unassigned", `${s.assigned}/${s.unassigned}`);
  if (extra.manifest) line("Manifest", extra.manifest);
  console.log("");
}
