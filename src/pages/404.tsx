import { HomeIcon } from "@heroicons/react/20/solid";
import * as React from "react";

import Seo from "@/components/Seo";
import { IconLink } from "@/components/ui/icon-button";
import { Layout } from "@/components/layout";

export default function NotFoundPage() {
  return (
    <Layout pageTitle="404 | Page Not Found">
      <Seo templateTitle="Not Found" />

      <main>
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
      </main>
    </Layout>
  );
}
