import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Text } from "@/components/typography";
import type { RouterOutputs } from "@/lib/api";
import { useTranslations } from "next-intl";

type TrendBuckets =
  RouterOutputs["analytics"]["companyOverview"]["trends"]["buckets"];

export function CompletionTrendChart({
  buckets,
  granularity,
  hasCompletions,
}: {
  buckets: TrendBuckets;
  granularity: "day" | "week" | "month";
  hasCompletions: boolean;
}) {
  const t = useTranslations("analytics");
  const trendConfig = {
    completedTasks: { label: t("completedTasks"), color: "oklch(var(--chart-1))" },
    completedEffort: { label: t("completedEffort"), color: "oklch(var(--chart-2))" },
  } satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("trendTitle")}</CardTitle>
        <CardDescription>
          {t("trendDescription", {
            granularity: t(granularity === "day" ? "day" : granularity === "week" ? "week" : "month"),
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasCompletions ? (
          <Text size="sm" tone="muted" className="py-6 text-center">
            {t("noCompletions")}
          </Text>
        ) : (
          <ChartContainer config={trendConfig} className="aspect-auto h-56 sm:h-64">
            <ComposedChart data={buckets} aria-label={t("trendTitle")}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                minTickGap={24}
                interval="preserveStartEnd"
              />
              <YAxis
                yAxisId="tasks"
                tickLine={false}
                axisLine={false}
                width={32}
                allowDecimals={false}
              />
              <YAxis
                yAxisId="effort"
                orientation="right"
                tickLine={false}
                axisLine={false}
                width={32}
                allowDecimals={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend content={<ChartLegendContent />} />
              <Bar
                yAxisId="tasks"
                dataKey="completedTasks"
                name={t("tasksLabel")}
                fill="var(--color-completedTasks)"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
              <Line
                yAxisId="effort"
                type="monotone"
                dataKey="completedEffort"
                name={t("effortLabel")}
                stroke="var(--color-completedEffort)"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
