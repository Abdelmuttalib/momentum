import { AppLayout } from "@/components/layout/app-layout";
import { requireAuthPage } from "@/server/auth-guard";
import type { GetServerSideProps } from "next";
import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight } from "lucide-react";
import { Bar, BarChart, XAxis } from "recharts";
import { CompactPageHeader } from "@/components/common/page-header";
import { ButtonLink } from "@/components/common/button-link";
import { routes } from "@/lib/routes";
import { CreateTask } from "@/components/views/project/tasks/forms/create-task";
import { useSession } from "next-auth/react";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { TaskStatus } from "@prisma/client";
import { useRecentTasks } from "@/features/tasks/hooks/use-recent-tasks";
import { TaskPriorityBadge } from "@/features/tasks/components/task-priority-badge";
import { shortId } from "@/lib/utils";
import { TaskStatusBadge } from "@/features/tasks/components/task-status-badge";
import { UserAvatar } from "@/components/user/user-menu";
import Link from "next/link";
import { DataLoader } from "@/components/data-loader";
import { CBadge } from "@/components/common/cbadge";
import { Text } from "@/components/typography";
import { formatDistanceToNow } from "@/lib/date";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AnalyticsKpiCard } from "@/features/analytics/components/analytics-kpi-card";
import { api, type RouterOutputs } from "@/lib/api";
import { useFormatter, useTranslations } from "next-intl";

