import { useEffect, useRef } from "react";
import {
  type FieldNamesMarkedBoolean,
  type FieldErrors,
  type FieldValues,
} from "react-hook-form";
import { toast } from "sonner";

export function useFormErrorToast<TFieldValues extends FieldValues>({
  errors,
  touchedFields,
}: {
  errors: FieldErrors<TFieldValues>;
  touchedFields: FieldNamesMarkedBoolean<TFieldValues>;
}) {
  const lastShown = useRef<Record<string, string | null>>({});

  useEffect(() => {
    Object.entries(errors).forEach(([fieldName, errorObj]) => {
      const errorMessage = errorObj?.message as string | undefined;

      // Only show toast if the field is touched AND the message has changed
      if (
        touchedFields[fieldName] &&
        errorMessage
        // &&
        // lastShown.current[fieldName] !== errorMessage
      ) {
        toast.error(errorMessage);
        // lastShown.current[fieldName] = errorMessage;
      }
    });

    // Optionally clear lastShown for fields with no more errors
    Object.keys(lastShown.current).forEach((field) => {
      if (!errors[field]) {
        lastShown.current[field] = null;
      }
    });
  }, [errors, touchedFields]);
}
