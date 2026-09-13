import { Text } from "@/components/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsKpiCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Text size="md" weight="semibold" as="p">
          {value}
        </Text>
        {hint && (
          <Text size="xs" tone="muted" className="mt-1">
            {hint}
          </Text>
        )}
      </CardContent>
    </Card>
  );
}
