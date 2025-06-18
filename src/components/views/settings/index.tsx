import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table-2";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { companyTeamsColumns } from "../company/organization-teams";
import { teamMembersColumns } from "../team/teamMembersColumns";
import { companyInvitationsColumns } from "../company/invites/company-invitations-columns";
import { CreateInvite } from "@/components/views/company/invitations/create-invite";

const companyInfoFormSchema = z.object({
  name: z.string(),
});

type CompanyInfoFormValues = z.infer<typeof companyInfoFormSchema>;

export function CompanySettings() {
  const { data: session } = useSession();
  const companyId = session?.user?.company?.id;
  const { data: companyData, isLoading: isLoadingCompanyData } =
    api.company.getCompany.useQuery();

  const {
    data: invitationsData,
    // isLoading: isLoadingInvitations
  } = api.company.getAllInvitations.useQuery();

  const {
    data: companyMembersData,
    // isLoading: isLoadingCompanyMembers
  } = api.company.getCompanyMembers.useQuery();
  const {
    data: companyTeams,
    // isLoading
  } = api.team.getAllTeamsByCompanyId.useQuery();
  const {
    register,
    handleSubmit,
    getValues,
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
    const { name } = data;

    await updateCompanyNameMutation.mutateAsync({
      companyId: companyData?.id || companyId,
      name,
    });
  }

  return (
    <>
      <div className="flex flex-col gap-7 rounded-lg py-7">
        <div className="w-full">
          <Typography as="p" variant="lg/medium">
            Company Settings
          </Typography>
        </div>
        <div className="flex flex-col gap-7 divide-y">
          {/* <MenuExample /> */}
          <div className="w-full">
            <div className="flex flex-col gap-2 pb-8">
              <form
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5 divide-y-2"
              >
                <div className="border-b py-6 text-sm lg:flex lg:items-start">
                  <div className="mb-1 space-y-1 lg:mb-0 lg:mr-5 lg:w-2/5 lg:flex-shrink-0">
                    <h3 className="text-foreground">
                      Company <span className="text-destructive">*</span>
                    </h3>
                    <p className="max-w-[420px] text-muted-foreground">
                      company name
                    </p>
                  </div>
                  <div className="flex items-center gap-x-2 lg:flex-grow">
                    <Input
                      id="companyName"
                      inputMode="text"
                      type="text"
                      placeholder="company"
                      {...register("name", {
                        required: true,
                      })}
                      defaultValue={companyData?.name}
                      disabled={true}
                      // disabled={
                      //   isLoadingCompanyData ||
                      //   updateCompanyNameMutation.isLoading
                      // }
                    />
                    <Button
                      type="submit"
                      isLoading={updateCompanyNameMutation.isLoading}
                      disabled={
                        isLoadingCompanyData ||
                        updateCompanyNameMutation.isLoading ||
                        getValues("name") === companyData?.name
                      }
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* company members */}
          <div className="w-full pt-6">
            <div className="flex flex-col gap-6 pb-8">
              <div className="flex items-center justify-between">
                <h2 className="FormLabel-md">Company Teams</h2>
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
                <h2 className="FormLabel-md">Company Members</h2>
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
                <h2 className="FormLabel-md">Company Invitations</h2>
                <CreateInvite />
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
      </div>
    </>
  );
}
