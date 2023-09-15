import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout";
import Container from "@/components/@pages/landing-page/container";
import { useForm } from "react-hook-form";
import type { Company } from "@prisma/client";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps } from "next";
import { api } from "@/utils/api";
import { z } from "zod";
import { toast } from "sonner";
import { formatFullDate } from "@/utils/formatFullDate";
import { companyInvitationsColumns } from "@/components/@pages/company/invites/company-invitations-columns";
import { DataTable } from "@/components/@pages/teams/TeamMembers/data-table";
import NewInvite from "@/components/@pages/company/NewInvite";
import { teamMembersColumns } from "@/components/@pages/teams/TeamMembers/team-members";
import { ProfileSettings } from "./profile";
import { companyTeamsColumns } from "@/components/@pages/company/organization-teams";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";

export function SettingsPageTabs() {
  return (
    <Tabs defaultValue="company" className="w-full px-0">
      <TabsList className="ml-auto grid h-12 w-full max-w-[15rem] grid-cols-2 rounded-b-none bg-gray-100 p-0 dark:bg-gray-800/50">
        <TabsTrigger
          value="company"
          className="h-full rounded-none border-b-2 border-transparent font-semibold data-[state=active]:border-b-brand-500 data-[state=active]:shadow-none"
        >
          Company
        </TabsTrigger>
        <TabsTrigger
          value="profile"
          className="h-full rounded-none border-b-2 border-transparent font-semibold data-[state=active]:border-b-brand-500 data-[state=active]:shadow-none"
        >
          Profile
        </TabsTrigger>
      </TabsList>

      <TabsContent value="company" className="">
        <CompanySettings />
      </TabsContent>
      <TabsContent value="profile" className="">
        <ProfileSettings />
      </TabsContent>
    </Tabs>
  );
}

interface CompanySettingsPageProps {
  company: Company;
}

const companyInfoFormSchema = z.object({
  name: z.string(),
});

type CompanyInfoFormValues = z.infer<typeof companyInfoFormSchema>;

export default function SettingsPage({ company }: CompanySettingsPageProps) {
  return (
    <Layout pageTitle="">
      <Container>
        <SettingsPageTabs />
      </Container>
      {/* <CompanySettings /> */}
    </Layout>
  );
}

export function CompanySettings() {
  const { data: session } = useSession();
  const companyId = session?.user?.company?.id;
  const { data: companyData, isLoading: isLoadingCompanyData } =
    api.company.getCompany.useQuery();

  const { data: invitationsData, isLoading: isLoadingInvitations } =
    api.company.getAllInvitations.useQuery();

  const { data: companyMembersData, isLoading: isLoadingCompanyMembers } =
    api.company.getCompanyMembers.useQuery();
  const { data: companyTeams, isLoading } =
    api.team.getAllTeamsByCompanyId.useQuery();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyInfoFormValues>();

  const apiContext = api.useContext();

  const updateCompanyNameMutation = api.company.updateCompanyName.useMutation({
    onSuccess: async () => {
      await apiContext.company.getCompany.invalidate();
      toast.success("Company name updated successfully");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  async function onSubmit(data: CompanyInfoFormValues) {
    console.log(data);
    const { name } = data;

    await updateCompanyNameMutation.mutateAsync({
      companyId: (companyData?.id as string) || (companyId as string),
      name,
    });
  }

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

  const { data: companyInvitations } = api.company.getAllInvitations.useQuery();

  console.log("companyMembersNotInTeam: ", companyInvitations);

  console.log("companyMembers: ", companyMembersData);
  return (
    <>
      <Container className="flex flex-col gap-7 rounded-lg py-7">
        <div className="w-full">
          <h1 className="h5">Company Settings</h1>
        </div>
        <div className="flex flex-col gap-7 divide-y-2">
          <div className="w-full">
            <div className="flex flex-col gap-2 pb-8">
              <div className="py-2">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-5 divide-y-2"
                >
                  <div className="flex w-fit items-end gap-3 space-y-4">
                    <div className="relative">
                      <Label
                        htmlFor="companyName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Company Name
                      </Label>
                      <Input
                        id="companyName"
                        inputMode="text"
                        type="text"
                        placeholder="company"
                        {...register("name", {
                          required: true,
                        })}
                        defaultValue={companyData?.name}
                        disabled={
                          isLoadingCompanyData ||
                          updateCompanyNameMutation.isLoading
                        }
                        error={errors?.name}
                      />
                      <p className="absolute -bottom-5 text-xs text-gray-500">
                        Date Created: {formatFullDate(companyData?.createdAt)}
                      </p>
                    </div>
                    <Button
                      type="submit"
                      isLoading={updateCompanyNameMutation.isLoading}
                      disabled={
                        isLoadingCompanyData ||
                        updateCompanyNameMutation.isLoading
                      }
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* company members */}
          <div className="w-full pt-6">
            <div className="flex flex-col gap-6 pb-8">
              <div className="flex items-center justify-between">
                <h2 className="label-md">Company Teams</h2>
              </div>
              <div className="">
                {companyTeams && (
                  <DataTable
                    columns={companyTeamsColumns}
                    data={companyTeams}
                  />
                )}
              </div>
            </div>
          </div>

          {/* company members */}
          <div className="w-full pt-6">
            <div className="flex flex-col gap-6 pb-8">
              <div className="flex items-center justify-between">
                <h2 className="label-md">Company Members</h2>
              </div>
              <div className="">
                {companyMembersData && (
                  <DataTable
                    columns={teamMembersColumns}
                    data={companyMembersData}
                  />
                )}
              </div>
            </div>
          </div>
          {/* company invites */}
          <div className="w-full pt-6">
            <div className="flex flex-col gap-2 pb-8">
              <div className="flex items-center justify-between">
                <h2 className="label-md">Company Invitations</h2>
                <NewInvite
                  triggerButton={
                    <Button
                      className="ml-2 inline-flex gap-1 whitespace-nowrap"
                      size="sm"
                    >
                      <PlusIcon className="w-5" /> New Invite
                    </Button>
                  }
                />
              </div>
              <div>
                {invitationsData && (
                  <DataTable
                    columns={companyInvitationsColumns}
                    data={invitationsData}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
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

  const company = userSession?.user?.company;

  return {
    props: {
      company: JSON.parse(JSON.stringify(company)),
    },
  };
};
