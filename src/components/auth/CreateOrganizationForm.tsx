import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { type FC, useState, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type TRegisterStep } from "@/pages/register";
import { ArrowLeftIcon } from "lucide-react";
import { api } from "@/utils/api";

type OrganizationFormData = {
  name: string;
};

export const CreateOrganizationForm: FC<{
  setRegisterStep: (step: TRegisterStep) => void;
  setOrganizationName: (name: string) => void;
}> = ({ setRegisterStep, setOrganizationName }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const organizationNameFormSchema = z.object({
    name: z.string().min(3, { message: "Organization name is too short" }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationNameFormSchema),
  });

  async function onCreateOrganization(data: OrganizationFormData) {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    toast.success("Organization created successfully");
    setOrganizationName(data.name);
    setRegisterStep("user");
    // fetchAPI
    //   .post("/admin/new/organization", data)
    //   .then(() => {
    //     toast.success("Organization created successfully");
    //     setOrganizationName(data.name);
    //     setRegisterStep("user");
    //   })
    //   .catch(() => {
    //     toast.error("Couldn't create organization");
    //   });

    setIsSubmitting(false);
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-5">
      <div>
        <h1 className="h3 text-gray-800">Create a new Organization</h1>
        <p className="text-gray-700">choose a name for your organization</p>
      </div>
      <form
        onSubmit={handleSubmit(onCreateOrganization)}
        className="w-full space-y-4"
      >
        <div>
          <label htmlFor="name">Name</label>
          <Input
            id="name"
            {...register("name")}
            type="text"
            placeholder="organization name"
          />
          {errors.name && (
            <p className="mt-0.5 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <Button disabled={isSubmitting} isLoading={isSubmitting}>
          Create Organization
        </Button>
      </form>
    </div>
  );
};

export const CreateAdminAccountForm: FC<{
  organizationName: string;
  setRegisterStep: Dispatch<SetStateAction<TRegisterStep>>;
}> = ({ organizationName, setRegisterStep }) => {
  const { push } = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      organization: z
        .string()
        .min(4, { message: "Organization name is too short" })
        .default(organizationName),
      phoneNumber: z
        .string()
        .regex(
          /^1[3-9]\d{9}$/,
          "Please enter a valid 10-digit phone number starting with 1 and the second digit between 3 and 9"
        )
        .nonempty(),
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

  type TAdminAccountFormData = z.infer<typeof adminAccountFormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TAdminAccountFormData>({
    resolver: zodResolver(adminAccountFormSchema),
    defaultValues: {
      organization: organizationName,
    },
  });

  const createOrganizationWithAdminAccountMutation =
    api.organization.createOrganizationWithAdminAccount.useMutation({
      onSuccess: (data) => {
        // Handle the new team. For example, you could redirect to the team's page
        // onSuccess();
        // reset();
        toast.success("admin account created successfully");
      },
      onError: () => {
        toast.error("Failed to create new team");
      },
    });

  async function onCreateAdminAccount(data: TAdminAccountFormData) {
    const requestData = {
      firstName: data.firstName,
      lastName: data.lastName,
      organization: data.organization,
      phoneNumber: data.phoneNumber,
      email: data.email,
      password: data.password,
    };

    await createOrganizationWithAdminAccountMutation.mutateAsync(requestData);

    // setIsSubmitting(true);
    // axios
    //   .post("/admin/new/admin-account", data)
    //   .then(() => {
    //     toast.success("admin account created successfully");
    //     push("/login");
    //   })
    //   .catch(() => {
    //     toast.error("Something went wrong, kindly try again!");
    //   });

    // setIsSubmitting(false);
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-5">
      <div>
        <h1 className="h3 text-gray-800">Create an admin account</h1>
        <p className="text-gray-700">
          create your admin account for your organization
        </p>
      </div>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onCreateAdminAccount)}
        className="w-full space-y-6"
      >
        <div className="w-full space-y-2">
          <div>
            <label htmlFor="organization">Organization</label>
            <Input
              id="organization"
              {...register("organization")}
              type="text"
              placeholder="organization"
              // defaultValue={organizationName}
              value={organizationName}
              disabled
            />
          </div>
          <div className="flex gap-2">
            <div>
              <label htmlFor="firstName">First Name</label>
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
              <label htmlFor="lastName">Last Name</label>
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
            <label htmlFor="phoneNumber">Phone Number</label>
            <div className="relative flex">
              <div className="flex w-14 items-center justify-center rounded-l-primary border-2 border-r-0 bg-gray-100/70">
                <span className="label-sm text-gray-600">+86</span>
              </div>
              <Input
                id="phoneNumber"
                {...register("phoneNumber")}
                type="tel"
                placeholder="1XXXXXXXXX"
                // className='rounded-l-none border-l-0 outline-none'
                className="rounded-l-none border-l-0 outline-none focus:border-l-0"
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-0.5 text-sm text-red-500">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email">Email</label>
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

          <div>
            <label htmlFor="password">Password</label>
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
            <label htmlFor="confirmPassword">Confirm Password</label>
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
            disabled={isSubmitting}
            isLoading={isSubmitting}
            variant="secondary"
            onClick={() => setRegisterStep("organization")}
          >
            <ArrowLeftIcon className="-ml-2 mr-1 h-4 w-4" />
            Back
          </Button>
          <Button
            type="submit"
            // disabled={isSubmitting}
            // isLoading={isSubmitting}
          >
            Create Admin Account
          </Button>
        </div>
      </form>
    </div>
  );
};
