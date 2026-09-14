import { Button } from "@/components/ui/button";
import { Check, Copy, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DialogForm } from "@/components/common/dialog-form";
import { Text } from "@/components/typography";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@prisma/client";
import { getUserRoleBadgeColor } from "@/lib/getBadgeColor";
import { useInvite } from "@/hooks/use-invite";
import { RichBadge } from "@/components/ui/rich-badge";
import { ButtonLoaderIcon } from "@/components/common/button-loader-icon";
import { UserRoleBadge } from "@/features/users/components/user-role-badge";
import { useTranslations } from "next-intl";

interface CreateInviteFormProps {
  onSuccess: () => void;
  onError: () => void;
  onCancel: () => void;
}

function CreateInviteForm({
  onSuccess,
  onError,
  onCancel,
}: CreateInviteFormProps) {
  const t = useTranslations("company");
  const [created, setCreated] = useState<{
    email: string;
    token: string | null;
    inviteCode: string | null;
  } | null>(null);
  const { form, handleSubmit, mutation } = useInvite({
    onSuccess: (invitation) => {
      if (invitation?.token && invitation?.inviteCode) {
        setCreated({
          email: invitation.email,
          token: invitation.token,
          inviteCode: invitation.inviteCode,
        });
      }
      onSuccess?.();
    },
    onError,
  });

  if (created?.token && created?.inviteCode) {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/register/user?token=${created.token}`
        : "";
    return (
      <InvitationResult
        email={created.email}
        url={url}
        inviteCode={created.inviteCode}
        onDone={onCancel}
      />
    );
  }

  return (
    <Form {...form}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-3"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>{t("inviteEmailLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder="email@mail.com"
                  disabled={mutation.isLoading}
                  dir="ltr"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="w-full space-y-1">
              <FormLabel>{t("inviteRoleLabel")}</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={(value) => field.onChange(value as Role)}
                  disabled={mutation.isLoading}
                >
                  <SelectTrigger className="w-full text-foreground">
                    <SelectValue placeholder={t("inviteRolePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(Role).map((role) => (
                        <SelectItem
                          key={role}
                          value={role}
                          className="capitalize"
                        >
                          <UserRoleBadge role={role} />
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-2 flex flex-col-reverse md:flex-row md:justify-end md:gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={mutation.isLoading}
            onClick={onCancel}
          >
            {t("inviteCancel")}
          </Button>
          <Button
            type="submit"
            className="flex-1 md:flex-initial"
            disabled={mutation.isLoading}
          >
            <ButtonLoaderIcon isPending={mutation.isLoading} />
            {t("inviteSubmit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function CopyRow({
  label,
  value,
  displayValue,
  copyLabel,
}: {
  label: string;
  value: string;
  displayValue?: string;
  copyLabel: string;
}) {
  const t = useTranslations("company");
  const [copied, setCopied] = useState(false);
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Input readOnly value={displayValue ?? value} dir="ltr" className="font-mono text-xs" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={copyLabel}
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
          {t("copy")}
        </Button>
      </div>
    </div>
  );
}

function InvitationResult({
  email,
  url,
  inviteCode,
  onDone,
}: {
  email: string;
  url: string;
  inviteCode: string;
  onDone: () => void;
}) {
  const t = useTranslations("company");
  return (
    <div className="flex flex-col gap-4">
      <Text size="sm" tone="muted">
        {t("inviteCreated", { email })}
      </Text>
      <CopyRow
        label={t("inviteLinkLabel")}
        value={url}
        copyLabel={t("copyInviteLink")}
      />
      <CopyRow
        label={t("inviteCodeLabel")}
        value={inviteCode}
        copyLabel={t("copyInviteCode")}
      />
      <div className="flex justify-end">
        <Button type="button" onClick={onDone}>
          {t("doneButton")}
        </Button>
      </div>
    </div>
  );
}

export function CreateInvite() {
  const t = useTranslations("company");
  return (
    <DialogForm
      title={t("inviteDialogTitle")}
      description={t("inviteDialogDescription")}
      triggerButton={
        <Button>
          <PlusIcon className="w-4" />
          {t("newInvite")}
        </Button>
      }
      dialogContentClassName="sm:max-w-md"
    >
      {({ onClose }) => (
        <CreateInviteForm
          onSuccess={() => {
            // Keep the dialog open: the form shows the invitation
            // link + code result state on success.
          }}
          onError={() => {
            // toast.error("Failed to invite user");
            onClose();
          }}
          onCancel={onClose}
        />
      )}
    </DialogForm>
  );
}
