import React from "react";
import Container from "./container";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRightCircle } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import GradientBackground from "@/components/GradientBackground";
import BoardExample from "./board-example";

export default function Hero() {
  return (
    <div className="relative flex min-h-[100svh] overflow-x-hidden pb-24 pt-36">
      <Container className="relative isolate">
        {/* <div
          aria-hidden="true"
          className="absolute inset-0 m-auto grid h-max w-full grid-cols-2 -space-x-52 opacity-40 dark:pb-32 dark:opacity-20"
        >
          <div className="h-56 bg-gradient-to-br from-primary to-purple-400  dark:from-blue-700"></div>
          <div className="h-32 bg-gradient-to-r from-brand-400 to-brand-300  dark:to-brand-600"></div>
        </div> */}
        <GradientBackground />
        <div className="relative grid grid-cols-1 gap-y-6 lg:grid-cols-2">
          <div className="relative lg:pr-32">
            <div className="mx-auto space-y-8">
              <Typography as="h1" variant="display-lg/semibold">
                The open source issue tracking tool
              </Typography>

              <Typography
                as="p"
                variant="lg/regular"
                className="mx-auto w-full max-w-4xl text-foreground-light"
              >
                Supercharge Your Team&apos;s Productivity.{" "}
                <span className="decoration-brand underline decoration-2 underline-offset-2">
                  Momentum
                </span>{" "}
                is a powerful task management app designed to help your team
                stay organized and focused.
              </Typography>

              <div className="flex flex-col flex-wrap gap-x-4 gap-y-2 sm:flex-row sm:gap-y-4">
                <ButtonLink
                  href="/sign-in"
                  size="lg"
                  rightIcon={<ArrowRight className="w-[18px]" />}
                >
                  Get Started
                </ButtonLink>
              </div>
            </div>
          </div>
          <div className="lg:absolute lg:-right-36">
            <BoardExample />
          </div>
        </div>
      </Container>
    </div>
  );
}
