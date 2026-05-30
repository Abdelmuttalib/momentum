import { getServerAuthSession } from "@/server/auth";
import type { GetServerSideProps } from "next";
import { api } from "@/lib/api";
import { DataTable } from "@/components/views/teams/TeamMembers/data-table";
import { CreateInvite } from "@/components/views/company/invitations/create-invite";
import { companyInvitationsColumns } from "@/components/views/company/invites/company-invitations-columns";
import { Seo } from "@/components/seo";
import { Typography } from "@/components/ui/typography";
import { AppLayout } from "@/components/layout/app-layout";
import {
  PageHeader,
  PageSubDescription,
  PageSubTitle,
  Stack,
} from "@/components/page-components";
import { useInvites } from "@/features/company/hooks/use-invite";
import { useSession } from "next-auth/react";
import { DataTableLoader } from "@/components/data-loader";

export default function CompanyPage() {
  const { data: session } = useSession();
  const companyId = session?.user?.company.id;

  const { data: invitations, isLoading } = useInvites({
    companyId: companyId,
  });

  return (
    <>
      <Seo title="Company | Momentum" />

      <AppLayout>
        <Stack>
          <PageHeader title="Company" description="" />
          {/* <div>
            <div className="flex flex-col gap-4">
              <div className="flex w-full items-center justify-between">
                <Typography as="h2" variant="lg/normal">
                  Company Teams
                </Typography>
                <CreateTeam />
              </div>

              <div>
                {companyTeams.data && (
                  <DataTable
                    columns={companyTeamsColumns}
                    data={companyTeams.data}
                  />
                )}
              </div>
            </div>
          </div> */}
          <div>
            <div className="flex flex-col gap-4">
              <div className="flex w-full items-center justify-between">
                <div>
                  <PageSubTitle>Invited Members(company)</PageSubTitle>
                  <PageSubDescription>
                    Manage all company invitations.
                  </PageSubDescription>
                </div>
                <CreateInvite />
              </div>
              <div>
                <DataTableLoader
                  data={invitations}
                  columns={companyInvitationsColumns}
                  isLoading={isLoading}
                  error={null}
                />
                {/* {invitations.data && (
                  <DataTable
                    columns={companyInvitationsColumns}
                    data={invitations.data}
                  />
                )} */}
              </div>
            </div>
          </div>
        </Stack>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userSession = await getServerAuthSession({ req, res });

  if (!userSession) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
