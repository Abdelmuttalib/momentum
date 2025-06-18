import { useFormErrorToast } from "@/hooks/use-form-error-toast";
import {
  createCompanyFormSchema,
  type CreateCompanySchemaType,
} from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function useCreateCompany() {
  const form = useForm<CreateCompanySchemaType>({
    resolver: zodResolver(createCompanyFormSchema),
  });

  useFormErrorToast<CreateCompanySchemaType>({
    errors: form.formState.errors,
    touchedFields: form.formState.touchedFields,
  });

  return {
    form,
  };
}
