import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/typography";
import {
  SettingSection,
} from "@/components/settings/setting-section";
import { api } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Link from "next/link";
import { ButtonLoaderIcon } from "@/components/common/button-loader-icon";

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
  const companyId = session?.user?.company?.id;
  const isAdmin = session?.user?.role === "ADMIN";
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
        title="Company name"
        description={
          isAdmin
            ? "Shown across the workspace."
            : "Only workspace admins can rename the company."
        }
      >
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-w-md flex-col gap-3"
        >
          <div>
            <Label htmlFor="companyName">Name</Label>
            <Input
              id="companyName"
              inputMode="text"
              type="text"
              placeholder="Company"
              {...register("name", {
                required: true,
              })}
              defaultValue={companyData?.name}
              disabled={
                !isAdmin ||
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
              !isAdmin ||
              isLoadingCompanyData ||
              updateCompanyNameMutation.isLoading ||
              getValues("name") === companyData?.name
            }
          >
            <ButtonLoaderIcon
              isPending={updateCompanyNameMutation.isLoading}
            />
            Save changes
          </Button>
        </form>
      </SettingSection>

      <SettingSection
        title="Members & invitations"
        description="Manage who has access to this workspace."
      >
        <Text size="sm" tone="muted">
          Workspace members and pending invitations are managed on the{" "}
          <Link
            href="/company"
            className="font-medium text-foreground hover:underline"
          >
            Company page
          </Link>
          .
        </Text>
      </SettingSection>
    </div>
  );
}
