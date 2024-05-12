/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { teamMembersColumns } from "@/components/@pages/team/teamMembersColumns";
import Container from "@/components/@pages/landing-page/container";
import { DataTable } from "@/components/@pages/teams/TeamMembers/data-table";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getServerAuthSession } from "@/server/auth";
import { prisma } from "@/server/db";
import { api } from "@/utils/api";
import type { Team } from "@prisma/client";
import { type GetServerSideProps } from "next";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AddUserDialog } from "@/components/@pages/company/organization-teams";
import { UsersIcon } from "lucide-react";
import type { TTeam } from "types";

interface TeamSettingsPageProps {
  team: Team;
}

const teamInfoFormSchema = z.object({
  name: z.string(),
});

type TeamInfoFormValues = z.infer<typeof teamInfoFormSchema>;

export default function TeamSettingsPage({ team }: TeamSettingsPageProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamInfoFormValues>();

  const { data: teamData } = api.team.getTeam.useQuery({
    teamId: team.id,
  });

  // const apiContext = api.useContext();

  const updateTeamNameMutation = api.team.updateTeamName.useMutation({
    onSuccess: () => {
      toast.success("Team name updated successfully");
      // apiContext.team.getTeamById.refetch();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  async function onSubmit(data: TeamInfoFormValues) {
    const { name } = data;

    await updateTeamNameMutation.mutateAsync({
      teamId: team.id,
      name,
    });
  }
  // const { data: companyTeams, isLoading } =
  //   api.team.getAllTeamsByCompanyId.useQuery();

  // getCompanyMembersNotInTeam: protectedProcedure
  // .input(
  //   z.object({
  //     teamId: z.string(),
  //   })
  // )
  // .query(async ({ input, ctx }) => {
  //   const companyId = ctx.session.user.company.id;
  //   const companyMembers = await ctx.prisma.user.findMany({
  //     where: {
  //       companyId,
  //       teams: {
  //         none: {
  //           id: input.teamId,
  //         },
  //       },
  //     },
  //   });
  //   return companyMembers;
  // }),

  const { data: companyMembersNotInTeam } =
    api.company.getCompanyMembersNotInTeam.useQuery({
      teamId: team.id,
    });

  return (
    <Layout pageTitle="">
      {/* <div className="h5 mb-6 border-b pb-8 pt-2">Team Settings</div> */}
      <Container className="flex flex-col gap-7 py-7">
        <div className="w-full">
          <div className="flex flex-col gap-2 pb-8">
            <div>
              <h2 className="h6-light">Team Info</h2>
            </div>
            <div>
              <form
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5 divide-y-2"
              >
                <div className="flex w-fit items-end gap-3 space-y-4">
                  <div>
                    <Label
                      htmlFor="teamName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Team Name
                    </Label>
                    <Input
                      id="teamName"
                      inputMode="text"
                      type="text"
                      placeholder="team name"
                      {...register("name", {
                        required: true,
                      })}
                      defaultValue={team.name}
                      disabled={updateTeamNameMutation.isLoading}
                      error={errors?.name}
                    />
                  </div>
                  <Button
                    type="submit"
                    isLoading={updateTeamNameMutation.isLoading}
                    disabled={updateTeamNameMutation.isLoading}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* team members/invites */}
        <div className="w-full">
          <div className="flex flex-col gap-2 pb-8">
            <div className="flex items-center justify-between">
              <h2 className="h6-light">Team Members</h2>
              <AddUserDialog
                team={team as TTeam}
                triggerButton={
                  <Button
                    type="button"
                    size="sm"
                    className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm"
                  >
                    <UsersIcon className="w-[1.125rem]" />
                    Add Members
                  </Button>
                }
              />
            </div>
            <div>
              {teamData && (
                <DataTable columns={teamMembersColumns} data={teamData.users} />
              )}
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
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

  if (!teamId) {
    return {
      redirect: {
        destination: "/teams",
        permanent: false,
      },
    };
  }

  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
    include: {
      users: true,
      projects: true,
      tasks: true,
    },
  });

  return {
    props: {
      team: JSON.parse(JSON.stringify(team)),
    },
  };
};
