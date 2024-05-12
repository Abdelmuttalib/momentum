import { type GetServerSideProps } from "next";
import Auth from "@/components/auth/AuthContainer";
import { getServerAuthSession } from "@/server/auth";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { BuildingOfficeIcon } from "@heroicons/react/20/solid";
import { Typography } from "@/components/ui/typography";
import { AuthLayout } from "@/components/layout";
import Seo from "@/components/Seo";

export default function SignInPage() {
  return (
    <>
      <Seo title="Sign in" />

      <AuthLayout>
        <div className="flex w-full max-w-lg flex-col rounded-lg p-9 px-12">
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
                  variant: "secondary",
                  size: "sm",
                }),
                "flex w-full justify-start gap-x-2"
              )}
            >
              <span className="p-2.5">
                <ArrowRightIcon className="h-5 w-5" />
              </span>
              <Typography variant="sm/medium" className="text-current">
                Setup a new company account
              </Typography>
            </Link>
            <Link
              href="/register/user"
              className={cn(
                buttonVariants({
                  variant: "secondary",
                  size: "sm",
                }),
                "flex w-full justify-start gap-x-2"
              )}
            >
              <span className="p-2.5">
                <BuildingOfficeIcon className="h-5 w-5" />
              </span>
              <Typography variant="sm/medium" className="text-current">
                Join your company
              </Typography>
            </Link>
          </div>
        </div>
      </AuthLayout>
    </>
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
