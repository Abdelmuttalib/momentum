/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Dispatch, type SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type RegisterStep } from "@/pages/register";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/router";
import { Label } from "@/components/ui/label";
import { type CreateCompanySchemaType } from "@/schema";
import { useCreateCompany } from "../use-create-company";
import { useCreateAdminAccount } from "@/hooks/use-create-admin-account";
import {
  AuthPageDescription,
  AuthPageTitle,
} from "@/components/views/auth/common";

interface CreateCompanyFormProps {
  setRegisterStep: (step: RegisterStep) => void;
  setCompanyName: (name: string) => void;
}

export function CreateCompanyForm({
  setRegisterStep,
  setCompanyName,
}: CreateCompanyFormProps) {
  const { form } = useCreateCompany();

  const router = useRouter();

  function onCreateCompany(data: CreateCompanySchemaType) {
    setCompanyName(data.name);
    setRegisterStep("user");
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <AuthPageTitle>Create a new company</AuthPageTitle>
        <AuthPageDescription>
          create your company and invite your team members.
        </AuthPageDescription>
      </div>
      <form
        onSubmit={form.handleSubmit(onCreateCompany)}
        className="w-full space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...form.register("name")}
            type="text"
            placeholder="company name"
            data-invalid={form.formState.errors.name?.message}
          />
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeftIcon className="-ml-1 h-4 w-4" />
            Back
          </Button>
          <Button type="submit">Create Company</Button>
        </div>
      </form>
    </div>
  );
}

interface CreateAdminAccountFormProps {
  companyName: string;
  setRegisterStep: Dispatch<SetStateAction<RegisterStep>>;
}

export function CreateAdminAccountForm({
  companyName,
  setRegisterStep,
}: CreateAdminAccountFormProps) {
  const { form, handleSubmit, mutation } = useCreateAdminAccount(companyName);

  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <div>
        <AuthPageTitle>Create an admin account</AuthPageTitle>
        <AuthPageDescription>
          create your admin account for your company
        </AuthPageDescription>
      </div>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit}
        className="w-full space-y-6"
      >
        <div className="w-full space-y-2">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              {...form.register("company")}
              type="text"
              placeholder="company"
              value={companyName}
              disabled
              className="bg-muted"
              data-invalid={form.formState.errors.company?.message}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              {...form.register("email")}
              type="email"
              placeholder="email@mail.com"
              data-invalid={form.formState.errors.email?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              {...form.register("name")}
              type="text"
              placeholder="Enter your name"
              data-invalid={form.formState.errors.name?.message}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              {...form.register("password")}
              type="password"
              placeholder="Enter your password"
              data-invalid={form.formState.errors.password?.message}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              {...form.register("confirmPassword")}
              type="password"
              placeholder="confirm your password"
              data-invalid={form.formState.errors.confirmPassword?.message}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setRegisterStep("company")}
            disabled={mutation.isLoading}
          >
            <ArrowLeftIcon className="-ml-2 mr-1 h-4 w-4" />
            Back
          </Button>
          <Button
            type="submit"
            disabled={mutation.isLoading}
            isLoading={mutation.isLoading}
          >
            Create Admin Account
          </Button>
        </div>
      </form>
    </div>
  );
}
