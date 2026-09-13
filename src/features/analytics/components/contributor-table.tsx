import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Text } from "@/components/typography";
import { UserAvatar } from "@/components/user/user-menu";
import { formatDuration } from "@/lib/analytics/format";
import { useFormatter, useTranslations } from "next-intl";

export type ContributorRow = {
  id: string;
  name: string;
  image: string | null;
  completedTasks: number;
  completedEffort: number;
  activeTasks: number;
  avgCycleTimeMs: number | null;
};

export function ContributorTable({
  contributors,
  emptyMessage,
}: {
  contributors: ContributorRow[];
  emptyMessage?: string;
}) {
  const t = useTranslations("analytics");
  const format = useFormatter();
  if (contributors.length === 0) {
    return (
      <Text size="sm" tone="muted" className="py-4 text-center">
        {emptyMessage ?? t("noContributorActivity")}
      </Text>
    );
  }
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-start">{t("contributor")}</TableHead>
            <TableHead className="text-end">{t("completed")}</TableHead>
            <TableHead className="text-end">{t("effort")}</TableHead>
            <TableHead className="text-end">{t("active")}</TableHead>
            <TableHead className="text-end">{t("avgCycle")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contributors.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <span className="inline-flex items-center gap-2">
                  <UserAvatar
                    user={{
                      id: c.id,
                      name: c.name,
                      email: "",
                      image: c.image,
                      role: "MEMBER",
                    }}
                    size="sm"
                  />
                  <span className="text-sm font-medium">{c.name}</span>
                </span>
              </TableCell>
              <TableCell className="text-end">
                {format.number(c.completedTasks)}
              </TableCell>
              <TableCell className="text-end">
                {t("points", { count: c.completedEffort })}
              </TableCell>
              <TableCell className="text-end">
                {format.number(c.activeTasks)}
              </TableCell>
              <TableCell className="text-end">
                {formatDuration(c.avgCycleTimeMs)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
