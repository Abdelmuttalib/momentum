/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { LogInIcon } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { AuthPageDescription, AuthPageTitle } from "../common";
import { Label } from "@/components/ui/label";

const signInFormSchema = z.object({
  email: z
    .string()
    .email({
      message: "invalid email address",
    })
    .min(4, {
      message: "email must be at least 4 characters",
    })
    .max(50, {
      message: "email must not be more than 50 characters",
    })
    .nonempty({
      message: "email is required",
    }),
  password: z
    .string()
    .min(8, { message: "password must be at least 8 characters" })
    .max(50, {
      message: "password must not be more than 50 characters",
    })
    .nonempty({
      message: "password is required",
    }),
});

type SignInFormFields = z.infer<typeof signInFormSchema>;

export function SignInForm() {
  const { push } = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<SignInFormFields>({
    resolver: zodResolver(signInFormSchema),
  });

  const onSubmit: SubmitHandler<SignInFormFields> = (data) => {
    setIsLoading(true);
    signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: "/overview",
      redirect: false,
      // callbackUrl: `${window.location.origin}/projects`,
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
      })
      .catch(() => {
        toast.error("Something went wrong, kindly try again");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="w-full space-y-3 py-4 sm:space-y-6">
      <div>
        <AuthPageTitle>Sign in</AuthPageTitle>
        <AuthPageDescription>
          {/* description */}
          Sign in to your account to access your projects, tasks, and more.
        </AuthPageDescription>
      </div>
      <div>
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              placeholder="email@mail.com"
              {...form.register("email")}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="password"
              {...form.register("password")}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="mt-3 w-full"
            disabled={
              Object.keys(form.formState.errors).length > 0 || isLoading
            }
            isLoading={isLoading}
            iconRight={<LogInIcon className="h-4 w-4" />}
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
