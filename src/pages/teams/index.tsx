/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Layout } from "@/components/layout";
import { api } from "@/utils/api";
import { getServerAuthSession } from "@/server/auth";
import {
  TeamCard,
  TeamLoader,
} from "@/components/@pages/teams/TeamProjects/Team";
import CreateTeam from "@/components/@pages/teams/forms/create-team";
import type { TTeam } from "types";
import Container from "@/components/@pages/landing-page/container";
import Seo from "@/components/Seo";
import {
  DialogContent,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/animated-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Typography } from "@/components/ui/typography";

type TeamsPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function TeamsPage({}: TeamsPageProps) {
  const { data: companyTeams, isLoading } =
    api.team.getAllTeamsByCompanyId.useQuery();

  return (
    <>
      <Seo title="Teams | Momentum" />
      <Layout pageTitle="Teams">
        {/* <Container className="flex flex-col gap-4"> */}
        <div className="flex flex-col gap-4">
          <div className="flex w-full items-center justify-end">
            <CreateTeam />
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {companyTeams &&
              companyTeams?.length > 0 &&
              companyTeams?.map((team) => (
                <TeamCard key={team.id} team={team as unknown as TTeam} />
              ))}
            {isLoading && [1, 2, 3, 4, 5, 6].map((n) => <TeamLoader key={n} />)}
          </div>

          {/* 0 teams */}
          {companyTeams && companyTeams?.length === 0 && (
            <p className="text-gray-500 dark:text-gray-600">
              - no teams yet. Create a team to get started with your
            </p>
          )}
          {/* <div className="mt-10 lg:mt-20">
          <h4 className="h6 mb-4 dark:text-gray-200">Manage Teams</h4>
          {companyTeams && (
            <DataTable columns={companyTeamsColumns} data={companyTeams} />
          )}
        </div> */}
        </div>
        {/* </Container> */}
      </Layout>
    </>
  );
}

function Demo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <Button onClick={() => setOpen(true)}>OPEN</Button>

      <DialogRoot open={open} onClose={() => setOpen(false)}>
        <DialogPortal>
          <DialogContent>
            <DialogTitle>
              <h2 className="h5 inline">Create a new Project</h2>
            </DialogTitle>

            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Projects are where you manage your team&apos;s work. Each
                project has its own board and issues.
              </p>

              <div className="mt-6">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Create Project
                </Button>

                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
    </div>
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

  // const companyId = userSession?.user?.company.id;
  // const companyTeams = await prisma.team.findMany({
  //   where: {
  //     companyId,
  //   },
  //   include: {
  //     users: {
  //       select: {
  //         id: true,
  //         firstName: true,
  //         lastName: true,
  //         email: true,
  //         emailVerified: true,
  //         image: true,
  //         role: true,
  //       },
  //     },
  //     projects: true,
  //     tasks: true,
  //   },
  // });

  // if (!companyTeams) {
  // }

  // return {
  //   redirect: {
  //     destination: `/teams/${companyTeams[0].id}`,
  //     permanent: false,
  //   },
  // };

  return {
    props: {},
  };
};
