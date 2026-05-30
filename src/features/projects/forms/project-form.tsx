import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonLoaderIcon } from "@/components/common/button-loader-icon";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectFormSchema, type ProjectFormSchemaType } from "@/schema";
import { BackButton } from "@/components/common/back-button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  FormActions,
  FormLayout,
  FormSection,
  FormSectionBody,
  FormSectionHeader,
  FormStack,
} from "@/components/page-components";
import { useFormErrorToast } from "@/hooks/use-form-error-toast";

interface ProjectFormProps {
  onSubmit: (data: ProjectFormSchemaType) => void;
  onSuccess?: () => void;
  onError?: () => void;
  onCancel?: () => void;
  defaultValues: ProjectFormSchemaType;
  isPending: boolean;
  mode?: "create" | "edit";
}

export function ProjectForm({
  onSubmit,
  onSuccess,
  onError,
  onCancel,
  defaultValues,
  isPending,
  mode = "create",
}: ProjectFormProps) {
  const form = useForm<ProjectFormSchemaType>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  useFormErrorToast({
    touchedFields: form.formState.touchedFields,
    errors: form.formState.errors,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          void form.handleSubmit(onSubmit)(e);
        }}
      >
        <FormStack>
          <FormSection>
            <FormLayout>
              <FormField
                control={form.control}
                name="name"
                disabled={isPending}
                data-invalid={form.formState.errors.name?.message}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Project Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="project name"
                        type="text"
                        inputMode="text"
                        aria-invalid={!!form.formState.errors.name?.message}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                disabled={isPending}
                data-invalid={form.formState.errors.description?.message}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="description">
                      Project Description
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="project description"
                        type="text"
                        inputMode="text"
                        aria-invalid={
                          !!form.formState.errors.description?.message
                        }
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </FormLayout>
          </FormSection>

          {/* ACTION */}
          <FormActions>
            <BackButton
              fallback={`/projects`}
              disabled={isPending}
              text="Cancel"
              // onClick={onCancel}
            />

            <Button
              type="submit"
              disabled={isPending || !form.formState.isDirty}
            >
              <ButtonLoaderIcon isPending={isPending} />
              {/* Create Project */}
              {mode === "create" ? "Create Project" : "Save Changes"}
            </Button>
          </FormActions>
        </FormStack>
      </form>
    </Form>
  );
}
