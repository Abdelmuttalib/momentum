/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type RegisterStep } from "@/pages/register";
import { ArrowLeftIcon } from "lucide-react";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { Label } from "../ui/label";
import { Typography } from "../ui/typography";

const companyNameFormSchema = z.object({
  name: z.string().min(3, { message: "company name is too short" }),
});

type CompanyFormData = z.infer<typeof companyNameFormSchema>;

interface CreateCompanyFormProps {
  setRegisterStep: (step: RegisterStep) => void;
  setCompanyName: (name: string) => void;
}

export function CreateCompanyForm({
  setRegisterStep,
  setCompanyName,
}: CreateCompanyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companyNameFormSchema),
  });

  const { back } = useRouter();

  function onCreateCompany(data: CompanyFormData) {
    setCompanyName(data.name);
    setRegisterStep("user");
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <div>
        <Typography as="h1" variant="xl/medium">
          Create a new company
        </Typography>
        <p className="text-gray-500">choose a name for your company</p>
      </div>
      <form
        onSubmit={handleSubmit(onCreateCompany)}
        className="w-full space-y-4"
      >
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register("name")}
            type="text"
            placeholder="company name"
            error={errors.name}
          />
        </div>
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => back()}
            leftIcon={<ArrowLeftIcon className="-ml-1 h-4 w-4" />}
          >
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
  const { push } = useRouter();
  const adminAccountFormSchema = z
    .object({
      firstName: z
        .string()
        .min(2, { message: "first name is too short" })
        .max(15)
        .nonempty(),
      lastName: z
        .string()
        .min(2, { message: "last name is too short" })
        .max(15)
        .nonempty(),
      email: z.string().min(4).email("kindly enter a valid email."),
      company: z
        .string()
        .min(4, { message: "Company name is too short" })
        .default(companyName),
      password: z
        .string()
        .min(8, { message: "password must be at least 8 characters" })
        .max(50)
        .nonempty(),
      confirmPassword: z
        .string()
        .min(8, { message: "password must be at least 8 characters" })
        .max(50)
        .nonempty(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "passwords do not match",
    });

  type AdminAccountFormData = z.infer<typeof adminAccountFormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminAccountFormData>({
    resolver: zodResolver(adminAccountFormSchema),
    defaultValues: {
      company: companyName,
    },
  });

  const createCompanyWithAdminAccountMutation =
    api.company.createCompanyWithAdminAccount.useMutation({
      onSuccess: async () => {
        // Handle the new team. For example, you could redirect to the team's page
        // onSuccess();
        // reset();
        toast.success("admin account created successfully");
        await push("/sign-in");
      },
      onError: () => {
        toast.error("Failed to create new team");
      },
    });

  async function onCreateAdminAccount(data: AdminAccountFormData) {
    const requestData = {
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company,
      email: data.email,
      password: data.password,
    };

    await createCompanyWithAdminAccountMutation.mutateAsync(requestData);
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <div>
        <h1 className="h4 text-gray-800">Create an admin account</h1>
        <p className="text-gray-700">
          create your admin account for your company
        </p>
      </div>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onCreateAdminAccount)}
        className="w-full space-y-6"
      >
        <div className="w-full space-y-2">
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              {...register("company")}
              type="text"
              placeholder="company"
              value={companyName}
              disabled
              className="bg-muted"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              {...register("email")}
              type="email"
              placeholder="email@mail.com"
            />
            {errors.email && (
              <p className="mt-0.5 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                type="text"
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="mt-0.5 text-sm text-red-500">
                  {errors.firstName.message as string}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                type="text"
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="mt-0.5 text-sm text-red-500">
                  {errors.lastName.message as string}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              {...register("password")}
              type="password"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-0.5 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              {...register("confirmPassword")}
              type="password"
              placeholder="confirm your password"
            />
            {errors.confirmPassword && (
              <p className="mt-0.5 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setRegisterStep("company")}
            disabled={createCompanyWithAdminAccountMutation.isLoading}
          >
            <ArrowLeftIcon className="-ml-2 mr-1 h-4 w-4" />
            Back
          </Button>
          <Button
            type="submit"
            disabled={createCompanyWithAdminAccountMutation.isLoading}
            isLoading={createCompanyWithAdminAccountMutation.isLoading}
          >
            Create Admin Account
          </Button>
        </div>
      </form>
    </div>
  );
}
