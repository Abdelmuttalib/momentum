/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Layout } from "@/components/layout";
import { getServerAuthSession } from "@/server/auth";
import { prisma } from "@/server/db";
import { Role, type Company } from "@prisma/client";
import type { GetServerSideProps } from "next";
import { z } from "zod";
import { api } from "@/utils/api";
// import InvitesList from "@/components/@pages/organization/InvitesList";
import { DataTable } from "@/components/@pages/teams/TeamMembers/data-table";
import type { Session } from "next-auth";
import NewInvite from "@/components/@pages/company/NewInvite";
import { companyInvitationsColumns } from "@/components/@pages/company/invites/company-invitations-columns";
import CreateTeam from "@/components/@pages/teams/forms/create-team";
import { companyTeamsColumns } from "@/components/@pages/company/organization-teams";

interface CompanyPageProps {
  companyData: Company;
  userSession: Session;
}

export const inviteUserToOrganizationFormSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^1[3-9]\d{9}$/, "validations.phoneNumber")
    .nonempty(),
  role: z.nativeEnum(Role),
});

export default function CompanyPage({
  companyData,
  userSession,
}: CompanyPageProps) {
  // const [id, companyId]: [string, string] = [
  //   userSession?.user.id,
  //   userSession?.user.company.id,
  // ];

  const companyTeams = api.team.getAllTeamsByCompanyId.useQuery();

  const invitations = api.company.getAllInvitations.useQuery();

  return (
    <Layout pageTitle={`Company: ${companyData.name}`} className="bg-gray-50">
      <div className="flex flex-col gap-12">
        <div>
          <div className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between">
              <h2 className="h6">Company Teams</h2>
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
              {/* <OrganizationTeams
                teams={organizationTeams.data}
                isLoading={organizationTeams.isLoading}
              /> */}
            </div>
          </div>
        </div>
        {/* Invitations */}
        <div>
          <div className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between">
              <h2 className="h6">Invited Users(company)</h2>
              <NewInvite />
            </div>
            <div>
              {/* <Projects projects={teamProjects} team={currentTeam} /> */}
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

  const companyId = userSession.user.company.id;

  const companyData = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
    include: {
      users: true,
      teams: {
        include: {
          users: true,
        },
      },
      invitations: true,
    },
  });

  return {
    props: {
      companyData: JSON.parse(JSON.stringify(companyData)),
      userSession: JSON.parse(JSON.stringify(userSession)),
    },
  };
};
