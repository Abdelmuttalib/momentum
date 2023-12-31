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
  // Button,
  buttonVariants,
} from "@/components/ui/button";
// import { useRouter } from "next/router";

export default function NotFoundPage() {
  // const { back } = useRouter();

  return (
    <Layout pageTitle="404">
      <Seo templateTitle="404 | Not Found" />

      {/* <main>
        <section className="bg-white">
          <div className="layout flex min-h-screen flex-col items-center justify-center text-center text-black">
            <div className="flex flex-col items-center gap-4 md:flex-row md:divide-x-4 md:divide-gray-800">
              <p className="text-5xl md:text-7xl">404</p>
              <h1 className="pl-4 text-4xl md:text-6xl">Page Not Found</h1>
            </div>
            <IconLink href="/" variant="outline" className="mt-14">
              <HomeIcon className="mr-1.5 w-5" />
              Back to Home
            </IconLink>
          </div>
        </section>
      </main> */}

      <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-6">
        <div className="text-center">
          <p className="text-3xl font-semibold">404</p>
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
            <Link
              href="/"
              className={cn(
                "inline-flex items-center justify-center gap-1.5",
                buttonVariants({
                  size: "lg",
                })
              )}
            >
              <HomeIcon className="mb-0.5 w-5" />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
