import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import type { Dispatch, FC, SetStateAction } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/utils/cn";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { type TAuthType } from "./AuthContainer";
import useTranslation from "next-translate/useTranslation";
import { hashPassword } from "@/utils/bcrypt";

const signInFormSchema = z.object({
  email: z.string().email().nonempty(),
  password: z
    .string()
    .min(8, { message: "password must be at least 8 characters" })
    .max(50)
    .nonempty(),
});

type SignInFormFields = z.infer<typeof signInFormSchema>;

const SignInForm: FC<{
  setAuthType: Dispatch<SetStateAction<TAuthType>>;
}> = ({ setAuthType }) => {
  const { t } = useTranslation("login");
  const { push } = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormFields>({
    resolver: zodResolver(signInFormSchema),
  });

  const onSubmit: SubmitHandler<SignInFormFields> = (data) => {
    // onSignIn
    setIsLoading(true);
    const hashedPassword = hashPassword(data.password);
    signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: "/dashboard",
      redirect: false,
      // callbackUrl: `${window.location.origin}/dashboard/projects`,
    })
      .then(async (response) => {
        if (response?.ok) {
          toast.success("Signed in successfully");
          if (response.url) {
            await push(response.url);
          }
        }
        if (!response?.ok) {
          toast.error("Something went wrong, kindly try again");
        }
        // const userSignedInData = response?.data;
      })
      .catch(() => {
        toast.error("Something went wrong, kindly try again");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="w-full py-4">
      <h1 className="h1 text-gray-800">Sign in</h1>
      <p className="text-gray-700">
        enter your credentials to access your account
      </p>

      <form
        className="mt-10 flex flex-col gap-3"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Phone Number Input */}
        <div>
          <label htmlFor="email">Email</label>

          <Input
            id="email"
            {...register("email")}
            type="email"
            inputMode="email"
            placeholder="email@mail.com"
            // className='rounded-l-none border-l-0 outline-none'
            className={cn("mt-0.5", {
              "border-red-500": errors.email,
            })}
          />
          {errors?.email && (
            <p className="mt-0.5 text-sm text-red-500">
              {errors.email?.message}
            </p>
          )}
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
            // placeholder='password'
            placeholder="password"
            className={cn("mt-1", { "border-red-500": errors.password })}
          />
          {errors.password && (
            <p className="mt-0.5 text-sm text-red-500">
              {t(errors.password?.message as string)}
            </p>
          )}
        </div>

        {/* Auth Buttton */}
        <Button
          type="submit"
          className="mt-2 w-full"
          disabled={Object.keys(errors).length > 0 || isLoading}
          isLoading={isLoading}
        >
          Sign in
        </Button>

        {/* Another Auth Routes */}
        <div className="text-center text-sm text-slate-500 sm:mb-4 sm:flex sm:items-center sm:gap-1">
          <span>Don&apos;t have an acoount?</span>
          <button
            onClick={() => setAuthType("create-account")}
            className="flex-2 text-primary underline"
          >
            {/* Register a new organization */}
            Create an account
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
