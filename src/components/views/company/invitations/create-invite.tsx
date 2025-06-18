import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DialogForm } from "@/components/common/dialog-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@prisma/client";
import { getUserRoleBadgeColor } from "@/utils/getBadgeColor";
import { useInvite, type UseInviteReturnType } from "@/hooks/use-invite";
import { RichBadge } from "@/components/ui/rich-badge";

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
  const { form, handleSubmit, mutation } = useInvite({
    onSuccess,
    onError,
  });

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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="email@mail.com"
                  disabled={mutation.isLoading}
                  {...field}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="w-full space-y-1">
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={(value) => field.onChange(value as Role)}
                  disabled={mutation.isLoading}
                >
                  <SelectTrigger className="w-full text-foreground">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(Role).map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                          className="capitalize"
                        >
                          <RichBadge
                            color={getUserRoleBadgeColor(status)}
                            className="capitalize"
                          >
                            {status.replace("_", " ")}
                          </RichBadge>
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
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 md:flex-initial"
            disabled={mutation.isLoading}
            isLoading={mutation.isLoading}
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function CreateInvite() {
  return (
    <DialogForm
      title="Invite a User"
      description="Send an invitation to a user to join your company."
      triggerButton={
        <Button>
          <PlusIcon className="w-4" />
          New Invite
        </Button>
      }
      dialogContentClassName="sm:max-w-md"
    >
      {({ onClose }) => (
        <CreateInviteForm
          onSuccess={() => {
            // toast.success("User invited successfully");
            onClose();
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
