import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Text } from "@/components/typography";
import type { RouterOutputs } from "@/lib/api";
import { tooltipDatumName } from "./chart-utils";
import { useTranslations } from "next-intl";

type Contributor =
  RouterOutputs["analytics"]["companyOverview"]["contributors"][number];

const MAX_BARS = 10;

function truncate(value: string, max = 14) {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

/** Distribution view only — exact values stay in the table below. */
export function ContributorEffortChart({
  contributors,
}: {
  contributors: Contributor[];
}) {
  const t = useTranslations("analytics");
  const contributorConfig = {
    completedEffort: { label: t("effort"), color: "oklch(var(--chart-1))" },
  } satisfies ChartConfig;
  const rows = contributors.slice(0, MAX_BARS).map((c) => ({
    ...c,
    shortName: truncate(c.name),
  }));
  if (rows.length === 0) return null;

  return (
    <div className="flex flex-col gap-1" aria-label={t("contributorsDistribution")}>
      <Text size="xs" tone="muted">
        {t("contributorsDistribution")}
      </Text>
      <ChartContainer config={contributorConfig} className="aspect-auto h-40">
        <BarChart data={rows} layout="vertical">
          <XAxis type="number" hide allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="shortName"
            tickLine={false}
            axisLine={false}
            width={96}
            tick={{ fontSize: 12 }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => tooltipDatumName(payload)}
              />
            }
          />
          <Bar dataKey="completedEffort" radius={[0, 4, 4, 0]} maxBarSize={14}>
            {rows.map((r) => (
              <Cell key={r.id} fill="var(--color-completedEffort)" />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
