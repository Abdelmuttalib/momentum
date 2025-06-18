import { siteConfig } from "@/config/site-config";
import { registerUserFormSchema, type RegisterUserSchemaType } from "@/schema";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
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
  const router = useRouter();

  const form = useForm<RegisterUserSchemaType>({
    resolver: zodResolver(registerUserFormSchema),
  });

  const mutation = api.company.registerInvitedUser.useMutation({
    onSuccess: async () => {
      toast.success("Account created successfully");
      await router.push(siteConfig.pages.main.links.signIn.href);
      onSuccess?.();
    },
    onError: () => {
      toast.error("Something went wrong, kindly try again!");
      onError?.();
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    console.log("Form submitted", data);
    await mutation.mutateAsync({
      name: data.name,
      email: data.email,
      password: data.password,
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
