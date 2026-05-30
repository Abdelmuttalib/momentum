import { DataTableLoader } from "@/components/data-loader";
import { AppLayout } from "@/components/layout/app-layout";
import { Seo } from "@/components/seo";
import { siteConfig } from "@/config/site-config";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { getServerAuthSession } from "@/server/auth";
import { type Project } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil } from "lucide-react";
import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { shortId } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/common/dashboard";
import { ButtonLink } from "@/components/common/button-link";
import { routes } from "@/lib/routes";

export default function ProjectsPage() {
  const { data: session } = useSession();
  const companyId = session?.user?.company.id;

  const { data: projects, isLoading } = useProjects(companyId);

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ getValue }) => {
        const id = getValue() as string;
        return <span>{shortId(id)}</span>;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedAt"));
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "id",
      header: "Actions",
      cell: ({ getValue }) => {
        const id = getValue() as string;
        return (
          <div className="flex gap-2 text-muted-foreground">
            <ButtonLink
              href={routes.projects.details({ projectId: id })}
              size="sm"
              variant="ghost"
            >
              <Eye className="h-4 w-4" />
              View
            </ButtonLink>

            <ButtonLink
              href={routes.projects.edit({ projectId: id })}
              size="sm"
              variant="ghost"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </ButtonLink>

            {/* <Button
              size="sm"
              variant="ghost"
              disabled
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              {tDelete}
            </Button> */}
          </div>
        );
      },
    },
    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   cell: ({ row }) => (
    //     <div className="capitalize">{row.getValue("status")}</div>
    //   ),
    // },

    // {
    //   accessorKey: "amount",
    //   header: () => <div className="text-right">Amount</div>,
    //   cell: ({ row }) => {
    //     const amount = parseFloat(row.getValue("amount"));

    //     // Format the amount as a dollar amount
    //     const formatted = new Intl.NumberFormat("en-US", {
    //       style: "currency",
    //       currency: "USD",
    //     }).format(amount);

    //     return <div className="text-right font-medium">{formatted}</div>;
    //   },
    // },
    // {
    //   id: "actions",
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     const payment = row.original;

    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <DotsHorizontalIcon className="h-4 w-4" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //           <DropdownMenuItem
    //             onClick={() => navigator.clipboard.writeText(payment.id)}
    //           >
    //             Copy payment ID
    //           </DropdownMenuItem>
    //           <DropdownMenuSeparator />
    //           <DropdownMenuItem>View customer</DropdownMenuItem>
    //           <DropdownMenuItem>View payment details</DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    // },
  ];

  return (
    <>
      <Seo title="Projects | Momentum" />

      <AppLayout>
        <DashboardPageHeader
          title="Projects"
          description="Manage all projects for your team."
          actions={
            <ButtonLink href={"/projects/new"} size="sm">
              Add Project
            </ButtonLink>
          }
        />

        <DataTableLoader
          columns={columns}
          data={projects}
          isLoading={isLoading}
          error={null}
        />
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userSession = await getServerAuthSession({ req, res });

  if (!userSession) {
    return {
      redirect: {
        destination: siteConfig.pages.main.links.signIn.href,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
