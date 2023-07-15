import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/utils/cn";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { api } from "@/utils/api";
import { LoginBackground } from "@/components/layout";

const signUpValidationSchema = z
  .object({
    firstName: z.string().min(2).nonempty(),
    lastName: z.string().min(2).nonempty(),
    email: z.string().min(4).email().nonempty(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "passwords do not match",
  });

type CreateUserAccountForm = z.infer<typeof signUpValidationSchema>;

function CreateUserAccountForm() {
  const { t } = useTranslation("login");
  const { back, push } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserAccountForm>({
    resolver: zodResolver(signUpValidationSchema),
  });

  const registerInvitedUserMutation =
    api.organization.registerInvitedUser.useMutation({
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
    <div className="w-full max-w-md bg-white px-6 py-4">
      <h1 className="h1">Get Started</h1>

      <p className="text-gray-700">get started by creating your account.</p>

      <form
        className="mt-10 flex flex-col gap-3"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Email Input */}
        <div>
          <label htmlFor="email">Email</label>
          <Input
            id="email"
            {...register("email")}
            type="email"
            inputMode="email"
            placeholder="email@mail.com"
            className="mt-0.5"
          />
          {errors.email && (
            <p className="mt-0.5 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* First Name Input */}
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <div className="w-full">
            <label htmlFor="firstName" className="block text-gray-600">
              First Name
            </label>
            <Input
              id="firstName"
              type="firstName"
              {...register("firstName", { required: true })}
              placeholder="first name"
              className={cn("mt-0.5", { "border-red-500": errors.firstName })}
            />
            {errors.firstName && (
              <p className="mt-0.5 text-sm text-red-500">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <label htmlFor="lastName" className="block text-gray-600">
              Last Name
            </label>
            <Input
              id="lastName"
              type="lastName"
              {...register("lastName", { required: true })}
              placeholder="last name"
              className={cn("mt-0.5", { "border-red-500": errors.lastName })}
            />
            {errors.lastName && (
              <p className="mt-0.5 text-sm text-red-500">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-gray-600">
            Password
          </label>
          <Input
            id="password"
            type="password"
            {...register("password", { required: true })}
            placeholder="password"
            className={cn("mt-0.5", { "border-red-500": errors.password })}
          />
          {errors.password && (
            <p className="mt-0.5 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div>
          <label htmlFor="confirmPassword" className="block text-gray-600">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", { required: true })}
            placeholder="confirm password"
            className={cn("mt-0.5", {
              "border-red-500": errors.confirmPassword,
            })}
          />
          {errors.confirmPassword && (
            <p className="mt-0.5 text-sm text-red-500">
              {errors?.confirmPassword?.message}
            </p>
          )}
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

        <div className=" text-sm font-medium text-gray-700 sm:mb-4 sm:flex sm:items-center sm:gap-1">
          <Button
            type="button"
            variant="secondary"
            onClick={() => back()}
            disabled={registerInvitedUserMutation.isLoading}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function RegisterUserPage() {
  return (
    <LoginBackground>
      <CreateUserAccountForm />
    </LoginBackground>
  );
}
