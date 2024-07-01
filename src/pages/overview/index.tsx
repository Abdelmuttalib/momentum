import Projects, { ProjectsView } from "@/components/@pages/teams/TeamProjects/Projects";
import { TeamCard } from "@/components/@pages/teams/TeamProjects/Team";
import { LayoutContainer } from "@/components/container";
import { Layout } from "@/components/layout";
import Seo from "@/components/Seo";
import { Typography } from "@/components/ui/typography";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";
import type { GetServerSideProps } from "next";
import * as React from "react";

export default function OverviewPage({ companyId }: { companyId: string }) {
  const {
    data: teams,
    isLoading: isLoadingTeams,
    error: teamsError,
  } = api.team.getAllTeamsByCompanyId.useQuery();

  const {
    data: companyProjects,
    isLoading: isLoadingCompanyProjects,
    error: companyProjectsError,
  } = api.company.getCompanyProjects.useQuery();

  return (
    <>
      <Seo title="Overview" />
      <Layout pageTitle="Overview">
        <div className="space-y-20">
          <div className="space-y-4">
            <Typography as="h2" variant="xl/medium">
              Teams
            </Typography>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {teams?.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          </div>
          <LayoutContainer className="space-y-4">
            <Typography as="h2" variant="xl/medium">
              Projects
            </Typography>
            <ProjectsView />
          </LayoutContainer>
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

  const companyId = userSession.user.company.id;

  return {
    props: {
      companyId,
    },
  };
};
