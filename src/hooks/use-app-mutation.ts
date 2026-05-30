// hooks/use-app-mutation.ts

import { toast } from "sonner";
import { useRouter } from "next/navigation";

type MutationOptions<TData> = {
  successMessage?: string;
  errorMessage?: string;

  redirectTo?: string | ((data: TData) => string);

  onSuccess?: (data: TData) => void | Promise<void>;
  onError?: (error: unknown) => void;
};

export function useAppMutation<TInput, TData>(
  mutation: {
    mutateAsync: (input: TInput) => Promise<TData>;
    isPending: boolean;
  },
  defaults?: MutationOptions<TData>
) {
  const router = useRouter();

  async function execute(input: TInput, options?: MutationOptions<TData>) {
    const merged = {
      ...defaults,
      ...options,
    };

    try {
      const data = await mutation.mutateAsync(input);

      if (merged.successMessage) {
        toast.success(merged.successMessage);
      }

      await merged.onSuccess?.(data);

      const redirectPath =
        typeof merged.redirectTo === "function"
          ? merged.redirectTo(data)
          : merged.redirectTo;

      if (redirectPath) {
        router.push(redirectPath);
      }

      return data;
    } catch (error) {
      if (merged.errorMessage) {
        toast.error(merged.errorMessage);
      }

      merged.onError?.(error);

      throw error;
    }
  }

  return {
    execute,
    isPending: mutation.isPending,
  };
}
