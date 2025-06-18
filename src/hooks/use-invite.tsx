import { inviteUserFormSchema, type InviteUserSchemaType } from "@/schema";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useFormErrorToast } from "./use-form-error-toast";

interface UseInviteOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

export function useInvite({ onSuccess, onError }: UseInviteOptions) {
  const apiContext = api.useContext();
  const form = useForm<InviteUserSchemaType>({
    resolver: zodResolver(inviteUserFormSchema),
  });

  const mutation = api.company.inviteUserToCompany.useMutation({
    onSuccess: async () => {
      toast.success("User invited successfully");
      form.reset();
      await apiContext.company.getAllInvitations.invalidate();
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to invite user");
      onError?.();
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutation.mutateAsync(data);
  });

  useFormErrorToast({
    errors: form.formState.errors,
    touchedFields: form.formState.touchedFields,
  });

  return {
    form,
    handleSubmit,
    mutation,
  };
}

export type UseInviteReturnType = ReturnType<typeof useInvite>;
