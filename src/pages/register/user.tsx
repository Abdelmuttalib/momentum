import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

import { useRouter } from "next/router";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Seo } from "@/components/seo";
import { Label } from "@/components/ui/label";
import { useRegisterUser } from "@/hooks/use-register-user";
import {
  AuthPageDescription,
  AuthPageTitle,
} from "@/components/views/auth/common";
import { siteConfig } from "@/config/site-config";
import { ButtonLoaderIcon } from "@/components/common/button-loader-icon";
import { SpinLoader } from "@/components/spin-loader";
import { EmptyState } from "@/components/common/empty-state";
import { Text } from "@/components/typography";
import { UserRoleBadge } from "@/features/users/components/user-role-badge";
import { api } from "@/lib/api";
import { requireAnonymousPage } from "@/server/auth-guard";
import { type GetServerSideProps } from "next";
import { useTranslations } from "next-intl";

function InvalidInvitationState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const t = useTranslations("auth");
  return (
    <>
      <Seo title={t("joinCompany")} />
      <div className="w-full max-w-md space-y-6 px-6 py-4">
        <div>
          <AuthPageTitle>{t("getStarted")}</AuthPageTitle>
          <AuthPageDescription>{description}</AuthPageDescription>
        </div>
        <EmptyState title={title} description={description} />
      </div>
    </>
  );
}

function CreateUserAccountForm({ token }: { token: string }) {
  const router = useRouter();
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");

  const {
    data: invitation,
    isLoading: isLoadingInvitation,
    error: invitationError,
  } = api.company.getInvitationByToken.useQuery(
    { token },
    { enabled: !!token, retry: false }
  );

  const { form, handleSubmit, mutation } = useRegisterUser({
    onSuccess: () => {
      router.push(siteConfig.pages.main.links.signIn.href).catch(() => {
        // redirect to sign in page
      });
    },
    onError: () => {
      toast.error(t("registerFailed"));
    },
  });

  useEffect(() => {
    form.setValue("token", token);
  }, [token, form]);

  useEffect(() => {
    if (invitation?.state === "VALID" && invitation.email) {
      form.setValue("email", invitation.email);
    }
  }, [invitation, form]);

  if (isLoadingInvitation) {
    return (
      <>
        <Seo title={t("joinCompany")} />
        <div className="w-full max-w-md space-y-6 px-6 py-4">
          <SpinLoader />
        </div>
      </>
    );
  }

  if (invitationError || !invitation || invitation.state === "INVALID") {
    return (
      <InvalidInvitationState
        title={t("invalidInvitation")}
        description={t("invalidInvitationDescription")}
      />
    );
  }

  if (invitation.state === "USED") {
    return (
      <InvalidInvitationState
        title={t("usedInvitation")}
        description={t("usedInvitationDescription")}
      />
    );
  }

  if (invitation.state === "EXPIRED" || invitation.state === "LOCKED") {
    return (
      <InvalidInvitationState
        title={t("expiredInvitation")}
        description={t("expiredInvitationDescription")}
      />
    );
  }

  if (invitation.state === "NEEDS_REGENERATION") {
    return (
      <InvalidInvitationState
        title={t("needsAttentionInvitation")}
        description={t("needsAttentionInvitationDescription")}
      />
    );
  }

  return (
    <>
      <Seo title={t("joinCompany")} />

      <div className="w-full max-w-md space-y-6 px-6 py-4">
        <div>
          <AuthPageTitle>{t("getStarted")}</AuthPageTitle>
          <AuthPageDescription>
            {t("invitedTo", { company: invitation.companyName })}
          </AuthPageDescription>
        </div>

        <form
          className="flex flex-col gap-4"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit}
        >
          {/* Email (locked to the invitation) */}
          <div>
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              {...form.register("email")}
              type="email"
              inputMode="email"
              placeholder="email@mail.com"
              disabled
              dir="ltr"
              data-invalid={form.formState.errors?.email?.message}
            />
            <Text size="xs" tone="muted">
              {t("emailLockedHint", { email: invitation.email })}
            </Text>
          </div>

          {/* Invited role context */}
          <div className="flex items-center gap-2">
            <Text size="xs" tone="muted" as="span">
              {t("joiningAs")}
            </Text>
            <UserRoleBadge role={invitation.role} />
          </div>

          {/* Name Input */}
          <div>
            <Label htmlFor="name">{t("name")}</Label>
            <Input
              id="name"
              type="name"
              {...form.register("name", { required: true })}
              placeholder="name"
              disabled={mutation.isLoading}
              data-invalid={form.formState.errors?.name?.message}
            />
          </div>

          {/* Password Input */}
          <div>
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              type="password"
              {...form.register("password", { required: true })}
              placeholder="password"
              disabled={mutation.isLoading}
              data-invalid={form.formState.errors?.password?.message}
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...form.register("confirmPassword", { required: true })}
              placeholder="confirm password"
              disabled={mutation.isLoading}
              data-invalid={form.formState.errors?.confirmPassword?.message}
            />
          </div>

          {/* Invite Code Input */}
          <div>
            <Label htmlFor="inviteCode">{t("inviteCode")}</Label>
            <Input
              id="inviteCode"
              {...form.register("inviteCode", { required: true })}
              placeholder="6-character code"
              autoComplete="off"
              maxLength={6}
              dir="ltr"
              className="font-mono uppercase placeholder:normal-case placeholder:font-sans"
              disabled={mutation.isLoading}
              data-invalid={form.formState.errors?.inviteCode?.message}
            />
            <Text size="xs" tone="muted">
              {t("inviteCodeHint")}
            </Text>
          </div>
          <div className="mt-2">
            <Button
              type="submit"
              disabled={
                Object.keys(form.formState.errors).length > 0 ||
                mutation.isLoading
              }
              className="w-full"
            >
              <ButtonLoaderIcon isPending={mutation.isLoading} />
              {t("createAccount")}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default function RegisterUserPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const inviteToken =
    typeof router.query.token === "string" ? router.query.token : "";

  return (
    <AuthLayout>
      {inviteToken ? (
        <CreateUserAccountForm token={inviteToken} />
      ) : (
        <InvalidInvitationState
          title={t("missingInvitation")}
          description={t("missingInvitationDescription")}
        />
      )}
    </AuthLayout>
  );
}

export const getServerSideProps: GetServerSideProps = requireAnonymousPage();