export default function DashboardPage() {
  const { data: session } = useSession();
  const t = useTranslations("overview");
  const tCommon = useTranslations("common");
  const companyId = session?.user?.company.id;

  const { data: projects, isLoading: isLoadingProjects } =
    useProjects(companyId);

  const { data: dash, isLoading: isLoadingDash } =
    api.analytics.dashboardOverview.useQuery(undefined, {
      enabled: !!companyId,
    });

  const { data: recentTasks, isLoading: isLoadingRecentTasks } = useRecentTasks(
    {
      companyId: companyId,
    }
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <CompactPageHeader
          title={t("title")}
          description={t("description")}
          actions={<>{projects && <CreateTask projects={projects} />}</>}
        />

        <DataLoader data={dash} isLoading={isLoadingDash}>
          {(d) => (
            <OverviewDashboard dash={d} userId={session?.user?.id ?? ""} />
          )}
        </DataLoader>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Recent Issues */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("recentTasks")}</CardTitle>
                  <CardDescription>
                    {t("recentTasksDescription")}
                  </CardDescription>
                </div>
                <ButtonLink
                  href={routes.tasks.index()}
                  variant="outline"
                  size="sm"
                >
                  {tCommon("viewAll")}
                  <ArrowUpRight className="ms-1 h-4 w-4 rtl:-scale-x-100" />
                </ButtonLink>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <DataLoader data={recentTasks} isLoading={isLoadingRecentTasks}>
                {(data) => (
                  <>
                    {data?.map((task) => (
                      <div
                        key={task.id}
                        className="group relative flex items-center gap-4 rounded-lg border p-3 hover:bg-popover"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              {shortId(task.id)}
                            </span>

                            <TaskPriorityBadge
                              priority={task.priority}
                              size="sm"
                            />
                          </div>
                          <p className="text-sm font-medium">{task.title}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <TaskStatusBadge status={task.status} size="sm" />

                          <UserAvatar user={task.assignee} size="sm" />
                        </div>

                        <ArrowUpRight className="hidden h-4 w-4 text-muted-foreground group-hover:absolute group-hover:end-1 group-hover:top-1 group-hover:block rtl:-scale-x-100" />
                        <Link
                          href={routes.projects.tasks.details({
                            projectId: task.projectId,
                            taskId: task.id,
                          })}
                          className="absolute inset-0"
                        >
                          <span className="sr-only">view task</span>
                        </Link>
                      </div>
                    ))}
                  </>
                )}
              </DataLoader>
            </CardContent>
          </Card>

          {/* Project Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("projectProgress")}</CardTitle>
                  <CardDescription>
                    {t("projectProgressDescription")}
                  </CardDescription>
                </div>
                <ButtonLink
                  href={routes.projects.index()}
                  variant="outline"
                  size="sm"
                >
                  {tCommon("viewAll")}
                  <ArrowUpRight className="ms-1 h-4 w-4 rtl:-scale-x-100" />
                </ButtonLink>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <DataLoader data={projects} isLoading={isLoadingProjects}>
                {(data) => (
                  <OverviewProjectProgress projects={data} />
                )}
              </DataLoader>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

const REASON_KEYS = {
  overdue: "overdue",
  unassigned: "unassigned",
  "due-soon": "dueSoon",
} as const;

function OverviewDashboard({
  dash,
  userId,
}: {
  dash: RouterOutputs["analytics"]["dashboardOverview"];
  userId: string;
}) {
  const t = useTranslations("overview");
  const tCommon = useTranslations("common");
  const myDay = dash.attention.filter((t) => t.assignee?.id === userId);

  return (
    <>
      {/* Snapshot KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsKpiCard title={t("openTasks")} value={String(dash.open)} />
        <AnalyticsKpiCard
          title={t("overdue")}
          value={String(dash.overdue)}
          hint={t("dueWeekHint", { count: dash.dueWeek })}
        />
        <AnalyticsKpiCard
          title={t("dueThisWeek")}
          value={String(dash.dueWeek)}
        />
        <AnalyticsKpiCard
          title={t("myActiveTasks")}
          value={String(dash.myActive)}
          hint={
            dash.myOverdue > 0
              ? t("overdueHint", { count: dash.myOverdue })
              : t("nothingOverdue")
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* My day */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("myDay")}</CardTitle>
                <CardDescription>{t("myDayDescription")}</CardDescription>
              </div>
              <ButtonLink
                href={routes.tasks.index()}
                variant="outline"
                size="sm"
              >
                {t("myTasks")}
                <ArrowUpRight className="ms-1 h-4 w-4 rtl:-scale-x-100" />
              </ButtonLink>
            </div>
          </CardHeader>
          <CardContent>
            {myDay.length === 0 ? (
              <Text size="sm" tone="muted" className="py-4 text-center">
                {t("nothingUrgent")}
              </Text>
            ) : (
              <ul className="flex flex-col gap-2">
                {myDay.map((t) => (
                  <AttentionRow key={t.id} task={t} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Needs attention */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("needsAttention")}</CardTitle>
                <CardDescription>{t("needsAttentionDescription")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {dash.attention.length === 0 ? (
              <Text size="sm" tone="muted" className="py-4 text-center">
                {t("everythingHealthy")}
              </Text>
            ) : (
              <ul className="flex flex-col gap-2">
                {dash.attention.map((t) => (
                  <AttentionRow key={t.id} task={t} showProject />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Week sparkline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("completedThisWeek")}</CardTitle>
              <CardDescription>{t("dailyCompletions")}</CardDescription>
            </div>
            <ButtonLink
              href={routes.analytics.index()}
              variant="outline"
              size="sm"
            >
              {t("fullAnalytics")}
              <ArrowUpRight className="ms-1 h-4 w-4 rtl:-scale-x-100" />
            </ButtonLink>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              completedTasks: {
                label: "Tasks",
                color: "oklch(var(--chart-1))",
              },
            }}
            className="aspect-auto h-28"
          >
            <BarChart
              data={dash.spark.buckets}
              aria-label="Daily completions this week"
            >
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                minTickGap={16}
                interval="preserveStartEnd"
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="completedTasks"
                name="Completed"
                fill="var(--color-completedTasks)"
                radius={[3, 3, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}

function AttentionRow({
  task,
  showProject = false,
}: {
  task: RouterOutputs["analytics"]["dashboardOverview"]["attention"][number];
  showProject?: boolean;
}) {
  const t = useTranslations("overview");
  const format = useFormatter();
  return (
    <li className="flex items-center gap-2 rounded-md border px-3 py-2">
      <div className="min-w-0 flex-1">
        <Link
          href={routes.projects.tasks.details({
            projectId: task.projectId,
            taskId: task.id,
          })}
          className="block truncate text-sm font-medium hover:underline"
        >
          {task.title}
        </Link>
        <Text size="xs" tone="muted">
          {showProject ? `${task.projectName} · ` : ""}
          {t(REASON_KEYS[task.reason] ?? "dueSoon")}
          {task.dueDate
            ? ` · ${t("dueLabel", {
                when: format.relativeTime(new Date(task.dueDate)),
              })}`
            : ""}
        </Text>
      </div>
      <TaskStatusBadge status={task.status} size="sm" />
    </li>
  );
}

function OverviewProjectProgress({
  projects,
}: {
  projects: RouterOutputs["project"]["getProjects"];
}) {
  const t = useTranslations("overview");
  const ranked = [...(projects ?? [])]
    .map((project) => {
      const total = project.tasks.length;
      const done = project.tasks.filter(
        (task) => task.status === TaskStatus.COMPLETED
      ).length;
      return { project, total, done };
    })
    .sort((a, b) => a.done / Math.max(1, a.total) - b.done / Math.max(1, b.total))
    .slice(0, 5);

  if (ranked.length === 0) {
    return (
      <Text size="sm" tone="muted" className="py-4 text-center">
        {t("noProjects")}
      </Text>
    );
  }

  return (
    <>
      {ranked.map(({ project, total, done }) => {
        const percent =
          total === 0 ? 0 : Math.round((done / total) * 100);
        return (
          <div key={project.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{project.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {t("tasksCompleted", {
                                  done,
                                  total,
                                })}
                              </p>
              </div>
              <div className="text-end">
                <p className="text-sm font-medium">{percent}%</p>
              </div>
            </div>
            <Progress value={percent} className="h-2" />
            <div className="flex items-center justify-end text-xs text-muted-foreground">
              <Link
                href={routes.projects.details({
                  projectId: project.id,
                })}
              >
                <CBadge color="gray" size="sm">
                  View
                  <ArrowUpRight className="ms-1 h-3 w-3" />
                </CBadge>
              </Link>
            </div>
          </div>
        );
      })}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuthPage(
  {},
  (_ctx, session) => Promise.resolve({ companyId: session.user.company.id })
);
