import { requireAuthPage } from "@/server/auth-guard";
import type { GetServerSideProps } from "next";
import { api } from "@/lib/api";
import { Seo } from "@/components/seo";
import { AppLayout } from "@/components/layout/app-layout";
import { CompactPageHeader } from "@/components/common/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTableLoader } from "@/components/data-loader";
import { CreateInvite } from "@/components/views/company/invitations/create-invite";
import { getCompanyInvitationsColumns } from "@/components/views/company/invites/company-invitations-columns";
import { teamMembersColumns } from "@/components/views/team/teamMembersColumns";
import { useInvites } from "@/features/company/hooks/use-invite";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function CompanyPage() {
  const { data: session } = useSession();
  const t = useTranslations("company");
  const company = session?.user?.company;
  const companyId = company?.id;

  const {
    data: invitations,
    isLoading: isLoadingInvitations,
    error: invitationsError,
  } = useInvites({
    companyId: companyId ?? "",
  });

  const {
    data: members,
    isLoading: isLoadingMembers,
    error: membersError,
  } = api.company.getCompanyUsers.useQuery();

  return (
    <>
      <Seo title="Company | Momentum" />

      <AppLayout>
        <div className="flex flex-col gap-4">
          <CompactPageHeader
            title={company?.name ?? t("title")}
            description={t("description")}
            actions={<CreateInvite />}
          />
          <Tabs defaultValue="members">
            <TabsList>
              <TabsTrigger value="members">
                {t("members", { count: members?.length ?? 0 })}
              </TabsTrigger>
              <TabsTrigger value="invitations">
                {t("invitations", { count: invitations?.length ?? 0 })}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="members">
              <DataTableLoader
                data={members}
                columns={teamMembersColumns}
                isLoading={isLoadingMembers}
                error={membersError}
              />
            </TabsContent>
            <TabsContent value="invitations">
              <DataTableLoader
                data={invitations}
                columns={getCompanyInvitationsColumns(t)}
                isLoading={isLoadingInvitations}
                error={invitationsError}
              />
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuthPage();
