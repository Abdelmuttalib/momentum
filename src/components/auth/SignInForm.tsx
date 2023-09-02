{
  /* <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company">
    <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6" action="#" method="POST">
      <div>
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
        <div class="mt-2">
          <input id="email" name="email" type="email" autocomplete="email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
          <div class="text-sm">
            <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
          </div>
        </div>
        <div class="mt-2">
          <input id="password" name="password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        </div>
      </div>

      <div>
        <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
      </div>
    </form>

    <p class="mt-10 text-center text-sm text-gray-500">
      Not a member?
      <a href="#" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Start a 14 day free trial</a>
    </p>
  </div>
</div> */
}
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { LogIn } from "lucide-react";
// import { Label } from "../ui/label";
// import InputField from "../ui/input-field";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const signInFormSchema = z.object({
  email: z.string().email().nonempty(),
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

export default function SignInForm() {
  const { push } = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);

  // {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // }

  const form = useForm<SignInFormFields>({
    resolver: zodResolver(signInFormSchema),
  });

  const onSubmit: SubmitHandler<SignInFormFields> = (data) => {
    setIsLoading(true);
    signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: "/teams",
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
    <div className="w-full space-y-3 py-4">
      <div>
        <div className="flex items-center gap-x-2">
          <h1 className="h4 dark:text-gray-200">Sign in</h1>
          {/* <span className="rounded-md border-2 border-black bg-black p-1.5 text-white group-hover:border-black group-hover:bg-black group-hover:text-gray-100">
            <LogIn className="h-5 w-5" />
          </span> */}
        </div>
        <p className="text-gray-500">
          enter your credentials to access your account
        </p>
      </div>
      <Form {...form}>
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-1"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    placeholder="email@mail.com"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    placeholder="password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="mt-3 w-full"
            disabled={
              Object.keys(form.formState.errors).length > 0 || isLoading
            }
            isLoading={isLoading}
          >
            Sign in
          </Button>
        </form>
      </Form>
    </div>
  );
}
