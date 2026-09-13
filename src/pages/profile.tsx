import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { CompactPageHeader } from "@/components/common/page-header";
import { DataLoader } from "@/components/data-loader";
import { EmptyState } from "@/components/common/empty-state";
import { Heading, Text } from "@/components/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/common/button-link";
import { UserRoleBadge } from "@/features/users/components/user-role-badge";
import { TaskStatusBadge } from "@/features/tasks/components/task-status-badge";
import { api } from "@/lib/api";
import { requireAuthPage } from "@/server/auth-guard";
import { Seo } from "@/components/seo";
import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";
import { formatDistanceToNow } from "@/lib/date";
import { formatDuration } from "@/lib/analytics/format";
import { AnalyticsKpiCard } from "@/features/analytics/components/analytics-kpi-card";
import { AnalyticsSection } from "@/features/analytics/components/analytics-section";
import { CompletionTrendChart } from "@/features/analytics/components/completion-trend-chart";
import { TaskStatusChart } from "@/features/analytics/components/task-status-chart";

type Range = "7d" | "30d" | "90d" | "all";

const RANGES: { value: Range; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "all", label: "All time" },
];

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Text size="xs" tone="muted" as="span" className="w-20 shrink-0 pt-0.5">
        {label}
      </Text>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function ProfilePage() {
  const { data: session } = useSession();
  const t = useTranslations("profile");
  const userId = session?.user?.id;
  const [range, setRange] = useState<Range>("30d");

  const { data: user, isLoading, error } = api.user.getUser.useQuery(
    { userId: userId ?? "" },
    { enabled: !!userId }
  );
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
  } = api.analytics.userOverview.useQuery(
    { range },
    { enabled: !!userId }
  );

  return (
    <AppLayout>
      <Seo title="Profile" />
      <div className="flex flex-col gap-4">
        <CompactPageHeader
          title={t("title")}
          description={t("description")}
          actions={
            <ButtonLink href="/settings/profile" variant="outline" size="sm">
              {t("editProfile")}
            </ButtonLink>
          }
        />

        <DataLoader data={user} isLoading={isLoading} error={error}>
          {(data) => (
            <div className="flex flex-col gap-4 rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={
                      data.image ??
                      `https://avatar.vercel.sh/${data.email}`
                    }
                    alt={data.name}
                  />
                  <AvatarFallback>{data.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <Heading level="section" className="truncate">
                    {data.name}
                  </Heading>
                  <Text size="sm" tone="muted" className="truncate">
                    {data.email}
                  </Text>
                </div>
                <span className="ms-auto shrink-0">
                  <UserRoleBadge role={data.role} />
                </span>
              </div>

              <Separator />

              <div className="flex flex-col gap-2.5">
                <MetaRow label={t("workspace")}>
                  <Text size="sm">{session?.user?.company?.name ?? "—"}</Text>
                </MetaRow>
              </div>
            </div>
          )}
        </DataLoader>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <Heading level="subsection">My performance</Heading>
          <div
            role="group"
            aria-label="Date range"
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
                {r.label}
              </Button>
            ))}
          </div>
        </div>

        <DataLoader data={stats} isLoading={isLoadingStats} error={statsError}>
          {(s) => (
            <div className="flex flex-col gap-6">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <AnalyticsKpiCard
                  title="Active tasks"
                  value={String(s.kpis.active)}
                  hint={
                    s.kpis.overdue > 0
                      ? `${s.kpis.overdue} overdue`
                      : "Nothing overdue"
                  }
                />
                <AnalyticsKpiCard
                  title="Due this week"
                  value={String(s.kpis.dueThisWeek)}
                />
                <AnalyticsKpiCard
                  title="Completed"
                  value={String(s.kpis.completedInRange)}
                  hint={`${s.kpis.completedEffort} pts delivered`}
                />
                <AnalyticsKpiCard
                  title="Avg cycle time"
                  value={formatDuration(s.kpis.avgCycleTimeMs)}
                  hint={
                    s.kpis.cycleTimeSampleSize > 0
                      ? `From ${s.kpis.cycleTimeSampleSize} tracked completions`
                      : "No lifecycle data yet"
                  }
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <CompletionTrendChart
                  buckets={s.trend.buckets}
                  granularity={s.trend.granularity}
                  hasCompletions={s.kpis.completedInRange > 0}
                />
                <TaskStatusChart data={s.byStatus} />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <AnalyticsSection title="Current workload">
                  {s.workload.length === 0 ? (
                    <Text size="sm" tone="muted" className="py-4 text-center">
                      Nothing assigned — enjoy the calm.
                    </Text>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {s.workload.map((t) => (
                        <li
                          key={t.id}
                          className="flex items-center gap-2 rounded-md border px-3 py-2"
                        >
                          <div className="min-w-0 flex-1">
                            <Link
                              href={routes.projects.tasks.details({
                                projectId: t.projectId,
                                taskId: t.id,
                              })}
                              className="block truncate text-sm font-medium hover:underline"
                            >
                              {t.title}
                            </Link>
                            <Text size="xs" tone="muted">
                              {t.projectName}
                              {t.dueDate
                                ? ` · due ${formatDistanceToNow(t.dueDate)}`
                                : ""}
                              {t.overdue ? " · overdue" : ""}
                            </Text>
                          </div>
                          <TaskStatusBadge status={t.status} size="sm" />
                        </li>
                      ))}
                    </ul>
                  )}
                </AnalyticsSection>

                <AnalyticsSection title="Recent completions">
                  {s.recent.length === 0 ? (
                    <Text size="sm" tone="muted" className="py-4 text-center">
                      No completions in this range yet.
                    </Text>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {s.recent.map((t) => (
                        <li
                          key={t.id}
                          className="flex items-center gap-2 rounded-md border px-3 py-2"
                        >
                          <div className="min-w-0 flex-1">
                            <Link
                              href={routes.projects.tasks.details({
                                projectId: t.projectId,
                                taskId: t.id,
                              })}
                              className="block truncate text-sm font-medium hover:underline"
                            >
                              {t.title}
                            </Link>
                            <Text size="xs" tone="muted">
                              {t.projectName}
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

              <AnalyticsSection title="Work by project">
                {s.byProject.length === 0 ? (
                  <EmptyState
                    title="No project activity"
                    description="Tasks you complete or hold will show up here by project."
                  />
                ) : (
                  <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {s.byProject.map((p) => (
                      <li
                        key={p.id}
                        className="flex flex-col gap-1 rounded-lg border p-3"
                      >
                        <Link
                          href={routes.projects.details({ projectId: p.id })}
                          className="truncate text-sm font-medium hover:underline"
                        >
                          {p.name}
                        </Link>
                        <Text size="xs" tone="muted">
                          {p.completed} completed · {p.active} active ·{" "}
                          {p.effort} pts
                        </Text>
                      </li>
                    ))}
                  </ul>
                )}
              </AnalyticsSection>
            </div>
          )}
        </DataLoader>
      </div>
    </AppLayout>
  );
}

export default ProfilePage;

export const getServerSideProps: GetServerSideProps = requireAuthPage();
