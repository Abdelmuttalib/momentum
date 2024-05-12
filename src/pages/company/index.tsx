import { Layout } from "@/components/layout";
import { getServerAuthSession } from "@/server/auth";
import { Role } from "@prisma/client";
import type { GetServerSideProps } from "next";
import { z } from "zod";
import { api } from "@/utils/api";
import { DataTable } from "@/components/@pages/teams/TeamMembers/data-table";
import NewInvite from "@/components/@pages/company/NewInvite";
import { companyInvitationsColumns } from "@/components/@pages/company/invites/company-invitations-columns";
import CreateTeam from "@/components/@pages/teams/forms/create-team";
import { companyTeamsColumns } from "@/components/@pages/company/organization-teams";
import Seo from "@/components/Seo";
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
                <Typography as="h2" variant="lg/regular">
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
                <Typography as="h2" variant="base/regular">
                  Invited Members(company)
                </Typography>
                <NewInvite />
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
