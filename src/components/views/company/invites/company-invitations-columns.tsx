import { InviteStatusBadge } from "@/features/company/components/invite-status-badge";
import { UserRoleBadge } from "@/features/users/components/user-role-badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/typography";
import { formatShortDateWithYear } from "@/lib/date";
import { api } from "@/lib/api";
import { type Invitation } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, Copy, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ButtonLoaderIcon } from "@/components/common/button-loader-icon";
import { useSession } from "next-auth/react";
import { isAdmin } from "@/lib/auth/roles";
import type { useTranslations } from "next-intl";

type CompanyT = ReturnType<typeof useTranslations<"company">>;

export function isInvitationExpired(
  invitation: Pick<Invitation, "status" | "expiresAt">
) {
  return (
    invitation.status === "INVITED" &&
    !!invitation.expiresAt &&
    new Date(invitation.expiresAt) < new Date()
  );
}

function CopyButton({
  t,
  value,
  label,
  children,
}: {
  t: CompanyT;
  value: string;
  label: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={label}
      title={label}
      onClick={() => {
        void navigator.clipboard
          .writeText(value)
          .then(() => {
            setCopied(true);
            toast.success(t("copied"));
            setTimeout(() => setCopied(false), 2000);
          })
          .catch(() => toast.error(t("copyFailed")));
      }}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {children}
    </Button>
  );
}

function InviteLinkCell({
  t,
  invitation,
}: {
  t: CompanyT;
  invitation: Invitation;
}) {
  if (!invitation.token) {
    return (
      <Text size="xs" tone="muted" as="span">
        {t("inviteUsed")}
      </Text>
    );
  }
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/register/user?token=${invitation.token}`
      : "";
  return (
    <CopyButton
      t={t}
      value={url}
      label={t("copyInviteLinkFor", { email: invitation.email })}
    >
      {t("link")}
    </CopyButton>
  );
}

function InviteCodeCell({
  t,
  invitation,
}: {
  t: CompanyT;
  invitation: Invitation;
}) {
  if (invitation.status !== "INVITED") {
    return (
      <Text size="xs" tone="muted" as="span">
        —
      </Text>
    );
  }
  if (!invitation.inviteCode) {
    return (
      <Text size="xs" tone="muted" as="span">
        {t("regenerateHint")}
      </Text>
    );
  }
  return (
    <CopyButton
      t={t}
      value={invitation.inviteCode}
      label={t("copyInviteCodeFor", { email: invitation.email })}
    >
      <span className="font-mono" dir="ltr">
        {invitation.inviteCode}
      </span>
    </CopyButton>
  );
}

function InvitationActionsCell({
  t,
  invitation,
}: {
  t: CompanyT;
  invitation: Invitation;
}) {
  const utils = api.useContext();
  const [confirming, setConfirming] = useState(false);
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const isAdminUser = isAdmin(userRole);

  const regenerate = api.company.regenerateInvitation.useMutation({
    onSuccess: async () => {
      toast.success(t("regenerated"));
      await utils.company.getAllInvitations.invalidate();
    },
    onError: () => toast.error(t("regenerateFailed")),
  });
  const revoke = api.company.revokeInvitation.useMutation({
    onSuccess: async () => {
      toast.success(t("revoked"));
      await utils.company.getAllInvitations.invalidate();
    },
    onError: () => toast.error(t("revokeFailed")),
  });

  if (invitation.status !== "INVITED") {
    return (
      <Text size="xs" tone="muted" as="span">
        —
      </Text>
    );
  }

  const isPending = regenerate.isLoading || revoke.isLoading;

  if (!confirming) {
    return (
      <span className="inline-flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          aria-label={t("regenerateFor", { email: invitation.email })}
          title={t("regenerateTitle")}
          disabled={isPending || !isAdminUser}
          onClick={() => void regenerate.mutateAsync({ id: invitation.id })}
        >
          <ButtonLoaderIcon isPending={regenerate.isLoading} />
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          aria-label={t("revokeFor", { email: invitation.email })}
          title={t("revoke")}
          disabled={isPending || !isAdminUser}
          className="text-destructive hover:text-destructive"
          onClick={() => setConfirming(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <Button
        variant="destructive"
        size="sm"
        disabled={isPending}
        onClick={() => void revoke.mutateAsync({ id: invitation.id })}
      >
        {t("confirm")}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={isPending}
        onClick={() => setConfirming(false)}
      >
        {t("cancel")}
      </Button>
    </span>
  );
}

function StatusCell({
  t,
  invitation,
}: {
  t: CompanyT;
  invitation: Invitation;
}) {
  if (isInvitationExpired(invitation)) {
    return (
      <Text size="xs" tone="muted" as="span">
        {t("expired")}
      </Text>
    );
  }
  return <InviteStatusBadge status={invitation?.status} />;
}

export function getCompanyInvitationsColumns(
  t: CompanyT
): ColumnDef<Invitation>[] {
  return [
    {
      accessorKey: "email",
      header: t("emailHeader"),
    },
    {
      accessorKey: "status",
      header: t("statusHeader"),
      cell: ({ row: { original } }) => {
        return <StatusCell t={t} invitation={original} />;
      },
    },
    {
      accessorKey: "role",
      header: t("roleHeader"),
      cell: ({ row: { original } }) => {
        const invitation = original;
        return (
          <>
            <UserRoleBadge role={invitation?.role} />
          </>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: t("dateHeader"),
      cell: ({ row: { original } }) => {
        const invitation = original;
        return <p>{formatShortDateWithYear(invitation?.createdAt)}</p>;
      },
    },
    {
      id: "inviteLink",
      header: t("linkHeader"),
      cell: ({ row: { original } }) => (
        <InviteLinkCell t={t} invitation={original} />
      ),
    },
    {
      id: "inviteCode",
      header: t("codeHeader"),
      cell: ({ row: { original } }) => (
        <InviteCodeCell t={t} invitation={original} />
      ),
    },
    {
      id: "actions",
      header: t("actionsHeader"),
      cell: ({ row: { original } }) => (
        <InvitationActionsCell t={t} invitation={original} />
      ),
    },
  ];
}


