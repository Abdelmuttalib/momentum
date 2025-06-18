import { siteConfig } from "@/config/site-config";
import {
  createAdminAccountFormSchema,
  type CreateAdminAccountSchemaType,
} from "@/schema";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useFormErrorToast } from "./use-form-error-toast";

export function useCreateAdminAccount(companyName: string) {
  const router = useRouter();

  const form = useForm<CreateAdminAccountSchemaType>({
    resolver: zodResolver(createAdminAccountFormSchema),
    defaultValues: {
      company: companyName,
    },
  });

  const mutation = api.company.createCompanyWithAdminAccount.useMutation({
    onSuccess: async () => {
      // Handle the new team. For example, you could redirect to the team's page
      // onSuccess();
      toast.success("admin account created successfully");
      form.reset();
      await router.push(siteConfig.pages.main.links.signIn.href);
    },
    onError: () => {
      toast.error("Failed to create new team");
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const requestData = {
      name: data.name,
      company: data.company,
      email: data.email,
      password: data.password,
    };

    await mutation.mutateAsync(requestData);
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

export type UseCreateAdminAccountReturnType = ReturnType<
  typeof useCreateAdminAccount
>;
