import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { BuildingOfficeIcon } from "@heroicons/react/20/solid";
import { Typography } from "@/components/ui/typography";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Seo } from "@/components/seo";
import { SignInForm } from "@/components/views/auth/forms/sign-in";

export default function SignInPage() {
  return (
    <>
      <Seo title="Sign in" />

      <AuthLayout>
        <div className="flex w-full max-w-md flex-col rounded-lg p-9 px-12">
          <div className="relative flex">
            <SignInForm />
          </div>

          <div className="flex w-full items-center gap-4">
            <hr className="w-full border" />
            <Typography variant="sm/normal">or</Typography>
            <hr className="w-full border" />
          </div>

          <div className="mt-3 flex flex-col gap-y-3">
            <Link
              href="/register"
              className={cn(
                buttonVariants({
                  variant: "secondary",
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
