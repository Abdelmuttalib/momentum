import { type GetServerSideProps } from "next";
import Auth from "@/components/auth/AuthContainer";
import { LoginBackground } from "@/components/layout";
import { getServerAuthSession } from "@/server/auth";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { BuildingOfficeIcon } from "@heroicons/react/20/solid";

export default function SignInPage() {
  return (
    <LoginBackground>
      <div className="flex flex-col">
        <Auth />

        <div className="flex w-full items-center gap-4">
          <hr className="w-full border" />
          <p>or</p>
          <hr className="w-full border" />
        </div>

        <div className="mt-3 flex flex-col gap-y-3">
          <Link
            href="/register"
            className={cn(
              buttonVariants({
                variant: "outline",
              }),
              "group flex h-[4.5rem] w-full items-center justify-start gap-x-3 rounded-lg px-3.5 text-left hover:border-black focus:outline-none "
            )}
          >
            <span className="rounded-md border-2 p-2.5 group-hover:border-black group-hover:bg-black group-hover:text-white">
            <ArrowRightIcon className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="font-semibold">Get Started</span>
              <span className="text-gray-500">
                Setup a new company account
                {/* and invite your team */}
              </span>
            </span>
          </Link>
          <Link
            href="/register/user"
            className={cn(
              buttonVariants({
                variant: "outline",
              }),
              "group flex h-[4.5rem] w-full items-center justify-start gap-x-3 rounded-lg px-3.5 text-left hover:border-black focus:outline-none"
            )}
          >
            <span className="rounded-md border-2 p-2.5 group-hover:border-black group-hover:bg-black group-hover:text-white">
              <BuildingOfficeIcon className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="font-semibold">I&apos;m part of a company</span>
              <span className="text-gray-500">Join your company</span>
            </span>
          </Link>
        </div>
      </div>
    </LoginBackground>
  );
}

// {/* Login */}
// <Button
// type="button"
// variant="outline"
// className={cn(
//   "group flex h-[4.5rem] w-full items-center justify-start gap-x-3 rounded-lg px-3.5 text-left hover:border-black focus:outline-none"
// )}
// >
// <span className="rounded-md border-2 p-2.5 group-hover:border-black group-hover:bg-black group-hover:text-gray-100">
//   <LogIn className="h-5 w-5" />
// </span>
// <span className="flex flex-col">
//   <span className="font-semibold">Sign in</span>
//   <span className="text-gray-500">sign in with your credentials</span>
// </span>
// </Button>

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (session?.user) {
    return {
      redirect: {
        destination: "/teams",
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
