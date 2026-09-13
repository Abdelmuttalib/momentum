import {
  useProject,
  useProjects,
} from "@/features/projects/hooks/use-projects";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Seo } from "@/components/seo";
import { requireAuthPage } from "@/server/auth-guard";
import { type GetServerSideProps } from "next";

import { Button } from "@/components/ui/button";
import { DataLoader } from "@/components/data-loader";
import { Stack } from "@/components/page-components";
import { CompactPageHeader } from "@/components/common/page-header";
import { Heading, Text } from "@/components/typography";
import { Progress } from "@/components/ui/progress";
import { CreateTask } from "@/components/views/project/tasks/forms/create-task";
import { useSession } from "next-auth/react";
import { CBadge } from "@/components/common/cbadge";
import { ButtonLink } from "@/components/common/button-link";
import { routes } from "@/lib/routes";
import { api, type RouterOutputs } from "@/lib/api";
import { cn } from "@/lib/cn";
import { formatDistanceToNow } from "@/lib/date";
import { formatDuration } from "@/lib/analytics/format";
import { TaskStatusBadge } from "@/features/tasks/components/task-status-badge";
import { AnalyticsKpiCard } from "@/features/analytics/components/analytics-kpi-card";
import { AnalyticsSection } from "@/features/analytics/components/analytics-section";
import { CompletionTrendChart } from "@/features/analytics/components/completion-trend-chart";
import { TaskStatusChart } from "@/features/analytics/components/task-status-chart";
import { ContributorTable } from "@/features/analytics/components/contributor-table";
import { TaskFilterView } from "@/features/tasks/components/task-filter-view";
import { useFormatter, useTranslations } from "next-intl";

type Range = "7d" | "30d" | "90d" | "all";

const RANGES: { value: Range; labelKey: "range7d" | "range30d" | "range90d" | "rangeAll" }[] = [
  { value: "7d", labelKey: "range7d" },
  { value: "30d", labelKey: "range30d" },
  { value: "90d", labelKey: "range90d" },
  { value: "all", labelKey: "rangeAll" },
];

export default function ProjectPage() {
  const { query } = useRouter();
  const t = useTranslations("projects");
  const projectId = query.projectId as string;
  const { data: session } = useSession();
  const companyId = session?.user?.company.id;

  const { data: project, isLoading, error } = useProject(projectId);
  const { data: projects } = useProjects(companyId);

  return (
    <>
      <Seo title={`${project?.name} | Momentum`} />

      <AppLayout>
        <Stack spacing="section">
          <CompactPageHeader
            title={project?.name ?? t("title")}
            description={
              project?.description || t("noDescription")
            }
            actions={
              <>
                <ButtonLink
                  href={routes.projects.tasks.index({ projectId })}
                  size="sm"
                >
                  {t("openBoard")}
                </ButtonLink>
                <ButtonLink
                  href={routes.projects.edit({ projectId })}
                  variant="outline"
                  size="sm"
                >
                  {t("edit")}
                </ButtonLink>
                <CreateTask
                  projectId={projectId}
                  projects={projects}
                  triggerButton={
                    <Button size="sm" variant="outline">
                      {t("addTask")}
                    </Button>
                  }
                />
              </>
            }
          />

          <DataLoader data={project} isLoading={isLoading} error={error}>
            {(data) => (
              <Stack spacing="section">
                <ProjectAnalyticsPanel projectId={data.id} />

                {/* Tasks */}
                <section className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Heading level="subsection">{t("tasks")}</Heading>
                      <CBadge color="gray" size="sm">
                        {data?.tasks?.length}{" "}
                        {t("taskCount", { count: data.tasks.length })}
                      </CBadge>
                    </div>
                    <Text size="sm" tone="muted">
                      {t("manageTasks")}
                    </Text>
                  </div>

                  <ProjectDetailsTasksView data={data} />
                </section>
              </Stack>
            )}
          </DataLoader>
        </Stack>
      </AppLayout>
    </>
  );
}

