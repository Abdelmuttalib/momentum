/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Layout } from "@/components/layout";
import { getServerAuthSession } from "@/server/auth";
import { prisma } from "@/server/db";
import { Role, type Organization } from "@prisma/client";
import type { GetServerSideProps } from "next";
import { z } from "zod";
import { api } from "@/utils/api";
import InvitesList from "@/components/@pages/organization/InvitesList";
import NewInvite from "@/components/@pages/organization/NewInvite";
import { CreateNewTeamDialog } from "../team";
import { DataTable } from "@/components/@pages/team/TeamMembers/data-table";
import { organizationTeamsColumns } from "@/components/@pages/organization/organization-teams";
import type { Session } from "next-auth";

interface OrganizationPageProps {
  organizationData: Organization;
  userSession: Session;
}

export const inviteUserToOrganizationFormSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^1[3-9]\d{9}$/, "validations.phoneNumber")
    .nonempty(),
  role: z.nativeEnum(Role),
});

export default function OrganizationPage({
  organizationData,
  userSession,
}: OrganizationPageProps) {
  const [id, organizationId]: [string, string] = [
    userSession?.user.id,
    userSession?.user.organizationId,
  ];

  const organizationTeams = api.team.admin.getAllTeamsByOrganization.useQuery({
    organizationId: organizationId,
  });

  const invitations = api.organization.getAllInvitations.useQuery(
    {
      organizationId: organizationId,
    },
    {
      enabled: !!organizationId,
    }
  );

  return (
    <Layout
      pageTitle={`Organization: ${organizationData.name}`}
      className="bg-gray-50"
    >
      <div className="flex flex-col gap-12">
        <div>
          <div className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between">
              <h2 className="h4">Organization Teams</h2>
              <CreateNewTeamDialog organizationId={organizationId} />
            </div>

            <div>
              {organizationTeams.data && (
                <DataTable
                  columns={organizationTeamsColumns}
                  data={organizationTeams.data}
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
              <h2 className="h4">Invited Users(organization)</h2>
              <NewInvite userId={id} organizationId={organizationId} />
            </div>
            <div>
              {/* <Projects projects={teamProjects} team={currentTeam} /> */}
              <InvitesList
                invitations={invitations.data}
                isLoading={invitations.isLoading}
              />
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
        destination: "/login",
        permanent: false,
      },
    };
  }

  const organizationId = userSession.user.organizationId;

  const organizationData = await prisma.organization.findUnique({
    where: {
      id: organizationId,
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
      organizationData: JSON.parse(JSON.stringify(organizationData)),
      userSession: JSON.parse(JSON.stringify(userSession)),
    },
  };
};
