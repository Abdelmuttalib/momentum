import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { AuthLayout } from "@/components/layout";
import { FormLabel } from "@/components/ui/form-label";
import { Typography } from "@/components/ui/typography";
import Seo from "@/components/Seo";

const signUpValidationSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "first name must be at least 2 characters")
      .nonempty("first name cannot be empty"),
    lastName: z
      .string()
      .min(2, "last name must be at least 2 characters")
      .nonempty("last name cannot be empty"),
    email: z
      .string()
      .min(4, "email must be at least 4 characters")
      .email("invalid email format")
      .nonempty("email cannot be empty"),
    password: z.string().min(8, "password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "passwords do not match",
  });

type CreateUserAccountForm = z.infer<typeof signUpValidationSchema>;

function CreateUserAccountForm() {
  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserAccountForm>({
    resolver: zodResolver(signUpValidationSchema),
  });

  const registerInvitedUserMutation =
    api.company.registerInvitedUser.useMutation({
      onSuccess: async () => {
        toast.success("Account created successfully");
        await push("/sign-in");
      },
      onError: () => {
        toast.error("Something went wrong, kindly try again!");
      },
    });

  async function onSubmit(data: CreateUserAccountForm) {
    await registerInvitedUserMutation.mutateAsync({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });
  }

  return (
    <>
      <Seo title="Join your company" />

      <div className="w-full max-w-md space-y-6 px-6 py-4">
        <div>
          <Typography as="h1" variant="xl/medium">
            Get Started
          </Typography>

          <Typography className="text-foreground-light">
            get started by creating your account.
          </Typography>
        </div>

        <form
          className="flex flex-col gap-4"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Email Input */}
          <div>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              {...register("email")}
              type="email"
              inputMode="email"
              placeholder="email@mail.com"
              error={errors?.email}
            />
          </div>

          {/* First Name Input */}
          <div className="flex w-full flex-col gap-4 sm:flex-row">
            <div className="w-full">
              <FormLabel htmlFor="firstName">First Name</FormLabel>
              <Input
                id="firstName"
                type="firstName"
                {...register("firstName", { required: true })}
                placeholder="first name"
                error={errors?.firstName}
              />
            </div>

            <div className="w-full">
              <FormLabel htmlFor="lastName">Last Name</FormLabel>
              <Input
                id="lastName"
                type="lastName"
                {...register("lastName", { required: true })}
                placeholder="last name"
                error={errors?.lastName}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              {...register("password", { required: true })}
              placeholder="password"
              error={errors?.password}
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", { required: true })}
              placeholder="confirm password"
              error={errors?.confirmPassword}
            />
            {/* {errors.confirmPassword && (
            <p className="mt-0.5 text-sm text-red-500">
              {errors?.confirmPassword?.message}
            </p>
          )} */}
          </div>
          <Button
            type="submit"
            disabled={
              Object.keys(errors).length > 0 ||
              registerInvitedUserMutation.isLoading
            }
            isLoading={registerInvitedUserMutation.isLoading}
            className="mt-2 w-full"
          >
            Create Account
          </Button>

          {/* Another Auth Routes */}

          {/* <div className=" text-sm font-medium text-gray-700 sm:mb-4 sm:flex sm:items-center sm:gap-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => back()}
            disabled={registerInvitedUserMutation.isLoading}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div> */}
        </form>
      </div>
    </>
  );
}

export default function RegisterUserPage() {
  return (
    <AuthLayout>
      <CreateUserAccountForm />
    </AuthLayout>
  );
}
