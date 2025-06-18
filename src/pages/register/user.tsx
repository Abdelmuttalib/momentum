import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/router";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Seo } from "@/components/seo";
import { Label } from "@/components/ui/label";
import { useRegisterUser } from "@/hooks/use-register-user";
import {
  AuthPageDescription,
  AuthPageTitle,
} from "@/components/views/auth/common";
import { siteConfig } from "@/config/site-config";

function CreateUserAccountForm() {
  const router = useRouter();

  const { form, handleSubmit, mutation } = useRegisterUser({
    onSuccess: () => {
      // toast.success("Account created successfully");
      router.push(siteConfig.pages.main.links.signIn.href).catch((e) => {
        // redirect to sign in page
        console.log("ERROR_REGISTER_USER", e);
      });
    },
    onError: () => {
      toast.error("Something went wrong, kindly try again!");
    },
  });

  return (
    <>
      <Seo title="Join your company" />

      <div className="w-full max-w-md space-y-6 px-6 py-4">
        <div>
          <AuthPageTitle>Get Started</AuthPageTitle>
          <AuthPageDescription>
            get started by creating your account.
          </AuthPageDescription>
        </div>

        <form
          className="flex flex-col gap-4"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit}
        >
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              {...form.register("email")}
              type="email"
              inputMode="email"
              placeholder="email@mail.com"
              disabled={mutation.isLoading}
              data-invalid={form.formState.errors?.email?.message}
            />
          </div>

          {/* First Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="name"
              {...form.register("name", { required: true })}
              placeholder="name"
              disabled={mutation.isLoading}
              data-invalid={form.formState.errors?.name?.message}
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...form.register("password", { required: true })}
              placeholder="password"
              disabled={mutation.isLoading}
              data-invalid={form.formState.errors?.password?.message}
            />
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...form.register("confirmPassword", { required: true })}
              placeholder="confirm password"
              disabled={mutation.isLoading}
              data-invalid={form.formState.errors?.confirmPassword?.message}
            />
          </div>
          <div className="mt-2">
            <Button
              type="submit"
              disabled={
                Object.keys(form.formState.errors).length > 0 ||
                mutation.isLoading
              }
              isLoading={mutation.isLoading}
              className="w-full"
            >
              Create Account
            </Button>
          </div>
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
