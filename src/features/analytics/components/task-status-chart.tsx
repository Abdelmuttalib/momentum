import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useTaskStatusLabel } from "@/features/tasks/components/task-status-label";

type StatusRow =
  RouterOutputs["analytics"]["companyOverview"]["byStatus"][number];

const STATUS_FILLS: Record<StatusRow["status"], string> = {
  BACKLOG: "oklch(var(--muted-foreground))",
  TO_DO: "oklch(var(--chart-4))",
  IN_PROGRESS: "oklch(var(--chart-1))",
  COMPLETED: "oklch(var(--chart-2))",
  CANCELED: "oklch(var(--muted-foreground))",
};

const statusConfig = {
  count: { label: "Tasks" },
} satisfies ChartConfig;

function truncate(value: string, max = 14) {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

export function TaskStatusChart({ data }: { data: StatusRow[] }) {
  const t = useTranslations("analytics");
  const getStatusLabel = useTaskStatusLabel();
  const total = data.reduce((n, s) => n + s.count, 0);
  const rows = data.map((s) => ({
    ...s,
    name: getStatusLabel(s.status),
    shortName: truncate(getStatusLabel(s.status)),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("statusTitle")}</CardTitle>
        <CardDescription>{t("statusDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <Text size="sm" tone="muted" className="py-6 text-center">
            {t("noTasksTracked")}
          </Text>
        ) : (
          <ChartContainer config={statusConfig} className="aspect-auto h-48 sm:h-56">
            <BarChart
              data={rows}
              layout="vertical"
              aria-label={t("statusTitle")}
            >
              <XAxis type="number" hide allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="shortName"
                tickLine={false}
                axisLine={false}
                width={88}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => tooltipDatumName(payload)}
                  />
                }
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={22}>
                {rows.map((r) => (
                  <Cell key={r.status} fill={STATUS_FILLS[r.status]} opacity={r.status === "CANCELED" ? 0.45 : 1} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
