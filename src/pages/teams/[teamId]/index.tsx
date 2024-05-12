import { Layout } from "@/components/layout";
import type { GetServerSideProps } from "next";

import CreateProjectDialog from "@/components/@pages/teams/TeamProjects/CreateProject";
import Projects from "@/components/@pages/teams/TeamProjects/Projects";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";
import Container from "@/components/@pages/landing-page/container";
import Seo from "@/components/Seo";

interface TeamPageProps {
  companyId: string;
  teamId: string;
}

export default function TeamPage({ teamId }: TeamPageProps) {
  const teamProjects = api.project.getAllProjectsByTeamId.useQuery(
    {
      teamId,
    },
    {
      enabled: !!teamId,
    }
  );

  return (
    <>
      <Seo title="Team Projects" />

      <Layout pageTitle="Team Projects">
        <div className="flex flex-col">
          {/* <DataTableDemo /> */}
          <div className="flex w-full items-center justify-end">
            <CreateProjectDialog teamId={teamId} />
          </div>
          <div>
            {/* <TeamProjectsTable teamProjects={teamProjects.data} /> */}
            <Projects
              projects={teamProjects.data}
              loading={teamProjects.isLoading}
            />
          </div>
        </div>
      </Layout>
    </>
  );
}

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

  return {
    props: {
      teamId,
    },
  };
};
