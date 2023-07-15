import { type GetStaticProps } from "next";
import Seo from "@/components/Seo";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/utils/cn";

function Header() {
  return (
    <header className="sticky top-0 border-b bg-transparent px-8 py-4 text-slate-800 backdrop-blur backdrop-filter transition-colors duration-300">
      <h1 className="text-3xl font-bold">Momentum</h1>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto flex min-h-[90svh] max-w-2xl items-center text-slate-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          The Open Source issue tracking tool.
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Supercharge Your Team&apos;s Productivity. Momentum is a powerful task
          management app designed to help your team stay organized and focused.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({
                variant: "default",
                size: "lg",
              })
            )}
          >
            Get Started
          </Link>
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
              })
            )}
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section>
      <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
        <div>
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Technical Specifications
            </h2>
            <p className="mt-4 text-gray-500">
              The walnut wood card tray is precision milled to perfectly fit a
              stack of Focus cards. The powder coated steel divider separates
              active cards from new ones, or can be used to archive important
              task lists.
            </p>
          </div>

          <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:grid-cols-3 lg:gap-x-8">
            {[
              {
                feature: "Task Management",
                description:
                  "Effortlessly create, assign, and track tasks to keep your team on track.",
              },

              {
                feature: "Team Collaboration",
                description:
                  "Seamlessly collaborate with your team members, share files, and discuss tasks.",
              },

              {
                feature: "Project Planning",
                description:
                  "Plan and organize projects with ease, set deadlines, and visualize progress.",
              },
            ].map(({ feature, description }) => (
              <div key={feature} className="border-t border-gray-200 pt-4">
                <dt className="font-medium text-gray-900">{feature}</dt>
                <dd className="mt-2 text-sm text-gray-500">{description}</dd>
              </div>
            ))}
          </dl>
        </div>
        {/* <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
              <img
                src="https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-01.jpg"
                alt="Walnut card tray with white powder coated steel divider and 3 punchout holes."
                className="rounded-lg bg-gray-100"
              />
              <img
                src="https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-02.jpg"
                alt="Top down view of walnut card tray with embedded magnets and card groove."
                className="rounded-lg bg-gray-100"
              />
              <img
                src="https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-03.jpg"
                alt="Side of walnut card tray with card groove and recessed card area."
                className="rounded-lg bg-gray-100"
              />
              <img
                src="https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-04.jpg"
                alt="Walnut card tray filled with cards and card angled in dedicated groove."
                className="rounded-lg bg-gray-100"
              />
            </div> */}
      </div>
    </section>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AppExplanation() {
  return (
    <section className="bg-gray-100 px-8 py-16">
      <div className="container mx-auto">
        <h2 className="mb-8 text-4xl font-bold">How Momentum Works</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-2xl font-bold">Create Tasks</h3>
            <p className="mb-4 text-lg">
              Easily create tasks and assign them to team members. Specify due
              dates, priorities, and add detailed descriptions.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-2xl font-bold">Collaborate and Discuss</h3>
            <p className="mb-4 text-lg">
              Seamlessly collaborate with your team members. Leave comments,
              attach files, and have meaningful discussions on tasks and
              projects.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-2xl font-bold">Track Progress</h3>
            <p className="mb-4 text-lg">
              Monitor the progress of your tasks and projects in real-time. Get
              a clear overview of pending tasks, upcoming deadlines, and
              completed work.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-2xl font-bold">
              Plan and Organize Projects
            </h3>
            <p className="mb-4 text-lg">
              Effortlessly plan and organize your projects. Set project
              milestones, assign tasks, and visualize project progress with
              ease.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-8 py-4 text-gray-500">
      <p className="text-center text-sm">
        Copyright © {new Date().getFullYear()} Momentum. All rights reserved.
      </p>
      {/* Copyright © {new Date().getFullYear()} invix. All rights reserved. */}
    </footer>
  );
}

export default function LandingPage() {
  return (
    <>
      <Seo title="Momentum" />
      <div className="flex min-h-[100svh] w-full flex-col">
        <Header />

        <div>
          <Hero />
          <Features />
        </div>
        {/* <AppExplanation /> */}

        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {},
  };
};
