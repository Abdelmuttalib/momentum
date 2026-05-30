import { useFormErrorToast } from "./use-form-error-toast";
import { type UseFormReturn } from "react-hook-form";

export type FormHelpersProps = {
  // form of react-hook-form
  form: UseFormReturn;
};

export function useFormHelpers({ form }: FormHelpersProps) {
  useFormErrorToast({
    errors: form.formState.errors,
    touchedFields: form.formState.touchedFields,
  });

  return {};
}
