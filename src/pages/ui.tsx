import DesignSystemGuide from "@/components/design-system";
import { type GetServerSideProps } from "next";
import React from "react";

export default function UI() {
  return (
    <div className="flex min-h-screen w-full justify-center py-44">
      <DesignSystemGuide />
    </div>
  );
}

// Development/design-system showcase. Hidden in production so it never
// becomes a public-facing UI surface; freely accessible in development.
export const getServerSideProps: GetServerSideProps = () => {
  if (process.env.NODE_ENV === "production") {
    return Promise.resolve({ notFound: true as const });
  }
  return Promise.resolve({ props: {} });
};
