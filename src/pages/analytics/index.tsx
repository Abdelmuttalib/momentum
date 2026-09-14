import { useState } from "react";
import { type GetServerSideProps } from "next";
import { AppLayout } from "@/components/layout/app-layout";
import { requireAuthPage } from "@/server/auth-guard";
import { CompactPageHeader } from "@/components/common/page-header";
import { DataLoader } from "@/components/data-loader";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api, type RouterOutputs } from "@/lib/api";
import { cn } from "@/lib/cn";
import { formatDuration } from "@/lib/analytics/format";
import { useFormatter, useTranslations } from "next-intl";
import { ContributorTable } from "@/features/analytics/components/contributor-table";
import { AnalyticsKpiCard } from "@/features/analytics/components/analytics-kpi-card";
import { AnalyticsSection } from "@/features/analytics/components/analytics-section";
import { CompletionTrendChart } from "@/features/analytics/components/completion-trend-chart";
import { TaskStatusChart } from "@/features/analytics/components/task-status-chart";
import { ProjectEffortChart } from "@/features/analytics/components/project-effort-chart";
import { ContributorEffortChart } from "@/features/analytics/components/contributor-effort-chart";

type Overview = RouterOutputs["analytics"]["companyOverview"];
type Range = "7d" | "30d" | "90d" | "all";

const RANGES: { value: Range; labelKey: "range7d" | "range30d" | "range90d" | "rangeAll" }[] = [
  { value: "7d", labelKey: "range7d" },
  { value: "30d", labelKey: "range30d" },
  { value: "90d", labelKey: "range90d" },
  { value: "all", labelKey: "rangeAll" },
];

const RANGE_NOUN_KEYS = {
  "7d": "range7d",
  "30d": "range30d",
  "90d": "range90d",
  all: "rangeAll",
} as const;

function AnalyticsPage() {
  const [range, setRange] = useState<Range>("30d");
  const t = useTranslations("analytics");
  const { data, isLoading, error } =
    api.analytics.companyOverview.useQuery({ range });

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <CompactPageHeader
          title={t("title")}
          description={t("description")}
          actions={
            <div
              role="group"
              aria-label={t("title")}
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
                  {t(r.labelKey)}
                </Button>
              ))}
            </div>
          }
        />

        <DataLoader data={data} isLoading={isLoading} error={error}>
          {(overview) => <AnalyticsDashboard data={overview} range={range} />}
        </DataLoader>
      </div>
    </AppLayout>
  );
}

function AnalyticsDashboard({ data, range }: { data: Overview; range: Range }) {
  const t = useTranslations("analytics");
  const format = useFormatter();
  const totalTracked = data.byStatus.reduce((n, s) => n + s.count, 0);
  if (totalTracked === 0) {
    return (
      <EmptyState
        title={t("noDataTitle")}
        description={t("noDataDescription")}
      />
    );
  }

  const { kpis } = data;

  return (
    <div className="flex flex-col gap-6">
      <AnalyticsSection title={t("now")} ariaLabel={t("now")}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <AnalyticsKpiCard title={t("openTasks")} value={format.number(kpis.openTasks)} />
          <AnalyticsKpiCard
            title={t("activeProjects")}
            value={format.number(kpis.activeProjects)}
            hint={t("activeProjectsHint")}
          />
          <AnalyticsKpiCard
            title={t("remainingEffort")}
            value={t("points", { count: kpis.remainingEffort })}
            hint={
              kpis.unestimatedOpen > 0
                ? t("openUnestimated", { count: kpis.unestimatedOpen })
                : t("allEstimated")
            }
          />
          <AnalyticsKpiCard
            title={t("completionSnapshot")}
            value={
              kpis.completionSnapshot == null
                ? "—"
                : t("percentValue", {
                    value: format.number(kpis.completionSnapshot, {
                      maximumFractionDigits: 1,
                    }),
                  })
            }
            hint={t("completionSnapshotHint")}
          />
        </div>
      </AnalyticsSection>

      <AnalyticsSection title={t(RANGE_NOUN_KEYS[range])} ariaLabel={t(RANGE_NOUN_KEYS[range])}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <AnalyticsKpiCard
            title={t("completedTasks")}
            value={format.number(kpis.completedTasks)}
          />
          <AnalyticsKpiCard
            title={t("completedEffort")}
            value={t("points", { count: kpis.completedEffort })}
            hint={
              kpis.unestimatedCompletedCount > 0
                ? t("completedUnestimated", {
                    count: kpis.unestimatedCompletedCount,
                  })
                : t("allCompletionsEstimated")
            }
          />
          <AnalyticsKpiCard
            title={t("avgCycleTime")}
            value={formatDuration(kpis.avgCycleTimeMs)}
            hint={
              kpis.cycleTimeSampleSize > 0
                ? t("cycleTimeHint", { count: kpis.cycleTimeSampleSize })
                : t("noLifecycleData")
            }
          />
        </div>
      </AnalyticsSection>

      <CompletionTrendChart
        buckets={data.trends.buckets}
        granularity={data.trends.granularity}
        hasCompletions={kpis.completedTasks > 0}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <TaskStatusChart data={data.byStatus} />
        <ProjectEffortChart
          projects={data.byProject.projects}
          moreCount={data.byProject.moreCount}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("contributorsTitle")}</CardTitle>
          <CardDescription>{t("contributorsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <ContributorEffortChart contributors={data.contributors} />
          <ContributorTable contributors={data.contributors} />
        </CardContent>
      </Card>
    </div>
  );
}

export default AnalyticsPage;

export const getServerSideProps: GetServerSideProps = requireAuthPage();
