/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Layout } from "@/components/layout";
import { prisma } from "@/server/db";
import type { GetServerSideProps } from "next";

import type { Project, Team } from "@prisma/client";
import TeamSwitcher from "@/components/team-switcher";
import CreateProjectDialog from "@/components/@pages/team/TeamProjects/CreateProject";
import Projects from "@/components/@pages/team/TeamProjects/Projects";
import { getServerAuthSession } from "@/server/auth";
import TeamMembersTable from "@/components/@pages/team/TeamMembers/TeamMembersTable";
import { api } from "@/utils/api";
import {
  AddUserDialog,
  type TTeam,
} from "@/components/@pages/organization/organization-teams";

type TeamPageProps = {
  currentTeam: TTeam;
  organizationTeams: Team[];
  teamProjects: Project[];
  organizationId: string;
  teamId: string;
};

const TeamPage = ({ currentTeam, organizationTeams }: TeamPageProps) => {
  const teamProjects = api.project.getAllProjectsByTeam.useQuery(
    {
      teamId: currentTeam.id,
    },
    {
      enabled: !!currentTeam.id,
    }
  );

  return (
    <Layout
      pageTitle={
        <>
          Team
          <TeamSwitcher
            currentTeam={currentTeam}
            teams={organizationTeams}
            className="ml-2"
          />
        </>
      }
      className="flex flex-col gap-20 bg-gray-50"
    >
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <h2 className="h4">Team Projects</h2>
          <CreateProjectDialog teamId={currentTeam.id} />
        </div>
        <div>
          {/* <TeamProjectsTable teamProjects={teamProjects.data} /> */}
          <Projects projects={teamProjects.data} team={currentTeam} />
        </div>
      </div>
      {/* Team Members */}
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <h2 className="h4">Team Members</h2>
          {/* <CreateProjectDialog teamId={team.id} /> */}
          {/* <CreateNewTeamDialog organizationId={organizationId} /> */}
          <AddUserDialog team={currentTeam} />
        </div>
        <TeamMembersTable teamMembers={currentTeam.users} />
      </div>
    </Layout>
  );
};

export default TeamPage;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  res,
}) => {
  const session = await getServerAuthSession({ req, res });
  const organizationId = session?.user.organizationId;
  const teamId = params?.teamId as string;

  const organizationTeams = await prisma.team.findMany({
    where: {
      organizationId,
    },
    include: {
      users: true,
    },
  });

  const currentTeam = organizationTeams.filter((team) => team.id === teamId)[0];

  const teamProjects = await prisma.project.findMany({
    where: {
      teamId: currentTeam?.id,
    },
  });

  return {
    props: {
      currentTeam,
      organizationTeams,
      teamProjects: JSON.parse(JSON.stringify(teamProjects)),
      teamId,
      organizationId,
    },
  };
};
