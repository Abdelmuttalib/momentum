import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/typography";
import { SettingSection } from "@/components/settings/setting-section";
import { api } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Link from "next/link";
import { ButtonLoaderIcon } from "@/components/common/button-loader-icon";
import { isAdmin } from "@/lib/auth/roles";
import { useTranslations } from "next-intl";

const companyInfoFormSchema = z.object({
  name: z.string(),
});

type CompanyInfoFormValues = z.infer<typeof companyInfoFormSchema>;

/**
 * Workspace configuration only (company name). Member and invitation
 * management lives on the Company page (/company), which uses a wider
 * management layout suited to tables.
 */
export function CompanySettings() {
  const { data: session } = useSession();
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const companyId = session?.user?.company?.id;
  const isAdminUser = isAdmin(session?.user?.role);

  const { data: companyData, isLoading: isLoadingCompanyData } =
    api.company.getCompany.useQuery();

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
    <div className="flex flex-col">
      <SettingSection
        title={t("companyName")}
        description={
          isAdminUser ? t("companyNameDescription") : t("companyAdminOnly")
        }
      >
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-w-md flex-col gap-3"
        >
          <div>
            <Label htmlFor="companyName">{t("name")}</Label>
            <Input
              id="companyName"
              inputMode="text"
              type="text"
              placeholder={t("companyNamePlaceholder")}
              {...register("name", {
                required: true,
              })}
              defaultValue={companyData?.name}
              disabled={
                !isAdminUser ||
                isLoadingCompanyData ||
                updateCompanyNameMutation.isLoading
              }
              data-invalid={errors?.name?.message}
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="self-start"
            disabled={
              !isAdminUser ||
              isLoadingCompanyData ||
              updateCompanyNameMutation.isLoading ||
              getValues("name") === companyData?.name
            }
          >
            <ButtonLoaderIcon isPending={updateCompanyNameMutation.isLoading} />
            {tCommon("saveChanges")}
          </Button>
        </form>
      </SettingSection>

      <SettingSection
        title={t("membersInvites")}
        description={t("membersInvitesDescription")}
      >
        <Text size="sm" tone="muted">
          {t.rich("manageOnCompanyPage", {
            link: (chunks) => (
              <Link
                href="/company"
                className="font-medium text-foreground hover:underline"
              >
                {chunks}
              </Link>
            ),
          })}
        </Text>
      </SettingSection>
    </div>
  );
}
