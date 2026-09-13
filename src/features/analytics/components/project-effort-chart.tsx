import { Bar, BarChart, Legend, XAxis, YAxis } from "recharts";
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
import { tooltipDatumName } from "./chart-utils";
import { useTranslations } from "next-intl";

type ProjectRow =
  RouterOutputs["analytics"]["companyOverview"]["byProject"]["projects"][number];

function truncate(value: string, max = 16) {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

export function ProjectEffortChart({
  projects,
  moreCount,
}: {
  projects: ProjectRow[];
  moreCount: number;
}) {
  const t = useTranslations("analytics");
  const projectConfig = {
    remainingEffort: { label: t("remaining"), color: "oklch(var(--chart-5))" },
    completedEffort: { label: t("completed"), color: "oklch(var(--chart-2))" },
  } satisfies ChartConfig;
  const rows = projects.map((p) => ({
    ...p,
    shortName: truncate(p.name),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("projectTitle")}</CardTitle>
        <CardDescription>{t("projectDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {rows.length === 0 ? (
          <Text size="sm" tone="muted" className="py-4 text-center">
            {t("noProjectWork")}
          </Text>
        ) : (
          <ChartContainer config={projectConfig} className="aspect-auto h-48 sm:h-56">
            <BarChart
              data={rows}
              layout="vertical"
              barGap={3}
              aria-label={t("projectTitle")}
            >
              <XAxis type="number" hide allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="shortName"
                tickLine={false}
                axisLine={false}
                width={110}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => tooltipDatumName(payload)}
                  />
                }
              />
              <Legend content={<ChartLegendContent />} />
              <Bar
                dataKey="remainingEffort"
                name={t("remaining")}
                fill="var(--color-remainingEffort)"
                radius={[0, 4, 4, 0]}
                maxBarSize={14}
              />
              <Bar
                dataKey="completedEffort"
                name={t("completed")}
                fill="var(--color-completedEffort)"
                radius={[0, 4, 4, 0]}
                maxBarSize={14}
              />
            </BarChart>
          </ChartContainer>
        )}
        {moreCount > 0 && (
          <Text size="xs" tone="muted">
            {t("moreProjects", { count: moreCount })}
          </Text>
        )}
        <Text size="xs" tone="muted">
          {t("estimatedOnlyNote")}
        </Text>
      </CardContent>
    </Card>
  );
}
