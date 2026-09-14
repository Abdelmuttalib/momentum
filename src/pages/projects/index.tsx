import { DataTableLoader } from "@/components/data-loader";
import { AppLayout } from "@/components/layout/app-layout";
import { Seo } from "@/components/seo";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { requireAuthPage } from "@/server/auth-guard";
import { type Project } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil } from "lucide-react";
import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CompactPageHeader } from "@/components/common/page-header";
import { ButtonLink } from "@/components/common/button-link";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/typography";
import { routes } from "@/lib/routes";
import { formatDistanceToNow } from "@/lib/date";
import { useFormatter, useTranslations } from "next-intl";

type ProjectWithTasks = Project & {
  tasks: { status: string }[];
};

type ProjectsT = ReturnType<typeof useTranslations<"projects">>;

function getColumns(
  t: ProjectsT,
  format: ReturnType<typeof useFormatter>
): ColumnDef<ProjectWithTasks>[] {
  return [
    {
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => {
        const project = row.original;
        return (
          <Link
            href={routes.projects.details({ projectId: project.id })}
            className="font-medium hover:underline"
          >
            {project.name}
          </Link>
        );
      },
    },
    {
      accessorKey: "description",
      header: t("projectDescription"),
      cell: ({ row }) => {
        const description = row.original.description;
        if (!description) {
          return (
            <Text size="xs" tone="muted" as="span">
              —
            </Text>
          );
        }
        return (
          <span className="block max-w-md truncate text-sm text-muted-foreground">
            {description}
          </span>
        );
      },
    },
    {
      id: "progress",
      header: t("progressColumn"),
      cell: ({ row }) => {
        const tasks = row.original.tasks ?? [];
        const done = tasks.filter((t) => t.status === "COMPLETED").length;
        const percent =
          tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100);
        return (
          <span className="flex min-w-28 items-center gap-2">
            <Progress value={percent} className="h-1.5 w-16" />
            <Text size="xs" tone="muted" as="span" className="whitespace-nowrap">
              {format.number(done)}/{format.number(tasks.length)}
            </Text>
          </span>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: t("updated"),
      cell: ({ row }) => {
        return (
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {formatDistanceToNow(row.getValue("updatedAt"))}
          </span>
        );
      },
    },
    {
      accessorKey: "id",
      header: t("actions"),
      cell: ({ getValue }) => {
        const id = getValue() as string;
        return (
          <div className="flex gap-1 text-muted-foreground">
            <ButtonLink
              href={routes.projects.details({ projectId: id })}
              size="sm"
              variant="ghost"
            >
              <Eye className="h-4 w-4" />
              {t("view")}
            </ButtonLink>

            <ButtonLink
              href={routes.projects.edit({ projectId: id })}
              size="sm"
              variant="ghost"
            >
              <Pencil className="h-4 w-4" />
              {t("edit")}
            </ButtonLink>
          </div>
        );
      },
    },
  ];
}

export default function ProjectsPage() {
  const { data: session } = useSession();
  const t = useTranslations("projects");
  const format = useFormatter();
  const companyId = session?.user?.company.id;

  const { data: projects, isLoading, error } = useProjects(companyId);
  const columns = getColumns(t, format);

  return (
    <>
      <Seo title="Projects | Momentum" />

      <AppLayout>
        <div className="space-y-6">
        <CompactPageHeader
          title={t("title")}
          description={t("description")}
          actions={
            <ButtonLink href={routes.projects.new()} size="sm">
              {t("addProject")}
            </ButtonLink>
          }
        />

        <DataTableLoader
          columns={columns}
          data={projects}
          isLoading={isLoading}
          error={error}
        />
        </div>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuthPage();
