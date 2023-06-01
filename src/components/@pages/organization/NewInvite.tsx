/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Role, type Organization, type User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getUserRoleBadgeColor } from "@/utils/getBadgeColor";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Badge from "@/components/ui/badge";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { type ReactNode, useState } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";

interface NewInviteFormProps {
  userId: User["id"];
  organizationId: Organization["id"];
  onCancel: () => void;
}

export const inviteUserToOrganizationFormSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^1[3-9]\d{9}$/, "validations.phoneNumber")
    .nonempty(),
  role: z.nativeEnum(Role),
});

type NewInviteFormSchema = z.infer<typeof inviteUserToOrganizationFormSchema>;

function NewInviteForm({
  userId,
  organizationId,
  onCancel,
}: NewInviteFormProps) {
  const apiContext = api.useContext();
  const form = useForm<NewInviteFormSchema>({
    resolver: zodResolver(inviteUserToOrganizationFormSchema),
  });

  const inviteUserToOrganizationMutation =
    api.organization.inviteUserToOrganization.useMutation({
      onSuccess: async () => {
        form.reset();
        await apiContext.organization.getAllInvitations.invalidate();
        onCancel();
        toast.success("User invited successfully");
      },
      onError: () => {
        toast.error("Failed to invite user");
      },
    });

  async function onSubmit(data: NewInviteFormSchema) {
    await inviteUserToOrganizationMutation.mutateAsync({
      invitedById: userId,
      organizationId: organizationId,
      ...data,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="13XXXXXXXXX" {...field} />
              </FormControl>
              {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className="w-full text-gray-800">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      {Object.values(Role).map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                          className="capitalize"
                        >
                          <Badge color={getUserRoleBadgeColor(status)}>
                            {status.replace("_", " ")}
                          </Badge>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse md:flex-row md:justify-end md:gap-2">
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            disabled={inviteUserToOrganizationMutation.isLoading}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="mt-2 flex-1 md:flex-initial"
            disabled={inviteUserToOrganizationMutation.isLoading}
            isLoading={inviteUserToOrganizationMutation.isLoading}
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

interface NewInviteDialogProps {
  isOpen: boolean;
  toggleModal: () => void;
  children: ReactNode;
}

const NewInviteDialog = ({
  isOpen,
  toggleModal,
  children,
}: NewInviteDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogTrigger asChild>
        <Button className="ml-2 inline-flex gap-1 whitespace-nowrap">
          <PlusIcon className="w-5" /> New Invite
        </Button>
      </DialogTrigger>
      {isOpen && (
        <DialogContent className="mt-10 bg-white sm:max-w-lg">
          <DialogHeader className="space-y-0">
            <DialogTitle>
              <h2 className="h5 inline">New Invite</h2>
            </DialogTitle>
            <DialogDescription className="body-sm inline text-gray-600">
              <p>Invite a user to your organization.</p>
            </DialogDescription>
          </DialogHeader>

          {children}
        </DialogContent>
      )}
    </Dialog>
  );
};

interface NewInviteProps {
  userId: User["id"];
  organizationId: Organization["id"];
}

export default function NewInvite(props: NewInviteProps) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleModal() {
    setIsOpen((prev) => !prev);
  }

  return (
    <NewInviteDialog isOpen={isOpen} toggleModal={toggleModal}>
      <NewInviteForm {...props} onCancel={() => toggleModal()} />
    </NewInviteDialog>
  );
}
