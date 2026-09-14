import { type GetServerSideProps } from "next";
import { requireAnonymousPage } from "@/server/auth-guard";
import { Typography } from "@/components/ui/typography";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Seo } from "@/components/seo";
import { SignInForm } from "@/components/views/auth/forms/sign-in";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

export default function SignInPage() {
  const t = useTranslations("auth");
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
                <ArrowRightIcon className="h-5 w-5 rtl:-scale-x-100" />
              </span>
              <Typography variant="sm/medium" className="text-current">
                {t("setupCompanyAccount")}
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
                {t("joinCompany")}
              </Typography>
            </Link>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps =
  requireAnonymousPage();
