import { type GetServerSideProps } from "next";

import Auth from "@/components/auth/AuthContainer";
import { LoginBackground } from "@/components/layout";

import { getServerAuthSession } from "@/server/auth";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";

const LoginPage = () => {
  const [choice, setChoice] = useState<"login" | null>(null);
  return (
    <LoginBackground>
      {/* <Auth /> */}
      {choice === null ? (
        <div className="flex flex-col gap-3">
          <h1 className="h1">Welcome back!</h1>
          <p className="label-sm mb-6 text-gray-500">
            Get back to your projects quickly by logging in with your email
          </p>
          {/* Login */}
          <Button
            type="button"
            variant="secondary"
            onClick={() => setChoice("login")}
            className={cn(
              "flex h-32 w-full items-center justify-between rounded-md px-7 text-left hover:border-black focus:outline-none sm:w-96"
            )}
          >
            <span className="flex flex-col">
              <span className="text-2xl font-bold">Login</span>
              <span className="pr-3 text-sm font-medium text-gray-400">
                Login with your credentials
              </span>
            </span>
            <ArrowRightIcon className="h-7 w-7" />
          </Button>
          <Link
            href="/register/user"
            className={cn(
              buttonVariants({
                variant: "secondary",
              }),
              "flex h-32 w-full items-center justify-between rounded-md px-7 text-left hover:border-black focus:outline-none sm:w-96"
            )}
          >
            <span className="flex flex-col">
              <span className="text-2xl font-bold">Register</span>
              <span className="pr-3 text-sm font-medium text-gray-400">
                You need to be invited to be able to register
              </span>
            </span>
            <ArrowRightIcon className="h-7 w-7" />
          </Link>
          <Link
            href="/register"
            className="hover:border-primary-100 hover:bg-primary-70 flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-8 hover:border-black sm:w-96"
          >
            <span className="flex flex-col">
              <span className="text-2xl font-bold">Create a Company</span>
              <span className="pr-3 text-sm font-medium text-gray-400">
                Get started by creating a new company account
              </span>
            </span>
            <ArrowRightIcon className="h-7 w-7" />
          </Link>
          {/* Register */}
          {/* Create an Organization */}
        </div>
      ) : (
        <div className="w-full max-w-md">
          <Auth />
          <Button
            type="button"
            variant="secondary"
            onClick={() => setChoice(null)}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      )}
    </LoginBackground>
  );
};

export default LoginPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (session?.user) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};
