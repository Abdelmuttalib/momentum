/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { teamMembersColumns } from "@/components/views/team/teamMembersColumns";
import Container from "@/components/views/landing-page/container";
import { DataTable } from "@/components/views/teams/TeamMembers/data-table";
import { requireAuthPage } from "@/server/auth-guard";
import { safeUserSelect } from "@/server/db/selects";
import { prisma } from "@/server/db";
import { api } from "@/lib/api";
import type { Team } from "@prisma/client";
import { type GetServerSideProps } from "next";
import { Seo } from "@/components/seo";
import { AppLayout } from "@/components/layout/app-layout";

interface TeamSettingsPageProps {
  team: Team;
}

export default function ProjectsPage({ team }: TeamSettingsPageProps) {
  const { data: teamData } = api.team.getTeam.useQuery({
    teamId: team.id,
  });

  return (
    <>
      <Seo title={`${team.name} | Momentum`} />

      <AppLayout>
        {/* <div className="h5 mb-6 border-b pb-8 pt-2">Team Settings</div> */}
        <Container className="flex flex-col gap-7 py-7">
          <div className="w-full">
            <div className="flex flex-col gap-2 pb-8">
              <div>
                {teamData && (
                  <DataTable
                    columns={teamMembersColumns}
                    data={teamData.users}
                  />
                )}
              </div>
            </div>
          </div>
        </Container>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuthPage(
  {},
  async (ctx, session) => {
    const teamId = ctx.params?.teamId as string;

    if (!teamId) {
      return {
        redirect: { destination: "/teams", permanent: false },
      };
    }

    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
        companyId: session.user.company.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        companyId: true,
        users: { select: safeUserSelect },
        projects: true,
        tasks: true,
      },
    });

    if (!team) {
      return {
        notFound: true,
      };
    }

    return {
      team: JSON.parse(JSON.stringify(team)),
    };
  }
);
