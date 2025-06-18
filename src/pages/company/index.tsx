import { Layout } from "@/components/layout";
import { getServerAuthSession } from "@/server/auth";
import { Role } from "@prisma/client";
import type { GetServerSideProps } from "next";
import { z } from "zod";
import { api } from "@/utils/api";
import { DataTable } from "@/components/views/teams/TeamMembers/data-table";
import { CreateInvite } from "@/components/views/company/invitations/create-invite";
import { companyInvitationsColumns } from "@/components/views/company/invites/company-invitations-columns";
import { CreateTeam } from "@/components/views/teams/forms/create-team";
import { companyTeamsColumns } from "@/components/views/company/organization-teams";
import { Seo } from "@/components/seo";
import { Typography } from "@/components/ui/typography";

export default function CompanyPage() {
  const companyTeams = api.team.getAllTeamsByCompanyId.useQuery();

  const invitations = api.company.getAllInvitations.useQuery();

  return (
    <>
      <Seo title="Company" />

      <Layout pageTitle={`Company`} className="">
        <div className="flex flex-col gap-12">
          <div>
            <div className="flex flex-col gap-4">
              <div className="flex w-full items-center justify-between">
                <Typography as="h2" variant="lg/normal">
                  Company Teams
                </Typography>
                {/* <CreateNewTeamDialog companyId={companyId} /> */}
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
          </div>
          <div>
            <div className="flex flex-col gap-4">
              <div className="flex w-full items-center justify-between">
                <Typography as="h2" variant="base/normal">
                  Invited Members(company)
                </Typography>
                <CreateInvite />
              </div>
              <div>
                {invitations.data && (
                  <DataTable
                    columns={companyInvitationsColumns}
                    data={invitations.data}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
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
