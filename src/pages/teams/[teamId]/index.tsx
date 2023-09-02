/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Layout } from "@/components/layout";
import { prisma } from "@/server/db";
import type { GetServerSideProps } from "next";

import type { Project, Task, Team, User } from "@prisma/client";
import TeamSwitcher from "@/components/team-switcher";
import CreateProjectDialog from "@/components/@pages/teams/TeamProjects/CreateProject";
import Projects from "@/components/@pages/teams/TeamProjects/Projects";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";
import Container from "@/components/@pages/landing-page/container";

interface TeamPageProps {
  initialTeamProjects: Project[];
  companyId: string;
  teamId: string;
}

const TeamPage = ({ teamId, initialTeamProjects }: TeamPageProps) => {
  const currentTeam = api.team.getTeam.useQuery(
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
      initialData: initialTeamProjects,
    }
  );

  return (
    <Layout pageTitle="">
      <Container className="flex flex-col gap-4">
        {/* <DataTableDemo /> */}
        <div className="flex w-full items-center justify-between">
          <h2 className="h4">Team Projects</h2>
          <CreateProjectDialog teamId={teamId} />
        </div>
        <div>
          {/* <TeamProjectsTable teamProjects={teamProjects.data} /> */}
            <Projects
              projects={teamProjects.data}
              loading={teamProjects.isLoading}
            />
        </div>
      </Container>
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
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const teamId = params?.teamId as string;

  const teamProjects = await prisma.project.findMany({
    where: {
      teamId: teamId,
    },
  });

  return {
    props: {
      initialTeamProjects: JSON.parse(JSON.stringify(teamProjects)),
      teamId,
    },
  };
};
