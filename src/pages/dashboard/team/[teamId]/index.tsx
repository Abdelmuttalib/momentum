/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Layout } from "@/components/layout";
import { prisma } from "@/server/db";
import type { GetServerSideProps } from "next";

import type { Project, Team, User } from "@prisma/client";
import TeamSwitcher from "@/components/team-switcher";
import CreateProjectDialog from "@/components/@pages/team/TeamProjects/CreateProject";
import Projects from "@/components/@pages/team/TeamProjects/Projects";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";
import { type TTeam } from "@/components/@pages/organization/organization-teams";

interface TeamPageProps {
  currentTeam: TTeam;
  companyTeams: Team[];
  teamProjects: Project[];
  companyId: string;
  teamId: string;
  userId: User["id"];
}

const TeamPage = ({ companyId, teamId, userId }: TeamPageProps) => {
  const companyTeams = api.team.admin.getAllTeamsByCompanyId.useQuery(
    {
      companyId,
    },
    {
      enabled: !!companyId,
    }
  );

  const currentTeam = api.team.admin.getTeamByTeamId.useQuery(
    {
      teamId,
    },
    {
      enabled: !!teamId,
    }
  );

  const teamProjects = api.project.getAllProjectsByTeamId.useQuery(
    {
      teamId,
    },
    {
      enabled: !!teamId,
    }
  );

  const companyMembers = api.team.user.getAllCompanyMembersByCompanyId.useQuery(
    {
      companyId,
      userId,
    },
    {
      enabled: !!companyId || !!userId,
    }
  );

  return (
    <Layout
      pageTitle={
        <div className="flex items-center">
          Team
          {currentTeam.data && companyTeams.data && (
            <TeamSwitcher
              currentTeam={currentTeam.data}
              teams={companyTeams.data}
              className="ml-2"
            />
          )}
        </div>
      }
      className="flex flex-col gap-20"
    >
      <div className="flex flex-col gap-4">
        {/* <DataTableDemo /> */}
        <div className="flex w-full items-center justify-between">
          <h2 className="h4">Team Projects</h2>
          <CreateProjectDialog teamId={teamId} />
        </div>
        <div>
          {/* <TeamProjectsTable teamProjects={teamProjects.data} /> */}
          {currentTeam.data && (
            <Projects projects={teamProjects.data} team={currentTeam.data} />
          )}
        </div>
      </div>
      {/* Team Members */}
      {/* <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <h2 className="h4">Team Members</h2>
          {currentTeam.data && companyMembers.data && (
            <AddUserDialog
              team={currentTeam.data}
              users={companyMembers.data}
            />
          )}
        </div>
        {currentTeam.data && (
          <TeamMembersTable teamMembers={currentTeam.data.users} />
        )}
      </div> */}
    </Layout>
  );
};

export default TeamPage;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  res,
}) => {
  const userSession = await getServerAuthSession({ req, res });

  if (!userSession) {
    return {
      redirect: {
        destination: "sign-in",
        permanent: false,
      },
    };
  }

  const userId = userSession?.user.id;
  const companyId = userSession?.user.companyId;
  const teamId = params?.teamId as string;

  const companyTeams = await prisma.team.findMany({
    where: {
      companyId,
    },
    include: {
      users: true,
    },
  });

  const currentTeam = companyTeams.filter((team) => team.id === teamId)[0];

  const teamProjects = await prisma.project.findMany({
    where: {
      teamId: currentTeam?.id,
    },
  });

  return {
    props: {
      currentTeam,
      userId,
      companyTeams,
      teamProjects: JSON.parse(JSON.stringify(teamProjects)),
      teamId,
      companyId,
    },
  };
};