function ProjectAnalyticsPanel({ projectId }: { projectId: string }) {
  const [range, setRange] = useState<Range>("30d");
  const tp = useTranslations("projects");
  const tAnalytics = useTranslations("analytics");
  const format = useFormatter();
  const {
    data: analytics,
    isLoading,
    error,
  } = api.analytics.projectOverview.useQuery({ projectId, range });

  return (
    <DataLoader data={analytics} isLoading={isLoading} error={error}>
      {(data) => (
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Heading level="subsection">{tp("health")}</Heading>
            <div
              role="group"
              aria-label={tp("health")}
              className="flex items-center rounded-md border p-0.5"
            >
              {RANGES.map((r) => (
                <Button
                  key={r.value}
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-pressed={range === r.value}
                  onClick={() => setRange(r.value)}
                  className={cn(
                    "h-7 px-2 text-xs",
                    range === r.value && "bg-accent text-accent-foreground"
                  )}
                >
                  {tp(r.labelKey)}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <AnalyticsKpiCard
              title={tp("tasks")}
              value={`${format.number(data.kpis.completedTasks)}/${format.number(data.kpis.totalTasks)}`}
              hint={tp("tasksActive", { count: data.kpis.openTasks })}
            />
            <AnalyticsKpiCard
              title={tp("completion")}
              value={
                data.kpis.completionRate == null
                  ? "—"
                  : tAnalytics("percentValue", {
                      value: format.number(data.kpis.completionRate, {
                        maximumFractionDigits: 1,
                      }),
                    })
              }
              hint={tAnalytics("completionSnapshotHint")}
            />
            <AnalyticsKpiCard
              title={tAnalytics("remainingEffort")}
              value={tAnalytics("points", { count: data.kpis.remainingEffort })}
              hint={
                data.kpis.unestimatedOpen > 0
                  ? tAnalytics("openUnestimated", { count: data.kpis.unestimatedOpen })
                  : tAnalytics("allEstimated")
              }
            />
            <AnalyticsKpiCard
              title={tAnalytics("avgCycleTime")}
              value={formatDuration(data.kpis.avgCycleTimeMs)}
              hint={
                data.kpis.cycleTimeSampleSize > 0
                  ? tAnalytics("cycleTimeHint", { count: data.kpis.cycleTimeSampleSize })
                  : tAnalytics("noLifecycleData")
              }
            />
          </div>

          <div className="flex flex-col gap-2 rounded-lg border bg-muted/40 p-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <Text size="sm" weight="medium">
                {tp("effortProgress", {
                  done: data.kpis.completedEffort,
                  total:
                    data.kpis.completedEffort + data.kpis.remainingEffort,
                })}
              </Text>
              <Text size="xs" tone="muted" className="ms-auto">
                {data.lastActivityAt
                  ? tp("lastActivity", {
                      when: formatDistanceToNow(data.lastActivityAt),
                    })
                  : tp("noActivity")}
              </Text>
            </div>
            <Progress
              value={
                data.kpis.completedEffort + data.kpis.remainingEffort === 0
                  ? 0
                  : Math.round(
                      (data.kpis.completedEffort /
                        (data.kpis.completedEffort + data.kpis.remainingEffort)) *
                        100
                    )
              }
              className="h-1.5"
            />
          </div>

          <CompletionTrendChart
            buckets={data.trend.buckets}
            granularity={data.trend.granularity}
            hasCompletions={data.kpis.completedTasks > 0}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <TaskStatusChart data={data.status} />
            <AnalyticsSection title="Contributors">
              {data.contributors.length === 0 ? (
                <Text size="sm" tone="muted" className="py-4 text-center">
                  No contributor activity in this range.
                </Text>
              ) : (
                <ContributorTable contributors={data.contributors} />
              )}
            </AnalyticsSection>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <AnalyticsSection title="Remaining work">
              {data.remaining.length === 0 ? (
                <Text size="sm" tone="muted" className="py-4 text-center">
                  Nothing open — nice work.
                </Text>
              ) : (
                <ul className="flex flex-col gap-2">
                  {data.remaining.map((t) => (
                    <li
                      key={t.id}
                      className="flex items-center gap-2 rounded-md border px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <Link
                          href={routes.projects.tasks.details({
                            projectId,
                            taskId: t.id,
                          })}
                          className="block truncate text-sm font-medium hover:underline"
                        >
                          {t.title}
                        </Link>
                        <Text size="xs" tone="muted">
                          {t.assignee ? t.assignee.name : "Unassigned"}
                          {t.dueDate
                            ? ` · due ${formatDistanceToNow(t.dueDate)}`
                            : ""}
                          {t.effortPoints != null
                            ? ` · ${t.effortPoints} pts`
                            : ""}
                        </Text>
                      </div>
                      <TaskStatusBadge status={t.status} size="sm" />
                    </li>
                  ))}
                </ul>
              )}
            </AnalyticsSection>

            <AnalyticsSection title="Recent completions">
              {data.recent.length === 0 ? (
                <Text size="sm" tone="muted" className="py-4 text-center">
                  No completions in this range.
                </Text>
              ) : (
                <ul className="flex flex-col gap-2">
                  {data.recent.map((t) => (
                    <li
                      key={t.id}
                      className="flex items-center gap-2 rounded-md border px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <Link
                          href={routes.projects.tasks.details({
                            projectId,
                            taskId: t.id,
                          })}
                          className="block truncate text-sm font-medium hover:underline"
                        >
                          {t.title}
                        </Link>
                        <Text size="xs" tone="muted">
                          {t.assignee ? t.assignee.name : "Unassigned"}
                          {t.completedAt
                            ? ` · ${formatDistanceToNow(t.completedAt)}`
                            : ""}
                        </Text>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </AnalyticsSection>
          </div>
        </div>
      )}
    </DataLoader>
  );
}

export function ProjectDetailsTasksView({
  data,
}: {
  data: RouterOutputs["project"]["getProject"];
}) {
  if (!data) return null;
  return <TaskFilterView tasks={data.tasks} />;
}

export const getServerSideProps: GetServerSideProps = requireAuthPage();
