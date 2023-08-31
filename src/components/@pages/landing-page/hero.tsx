import React from "react";
import Container from "./container";
import { ButtonLink } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="relative flex h-[100svh] pb-24 pt-36" id="home">
      <Container>
        <div
          aria-hidden="true"
          className="absolute inset-0 m-auto grid h-max w-full grid-cols-2 -space-x-52 opacity-40 dark:pb-32 dark:opacity-40"
        >
          <div className="h-56 bg-gradient-to-br from-primary to-purple-400 blur-[106px] dark:from-blue-700"></div>
          <div className="h-32 bg-gradient-to-r from-brand-400 to-brand-300 blur-[106px] dark:to-brand-600"></div>
        </div>
        <div className="relative ml-auto">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 mx-auto h-full w-full max-w-md rounded-full opacity-40 dark:hidden"
          >
            <div className="h-full rounded-full bg-gradient-to-br from-brand-600 to-brand-400 blur-3xl dark:from-blue-700"></div>

            {/* <div className="h-32 bg-gradient-to-r from-brand-400 to-brand-300 blur-[106px] dark:to-brand-600"></div> */}
          </div>
          <div className="relative">
            <div className="mx-auto space-y-8 text-center lg:w-2/3">
              <h1 className="h2 sm:h1 md:display-sm lg:display-md xl:display-lg dark:to-primary-900 my-8 font-bold dark:bg-gradient-to-br dark:from-brand-200 dark:via-brand-400 dark:to-brand-600 dark:bg-clip-text dark:text-transparent sm:font-bold">
                The Open Source issue tracking tool
              </h1>
              <p className="text-gray-700 dark:text-gray-400 sm:text-lg md:px-32">
                Supercharge Your Team&apos;s Productivity.{" "}
                <span className="underline decoration-brand decoration-2 underline-offset-2">
                  Momentum
                </span>{" "}
                is a powerful task management app designed to help your team
                stay organized and focused.
              </p>
              <div className="flex flex-col flex-wrap justify-center gap-x-4 gap-y-2 sm:flex-row sm:gap-y-4">
                <ButtonLink href="/" size="lg">
                  Get Started
                </ButtonLink>

                {/* <ButtonLink href="/" size="lg" variant="outline">
                  Learn More
                </ButtonLink> */}
              </div>
              {/* insights */}
              {/* <div className="mt-16 hidden justify-between border-y border-gray-100 py-8 dark:border-gray-800 sm:flex">
              <div className="text-left">
                <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                  The lowest price
                </h6>
                <p className="mt-2 text-gray-500">Some text here</p>
              </div>
              <div className="text-left">
                <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                  The fastest on the market
                </h6>
                <p className="mt-2 text-gray-500">Some text here</p>
              </div>
              <div className="text-left">
                <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                  The most loved
                </h6>
                <p className="mt-2 text-gray-500">Some text here</p>
              </div>
            </div> */}
            </div>
          </div>
          {/* logos */}
          {/* <div className="mt-12 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6">
            <div className="p-4 grayscale transition duration-200 hover:grayscale-0">
              <img
                src="./images/clients/microsoft.svg"
                className="mx-auto h-12 w-auto"
                loading="lazy"
                alt="client logo"
                width=""
                height=""
              />
            </div>
            <div className="p-4 grayscale transition duration-200 hover:grayscale-0">
              <img
                src="./images/clients/airbnb.svg"
                className="mx-auto h-12 w-auto"
                loading="lazy"
                alt="client logo"
                width=""
                height=""
              />
            </div>
            <div className="flex p-4 grayscale transition duration-200 hover:grayscale-0">
              <img
                src="./images/clients/google.svg"
                className="m-auto h-9 w-auto"
                loading="lazy"
                alt="client logo"
                width=""
                height=""
              />
            </div>
            <div className="p-4 grayscale transition duration-200 hover:grayscale-0">
              <img
                src="./images/clients/ge.svg"
                className="mx-auto h-12 w-auto"
                loading="lazy"
                alt="client logo"
                width=""
                height=""
              />
            </div>
            <div className="flex p-4 grayscale transition duration-200 hover:grayscale-0">
              <img
                src="./images/clients/netflix.svg"
                className="m-auto h-8 w-auto"
                loading="lazy"
                alt="client logo"
                width=""
                height=""
              />
            </div>
            <div className="p-4 grayscale transition duration-200 hover:grayscale-0">
              <img
                src="./images/clients/google-cloud.svg"
                className="mx-auto h-12 w-auto"
                loading="lazy"
                alt="client logo"
                width=""
                height=""
              />
            </div>
          </div> */}
        </div>
      </Container>
    </div>
  );
}