import * as React from "react";

import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <>
      <Seo templateTitle="404 | Not Found" />

      <main className="flex h-full min-h-screen w-full items-center justify-center px-6 py-24 sm:py-32 lg:px-6">
        <div className="text-center">
          <Typography as="p" variant="3xl/semibold" className="text-primary">
            404
          </Typography>
          <Typography as="h1" variant="5xl/semibold" className="mt-4">
            Page not found
          </Typography>
          <Typography
            as="p"
            className="mt-6 text-base leading-7 text-muted-foreground"
          >
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </Typography>
          <div className="mt-10 flex justify-center gap-x-3">
            <Button size="lg" asChild>
              <Link href="/">Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
