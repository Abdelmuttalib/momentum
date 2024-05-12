import { HomeIcon } from "@heroicons/react/20/solid";
import * as React from "react";

import Seo from "@/components/Seo";
import { cn } from "@/utils/cn";
import { ButtonLink } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export default function NotFoundPage() {
  return (
    <>
      <Seo templateTitle="404 | Not Found" />

      <main className="flex h-full min-h-screen w-full items-center justify-center px-6 py-24 sm:py-32 lg:px-6">
        <div className="text-center">
          <Typography
            as="p"
            variant="display-sm/semibold"
            className="text-primary"
          >
            404
          </Typography>
          <Typography as="h1" variant="display-lg/semibold" className="mt-4">
            Page not found
          </Typography>
          <Typography
            as="p"
            className="mt-6 text-base leading-7 text-foreground-lighter"
          >
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </Typography>
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
              leftIcon={<HomeIcon className="mb-0.5 w-5" />}
            >
              Home
            </ButtonLink>
          </div>
        </div>
      </main>
    </>
  );
}
