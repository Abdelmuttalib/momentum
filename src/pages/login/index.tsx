import { type GetServerSideProps } from "next";

import Auth from "@/components/auth/AuthContainer";
import { LoginBackground } from "@/components/layout";

import { getServerAuthSession } from "@/server/auth";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const [choice, setChoice] = useState<"login" | null>(null);
  return (
    <LoginBackground>
      {/* <Auth /> */}
      {choice === null ? (
        <div className="flex flex-col gap-3">
          <h1 className="h2">Welcome back!</h1>
          <p className="label-sm mb-6 text-gray-500">
            Get back to your projects quickly by logging in with your email
          </p>
          {/* Login */}
          <button
            onClick={() => setChoice("login")}
            className="flex w-full items-center justify-between rounded-primary-lg border-2 border-gray-200 bg-white px-4 py-8 text-left outline-none hover:border-primary-100 hover:bg-primary-70 focus:outline-none sm:w-96"
          >
            <span className="flex flex-col">
              <span className="text-2xl font-bold">Login</span>
              <span className="pr-3 text-sm font-medium text-gray-400">
                Login with your credentials
              </span>
            </span>
            <ArrowRightIcon className="h-7 w-7" />
          </button>
          <Link
            href="/register/user"
            className="flex w-full items-center justify-between rounded-primary-lg border-2 border-gray-200 bg-white px-4 py-8 hover:border-primary-100 hover:bg-primary-70 sm:w-96"
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
            className="flex w-full items-center justify-between rounded-primary-lg border-2 border-gray-200 bg-white px-4 py-8 hover:border-primary-100 hover:bg-primary-70 sm:w-96"
          >
            <span className="flex flex-col">
              <span className="text-2xl font-bold">Create an organization</span>
              <span className="pr-3 text-sm font-medium text-gray-400">
                Get started by creating a new organization
              </span>
            </span>
            <ArrowRightIcon className="h-7 w-7" />
          </Link>
          {/* Register */}
          {/* Create an Organization */}
        </div>
      ) : (
        <div>
          <Auth />
          <Button
            type="button"
            variant="secondary"
            className="group mx-6 bg-transparent transition-all duration-300 hover:-ml-0.5  hover:bg-transparent focus:bg-transparent"
            onClick={() => setChoice(null)}
          >
            <ArrowLeftIcon className="-ml-1 mr-1 h-5 w-5 transition-all duration-300 " />
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
        destination: "/team",
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
