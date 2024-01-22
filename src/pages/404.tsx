import {
  // ArrowLeftIcon,
  HomeIcon,
} from "@heroicons/react/20/solid";
import * as React from "react";

import Seo from "@/components/Seo";
import { Layout } from "@/components/layout";
import Link from "next/link";
import { cn } from "@/utils/cn";
import {
  ButtonLink,
  // Button,
  buttonVariants,
} from "@/components/ui/button";
// import { useRouter } from "next/router";

export default function NotFoundPage() {
  // const { back } = useRouter();

  return (
    <>
      <Seo templateTitle="404 | Not Found" />

      <main className="flex h-full min-h-screen w-full items-center justify-center px-6 py-24 sm:py-32 lg:px-6">
        <div className="text-center">
          <p className="text-3xl font-semibold text-brand">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex justify-center gap-x-3">
            {/* <Button
              onClick={() => back()}
              size="lg"
              className="inline-flex items-center"
            >
              <ArrowLeftIcon className="mr-1.5 w-5" />
              Go back
            </Button> */}
            <ButtonLink
              href="/"
              size="lg"
              className={cn("inline-flex items-center justify-center gap-1.5")}
            >
              <HomeIcon className="mb-0.5 w-5" />
              <span>Home</span>
            </ButtonLink>
          </div>
        </div>
      </main>
    </>
  );
}
