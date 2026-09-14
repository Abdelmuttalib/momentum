import { registerUserFormSchema, type RegisterUserSchemaType } from "@/schema";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useFormErrorToast } from "./use-form-error-toast";

export interface UseRegisterUserOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

export function useRegisterUser({
  onSuccess,
  onError,
}: UseRegisterUserOptions) {
  const form = useForm<RegisterUserSchemaType>({
    resolver: zodResolver(registerUserFormSchema),
  });

  const mutation = api.company.registerInvitedUser.useMutation({
    onSuccess: () => {
      toast.success("Account created successfully");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Something went wrong, kindly try again!");
      onError?.();
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutation.mutateAsync({
      name: data.name,
      email: data.email,
      password: data.password,
      token: data.token,
      inviteCode: data.inviteCode ?? null,
    });
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
